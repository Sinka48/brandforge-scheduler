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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    if (!questionnaire) {
      throw new Error('Questionnaire data is required')
    }

    console.log('Starting brand identity generation process...')
    console.log('Questionnaire data:', JSON.stringify(questionnaire, null, 2))

    // Generate color palette
    console.log('Generating color palette...')
    const colorPrompt = `Generate a color palette for a ${questionnaire.industry} business with these traits: ${questionnaire.brand_personality.join(', ')}. They prefer these colors: ${questionnaire.color_preferences.join(', ')}. Return exactly 5 hex color codes in a JSON array format.`
    
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
            content: 'You are a brand identity expert. Generate a color palette. Return only a JSON array of exactly 5 hex color codes.'
          },
          {
            role: 'user',
            content: colorPrompt
          }
        ],
      }),
    })

    if (!colorResponse.ok) {
      const errorData = await colorResponse.text()
      console.error('OpenAI Color API Error:', errorData)
      throw new Error(`OpenAI Color API Error: ${colorResponse.status}`)
    }

    const colorData = await colorResponse.json()
    console.log('Color API response:', JSON.stringify(colorData, null, 2))
    
    if (!colorData.choices?.[0]?.message?.content) {
      throw new Error('Invalid color response from OpenAI')
    }
    
    const colors = JSON.parse(colorData.choices[0].message.content)
    console.log('Generated colors:', colors)

    // Generate typography recommendations
    console.log('Generating typography recommendations...')
    const typographyPrompt = `Recommend fonts for a ${questionnaire.industry} business with these traits: ${questionnaire.brand_personality.join(', ')}. Return a JSON object with headingFont and bodyFont properties.`
    
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
            content: typographyPrompt
          }
        ],
      }),
    })

    if (!typographyResponse.ok) {
      const errorData = await typographyResponse.text()
      console.error('OpenAI Typography API Error:', errorData)
      throw new Error(`OpenAI Typography API Error: ${typographyResponse.status}`)
    }

    const typographyData = await typographyResponse.json()
    console.log('Typography API response:', JSON.stringify(typographyData, null, 2))
    
    if (!typographyData.choices?.[0]?.message?.content) {
      throw new Error('Invalid typography response from OpenAI')
    }

    const typography = JSON.parse(typographyData.choices[0].message.content)
    console.log('Generated typography:', typography)

    // Generate logo concept
    console.log('Generating logo concept...')
    const logoPrompt = `Create a modern, professional logo for ${questionnaire.business_name}, a ${questionnaire.industry} business. The brand personality is ${questionnaire.brand_personality.join(', ')}. Use these colors: ${questionnaire.color_preferences.join(', ')}. The logo should be minimal and versatile.`
    
    const logoResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: logoPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    })

    if (!logoResponse.ok) {
      const errorData = await logoResponse.text()
      console.error('DALL-E API Error:', errorData)
      throw new Error(`DALL-E API Error: ${logoResponse.status}`)
    }

    const logoData = await logoResponse.json()
    console.log('Logo API response:', JSON.stringify(logoData, null, 2))
    
    if (!logoData.data?.[0]?.url) {
      throw new Error('Invalid logo response from DALL-E')
    }

    console.log('Brand identity generation completed successfully')

    return new Response(
      JSON.stringify({
        colors,
        typography,
        logoUrl: logoData.data[0].url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error in generate-brand-identity function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})