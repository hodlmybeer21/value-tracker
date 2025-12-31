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

interface CostChartProps {
  item: ItemData;
}

export function CostChart({ item }: CostChartProps) {
  const chartData = useMemo(() => {
    if (!item.data.length) return [];

    return item.data.map((point) => {
      const costUSD = point.itemPriceUSD;
      const costGold = point.itemPriceUSD / point.goldPriceUSD; // Ounces of gold
      const costBTC = point.btcPriceUSD ? point.itemPriceUSD / point.btcPriceUSD : null;

      return {
        year: point.year,
        rawUSD: costUSD,
        rawGold: costGold,
        rawBTC: costBTC,
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

          {/* Left Axis: USD */}
          <YAxis 
            yAxisId="left-usd"
            orientation="left"
            stroke="hsl(142, 70%, 45%)"
            tickLine={false}
            axisLine={false}
            dx={-10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            label={{ 
              value: 'Price (USD)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fill: 'hsl(142, 70%, 45%)', textAnchor: 'middle' },
              dx: 0
            }}
          />

          {/* Right Axis: Gold */}
          <YAxis 
            yAxisId="right-gold"
            orientation="right"
            stroke="hsl(45, 93%, 47%)"
            tickLine={false}
            axisLine={false}
            dx={10}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
            tickFormatter={(value) => `${value.toFixed(3)} oz`}
            label={{ 
              value: 'Cost in Gold (oz)', 
              angle: 90, 
              position: 'insideRight', 
              style: { fill: 'hsl(45, 93%, 47%)', textAnchor: 'middle' },
              dy: -20
            }}
          />

          {/* Secondary Right Axis: BTC (Hidden axis line/ticks to reduce clutter, but used for scaling) */}
          <YAxis 
            yAxisId="right-btc"
            orientation="right"
            stroke="hsl(24, 95%, 53%)"
            hide={true} // Hidden visual axis, but used for scaling the orange line
            domain={['auto', 'auto']}
          />

          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-xl font-mono text-sm">
                    <p className="text-muted-foreground mb-2">{label}</p>
                    {payload.map((entry: any) => {
                      let formattedValue = "";
                      let unit = "";
                      if (entry.dataKey === "rawUSD") {
                        formattedValue = `$${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                      } else if (entry.dataKey === "rawGold") {
                        formattedValue = `${Number(entry.value).toFixed(4)}`;
                        unit = " oz";
                      } else if (entry.dataKey === "rawBTC") {
                        formattedValue = `${Number(entry.value).toFixed(6)}`;
                        unit = " BTC";
                      }

                      return (
                        <div key={entry.name} className="flex items-center justify-between gap-8 mb-1">
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
                            <span className="text-foreground font-medium">{entry.name}</span>
                          </span>
                          <span className="text-foreground">
                            {formattedValue}
                            <span className="text-muted-foreground ml-1 text-xs">{unit}</span>
                          </span>
                        </div>
                      );
                    })}
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
            yAxisId="left-usd"
            type="monotone"
            dataKey="rawUSD"
            name="USD Price"
            stroke="hsl(142, 70%, 45%)"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(142, 70%, 45%)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right-gold"
            type="monotone"
            dataKey="rawGold"
            name="Gold Cost"
            stroke="hsl(45, 93%, 47%)"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(45, 93%, 47%)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right-btc"
            type="monotone"
            dataKey="rawBTC"
            name="Bitcoin Cost"
            stroke="hsl(24, 95%, 53%)"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(24, 95%, 53%)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
