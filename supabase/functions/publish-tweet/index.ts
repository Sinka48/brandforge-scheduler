
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "node:crypto";

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

const BASE_URL = "https://api.twitter.com/2";

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  console.log("Generated OAuth signature:", signature);
  return signature;
}

function generateOAuthHeader(method: string, url: string, keys: TwitterKeys): string {
  const oauthParams = {
    oauth_consumer_key: keys.consumerKey,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: keys.accessToken,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    keys.consumerSecret,
    keys.accessTokenSecret
  );

  return 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .sort()
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ');
}

async function publishTweet(content: string, keys: TwitterKeys): Promise<any> {
  const url = `${BASE_URL}/tweets`;
  const method = "POST";
  const params = { text: content };

  const oauthHeader = generateOAuthHeader(method, url, keys);
  console.log("Publishing tweet with OAuth Header:", oauthHeader);

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': oauthHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Twitter API Error:", {
      status: response.status,
      body: errorText
    });
    throw new Error(`Failed to publish tweet: ${response.status} - ${errorText}`);
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, keys, test = false } = await req.json();
    
    if (!keys) {
      throw new Error("Twitter API keys are required");
    }

    if (!test && !content) {
      throw new Error("Tweet content is required");
    }

    if (test) {
      // Just verify the credentials by trying to get the user info
      const url = `${BASE_URL}/users/me`;
      const method = "GET";
      const oauthHeader = generateOAuthHeader(method, url, keys);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': oauthHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to verify credentials: ${response.status} - ${errorText}`);
      }

      const userData = await response.json();
      return new Response(
        JSON.stringify({ username: userData.data?.username, status: "ok" }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
