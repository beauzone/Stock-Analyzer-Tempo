import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  summary: string;
}

interface NewsPanelProps {
  news?: NewsItem[];
}

export default function NewsPanel({
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
    {
      id: "3",
      title: "New Regulations Impact Trading Platforms",
      source: "Bloomberg",
      timestamp: "6 hours ago",
      summary:
        "Regulatory changes announced today could significantly affect how trading platforms operate...",
    },
  ],
}: NewsPanelProps) {
  return (
    <Card className="w-full h-full bg-background border">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Latest News</h2>
        <ScrollArea className="h-[280px] w-full rounded-md">
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={item.id}>
                <div className="space-y-1">
                  <h3 className="font-medium leading-none">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{item.source}</span>
                    <span className="mx-2">•</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
                {index < news.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
