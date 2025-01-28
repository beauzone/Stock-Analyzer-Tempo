import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface ChartTab {
  id: string;
  symbol: string;
  isActive: boolean;
}

interface ChartTabsProps {
  tabs?: ChartTab[];
  onAddTab?: () => void;
  onCloseTab?: (id: string) => void;
  onSelectTab?: (id: string) => void;
}

const ChartTabs = ({
  tabs = [
    { id: "1", symbol: "AAPL", isActive: true },
    { id: "2", symbol: "GOOGL", isActive: false },
    { id: "3", symbol: "MSFT", isActive: false },
  ],
  onAddTab = () => {},
  onCloseTab = () => {},
  onSelectTab = () => {},
}: ChartTabsProps) => {
  return (
    <div className="w-full bg-background border-b">
      <div className="flex items-center justify-between px-2 h-10">
        <Tabs
          defaultValue={tabs.find((tab) => tab.isActive)?.id || tabs[0]?.id}
          className="flex-1"
          onValueChange={onSelectTab}
        >
          <TabsList className="h-9 bg-transparent">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex items-center group">
                <TabsTrigger
                  value={tab.id}
                  className="data-[state=active]:bg-muted px-4 h-8"
                >
                  {tab.symbol}
                </TabsTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onCloseTab(tab.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="ml-2" onClick={onAddTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChartTabs;
