
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TwitterFormSkeleton } from "./TwitterFormSkeleton";
import { useTwitterCredentials } from "@/hooks/useTwitterCredentials";

export function TwitterAPIForm() {
  const { keys, setKeys, isLoading, saveCredentials } = useTwitterCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCredentials(keys);
  };

  if (isLoading) {
    return <TwitterFormSkeleton />;
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Twitter API Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Twitter API credentials. These will be securely stored for future use.
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          Save and Test Connection
        </Button>
      </form>
    </Card>
  );
}
