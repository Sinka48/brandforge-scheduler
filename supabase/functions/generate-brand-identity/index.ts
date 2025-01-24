import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to make API calls with retry logic
async function makeOpenAIRequest(url: string, options: RequestInit, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Making OpenAI request to ${url}, attempt ${attempt}`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status}`, errorText);
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || attempt * 2;
          console.log(`Rate limited. Waiting ${retryAfter} seconds before retry`);
          await delay(parseInt(retryAfter) * 1000);
          continue;
        }

        // Log detailed error for debugging
        console.error('Request details:', {
          url,
          method: options.method,
          headers: options.headers,
          body: options.body,
        });
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Request successful:`, data);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      console.log(`Retrying after delay...`);
      await delay(2000 * attempt); // Exponential backoff
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked - starting execution");
    
    const { questionnaire } = await req.json();
    console.log("Received questionnaire:", questionnaire);

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    // Use either provided or default attributes
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

    console.log("Sending content generation request to OpenAI");
    const contentData = await makeOpenAIRequest(
      'https://api.openai.com/v1/chat/completions',
      {
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
      }
    );

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
    const logoPrompt = `Create a minimalist, professional logo for a ${finalIndustry} business. Simple, clean design with basic shapes. Pure white background. No text or words. High contrast, suitable for business use.`;
    
    console.log("Sending logo generation request to DALL-E");
    const logoData = await makeOpenAIRequest(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: logoPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural",
        }),
      }
    );
    
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
          profileImage: logoUrl,
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