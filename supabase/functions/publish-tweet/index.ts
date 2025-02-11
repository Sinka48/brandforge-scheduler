import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TwitterKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

function validateKeys(keys: TwitterKeys) {
  if (!keys.consumerKey) throw new Error("Missing API Key");
  if (!keys.consumerSecret) throw new Error("Missing API Secret");
  if (!keys.accessToken) throw new Error("Missing Access Token");
  if (!keys.accessTokenSecret) throw new Error("Missing Access Token Secret");
}

function generateOAuthSignature(
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
  
  console.log("Generating OAuth signature with base string:", signatureBaseString);
  
  return crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  ).then(key => {
    return crypto.subtle.sign("HMAC", key, message);
  }).then(signature => {
    return encodeBase64(new Uint8Array(signature));
  });
}

async function generateOAuthHeader(method: string, url: string, keys: TwitterKeys): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const oauthParams = {
    oauth_consumer_key: keys.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: keys.accessToken,
    oauth_version: "1.0"
  };

  const signature = await generateOAuthSignature(
    method,
    url,
    oauthParams,
    keys.consumerSecret,
    keys.accessTokenSecret
  );

  console.log("Generated OAuth signature:", signature);

  return 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .sort()
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ');
}

async function getTwitterUsername(keys: TwitterKeys): Promise<string> {
  const url = "https://api.twitter.com/2/users/me";
  const method = "GET";

  const oauthHeader = await generateOAuthHeader(method, url, keys);
  console.log("Getting Twitter username with OAuth Header:", oauthHeader);

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': oauthHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twitter API Error:", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: errorText
    });
    throw new Error(`Failed to get Twitter username: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Twitter user data:", data);
  
  if (!data.data?.username) {
    throw new Error("Could not retrieve username from Twitter response");
  }

  return data.data.username;
}

async function publishTweet(content: string, keys: TwitterKeys): Promise<any> {
  const url = "https://api.twitter.com/2/tweets";
  const method = "POST";
  const params = { text: content };

  const oauthHeader = await generateOAuthHeader(method, url, keys);
  console.log("Publishing tweet with OAuth Header:", oauthHeader);

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': oauthHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const responseText = await response.text();
  console.log("Response Body:", responseText);

  if (!response.ok) {
    throw new Error(`Failed to publish tweet: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting request processing");

    const { content, test = false, keys } = await req.json();
    
    if (!keys) {
      throw new Error("Twitter API keys are required");
    }

    validateKeys(keys);
    
    if (test) {
      console.log("Test mode - verifying credentials and getting username");
      const username = await getTwitterUsername(keys);
      return new Response(
        JSON.stringify({ username, status: "ok" }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!content) {
      throw new Error("Tweet content is required");
    }

    console.log("Publishing tweet:", { content });
    const result = await publishTweet(content, keys);
    
    return new Response(
      JSON.stringify(result), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("Error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process request" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
