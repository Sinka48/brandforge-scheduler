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
    console.log("Received request body:", await req.clone().text());
    const { questionnaire } = await req.json();
    
    console.log("Parsed questionnaire data:", questionnaire);

    if (!questionnaire || !questionnaire.id) {
      console.error("Missing or invalid questionnaire data");
      throw new Error("No questionnaire data provided");
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    let brandAttributes = {};
    if (questionnaire.is_ai_generated) {
      const attributesPrompt = `Generate brand identity attributes for a new business. Include:
1. A creative and memorable business name
2. An industry category from this list: Technology, Healthcare, Education, Retail, Finance, Entertainment, Food & Beverage, Travel, Real Estate
3. Three brand personality traits from this list: Professional, Friendly, Innovative, Traditional, Luxurious, Playful, Minimalist, Bold, Trustworthy, Creative
4. A target audience from this list: Young Professionals, Parents, Students, Business Owners, Seniors, Tech-Savvy, Luxury Consumers, Budget Shoppers, Health Enthusiasts, Creative Professionals
5. A compelling social media bio (max 160 characters)
6. A brief brand story (max 500 characters)

Format the response as a JSON object with these exact keys: businessName, industry, brandPersonality, targetAudience, socialBio, brandStory`;

      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a brand identity expert that generates creative and market-appropriate brand attributes.' },
            { role: 'user', content: attributesPrompt }
          ],
        }),
      });

      const attributesData = await completion.json();
      const attributesResponse = attributesData.choices[0]?.message?.content;
      
      if (!attributesResponse) {
        throw new Error("Failed to generate brand attributes");
      }

      try {
        // Attempt to parse the response, with error handling
        const parsedResponse = JSON.parse(attributesResponse.trim());
        console.log("Successfully parsed brand attributes:", parsedResponse);
        
        // Validate the required fields
        if (!parsedResponse.businessName || !parsedResponse.industry || !parsedResponse.brandPersonality || !parsedResponse.targetAudience) {
          throw new Error("Missing required fields in brand attributes");
        }
        
        // Ensure brandPersonality is an array
        if (!Array.isArray(parsedResponse.brandPersonality)) {
          parsedResponse.brandPersonality = [parsedResponse.brandPersonality];
        }
        
        brandAttributes = parsedResponse;
      } catch (error) {
        console.error("Error parsing brand attributes:", error, "Raw response:", attributesResponse);
        throw new Error("Invalid brand attributes format");
      }
    }

    // Use either provided or AI-generated attributes
    const finalBusinessName = questionnaire.business_name || brandAttributes.businessName || "AI Generated Brand";
    const finalIndustry = questionnaire.industry || brandAttributes.industry || "General";
    const finalPersonality = questionnaire.brand_personality?.length ? questionnaire.brand_personality : brandAttributes.brandPersonality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || brandAttributes.targetAudience || "General";
    const finalSocialBio = questionnaire.ai_generated_parameters?.socialBio || brandAttributes.socialBio || `Professional ${finalIndustry} services tailored to your needs`;
    const finalBrandStory = questionnaire.ai_generated_parameters?.brandStory || brandAttributes.brandStory || "";

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

    console.log("Sending prompt to OpenAI:", prompt);

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

    console.log("OpenAI response:", response);

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
    const logoUrl = logoData.data?.[0]?.url || "";

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

    console.log("Returning result:", result);

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