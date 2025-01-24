import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Questionnaire {
  id: string;
  user_id: string;
  business_name: string;
  industry: string;
  brand_personality?: string[];
  target_audience?: {
    primary: string;
  };
  is_ai_generated: boolean;
  ai_generated_parameters?: {
    socialBio?: string;
    brandStory?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaire } = await req.json();
    console.log("Received questionnaire:", JSON.stringify(questionnaire, null, 2));
    
    if (!questionnaire || !questionnaire.id) {
      throw new Error("No questionnaire data provided");
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    let brandAttributes = {};
    if (questionnaire.is_ai_generated) {
      console.log("Generating AI brand attributes...");
      
      const attributesPrompt = `Generate brand identity attributes as a pure JSON object (no markdown formatting) with these exact fields:
{
  "businessName": "a creative and memorable business name",
  "industry": "one of [Technology, Healthcare, Education, Retail, Finance, Entertainment, Food & Beverage, Travel, Real Estate]",
  "brandPersonality": ["trait1", "trait2", "trait3"] (exactly three traits from [Professional, Friendly, Innovative, Traditional, Luxurious, Playful, Minimalist, Bold, Trustworthy, Creative]),
  "targetAudience": "one of [Young Professionals, Parents, Students, Business Owners, Seniors, Tech-Savvy, Luxury Consumers, Budget Shoppers, Health Enthusiasts, Creative Professionals]",
  "socialBio": "a compelling social media bio (max 160 characters)",
  "brandStory": "a brief brand story (max 500 characters)"
}

Return ONLY the JSON object with no additional text or formatting.`;

      console.log("Sending prompt to OpenAI:", attributesPrompt);

      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a JSON generator that only returns valid JSON objects without any markdown or additional formatting.' 
            },
            { role: 'user', content: attributesPrompt }
          ],
          temperature: 0.7,
        }),
      });

      const attributesData = await completion.json();
      console.log("OpenAI response:", JSON.stringify(attributesData, null, 2));
      
      const attributesResponse = attributesData.choices[0]?.message?.content;
      
      if (!attributesResponse) {
        throw new Error("Failed to generate brand attributes");
      }

      try {
        // Clean up any potential markdown formatting
        const cleanJson = attributesResponse.replace(/```json\n|\n```|```/g, '').trim();
        console.log("Cleaned JSON string:", cleanJson);
        
        const parsedResponse = JSON.parse(cleanJson);
        console.log("Parsed attributes:", JSON.stringify(parsedResponse, null, 2));

        // Validate required fields
        const requiredFields = ['businessName', 'industry', 'brandPersonality', 'targetAudience'];
        const missingFields = requiredFields.filter(field => !parsedResponse[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Ensure brandPersonality is an array with exactly 3 traits
        if (!Array.isArray(parsedResponse.brandPersonality) || parsedResponse.brandPersonality.length !== 3) {
          throw new Error('brandPersonality must be an array with exactly 3 traits');
        }

        brandAttributes = parsedResponse;
      } catch (error) {
        console.error("Error parsing brand attributes:", error);
        console.error("Raw response that failed parsing:", attributesResponse);
        throw new Error(`Invalid brand attributes format: ${error.message}`);
      }
    }

    // Use either provided or AI-generated attributes
    const finalBusinessName = questionnaire.is_ai_generated ? 
                            brandAttributes.businessName : 
                            (questionnaire.business_name || "AI Generated Brand");
    const finalIndustry = questionnaire.industry || brandAttributes.industry || "General";
    const finalPersonality = questionnaire.brand_personality?.length ? 
                            questionnaire.brand_personality : 
                            brandAttributes.brandPersonality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || 
                               brandAttributes.targetAudience || "General";
    const finalSocialBio = questionnaire.ai_generated_parameters?.socialBio || 
                          brandAttributes.socialBio || 
                          `Professional ${finalIndustry} services tailored to your needs`;
    const finalBrandStory = questionnaire.ai_generated_parameters?.brandStory || 
                           brandAttributes.brandStory || "";

    console.log("Final brand attributes:", {
      businessName: finalBusinessName,
      industry: finalIndustry,
      personality: finalPersonality,
      targetAudience: finalTargetAudience,
      socialBio: finalSocialBio,
      brandStory: finalBrandStory
    });

    // Generate logo using DALL-E
    const logoPrompt = `Create a professional, modern logo for ${finalBusinessName} in the ${finalIndustry} industry. The logo should be simple, memorable, and work well at different sizes. Use a clean design with minimal colors.`;
    
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

    const logoData = await logoResponse.json();
    const logoUrl = logoData.data?.[0]?.url;

    if (!logoUrl) {
      throw new Error("Failed to generate logo");
    }

    // Default color palette if no colors are extracted
    const defaultColors = [
      "#4A90E2", // Default blue
      "#50E3C2", // Default teal
      "#F5A623", // Default orange
      "#9013FE", // Default purple
      "#D0021B"  // Default red
    ];

    const result = {
      logoUrl,
      metadata: {
        name: finalBusinessName,
        industry: finalIndustry,
        brandPersonality: finalPersonality,
        targetAudience: finalTargetAudience,
        socialBio: finalSocialBio,
        brandStory: finalBrandStory,
        colors: defaultColors,
        socialAssets: {
          profileImage: "",
          coverImage: "",
        },
        isAiGenerated: questionnaire.is_ai_generated,
        aiGeneratedParameters: {
          socialBio: finalSocialBio,
          brandStory: finalBrandStory,
        }
      }
    };

    console.log("Returning result:", JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in generate-brand-identity:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});