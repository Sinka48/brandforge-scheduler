import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    const finalSocialBio = `Professional ${finalIndustry} services tailored to your needs`;

    console.log("Final brand attributes:", {
      businessName: finalBusinessName,
      industry: finalIndustry,
      personality: finalPersonality,
      targetAudience: finalTargetAudience,
      socialBio: finalSocialBio,
    });

    // Generate logo using DALL-E
    const logoPrompt = `Create a professional, modern logo for ${finalBusinessName} in the ${finalIndustry} industry. The logo should be simple, memorable, and work well at different sizes. Use a clean design with minimal colors.`;
    
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
        size: "512x512",
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
        socialBio: finalSocialBio,
        colors: defaultColors,
        socialAssets: {
          profileImage: "",
          coverImage: "",
        },
        isAiGenerated: questionnaire.is_ai_generated,
        aiGeneratedParameters: {
          socialBio: finalSocialBio,
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