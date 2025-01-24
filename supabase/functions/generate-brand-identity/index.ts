import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked - starting execution");
    
    const { generateNameOnly, questionnaire } = await req.json();
    console.log("Request params:", { generateNameOnly, questionnaire });

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    // Handle name generation only
    if (generateNameOnly) {
      console.log("Generating business name only...");
      
      const namePrompt = `Generate a creative and memorable business name. Return ONLY the name, no additional text or explanation.`;

      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a business name generator. Return only the name, no additional text.' },
            { role: 'user', content: namePrompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!completion.ok) {
        const errorData = await completion.text();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${completion.status}`);
      }

      const nameData = await completion.json();
      console.log("OpenAI response:", nameData);

      const generatedName = nameData.choices[0]?.message?.content?.trim();
      
      if (!generatedName) {
        throw new Error("Failed to generate business name");
      }

      return new Response(
        JSON.stringify({
          metadata: { name: generatedName }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use either provided or default attributes for full brand generation
    const finalBusinessName = questionnaire.business_name || "AI Generated Brand";
    const finalIndustry = questionnaire.industry || "General";
    const finalPersonality = questionnaire.brand_personality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || "General";

    // Generate brand story and social media bio
    const contentPrompt = `Create a brand identity for ${finalBusinessName} in the ${finalIndustry} industry.
    Target audience: ${finalTargetAudience}
    Brand personality: ${finalPersonality.join(', ') || 'professional, modern'}
    
    Please provide:
    1. A compelling brand story (2-3 sentences)
    2. A catchy social media bio (1 sentence)
    
    Format the response as JSON:
    {
      "brandStory": "story here",
      "socialBio": "bio here"
    }`;

    const contentCompletion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a brand identity expert. Provide responses in JSON format.' },
          { role: 'user', content: contentPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!contentCompletion.ok) {
      const errorData = await contentCompletion.text();
      console.error("OpenAI API error (content):", errorData);
      throw new Error(`OpenAI API error: ${contentCompletion.status}`);
    }

    const contentData = await contentCompletion.json();
    console.log("OpenAI content response:", contentData);

    let brandContent;
    try {
      brandContent = JSON.parse(contentData.choices[0].message.content);
    } catch (error) {
      console.error("Error parsing content response:", error);
      brandContent = {
        brandStory: `${finalBusinessName} is a leading provider of ${finalIndustry} solutions, dedicated to delivering exceptional value to our customers.`,
        socialBio: `Professional ${finalIndustry} services tailored to your needs`
      };
    }

    // Generate logo using DALL-E
    const logoPrompt = `Create a minimalist and professional logo design for a ${finalIndustry} company named ${finalBusinessName}. The design should be:
    - Simple and iconic
    - Suitable for business use
    - Centered in the composition
    - On a plain white background
    - No text or lettering
    - Clean lines and shapes
    - Professional color scheme`;
    
    console.log("Sending request to DALL-E with prompt:", logoPrompt);

    const logoResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: logoPrompt,
        n: 1,
        size: "1024x1024",
        model: "dall-e-3",
        quality: "standard",
        style: "natural",
      }),
    });

    if (!logoResponse.ok) {
      const errorData = await logoResponse.text();
      console.error("DALL-E API error:", errorData);
      throw new Error(`DALL-E API error: ${logoResponse.status}`);
    }

    const logoData = await logoResponse.json();
    console.log("DALL-E response received");
    
    const logoUrl = logoData.data?.[0]?.url;
    if (!logoUrl) {
      throw new Error("Failed to generate logo URL");
    }

    // Default color palette
    const defaultColors = [
      "#4A90E2", // Blue
      "#50E3C2", // Teal
      "#F5A623", // Orange
      "#9013FE", // Purple
      "#D0021B"  // Red
    ];

    const result = {
      logoUrl,
      metadata: {
        name: finalBusinessName,
        industry: finalIndustry,
        brandPersonality: finalPersonality,
        targetAudience: finalTargetAudience,
        socialBio: brandContent.socialBio,
        story: brandContent.brandStory,
        colors: defaultColors,
        socialAssets: {
          profileImage: "",
          coverImage: "",
        },
        isAiGenerated: questionnaire.is_ai_generated,
        aiGeneratedParameters: {
          socialBio: brandContent.socialBio,
          brandStory: brandContent.brandStory
        }
      }
    };

    console.log("Returning successful response");
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in generate-brand-identity:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error",
      details: error.toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});