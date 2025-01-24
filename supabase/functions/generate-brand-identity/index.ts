import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateImage(prompt: string, size = "1024x1024") {
  console.log("Generating image with prompt:", prompt);
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('DALL-E API error:', error);
    throw new Error(`DALL-E API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { questionnaire } = await req.json();
    console.log("Received questionnaire data:", questionnaire);

    if (!questionnaire || typeof questionnaire !== 'object') {
      throw new Error('Invalid questionnaire data format');
    }

    // Validate required fields
    const requiredFields = ['business_name', 'industry', 'brand_personality'];
    for (const field of requiredFields) {
      if (!questionnaire[field]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate brand_personality is an array
    if (!Array.isArray(questionnaire.brand_personality)) {
      console.error('brand_personality must be an array');
      throw new Error('brand_personality must be an array');
    }

    console.log('Generating brand identity with OpenAI...');
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
            content: `Generate brand identity for business name: "${questionnaire.business_name}", 
            industry: "${questionnaire.industry}", 
            brand personality: ${JSON.stringify(questionnaire.brand_personality)}`
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

    // Generate images
    console.log('Generating profile image...');
    const profileImageUrl = await generateImage(suggestions.profileImagePrompt);
    console.log('Profile image generated:', profileImageUrl);

    console.log('Generating cover image...');
    const coverImageUrl = await generateImage(suggestions.coverImagePrompt, "1792x1024");
    console.log('Cover image generated:', coverImageUrl);

    // Save brand assets
    const { data: brandAsset, error: brandAssetError } = await supabase
      .from('brand_assets')
      .insert({
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
      })
      .select()
      .single();

    if (brandAssetError) {
      console.error('Error saving brand asset:', brandAssetError);
      throw brandAssetError;
    }

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