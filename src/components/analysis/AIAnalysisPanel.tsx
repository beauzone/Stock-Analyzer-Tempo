import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";

interface AIAnalysisPanelProps {
  onAnalyze?: (query: string) => Promise<string>;
  isLoading?: boolean;
  analysis?: string;
}

const AIAnalysisPanel = ({
  onAnalyze = async (query: string) => `AI analysis for: ${query}`,
  isLoading = false,
  analysis = "No analysis available yet. Try asking a question about the stock.",
}: AIAnalysisPanelProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await onAnalyze(query);
      setQuery("");
    }
  };

  return (
    <Card className="h-full w-full bg-background p-4 flex flex-col gap-4">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full rounded-md border p-4">
          <div className="whitespace-pre-wrap">{analysis}</div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Ask about this stock's performance, fundamentals, or technical analysis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default AIAnalysisPanel;
