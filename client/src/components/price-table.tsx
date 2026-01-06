import { ItemData } from "@/data/items";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriceTableProps {
  item: ItemData;
}

const YEARS_TO_SHOW = [1970, 1980, 1990, 2000, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2025];

export function PriceTable({ item }: PriceTableProps) {
  // Filter data for selected years
  const tableData = YEARS_TO_SHOW.map(year => {
    const point = item.data.find(d => d.year === year);
    if (!point) return null;

    // Calculate Gold Price (oz) and BTC Price
    // Avoid division by zero
    const goldCost = point.goldPriceUSD ? point.itemPriceUSD / point.goldPriceUSD : 0;
    const btcCost = point.btcPriceUSD ? point.itemPriceUSD / point.btcPriceUSD : null;

    return {
      year,
      usd: point.itemPriceUSD,
      gold: goldCost,
      btc: btcCost,
    };
  }).filter(Boolean) as { year: number; usd: number; gold: number; btc: number | null }[];

  // Helper to format numbers
  const formatValue = (val: number | null, type: 'usd' | 'gold' | 'btc') => {
    if (val === null) return "";
    
    if (type === 'usd') {
      return val.toFixed(2);
    }
    if (type === 'gold') {
       // Show more decimals for small gold amounts
       return val < 0.01 ? val.toFixed(4) : val.toFixed(2);
    }
    if (type === 'btc') {
      // BTC needs many decimals for recent years, fewer for early years
      if (val > 100) return val.toFixed(0);
      if (val > 1) return val.toFixed(2);
      if (val > 0.001) return val.toFixed(4);
      return val.toFixed(6);
    }
    return val.toString();
  };

  // Helper to determine color class based on value relative to min/max in the row
  // Higher value = Red (Bad purchasing power), Lower value = Green (Good purchasing power)
  const getColorClass = (val: number | null, values: (number | null)[]) => {
    if (val === null) return "bg-transparent";
    
    const numericValues = values.filter(v => v !== null) as number[];
    if (numericValues.length === 0) return "bg-transparent";

    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    
    if (min === max) return "bg-yellow-100 dark:bg-yellow-900/30";

    // Normalize value between 0 (best/lowest) and 1 (worst/highest)
    const ratio = (val - min) / (max - min);

    // Color interpolation logic (simplified with Tailwind classes for now)
    // Low (Green) -> Medium (Yellow) -> High (Red)
    if (ratio < 0.33) return "bg-green-200 dark:bg-green-900/40";
    if (ratio < 0.66) return "bg-yellow-100 dark:bg-yellow-900/40";
    return "bg-red-200 dark:bg-red-900/40";
  };

  const usdValues = tableData.map(d => d.usd);
  const goldValues = tableData.map(d => d.gold);
  const btcValues = tableData.map(d => d.btc);

  return (
    <Card className="border-border bg-card/40 backdrop-blur-md shadow-2xl mb-12 overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="p-3 font-mono text-xs uppercase tracking-widest text-muted-foreground bg-white dark:bg-slate-950 sticky left-0 z-20 border-r border-border">Currency</th>
              {tableData.map(d => (
                <th key={d.year} className="p-3 font-mono font-bold border-l border-border/20 min-w-[80px]">
                  {d.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* USD ROW */}
            <tr className="border-b border-border/50 group hover:bg-muted/5">
              <td className="p-3 font-bold text-left bg-white dark:bg-slate-950 sticky left-0 z-20 border-r border-border shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)]">USD ($)</td>
              {tableData.map((d, i) => (
                <td key={d.year} className={cn("p-2 border-l border-border/20 transition-colors", getColorClass(d.usd, usdValues))}>
                  {formatValue(d.usd, 'usd')}
                </td>
              ))}
            </tr>

            {/* GOLD ROW */}
            <tr className="border-b border-border/50 group hover:bg-muted/5">
              <td className="p-3 font-bold text-left bg-white dark:bg-slate-950 sticky left-0 z-20 border-r border-border shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)] text-chart-2">Gold (oz)</td>
              {tableData.map((d, i) => (
                <td key={d.year} className={cn("p-2 border-l border-border/20 transition-colors", getColorClass(d.gold, goldValues))}>
                  {formatValue(d.gold, 'gold')}
                </td>
              ))}
            </tr>

            {/* BTC ROW */}
            <tr className="group hover:bg-muted/5">
              <td className="p-3 font-bold text-left bg-white dark:bg-slate-950 sticky left-0 z-20 border-r border-border shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)] text-chart-3">Bitcoin (BTC)</td>
              {tableData.map((d, i) => (
                <td key={d.year} className={cn("p-2 border-l border-border/20 transition-colors", getColorClass(d.btc, btcValues))}>
                  {formatValue(d.btc, 'btc')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
