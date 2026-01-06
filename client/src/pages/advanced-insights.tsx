import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Baby, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ITEMS, ItemData } from "@/data/items";
import { CostChart } from "@/components/cost-chart";
import background from "@assets/generated_images/subtle_dark_financial_data_visualization_abstract_background.png";

export default function AdvancedInsights() {
  const [parentBirthYear, setParentBirthYear] = useState<string>("1965");
  const [parentAgeAtBirth, setParentAgeAtBirth] = useState<string>("30");
  const [selectedItemId, setSelectedItemId] = useState<string>("home");

  const selectedItem = ITEMS.find(i => i.id === selectedItemId) || ITEMS.find(i => i.id === "home")!;

  // Calculations
  const parentYear = parseInt(parentBirthYear);
  const ageAtBirth = parseInt(parentAgeAtBirth);
  
  const parentEraStart = parentYear + 20; // Assume "Adult" life starts at 20? Or specifically when they had kids?
  // Text says "Parent's Era (e.g., cost when you had kids)"
  const parentChildbirthYear = parentYear + ageAtBirth;
  const currentYear = 2024;
  
  // Find data points
  const parentEraData = selectedItem.data.find(d => d.year === parentChildbirthYear) || 
                        selectedItem.data.find(d => d.year === Math.floor(parentChildbirthYear/5)*5) || // Approximate to nearest available year
                        selectedItem.data[0];

  const currentEraData = selectedItem.data.find(d => d.year === currentYear) || selectedItem.data[selectedItem.data.length - 1];

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

  // Filter data for the chart to start from Parent's Childbirth Year
  // We actually want to show the trend from when the parent had kids until now
  const filteredItem = useMemo(() => {
    return {
      ...selectedItem,
      data: selectedItem.data.filter(d => d.year >= parentChildbirthYear)
    };
  }, [selectedItem, parentChildbirthYear]);


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
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2 hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to Overview
          </Button>
        </Link>

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

                <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="font-mono text-xs uppercase mb-1 text-primary">Comparison Era</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span>Parent's Era:</span>
                    <span className="font-bold text-foreground">{parentChildbirthYear}</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <span>Current Era:</span>
                    <span className="font-bold text-foreground">{currentYear}</span>
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
                    Since <span className="font-bold text-foreground">{parentChildbirthYear}</span>, the cost of a <span className="font-bold text-foreground">{selectedItem.name}</span> has risen by <span className="font-bold text-red-400">{usdChange.toFixed(0)}%</span> in US Dollars.
                  </p>
                  
                  <Separator className="my-4 bg-blue-500/20" />
                  
                  <p className="text-sm text-muted-foreground">
                    However, priced in Gold, the cost has <span className={goldCostChange > 0 ? "text-red-400" : "text-green-400"}>
                      {goldCostChange > 0 ? "increased" : "decreased"} by {Math.abs(goldCostChange).toFixed(0)}%
                    </span>. This suggests that assets like Gold have held their value better against inflation over your child's lifetime.
                  </p>
               </CardContent>
            </Card>
          </div>

          {/* Main Visualization */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-card/40 backdrop-blur-md border-border min-h-[500px]">
              <CardHeader>
                <CardTitle>Cost Burden Evolution</CardTitle>
                <CardDescription>
                  Tracking the cost of {selectedItem.name} from {parentChildbirthYear} to {currentYear}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CostChart item={filteredItem} />
                
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cost in {parentChildbirthYear}</div>
                    <div className="text-2xl font-bold">${parentEraData.itemPriceUSD.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">USD (Nominal)</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Cost in {currentYear}</div>
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
                    <h3 className="text-lg font-bold mb-2">Strategic Takeaway</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      While the USD cost has increased significantly, this highlights the importance of asset allocation. 
                      Parents who stored wealth in scarce assets (like Real Estate or Gold) were able to preserve purchasing power 
                      for the next generation, whereas holding cash resulted in a loss of power.
                      <br/><br/>
                      For the current generation, digital scarcity (Bitcoin) offers a modern tool to hedge against this continued monetary expansion.
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
