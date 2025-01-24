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
  // Handle CORS preflight requests
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

    console.log("Processing questionnaire:", questionnaire);

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error("OpenAI API key not found");
    }

    let prompt = `Generate a brand identity for:
Business Name: "${questionnaire.business_name}"
Industry: "${questionnaire.industry}"
${questionnaire.brand_personality?.length ? `Brand Personality: ${questionnaire.brand_personality.join(', ')}` : ''}
${questionnaire.target_audience?.primary ? `Target Audience: ${questionnaire.target_audience.primary}` : ''}
${questionnaire.ai_generated_parameters?.socialBio ? `Social Bio: ${questionnaire.ai_generated_parameters.socialBio}` : ''}
${questionnaire.ai_generated_parameters?.brandStory ? `Brand Story: ${questionnaire.ai_generated_parameters.brandStory}` : ''}

Return a complete brand identity including:
- A color palette of exactly 5 hex colors that work well together and align with the brand personality
- A detailed logo description
- A creative brand name (if AI generated)
- A compelling social media bio (max 160 characters)
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
    const logoPrompt = `Create a professional, modern logo for ${questionnaire.business_name} in the ${questionnaire.industry} industry. The logo should be simple, memorable, and work well at different sizes. Use a clean design with minimal colors.`;
    
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
        name: questionnaire.business_name,
        industry: questionnaire.industry,
        brandPersonality: questionnaire.brand_personality,
        targetAudience: questionnaire.target_audience?.primary,
        socialBio: questionnaire.ai_generated_parameters?.socialBio || `Professional ${questionnaire.industry} services tailored to your needs`,
        brandStory: questionnaire.ai_generated_parameters?.brandStory,
        colors,
        socialAssets: {
          profileImage: "",
          coverImage: "",
        },
        isAiGenerated: questionnaire.is_ai_generated,
        aiGeneratedParameters: questionnaire.ai_generated_parameters
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