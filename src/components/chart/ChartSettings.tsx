import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChartSettingsProps {
  settings: {
    showGrid: boolean;
    showVolume: boolean;
    showLegend: boolean;
    theme: "light" | "dark";
    lineWidth: number;
    gridOpacity: number;
    upColor: string;
    downColor: string;
    indicators: ("sma" | "ema" | "rsi" | "macd" | "none")[];
    indicatorSettings: {
      sma?: { period: number };
      ema?: { period: number };
      rsi?: { period: number };
      macd?: { fastPeriod: number; slowPeriod: number; signalPeriod: number };
    };
  };
  onSettingsChange: (settings: Partial<ChartSettingsProps["settings"]>) => void;
}

const ChartSettings: React.FC<ChartSettingsProps> = ({
  settings = {
    showGrid: true,
    showVolume: true,
    showLegend: true,
    theme: "light",
    lineWidth: 2,
    gridOpacity: 0.1,
    upColor: "#26a69a",
    downColor: "#ef5350",
  },
  onSettingsChange,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chart Settings</SheetTitle>
          <SheetDescription>
            Customize the appearance of your chart
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Display Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Display</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid">Show Grid</Label>
                <Switch
                  id="show-grid"
                  checked={settings.showGrid}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ showGrid: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-volume">Show Volume</Label>
                <Switch
                  id="show-volume"
                  checked={settings.showVolume}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ showVolume: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-legend">Show Legend</Label>
                <Switch
                  id="show-legend"
                  checked={settings.showLegend}
                  onCheckedChange={(checked) =>
                    onSettingsChange({ showLegend: checked })
                  }
                />
              </div>
            </div>

            {/* Theme Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Theme</h4>
              <Select
                value={settings.theme}
                onValueChange={(value: "light" | "dark") =>
                  onSettingsChange({ theme: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Line Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Line Width</h4>
              <div className="flex flex-col space-y-2">
                <Slider
                  min={1}
                  max={4}
                  step={0.5}
                  value={[settings.lineWidth]}
                  onValueChange={([value]) =>
                    onSettingsChange({ lineWidth: value })
                  }
                />
                <span className="text-xs text-muted-foreground text-right">
                  {settings.lineWidth}px
                </span>
              </div>
            </div>

            {/* Grid Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Grid Opacity</h4>
              <div className="flex flex-col space-y-2">
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.gridOpacity]}
                  onValueChange={([value]) =>
                    onSettingsChange({ gridOpacity: value })
                  }
                />
                <span className="text-xs text-muted-foreground text-right">
                  {Math.round(settings.gridOpacity * 100)}%
                </span>
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Colors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="up-color">Up Color</Label>
                  <input
                    id="up-color"
                    type="color"
                    value={settings.upColor}
                    onChange={(e) =>
                      onSettingsChange({ upColor: e.target.value })
                    }
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-color">Down Color</Label>
                  <input
                    id="down-color"
                    type="color"
                    value={settings.downColor}
                    onChange={(e) =>
                      onSettingsChange({ downColor: e.target.value })
                    }
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Indicators</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="sma-toggle"
                    checked={settings.indicators.includes("sma")}
                    onCheckedChange={(checked) =>
                      onSettingsChange({
                        indicators: checked
                          ? [...settings.indicators, "sma"]
                          : settings.indicators.filter((i) => i !== "sma"),
                      })
                    }
                  />
                  <Label htmlFor="sma-toggle">SMA</Label>
                  {settings.indicators.includes("sma") && (
                    <Select
                      value={settings.indicatorSettings.sma?.period?.toString()}
                      onValueChange={(value) =>
                        onSettingsChange({
                          indicatorSettings: {
                            ...settings.indicatorSettings,
                            sma: { period: parseInt(value) },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 20, 50, 200].map((period) => (
                          <SelectItem key={period} value={period.toString()}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="ema-toggle"
                    checked={settings.indicators.includes("ema")}
                    onCheckedChange={(checked) =>
                      onSettingsChange({
                        indicators: checked
                          ? [...settings.indicators, "ema"]
                          : settings.indicators.filter((i) => i !== "ema"),
                      })
                    }
                  />
                  <Label htmlFor="ema-toggle">EMA</Label>
                  {settings.indicators.includes("ema") && (
                    <Select
                      value={settings.indicatorSettings.ema?.period?.toString()}
                      onValueChange={(value) =>
                        onSettingsChange({
                          indicatorSettings: {
                            ...settings.indicatorSettings,
                            ema: { period: parseInt(value) },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 20, 50, 200].map((period) => (
                          <SelectItem key={period} value={period.toString()}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="rsi-toggle"
                    checked={settings.indicators.includes("rsi")}
                    onCheckedChange={(checked) =>
                      onSettingsChange({
                        indicators: checked
                          ? [...settings.indicators, "rsi"]
                          : settings.indicators.filter((i) => i !== "rsi"),
                      })
                    }
                  />
                  <Label htmlFor="rsi-toggle">RSI</Label>
                  {settings.indicators.includes("rsi") && (
                    <Select
                      value={settings.indicatorSettings.rsi?.period?.toString()}
                      onValueChange={(value) =>
                        onSettingsChange({
                          indicatorSettings: {
                            ...settings.indicatorSettings,
                            rsi: { period: parseInt(value) },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 14, 20, 25].map((period) => (
                          <SelectItem key={period} value={period.toString()}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="macd-toggle"
                    checked={settings.indicators.includes("macd")}
                    onCheckedChange={(checked) =>
                      onSettingsChange({
                        indicators: checked
                          ? [...settings.indicators, "macd"]
                          : settings.indicators.filter((i) => i !== "macd"),
                      })
                    }
                  />
                  <Label htmlFor="macd-toggle">MACD</Label>
                  {settings.indicators.includes("macd") && (
                    <div className="flex gap-2">
                      <Select
                        value={settings.indicatorSettings.macd?.fastPeriod?.toString()}
                        onValueChange={(value) =>
                          onSettingsChange({
                            indicatorSettings: {
                              ...settings.indicatorSettings,
                              macd: {
                                ...settings.indicatorSettings.macd,
                                fastPeriod: parseInt(value),
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Fast" />
                        </SelectTrigger>
                        <SelectContent>
                          {[8, 12, 14].map((period) => (
                            <SelectItem key={period} value={period.toString()}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={settings.indicatorSettings.macd?.slowPeriod?.toString()}
                        onValueChange={(value) =>
                          onSettingsChange({
                            indicatorSettings: {
                              ...settings.indicatorSettings,
                              macd: {
                                ...settings.indicatorSettings.macd,
                                slowPeriod: parseInt(value),
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Slow" />
                        </SelectTrigger>
                        <SelectContent>
                          {[21, 26, 30].map((period) => (
                            <SelectItem key={period} value={period.toString()}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={settings.indicatorSettings.macd?.signalPeriod?.toString()}
                        onValueChange={(value) =>
                          onSettingsChange({
                            indicatorSettings: {
                              ...settings.indicatorSettings,
                              macd: {
                                ...settings.indicatorSettings.macd,
                                signalPeriod: parseInt(value),
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Signal" />
                        </SelectTrigger>
                        <SelectContent>
                          {[7, 9, 12].map((period) => (
                            <SelectItem key={period} value={period.toString()}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ChartSettings;
