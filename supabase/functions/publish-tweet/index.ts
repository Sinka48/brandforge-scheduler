import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function validateEnvironmentVariables() {
  if (!API_KEY) throw new Error("Missing TWITTER_CONSUMER_KEY");
  if (!API_SECRET) throw new Error("Missing TWITTER_CONSUMER_SECRET");
  if (!ACCESS_TOKEN) throw new Error("Missing TWITTER_ACCESS_TOKEN");
  if (!ACCESS_TOKEN_SECRET) throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET");
}

async function generateOAuthSignature(
  method: string,
  url: string,
  oauthParams: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): Promise<string> {
  const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(
    Object.entries(oauthParams)
      .sort()
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&")
  )}`;

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  const encoder = new TextEncoder();
  const key = encoder.encode(signingKey);
  const message = encoder.encode(signatureBaseString);
  
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", hmacKey, message);
  return encodeBase64(new Uint8Array(signature));
}

async function generateOAuthHeader(method: string, url: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0"
  };

  const signature = await generateOAuthSignature(
    method,
    url,
    oauthParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  return 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .sort()
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ');
}

async function publishTweet(content: string): Promise<any> {
  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";

  const oauthHeader = await generateOAuthHeader(method, url);
  console.log("Generated OAuth Header:", oauthHeader);

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': oauthHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: content })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twitter API Response:", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: errorText
    });
    throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    validateEnvironmentVariables();
    console.log("Environment variables validated");

    const { content, test = false } = await req.json();
    
    if (!content) {
      throw new Error("Tweet content is required");
    }

    if (content.length > 280) {
      throw new Error("Tweet content exceeds 280 characters");
    }

    if (test) {
      console.log("Test mode - verifying credentials only");
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Publishing tweet:", { content });
    const result = await publishTweet(content);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to publish tweet" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});