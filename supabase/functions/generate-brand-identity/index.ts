import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Questionnaire {
  business_name: string;
  industry: string;
  brand_personality?: string[];
  target_audience?: {
    primary: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { questionnaire, regenerateOnly } = await req.json();
    
    if (!questionnaire) {
      throw new Error("No questionnaire data provided");
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    let prompt = `Generate a brand identity for:
    Business Name: "${questionnaire.business_name}"
    Industry: "${questionnaire.industry}"
    ${questionnaire.brand_personality?.length ? `Brand Personality: ${questionnaire.brand_personality.join(', ')}` : ''}
    ${questionnaire.target_audience?.primary ? `Target Audience: ${questionnaire.target_audience.primary}` : ''}`;

    if (regenerateOnly) {
      switch (regenerateOnly) {
        case 'logo':
          prompt += '\nGenerate only a new logo description and profile image prompt';
          break;
        case 'colors':
          prompt += '\nGenerate only a new color palette with exactly 5 hex colors';
          break;
        case 'typography':
          prompt += '\nGenerate only new typography choices for heading and body fonts';
          break;
        case 'twitter_profile':
        case 'facebook_profile':
        case 'instagram_profile':
        case 'linkedin_profile':
          prompt += '\nGenerate only a new profile image prompt';
          break;
        case 'twitter_cover':
        case 'facebook_cover':
        case 'linkedin_cover':
          prompt += '\nGenerate only a new cover image prompt';
          break;
      }
    } else {
      prompt += `
      Return a complete brand identity including:
      - A color palette of exactly 5 hex colors that work well together
      - Typography choices (headingFont and bodyFont) from Google Fonts
      - A detailed logo description
      - A creative brand name (if AI generated)
      - A compelling social media bio (max 160 characters)
      - Profile image prompt for DALL-E
      - Cover image prompt for DALL-E`;
    }

    console.log("Sending prompt to OpenAI:", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const response = completion.data.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    console.log("OpenAI response:", response);

    const dalle = new OpenAIApi(configuration);
    let logoUrl = "";
    let profileImageUrl = "";
    let coverImageUrl = "";

    if (!regenerateOnly || regenerateOnly === 'logo') {
      const logoPrompt = `Create a professional, modern logo for ${questionnaire.business_name} in the ${questionnaire.industry} industry. The logo should be simple, memorable, and work well at different sizes. Use a clean design with minimal colors.`;
      
      const logoResponse = await dalle.createImage({
        prompt: logoPrompt,
        n: 1,
        size: "512x512",
      });

      logoUrl = logoResponse.data.data[0]?.url || "";
    }

    if (!regenerateOnly || regenerateOnly.includes('profile')) {
      const profilePrompt = `Create a professional profile picture for ${questionnaire.business_name}'s social media. It should be simple, iconic, and instantly recognizable.`;
      
      const profileResponse = await dalle.createImage({
        prompt: profilePrompt,
        n: 1,
        size: "512x512",
      });

      profileImageUrl = profileResponse.data.data[0]?.url || "";
    }

    if (!regenerateOnly || regenerateOnly.includes('cover')) {
      const coverPrompt = `Create a professional cover image for ${questionnaire.business_name}'s social media. It should be wide format, simple, and align with the brand's industry: ${questionnaire.industry}.`;
      
      const coverResponse = await dalle.createImage({
        prompt: coverPrompt,
        n: 1,
        size: "1024x512",
      });

      coverImageUrl = coverResponse.data.data[0]?.url || "";
    }

    const result = {
      logoUrl,
      metadata: {
        name: questionnaire.business_name,
        industry: questionnaire.industry,
        brandPersonality: questionnaire.brand_personality,
        targetAudience: questionnaire.target_audience?.primary,
        socialBio: "Professional " + questionnaire.industry + " services tailored to your needs",
        socialAssets: {
          profileImage: profileImageUrl,
          coverImage: coverImageUrl,
        },
        isAiGenerated: true,
        aiGeneratedParameters: {
          businessName: questionnaire.business_name,
          industry: questionnaire.industry,
          brandPersonality: questionnaire.brand_personality,
          targetAudience: questionnaire.target_audience?.primary,
        }
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});