import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ItemData } from "@/data/items";

interface CostChartProps {
  item: ItemData;
}

export function CostChart({ item }: CostChartProps) {
  const chartData = useMemo(() => {
    // 1. Find the base year. 
    // We want a base year where BTC data is "reasonable" or just the first one.
    // Let's stick to the prompt's suggestion: Indexed to 100 at earliest common date.
    // Our data has BTC from 2010, but it was pennies. 
    // Let's just take the first data point as base for simplicity for now.
    if (!item.data.length) return [];

    const base = item.data[0];
    
    // Base Costs
    const baseCostUSD = base.itemPriceUSD;
    const baseCostGold = base.itemPriceUSD / base.goldPriceUSD;
    // Handle BTC being null or zero? Our data has numbers.
    const baseCostBTC = base.btcPriceUSD ? base.itemPriceUSD / base.btcPriceUSD : null;

    return item.data.map((point) => {
      const costUSD = point.itemPriceUSD;
      const costGold = point.itemPriceUSD / point.goldPriceUSD;
      const costBTC = point.btcPriceUSD ? point.itemPriceUSD / point.btcPriceUSD : null;

      return {
        year: point.year,
        rawUSD: costUSD,
        rawGold: costGold,
        rawBTC: costBTC,
        // Indexed Values (100 = Base)
        indexUSD: (costUSD / baseCostUSD) * 100,
        indexGold: (costGold / baseCostGold) * 100,
        indexBTC: (baseCostBTC && costBTC) ? (costBTC / baseCostBTC) * 100 : null,
      };
    });
  }, [item]);

  return (
    <div className="w-full h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false}
            axisLine={false}
            dy={10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false}
            axisLine={false}
            dx={-10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            domain={['auto', 'auto']}
            // Log scale might be needed if BTC drops too hard, but prompt said linear first.
            // Let's stick to linear.
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-xl font-mono text-sm">
                    <p className="text-muted-foreground mb-2">{label}</p>
                    {payload.map((entry: any) => (
                      <div key={entry.name} className="flex items-center justify-between gap-8 mb-1">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-foreground font-medium">{entry.name}</span>
                        </span>
                        <span className="text-foreground">
                          {Number(entry.value).toFixed(1)} 
                          <span className="text-muted-foreground ml-1 text-xs">
                             (Indexed)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-foreground font-medium ml-2">{value}</span>}
          />
          
          <Line
            type="monotone"
            dataKey="indexUSD"
            name="USD"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="indexGold"
            name="Gold"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--chart-2))", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="indexBTC"
            name="Bitcoin"
            stroke="hsl(var(--chart-3))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--chart-3))", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
