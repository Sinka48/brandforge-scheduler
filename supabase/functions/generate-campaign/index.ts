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

    // Create a more structured example to guide the model
    const examplePost = {
      content: "Exciting news! We're launching our new product line today. Check out our website for exclusive deals! #launch #newproduct",
      platform: "twitter",
      time: "09:30",
      imageUrl: "Product showcase on a clean white background"
    };

    const systemPrompt = `You are a social media campaign generator. Generate exactly ${duration} posts for the specified platforms.
    Return ONLY a JSON object with this exact structure (no markdown, no additional text):
    {
      "campaign": [
        ${JSON.stringify(examplePost, null, 2)}
      ]
    }
    Each post must have exactly these fields: content, platform, time (HH:mm format), and imageUrl.`;

    const userPrompt = `Create a ${duration}-day social media campaign about "${goal}" for ${platforms.join(', ')}. 
    Use a ${tone || 'professional'} tone.
    Requirements:
    - Each post must be appropriate for its platform
    - Schedule posts between 9:00 and 20:00
    - Keep Twitter posts under 280 characters
    - Include relevant hashtags where appropriate
    - Provide clear image descriptions
    Return only the JSON object, no explanations or markdown.`;

    console.log('Sending request to OpenAI with prompts:', { systemPrompt, userPrompt });

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
    console.log('OpenAI raw response:', data.choices[0].message.content);

    let result;
    try {
      // First try to parse the content directly
      const content = data.choices[0].message.content.trim();
      result = JSON.parse(content);
      
      // Validate the expected structure
      if (!result.campaign || !Array.isArray(result.campaign)) {
        console.error('Invalid response structure:', result);
        throw new Error('Response missing campaign array');
      }

      // Validate each post in the campaign
      result.campaign.forEach((post: any, index: number) => {
        const requiredFields = ['content', 'platform', 'time', 'imageUrl'];
        const missingFields = requiredFields.filter(field => !post[field]);
        
        if (missingFields.length > 0) {
          console.error(`Post ${index} missing fields:`, missingFields);
          throw new Error(`Post ${index} missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate time format
        if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(post.time)) {
          console.error(`Invalid time format in post ${index}:`, post.time);
          throw new Error(`Invalid time format in post ${index}`);
        }
      });

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      
      // Try to extract JSON from markdown code blocks if direct parsing fails
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[1].trim();
          console.log('Extracted JSON from code block:', extractedJson);
          
          result = JSON.parse(extractedJson);
          if (!result.campaign || !Array.isArray(result.campaign)) {
            throw new Error('Invalid response structure in code block');
          }
        } catch (error) {
          console.error('Failed to parse JSON from code block:', error);
          throw new Error('Could not parse campaign data from code block');
        }
      } else {
        console.error('No JSON or code block found in response');
        throw new Error('Could not find valid JSON in OpenAI response');
      }
    }

    console.log('Successfully parsed result:', result);

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