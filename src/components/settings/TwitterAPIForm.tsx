
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TwitterKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export function TwitterAPIForm() {
  const [keys, setKeys] = useState<TwitterKeys>({
    consumerKey: '',
    consumerSecret: '',
    accessToken: '',
    accessTokenSecret: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store in session storage (will be cleared when browser is closed)
    sessionStorage.setItem('twitter_keys', JSON.stringify(keys));
    
    // Test the connection
    try {
      const { data, error } = await fetch('/api/functions/publish-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: "Testing Twitter connection...",
          test: true,
          keys // Pass the keys to the function
        })
      }).then(res => res.json());

      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: `Connected to Twitter as @${data.username}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to verify Twitter credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Twitter API Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Twitter API credentials. These will be stored temporarily in your browser session.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium mb-1">
              API Key (Consumer Key)
            </label>
            <Input
              id="consumerKey"
              value={keys.consumerKey}
              onChange={(e) => setKeys({ ...keys, consumerKey: e.target.value })}
              required
              type="password"
              placeholder="Enter your API Key"
            />
          </div>

          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium mb-1">
              API Secret (Consumer Secret)
            </label>
            <Input
              id="consumerSecret"
              value={keys.consumerSecret}
              onChange={(e) => setKeys({ ...keys, consumerSecret: e.target.value })}
              required
              type="password"
              placeholder="Enter your API Secret"
            />
          </div>

          <div>
            <label htmlFor="accessToken" className="block text-sm font-medium mb-1">
              Access Token
            </label>
            <Input
              id="accessToken"
              value={keys.accessToken}
              onChange={(e) => setKeys({ ...keys, accessToken: e.target.value })}
              required
              type="password"
              placeholder="Enter your Access Token"
            />
          </div>

          <div>
            <label htmlFor="accessTokenSecret" className="block text-sm font-medium mb-1">
              Access Token Secret
            </label>
            <Input
              id="accessTokenSecret"
              value={keys.accessTokenSecret}
              onChange={(e) => setKeys({ ...keys, accessTokenSecret: e.target.value })}
              required
              type="password"
              placeholder="Enter your Access Token Secret"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save and Test Connection
        </Button>
      </form>
    </Card>
  );
}
