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
    const { questionnaire, version } = await req.json();
    
    if (!questionnaire) {
      throw new Error('Questionnaire data is required');
    }

    console.log('Generating brand identity for questionnaire:', questionnaire);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Generate brand identity using OpenAI
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
            - coverImagePrompt: a detailed prompt for generating a cover image
            Format the response as a valid JSON object with these exact keys.`
          },
          {
            role: 'user',
            content: `Generate brand identity for: ${JSON.stringify(questionnaire)}`
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

    // Generate profile image using DALL-E
    const profileImageUrl = await generateImage(suggestions.profileImagePrompt);

    // Generate cover image using DALL-E
    const coverImageUrl = await generateImage(suggestions.coverImagePrompt, "1792x1024");

    // Store the brand identity assets
    const { data: brandAsset, error: brandAssetError } = await supabase
      .from('brand_assets')
      .insert({
        user_id: questionnaire.user_id,
        questionnaire_id: questionnaire.id,
        asset_type: 'brand_identity',
        url: profileImageUrl,
        version: version || 1,
        metadata: {
          colors: suggestions.colors,
          typography: suggestions.typography,
          logoDescription: suggestions.logoDescription,
          socialAssets: {
            profileImage: profileImageUrl,
            coverImage: coverImageUrl
          },
          socialBio: suggestions.socialBio,
          name: suggestions.socialName
        },
        asset_category: 'brand'
      })
      .select()
      .single();

    if (brandAssetError) {
      console.error('Error storing brand assets:', brandAssetError);
      throw brandAssetError;
    }

    // Store the social media assets
    const { error: socialAssetsError } = await supabase
      .from('brand_assets')
      .insert([
        {
          user_id: questionnaire.user_id,
          questionnaire_id: questionnaire.id,
          asset_type: 'image',
          url: profileImageUrl,
          version: version || 1,
          asset_category: 'social',
          social_asset_type: 'profile'
        },
        {
          user_id: questionnaire.user_id,
          questionnaire_id: questionnaire.id,
          asset_type: 'image',
          url: coverImageUrl,
          version: version || 1,
          asset_category: 'social',
          social_asset_type: 'cover'
        }
      ]);

    if (socialAssetsError) {
      console.error('Error storing social assets:', socialAssetsError);
      throw socialAssetsError;
    }

    return new Response(
      JSON.stringify({
        colors: suggestions.colors,
        typography: suggestions.typography,
        logoUrl: profileImageUrl,
        socialName: suggestions.socialName,
        socialBio: suggestions.socialBio,
        profileImageUrl,
        coverImageUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
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
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});