import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface HashtagSelectorProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  suggestedHashtags?: string[];
}

export function HashtagSelector({ 
  hashtags, 
  onHashtagsChange,
  suggestedHashtags = []
}: HashtagSelectorProps) {
  const [input, setInput] = useState("");

  const handleAddHashtag = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formattedTag)) {
      onHashtagsChange([...hashtags, formattedTag]);
    }
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      handleAddHashtag(input.trim());
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    onHashtagsChange(hashtags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      <Label>Hashtags</Label>
      
      <div className="space-y-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type hashtag and press Enter"
        />

        <div className="flex flex-wrap gap-2">
          {hashtags.map(tag => (
            <Badge
              key={tag}
              variant="default"
              className="flex items-center gap-1"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveHashtag(tag)}
              />
            </Badge>
          ))}
        </div>

        {suggestedHashtags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Suggested Hashtags</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleAddHashtag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}