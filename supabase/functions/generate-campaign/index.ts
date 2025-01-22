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

    const systemPrompt = `You are a social media campaign generator. Generate a campaign of ${duration} posts for the specified platforms.
    Each post should be formatted as a JSON object within a campaign array like this:
    {
      "campaign": [
        {
          "content": "The post text content",
          "platform": "platform name",
          "time": "HH:mm",
          "imageUrl": "description of image that would complement the post"
        }
      ]
    }
    Important: Return ONLY valid JSON, no additional text or markdown.`;

    const userPrompt = `Generate a ${duration}-day social media campaign about "${goal}" for ${platforms.join(', ')}. 
    Use a ${tone || 'professional'} tone. Each post should be platform-appropriate.
    Spread the posts throughout the day between 9:00 and 20:00.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
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
      // First try to parse the content directly
      result = JSON.parse(data.choices[0].message.content);
      
      // Validate the expected structure
      if (!result.campaign || !Array.isArray(result.campaign)) {
        throw new Error('Invalid response structure');
      }

      // Validate each post in the campaign
      result.campaign.forEach((post: any, index: number) => {
        if (!post.content || !post.platform || !post.time || !post.imageUrl) {
          throw new Error(`Invalid post structure at index ${index}`);
        }
      });

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      
      // Try to extract JSON from markdown code blocks if direct parsing fails
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[1].trim());
          if (!result.campaign || !Array.isArray(result.campaign)) {
            throw new Error('Invalid response structure in code block');
          }
        } catch (error) {
          console.error('Failed to parse JSON from code block:', error);
          throw new Error('Could not parse campaign data from OpenAI response');
        }
      } else {
        throw new Error('Could not find valid JSON in OpenAI response');
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