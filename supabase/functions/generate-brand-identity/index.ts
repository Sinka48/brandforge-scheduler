import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateLogoWithHuggingFace(prompt: string) {
  try {
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));
    console.log("Generating logo with prompt:", prompt);

    const response = await hf.textToImage({
      inputs: prompt,
      model: 'stabilityai/stable-diffusion-2',
      parameters: {
        negative_prompt: "text, words, letters, watermark, signature, blurry, low quality",
        num_inference_steps: 30,
        guidance_scale: 7.5,
      }
    });

    if (!response) {
      throw new Error("No response from Hugging Face API");
    }

    console.log("Image generation successful, converting to base64");
    
    // Convert the response to a base64 string
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer) {
      throw new Error("Failed to get array buffer from response");
    }

    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const logoUrl = `data:image/png;base64,${base64}`;

    console.log("Logo generated and converted successfully");
    return logoUrl;
  } catch (error) {
    console.error("Error in generateLogoWithHuggingFace:", error);
    throw new Error(`Logo generation failed: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked - starting execution");

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
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

    // Set auth header and verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('Unauthorized');
    }

    console.log("User authenticated:", user.id);
    
    const { questionnaire } = await req.json();
    console.log("Received questionnaire:", questionnaire);

    // Use either provided or default attributes
    const finalBusinessName = questionnaire.business_name || "AI Generated Brand";
    const finalIndustry = questionnaire.industry || "General";
    const finalPersonality = questionnaire.brand_personality || [];
    const finalTargetAudience = questionnaire.target_audience?.primary || "General";

    // Generate brand story and social media bio using simple templates
    const brandStory = `${finalBusinessName} is a leading provider in the ${finalIndustry} industry, dedicated to delivering exceptional value to our customers. We focus on ${finalPersonality.join(' and ')} while serving ${finalTargetAudience}.`;
    
    const socialBio = `Professional ${finalIndustry} services tailored for ${finalTargetAudience}`;

    // Generate logo using Hugging Face
    const logoPrompt = `Create a minimalist, professional logo for a ${finalIndustry} business. Simple, clean design with basic shapes. Pure white background. No text or words. High contrast, suitable for business use.`;
    
    console.log("Generating logo with Hugging Face");
    const logoUrl = await generateLogoWithHuggingFace(logoPrompt);

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
        socialBio: socialBio,
        story: brandStory,
        colors: defaultColors,
        socialAssets: {
          profileImage: logoUrl,
          coverImage: "",
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
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error",
      details: error.toString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message === 'Unauthorized' ? 401 : 500,
    });
  }
});