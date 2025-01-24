import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Questionnaire {
  business_name: string;
  industry: string;
  brand_personality: string[];
  user_id: string;
  id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function started");
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const requestData = await req.json();
    console.log("Received request data:", requestData);

    // Validate questionnaire data structure
    if (!requestData.questionnaire) {
      console.error("Missing questionnaire in request data:", requestData);
      throw new Error('Missing questionnaire data');
    }

    const questionnaire = requestData.questionnaire as Questionnaire;

    // Validate required fields
    const requiredFields = ['business_name', 'industry', 'brand_personality', 'user_id', 'id'];
    for (const field of requiredFields) {
      if (!questionnaire[field as keyof Questionnaire]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate brand_personality is an array
    if (!Array.isArray(questionnaire.brand_personality)) {
      console.error('brand_personality must be an array');
      throw new Error('brand_personality must be an array');
    }

    console.log("Generating brand identity with OpenAI...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a brand identity expert. Generate a complete brand identity based on the questionnaire data. 
            Return a JSON object with:
            - colors: array of exactly 5 hex color codes that work well together based on the brand personality
            - typography: object with headingFont and bodyFont (use Google Fonts names)
            - logoDescription: detailed description of a logo that matches the brand
            - socialName: a creative and memorable brand name
            - socialBio: a compelling social media bio (max 160 characters)
            - profileImagePrompt: a detailed prompt for generating a profile image
            - coverImagePrompt: a detailed prompt for generating a cover image`
          },
          {
            role: 'user',
            content: `Generate brand identity for:
            Business Name: "${questionnaire.business_name}"
            Industry: "${questionnaire.industry}"
            Brand Personality: ${JSON.stringify(questionnaire.brand_personality)}`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    const suggestions = JSON.parse(data.choices[0].message.content);
    console.log('Parsed suggestions:', suggestions);

    // Generate profile image
    console.log('Generating profile image...');
    const profileImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: suggestions.profileImagePrompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!profileImageResponse.ok) {
      const error = await profileImageResponse.text();
      console.error('DALL-E API error (profile):', error);
      throw new Error(`DALL-E API error (profile): ${error}`);
    }

    const profileImageData = await profileImageResponse.json();
    const profileImageUrl = profileImageData.data[0].url;

    // Generate cover image
    console.log('Generating cover image...');
    const coverImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: suggestions.coverImagePrompt,
        n: 1,
        size: "1792x1024",
      }),
    });

    if (!coverImageResponse.ok) {
      const error = await coverImageResponse.text();
      console.error('DALL-E API error (cover):', error);
      throw new Error(`DALL-E API error (cover): ${error}`);
    }

    const coverImageData = await coverImageResponse.json();
    const coverImageUrl = coverImageData.data[0].url;

    const brandAsset = {
      user_id: questionnaire.user_id,
      questionnaire_id: questionnaire.id,
      asset_type: 'brand_identity',
      url: profileImageUrl,
      metadata: {
        colors: suggestions.colors,
        typography: suggestions.typography,
        logoDescription: suggestions.logoDescription,
        name: suggestions.socialName,
        socialBio: suggestions.socialBio,
        socialAssets: {
          profileImage: profileImageUrl,
          coverImage: coverImageUrl
        }
      }
    };

    console.log('Generated brand asset:', brandAsset);

    return new Response(
      JSON.stringify(brandAsset),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-brand-identity function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});