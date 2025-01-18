import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { questionnaire } = await req.json()
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

    // Generate color palette
    const colorResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a brand identity expert. Generate a color palette based on the brand questionnaire data. Return only a JSON array of exactly 5 hex color codes.'
          },
          {
            role: 'user',
            content: `Generate a color palette for a ${questionnaire.industry} business with these traits: ${questionnaire.brand_personality.join(', ')}. They prefer these colors: ${questionnaire.color_preferences.join(', ')}`
          }
        ],
      }),
    })

    const colorData = await colorResponse.json()
    const colors = JSON.parse(colorData.choices[0].message.content)

    // Generate typography recommendations
    const typographyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a typography expert. Recommend font pairings based on brand personality. Return a JSON object with headingFont and bodyFont properties.'
          },
          {
            role: 'user',
            content: `Recommend fonts for a ${questionnaire.industry} business with these traits: ${questionnaire.brand_personality.join(', ')}`
          }
        ],
      }),
    })

    const typographyData = await typographyResponse.json()
    const typography = JSON.parse(typographyData.choices[0].message.content)

    // Generate logo concepts using DALL-E
    const logoResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a modern, professional logo for ${questionnaire.business_name}, a ${questionnaire.industry} business. The brand personality is ${questionnaire.brand_personality.join(', ')}. Use these colors: ${questionnaire.color_preferences.join(', ')}. The logo should be minimal and versatile.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    })

    const logoData = await logoResponse.json()

    return new Response(
      JSON.stringify({
        colors,
        typography,
        logoUrl: logoData.data[0].url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    )
  }
})