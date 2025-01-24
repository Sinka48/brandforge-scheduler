import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
      
      const attributesPrompt = `Generate brand identity attributes for a new business in JSON format. Include these exact fields:
- businessName: a creative and memorable business name
- industry: one of [Technology, Healthcare, Education, Retail, Finance, Entertainment, Food & Beverage, Travel, Real Estate]
- brandPersonality: exactly three traits from [Professional, Friendly, Innovative, Traditional, Luxurious, Playful, Minimalist, Bold, Trustworthy, Creative]
- targetAudience: one of [Young Professionals, Parents, Students, Business Owners, Seniors, Tech-Savvy, Luxury Consumers, Budget Shoppers, Health Enthusiasts, Creative Professionals]
- socialBio: a compelling social media bio (max 160 characters)
- brandStory: a brief brand story (max 500 characters)

Format the response as a valid JSON object with these exact keys. Ensure all values are strings except brandPersonality which should be an array of strings.`;

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
            { role: 'system', content: 'You are a brand identity expert that generates creative and market-appropriate brand attributes in JSON format.' },
            { role: 'user', content: attributesPrompt }
          ],
        }),
      });

      const attributesData = await completion.json();
      console.log("OpenAI response:", JSON.stringify(attributesData, null, 2));
      
      const attributesResponse = attributesData.choices[0]?.message?.content;
      
      if (!attributesResponse) {
        throw new Error("Failed to generate brand attributes");
      }

      try {
        console.log("Raw attributes response:", attributesResponse);
        const parsedResponse = JSON.parse(attributesResponse.trim());
        console.log("Parsed attributes:", JSON.stringify(parsedResponse, null, 2));

        // Validate required fields
        const requiredFields = ['businessName', 'industry', 'brandPersonality', 'targetAudience'];
        const missingFields = requiredFields.filter(field => !parsedResponse[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Ensure brandPersonality is an array with exactly 3 traits
        if (!Array.isArray(parsedResponse.brandPersonality)) {
          parsedResponse.brandPersonality = [parsedResponse.brandPersonality];
        }
        parsedResponse.brandPersonality = parsedResponse.brandPersonality.slice(0, 3);

        brandAttributes = parsedResponse;
      } catch (error) {
        console.error("Error parsing brand attributes:", error);
        console.error("Raw response that failed parsing:", attributesResponse);
        throw new Error(`Invalid brand attributes format: ${error.message}`);
      }
    }

    // Use either provided or AI-generated attributes
    const finalBusinessName = questionnaire.business_name || brandAttributes.businessName || "AI Generated Brand";
    const finalIndustry = questionnaire.industry || brandAttributes.industry || "General";
    const finalPersonality = questionnaire.brand_personality?.length ? questionnaire.brand_personality : brandAttributes.brandPersonality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || brandAttributes.targetAudience || "General";
    const finalSocialBio = questionnaire.ai_generated_parameters?.socialBio || brandAttributes.socialBio || `Professional ${finalIndustry} services tailored to your needs`;
    const finalBrandStory = questionnaire.ai_generated_parameters?.brandStory || brandAttributes.brandStory || "";

    console.log("Final brand attributes:", {
      businessName: finalBusinessName,
      industry: finalIndustry,
      personality: finalPersonality,
      targetAudience: finalTargetAudience,
      socialBio: finalSocialBio,
      brandStory: finalBrandStory
    });

    const prompt = `Generate a brand identity for:
Business Name: "${finalBusinessName}"
Industry: "${finalIndustry}"
${finalPersonality.length ? `Brand Personality: ${finalPersonality.join(', ')}` : ''}
${finalTargetAudience ? `Target Audience: ${finalTargetAudience}` : ''}
${finalSocialBio ? `Social Bio: ${finalSocialBio}` : ''}
${finalBrandStory ? `Brand Story: ${finalBrandStory}` : ''}

Return a complete brand identity including:
- A color palette of exactly 5 hex colors that work well together and align with the brand personality
- A detailed logo description
- Profile image prompt for DALL-E
- Cover image prompt for DALL-E`;

    console.log("Sending brand identity prompt to OpenAI:", prompt);

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates brand identities.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await completion.json();
    const response = data.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    console.log("OpenAI brand identity response:", response);

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

    // Extract colors from the OpenAI response
    const colorMatch = response.match(/#[0-9A-Fa-f]{6}/g);
    const colors = colorMatch ? colorMatch.slice(0, 5) : [
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
        colors,
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
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in generate-brand-identity:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});