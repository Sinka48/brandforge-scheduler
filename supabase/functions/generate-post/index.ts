import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { platforms, topic } = await req.json()

    if (!platforms || platforms.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one platform must be specified' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    })

    const platformStr = platforms.join(', ')
    const prompt = `Generate a social media post for ${platformStr}. Topic: ${topic || 'general'}. The post should be engaging and follow best practices for these platforms.`

    console.log('Generating post with prompt:', prompt)

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a social media expert that creates engaging posts optimized for different platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })

    const generatedContent = response.choices[0].message.content

    console.log('Generated content:', generatedContent)

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error generating post:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})