import { useState } from "react";
import { ITEMS } from "@/data/items";
import { CostChart } from "@/components/cost-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import background from "@assets/generated_images/subtle_dark_financial_data_visualization_abstract_background.png";

export default function Home() {
  // Default to Bread or the first item
  const [selectedItemId, setSelectedItemId] = useState<string>(ITEMS[0].id);

  const selectedItem = ITEMS.find((i) => i.id === selectedItemId) || ITEMS[0];

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
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono tracking-wider mb-2">
            PURCHASING POWER PARITY
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            The Real Cost of Living
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            See how the cost of everyday items has changed when measured in Dollars, Gold, and Bitcoin.
          </p>
        </header>

        {/* Controls */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <label className="text-xs font-mono text-muted-foreground mb-2 block uppercase tracking-widest">
              Select Item to Compare
            </label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger className="h-12 bg-card border-border text-lg shadow-sm">
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f172a] border-border shadow-xl z-[9999] opacity-100">
                {ITEMS.map((item) => (
                  <SelectItem key={item.id} value={item.id} className="text-base py-3 cursor-pointer focus:bg-primary/20 focus:text-foreground">
                    <span className="mr-2">{item.emoji}</span> {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart Card */}
        <Card className="border-border bg-card/40 backdrop-blur-md shadow-2xl mb-12 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{selectedItem.emoji}</span>
                  {selectedItem.name}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {selectedItem.description}
                </p>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Base Year</div>
                <div className="font-mono font-bold text-xl">{selectedItem.data[0].year}</div>
              </div>
            </div>
            
            <CostChart item={selectedItem} />
            
            <div className="mt-6 text-center text-sm text-muted-foreground font-mono">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2 align-middle"></span>Rising line = More expensive (Purchasing Power Lost)
              <span className="mx-4 text-border">|</span>
              <span className="inline-block w-3 h-3 rounded-full bg-chart-3 mr-2 align-middle"></span>Falling line = Cheaper (Purchasing Power Gained)
            </div>
          </CardContent>
        </Card>

        {/* Explanation Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-card/20 border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
                <span className="text-lg">💵</span> US Dollar
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The chart shows the nominal price in USD. A rising blue line indicates inflation—it takes more dollars to buy the same {selectedItem.unit.toLowerCase()} over time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/20 border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-chart-2 font-bold mb-2 flex items-center gap-2">
                <span className="text-lg">🪙</span> Gold
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gold has historically been a store of value. If the gold line is flat or falling, it means gold has preserved or increased its purchasing power relative to this item.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/20 border-border/50">
            <CardContent className="pt-6">
              <h3 className="text-chart-3 font-bold mb-2 flex items-center gap-2">
                <span className="text-lg">₿</span> Bitcoin
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bitcoin is a digital store of value. A rapidly falling orange line demonstrates Bitcoin's deflationary nature—it takes significantly less BTC to buy the same item today than in the past.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <footer className="text-center border-t border-border pt-8">
          <p className="text-muted-foreground text-sm mb-2">
            Data Sources: FRED (St. Louis Fed), U.S. Census Bureau, Yahoo Finance.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            *Data is for educational purposes only. Past performance does not guarantee future results.
          </p>
        </footer>

      </div>
    </div>
  );
}
