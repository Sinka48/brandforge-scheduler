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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaire } = await req.json();
    
    if (!questionnaire) {
      throw new Error('Questionnaire data is required');
    }

    console.log('Generating brand identity for questionnaire:', questionnaire);

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
            content: 'You are a brand identity expert. Generate brand identity suggestions based on the questionnaire data. Return a JSON object with color palette (array of hex codes), typography (object with headingFont and bodyFont), and logo description.'
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
      throw new Error('Failed to generate brand identity');
    }

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    // Store the generated assets
    const { data: asset, error: assetError } = await supabase
      .from('brand_assets')
      .insert([
        {
          user_id: questionnaire.user_id,
          questionnaire_id: questionnaire.id,
          asset_type: 'brand_identity',
          url: '', // This would be updated once we implement actual asset generation
          metadata: suggestions
        }
      ])
      .select()
      .single();

    if (assetError) {
      console.error('Error storing brand assets:', assetError);
      throw assetError;
    }

    return new Response(
      JSON.stringify(suggestions),
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