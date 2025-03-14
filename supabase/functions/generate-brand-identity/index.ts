import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateBusinessName() {
  try {
    console.log("Generating business name with OpenAI");
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative business name generator. Generate a unique, memorable business name. Return only the name, nothing else."
          },
          {
            role: "user",
            content: "Generate a unique business name."
          }
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error response:", error);
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const businessName = data.choices[0].message.content.trim();
    console.log("Generated business name:", businessName);

    return {
      metadata: {
        name: businessName
      }
    };
  } catch (error) {
    console.error("Error in generateBusinessName:", error);
    throw error;
  }
}

async function generateImageWithDallE(prompt: string, size: "1024x1024" | "1792x1024") {
  try {
    console.log("Generating image with DALL-E, prompt:", prompt);
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `${prompt}. High quality, professional design. Pure white background. No text or words.`,
        n: 1,
        size: size,
        quality: "standard",
        response_format: "b64_json"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("DALL-E API error response:", error);
      throw new Error(`DALL-E API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    if (!data.data?.[0]?.b64_json) {
      throw new Error("No image data received from DALL-E");
    }

    console.log("Image generated successfully");
    return `data:image/png;base64,${data.data[0].b64_json}`;
  } catch (error) {
    console.error("Error in generateImageWithDallE:", error);
    throw error;
  }
}

async function generateBrandContent(businessName: string, industry: string, personality: string[], targetAudience: string) {
  try {
    console.log("Generating brand content with GPT-4");
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional brand identity expert. Generate concise, engaging brand content."
          },
          {
            role: "user",
            content: `Create a brand story and social media bio for a ${industry} business named "${businessName}" with these personality traits: ${personality.join(', ')}. The target audience is ${targetAudience}.`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("GPT API error response:", error);
      throw new Error(`GPT API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const [story, bio] = content.split('\n\n');
    
    return {
      brandStory: story.replace('Brand Story: ', '').trim(),
      socialBio: bio.replace('Social Bio: ', '').trim()
    };
  } catch (error) {
    console.error("Error in generateBrandContent:", error);
    throw error;
  }
}

async function generateSocialMediaAssets(businessName: string, industry: string) {
  console.log("Generating social media assets...");
  
  // Generate logo (square format)
  const logoPrompt = `Professional logo for ${businessName}, a ${industry} business`;
  const logoUrl = await generateImageWithDallE(logoPrompt, "1024x1024");
  
  // Generate cover image (wide format)
  const coverPrompt = `Professional, modern cover image or banner for ${businessName}, a ${industry} business. Abstract, minimalist design that represents the brand's identity`;
  const coverUrl = await generateImageWithDallE(coverPrompt, "1792x1024");
  
  return {
    profileImage: logoUrl,
    coverImage: coverUrl
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked - starting execution");

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error("OpenAI API key is not configured. Please add it in the Supabase dashboard.");
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('Unauthorized');
    }

    console.log("User authenticated:", user.id);
    
    const requestData = await req.json();
    console.log("Received request data:", requestData);

    if (requestData.generateNameOnly) {
      console.log("Generating business name only");
      const result = await generateBusinessName();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { questionnaire } = requestData;
    if (!questionnaire) {
      throw new Error('No questionnaire data provided');
    }

    const finalBusinessName = questionnaire.business_name || "AI Generated Brand";
    const finalIndustry = questionnaire.industry || "General";
    const finalPersonality = questionnaire.brand_personality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || "General";

    console.log("Generating brand content");
    const { brandStory, socialBio } = await generateBrandContent(
      finalBusinessName,
      finalIndustry,
      finalPersonality,
      finalTargetAudience
    );

    console.log("Generating social media assets");
    const socialAssets = await generateSocialMediaAssets(finalBusinessName, finalIndustry);

    const defaultColors = [
      "#4A90E2", // Blue
      "#50E3C2", // Teal
      "#F5A623", // Orange
      "#9013FE", // Purple
      "#D0021B"  // Red
    ];

    const result = {
      logoUrl: socialAssets.profileImage,
      metadata: {
        name: finalBusinessName,
        industry: finalIndustry,
        brandPersonality: finalPersonality,
        targetAudience: finalTargetAudience,
        socialBio: socialBio,
        story: brandStory,
        colors: defaultColors,
        socialAssets: {
          profileImage: socialAssets.profileImage,
          coverImage: socialAssets.coverImage,
        },
        isAiGenerated: questionnaire.is_ai_generated,
        aiGeneratedParameters: {
          socialBio: socialBio,
          brandStory: brandStory
        }
      }
    };

    console.log("Returning successful response");
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in generate-brand-identity:", error);
    
    if (error.message?.includes('insufficient_quota')) {
      return new Response(JSON.stringify({ 
        error: "OpenAI API quota exceeded. Please check your billing details or use a different API key.",
        details: error.toString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 402
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error",
      details: error.toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message === 'Unauthorized' ? 401 : 500,
    });
  }
});
