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
import { ItemData } from "@/data/items";

interface BitcoinChartProps {
  item: ItemData;
}

export function BitcoinChart({ item }: BitcoinChartProps) {
  const chartData = useMemo(() => {
    // Filter for years where BTC data exists and is non-zero
    // We also want to filter out the very early "pennies" years if they skew the graph too wildly,
    // but a log scale should handle it.
    const btcData = item.data.filter(d => d.btcPriceUSD && d.btcPriceUSD > 0);
    
    if (!btcData.length) return [];

    return btcData.map((point) => {
      const costBTC = point.btcPriceUSD ? point.itemPriceUSD / point.btcPriceUSD : null;

      return {
        year: point.year,
        rawBTC: costBTC,
      };
    });
  }, [item]);

  return (
    <div className="w-full h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.1)" vertical={false} />
          
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false}
            axisLine={false}
            dy={10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
          />

          <YAxis 
            scale="log"
            domain={['auto', 'auto']}
            stroke="hsl(24, 95%, 53%)"
            tickLine={false}
            axisLine={false}
            dx={-10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            tickFormatter={(value) => {
               // Format for log scale readability
               if (value >= 1) return value.toFixed(1);
               if (value >= 0.001) return value.toFixed(3);
               return value.toExponential(1);
            }}
            label={{ 
              value: 'Cost in BTC (Log Scale)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fill: 'hsl(24, 95%, 53%)', textAnchor: 'middle' },
              dx: 10
            }}
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
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
                          <span className="text-foreground font-medium">{entry.name}</span>
                        </span>
                        <span className="text-foreground">
                          {Number(entry.value).toFixed(8)} 
                          <span className="text-muted-foreground ml-1 text-xs">BTC</span>
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
            dataKey="rawBTC"
            name="Bitcoin Cost (Deflationary View)"
            stroke="hsl(24, 95%, 53%)"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(24, 95%, 53%)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
