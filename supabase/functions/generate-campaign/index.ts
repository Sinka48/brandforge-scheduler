import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request data:', requestData);

    const { goal, platforms, duration, tone } = requestData;

    // Validate required parameters
    if (!goal || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      console.error('Missing or invalid required parameters:', { goal, platforms });
      throw new Error('Missing required parameters: goal and platforms array');
    }

    console.log('Generating campaign for:', { goal, platforms, duration, tone });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a social media campaign generator. Generate a campaign of posts for the specified platforms.
            Each post should be formatted as a JSON object with these properties:
            - content: the post text
            - platform: the social media platform
            - time: time in HH:mm format
            - imageUrl: a description for an image that would complement the post
            Return an object with a campaign property containing an array of post objects.`
          },
          {
            role: 'user',
            content: `Generate a ${duration}-day social media campaign about "${goal}" for ${platforms.join(', ')}. 
            Use a ${tone || 'professional'} tone. Each post should be platform-appropriate.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse campaign data from OpenAI response');
      }
    }

    console.log('Parsed result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-campaign function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});