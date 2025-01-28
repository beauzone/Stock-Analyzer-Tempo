import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsPanel from "./NewsPanel";
import AIAnalysisPanel from "./AIAnalysisPanel";

interface AnalysisTabsProps {
  symbol?: string;
  onAnalyze?: (query: string) => Promise<string>;
  isLoading?: boolean;
  aiAnalysis?: string;
  news?: Array<{
    id: string;
    title: string;
    source: string;
    timestamp: string;
    summary: string;
  }>;
}

const AnalysisTabs = ({
  symbol = "AAPL",
  onAnalyze = async (query: string) => `AI analysis for: ${query}`,
  isLoading = false,
  aiAnalysis = "No analysis available yet. Try asking a question about the stock.",
  news = [
    {
      id: "1",
      title: "Market Rally Continues as Tech Stocks Surge",
      source: "Financial Times",
      timestamp: "2 hours ago",
      summary:
        "Major technology stocks led a broad market rally as investors responded positively to recent earnings reports...",
    },
    {
      id: "2",
      title: "Federal Reserve Signals Potential Rate Changes",
      source: "Wall Street Journal",
      timestamp: "4 hours ago",
      summary:
        "The Federal Reserve indicated it may adjust its monetary policy stance in response to recent economic data...",
    },
  ],
}: AnalysisTabsProps) => {
  return (
    <div className="w-full h-[382px] bg-background">
      <Tabs defaultValue="news" className="w-full h-full">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 h-[calc(100%-48px)]">
          <TabsContent value="news" className="mt-0 h-full">
            <NewsPanel news={news} />
          </TabsContent>

          <TabsContent value="ai-analysis" className="mt-0 h-full">
            <AIAnalysisPanel
              onAnalyze={onAnalyze}
              isLoading={isLoading}
              analysis={aiAnalysis}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalysisTabs;
