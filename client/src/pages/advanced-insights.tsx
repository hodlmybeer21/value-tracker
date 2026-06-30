import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Baby, TrendingUp, Bitcoin, Copy, Check, Share2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ITEMS, ItemData } from "@/data/items";
import { CostChart } from "@/components/cost-chart";
import background from "@assets/generated_images/subtle_dark_financial_data_visualization_abstract_background.png";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

const BITCOIN_ADDRESS = "bc1qakn7jw6wjuhr3t5mpgjaw5ppnsp7gwt4534php";

export default function AdvancedInsights() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Honor ?item= deep link so home → insights preserves the user's selection.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const itemParam = params.get("item");
      if (itemParam && ITEMS.some((i) => i.id === itemParam)) {
        setSelectedItemId(itemParam);
      }
    }
  }, []);

  // Defaults: Millennial-typical — born 1985, had kids at 30 → "your era" = 2015 (the year Bitcoin was in mainstream narratives and just starting its big run)
  const [parentBirthYear, setParentBirthYear] = useState<string>("1985");
  const [parentAgeAtBirth, setParentAgeAtBirth] = useState<string>("30");
  const [selectedItemId, setSelectedItemId] = useState<string>("home");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(BITCOIN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareMyEra = async () => {
    const url = `${window.location.origin}/advanced-insights?item=${encodeURIComponent(selectedItemId)}`;
    const shareText = `Since ${parentEraYear}, the cost of a ${selectedItem.name.toLowerCase()} has risen ${usdChange.toFixed(0)}% in US Dollars. See yours →`;
    const fullText = `${shareText} ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `My era vs. now: ${selectedItem.name}`, text: shareText, url });
      } else {
        await navigator.clipboard.writeText(fullText);
        toast({
          title: "Link copied",
          description: `Era, item, and numbers — paste anywhere.`,
        });
      }
    } catch (err) {
      // User cancelled share — do nothing
      console.error("Share failed:", err);
    }
  };

  const selectedItem = ITEMS.find(i => i.id === selectedItemId) || ITEMS.find(i => i.id === "home")!;

  // Calculations
  const parentYear = parseInt(parentBirthYear);
  const ageAtBirth = parseInt(parentAgeAtBirth);
  
  const parentEraStart = parentYear + 20; // Assume "Adult" life starts at 20? Or specifically when they had kids?
  // Text says "Parent's Era (e.g., cost when you had kids)"
  const parentChildbirthYear = parentYear + ageAtBirth;
  const currentYear = new Date().getFullYear();

  // Find data points — track the actual year used so labels don't lie about which year is shown
  const findEraData = (targetYear: number) => {
    return (
      selectedItem.data.find(d => d.year === targetYear) ||
      selectedItem.data.find(d => d.year === Math.floor(targetYear / 5) * 5) ||
      selectedItem.data[0]
    );
  };
  const parentEraData = findEraData(parentChildbirthYear);
  const parentEraYear = parentEraData.year;
  const parentEraWasFallback = parentEraYear !== parentChildbirthYear;

  const currentEraData = findEraData(currentYear);
  const currentEraYear = currentEraData.year;
  const currentEraWasFallback = currentEraYear !== currentYear;

  // Calculate Shifts
  const calculateChange = (start: number, end: number) => {
    if (!start) return 0;
    return ((end - start) / start) * 100;
  };

  const usdChange = calculateChange(parentEraData.itemPriceUSD, currentEraData.itemPriceUSD);
  
  // Gold/BTC purchasing power logic is inverse of price (lower cost = higher purchasing power)
  // Cost in Gold
  const goldCostStart = parentEraData.itemPriceUSD / (parentEraData.goldPriceUSD || 1);
  const goldCostEnd = currentEraData.itemPriceUSD / (currentEraData.goldPriceUSD || 1);
  const goldCostChange = calculateChange(goldCostStart, goldCostEnd);

  // BTC Cost (only if start year has BTC, which is unlikely for parents, so we handle it gracefully)
  const btcCostStart = parentEraData.btcPriceUSD ? parentEraData.itemPriceUSD / parentEraData.btcPriceUSD : null;
  const btcCostEnd = currentEraData.btcPriceUSD ? currentEraData.itemPriceUSD / currentEraData.btcPriceUSD : null;
  const btcCostChange = (btcCostStart && btcCostEnd) ? calculateChange(btcCostStart, btcCostEnd) : null;

  // Filter data for the chart to start from the ACTUAL era year shown (so the chart and labels agree)
  const filteredItem = useMemo(() => {
    return {
      ...selectedItem,
      data: selectedItem.data.filter(d => d.year >= parentEraYear)
    };
  }, [selectedItem, parentEraYear]);


  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/20">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" /> Back to Overview
            </Button>
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
                data-testid="button-donate-insights"
              >
                <Bitcoin className="w-4 h-4" />
                <span className="hidden sm:inline">Support Value Tracker</span>
                <span className="sm:hidden">Support</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-orange-500">
                  <Bitcoin className="w-5 h-5" />
                  Support Value Tracker
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG 
                    value={`bitcoin:${BITCOIN_ADDRESS}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="w-full space-y-2">
                  <p className="text-sm text-slate-300 text-center">
                    Scan the QR code or copy the address below
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-800 px-3 py-2 rounded text-xs break-all font-mono text-slate-200">
                      {BITCOIN_ADDRESS}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={copyToClipboard}
                      className="shrink-0 border-slate-600 hover:bg-slate-800"
                      data-testid="button-copy-address-insights"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-300" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-500 text-center">Address copied!</p>
                  )}
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Thank you for supporting this project!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <header className="mb-12">
           <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-wider mb-2">
            GENERATIONAL INSIGHTS
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Bridge the Generation Gap
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Understand how the economic landscape has shifted between your generation and the next. 
            See the data behind the "it was cheaper back then" feeling.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card/40 backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Baby className="h-5 w-5 text-primary" />
                  Your Era vs. Now
                </CardTitle>
                <CardDescription>
                  Enter details to compare your purchasing power when you started a family versus today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Item to Compare</Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger className="h-12 bg-card border-border text-lg shadow-sm">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border shadow-xl z-[9999] opacity-100 max-h-[300px]">
                      {ITEMS.map((item) => (
                        <SelectItem key={item.id} value={item.id} className="text-base py-3 cursor-pointer text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:font-semibold data-[state=checked]:text-slate-900">
                          <span className="mr-2">{item.emoji}</span> {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border/50" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Your Birth Year</Label>
                    <Input 
                      type="number" 
                      min={1940} 
                      max={2000} 
                      value={parentBirthYear} 
                      onChange={(e) => setParentBirthYear(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age you had kids</Label>
                    <Input 
                      type="number" 
                      min={18} 
                      max={50} 
                      value={parentAgeAtBirth} 
                      onChange={(e) => setParentAgeAtBirth(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Quick presets */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    One-tap presets
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Boomer parent", year: "1955", age: "30" },
                      { label: "Gen X parent", year: "1975", age: "32" },
                      { label: "Millennial", year: "1985", age: "30" },
                      { label: "Gen Z", year: "1995", age: "26" },
                    ].map((p) => {
                      const active = parentBirthYear === p.year && parentAgeAtBirth === p.age;
                      return (
                        <button
                          key={p.label}
                          onClick={() => {
                            setParentBirthYear(p.year);
                            setParentAgeAtBirth(p.age);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                            active
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-card text-muted-foreground border-border hover:border-blue-500/50 hover:text-blue-400"
                          }`}
                          data-testid={`preset-${p.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="font-mono text-xs uppercase mb-1 text-primary">Comparison Era</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span>Parent's Era:</span>
                    <span className="font-bold text-foreground">{parentEraYear}{parentEraWasFallback && <span className="text-xs text-muted-foreground font-normal"> (closest available)</span>}</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <span>Current Era:</span>
                    <span className="font-bold text-foreground">{currentEraYear}{currentEraWasFallback && <span className="text-xs text-muted-foreground font-normal"> (closest available)</span>}</span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Key Findings Box */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
               <CardHeader>
                <CardTitle className="text-lg text-blue-400">Key Insight</CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-lg leading-relaxed">
                    Since <span className="font-bold text-foreground">{parentEraYear}</span>, the cost of a <span className="font-bold text-foreground">{selectedItem.name}</span> has risen by <span className="font-bold text-red-400">{usdChange.toFixed(0)}%</span> in US Dollars.
                  </p>
                  
                  <Separator className="my-4 bg-yellow-500/20" />
                  
                  <p className="text-sm text-muted-foreground">
                    <span className="text-yellow-500 font-semibold">Gold:</span> Priced in Gold, the cost has <span className={goldCostChange > 0 ? "text-red-400" : "text-green-400"}>
                      {goldCostChange > 0 ? "increased" : "decreased"} by {Math.abs(goldCostChange).toFixed(0)}%
                    </span>. Gold has historically preserved purchasing power against inflation.
                  </p>
                  
                  <Separator className="my-4 bg-orange-500/20" />
                  
                  {btcCostChange !== null ? (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-orange-500 font-semibold">Bitcoin:</span> Priced in Bitcoin, the cost has <span className={btcCostChange > 0 ? "text-red-400" : "text-green-400"}>
                        {btcCostChange > 0 ? "increased" : "decreased"} by {Math.abs(btcCostChange).toFixed(0)}%
                      </span>. Bitcoin's dramatic appreciation has significantly increased its purchasing power.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-orange-500 font-semibold">Bitcoin:</span> Bitcoin wasn't available in {parentEraYear} (launched in 2009). Try selecting a more recent year to see Bitcoin comparisons.
                    </p>
                  )}

                  <Button
                    onClick={shareMyEra}
                    variant="outline"
                    className="w-full mt-4 border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
                    data-testid="button-share-era"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share my era with someone who'd relate
                  </Button>
               </CardContent>
            </Card>
          </div>

          {/* Main Visualization */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-card/40 backdrop-blur-md border-border min-h-[500px]">
              <CardHeader>
                <CardTitle>Cost Burden Evolution</CardTitle>
                <CardDescription>
                  Tracking the cost of {selectedItem.name} from {parentEraYear} to {currentEraYear}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CostChart item={filteredItem} />
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cost in {parentEraYear}</div>
                    <div className="text-2xl font-bold">${parentEraData.itemPriceUSD.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">USD (Nominal)</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cost in {currentEraYear}</div>
                    <div className="text-2xl font-bold">${currentEraData.itemPriceUSD.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">USD (Nominal)</div>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border relative overflow-hidden">
                     <div className={`absolute inset-0 opacity-10 ${usdChange > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Burden Shift</div>
                    <div className={`text-2xl font-bold ${usdChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {usdChange > 0 ? '+' : ''}{usdChange.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">In USD terms</div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Strategic Takeaway */}
             <Card className="bg-card/20 border-border">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="shrink-0 h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">The Handoff Is Coming</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The biggest transfer of business and personal wealth in U.S. history is underway.
                      When a Boomer-era portfolio of cash, real estate, and retirement accounts lands on a millennial's desk,
                      the numbers above are what determines whether that handoff preserves a life or quietly erodes it.
                      <br/><br/>
                      Holding cash over the last {currentEraYear - parentEraYear} years cost the average household the purchasing power you just saw.
                      Scarce assets — real estate, gold, and for the next generation, Bitcoin — preserved it.
                      Understanding this isn't optional anymore. It's the foundation of the next decade.
                      <br/><br/>
                      <a href="https://goodbotai.tech" className="text-primary hover:underline font-medium">More from Tyler + GoodBot →</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
