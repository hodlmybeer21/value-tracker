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
import { prefersReducedMotion } from "@/lib/motion";
import { costIn } from "@/lib/era";

interface CostChartProps {
  item: ItemData;
}

type Key = "USD" | "Gold" | "BTC" | "SPY";

const SERIES: { key: Key; name: string; color: string; unit: string; digits: number }[] = [
  { key: "USD", name: "USD Price", color: "hsl(142, 70%, 45%)", unit: "", digits: 2 },
  { key: "Gold", name: "Gold Cost", color: "hsl(45, 93%, 47%)", unit: " oz", digits: 4 },
  { key: "BTC", name: "Bitcoin Cost", color: "hsl(24, 95%, 53%)", unit: " BTC", digits: 8 },
  { key: "SPY", name: "S&P 500 (SPY) Cost", color: "hsl(217, 91%, 60%)", unit: " shares", digits: 4 },
];

/**
 * All four costs on ONE log axis, each indexed to 100 at its first year with
 * data (BTC's first year is 2010 — no market before Jul 2010). Lines can be
 * compared directly: a line at 50 means the item costs half as much in that
 * unit as it did in the base year.
 */
export function CostChart({ item }: CostChartProps) {
  const { chartData, bases } = useMemo(() => {
    const raw = item.data
      .filter((p) => p.itemPriceUSD !== null)
      .map((p) => ({
        year: p.year,
        label: p.label,
        unverified: p.itemUnverified,
        USD: p.itemPriceUSD,
        Gold: costIn(p.itemPriceUSD, p.goldPriceUSD),
        BTC: costIn(p.itemPriceUSD, p.btcPriceUSD),
        SPY: costIn(p.itemPriceUSD, p.spyPriceUSD),
      }));
    const bases: Partial<Record<Key, { year: string; value: number }>> = {};
    for (const s of SERIES) {
      const first = raw.find((r) => r[s.key] != null);
      if (first) bases[s.key] = { year: first.label, value: first[s.key] as number };
    }
    const chartData = raw.map((r) => {
      const row: Record<string, unknown> = { ...r };
      for (const s of SERIES) {
        const b = bases[s.key];
        const v = r[s.key];
        row[`idx${s.key}`] = b && v != null ? (v / b.value) * 100 : null;
      }
      return row;
    });
    return { chartData, bases };
  }, [item]);

  return (
    <div className="w-full">
      <div className="w-full h-[420px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              dy={10}
              style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              allowDataOverflow
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={60}
              style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
              tickFormatter={(v: number) => Number(v.toPrecision(2)).toLocaleString(undefined, { maximumSignificantDigits: 2 })}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload as Record<string, any>;
                return (
                  <div className="bg-card/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-xl font-mono text-sm">
                    <p className="text-muted-foreground mb-2">
                      {label}
                      {row.unverified && <span className="ml-2 text-amber-400">· unverified price</span>}
                    </p>
                    {SERIES.map((s) => {
                      const v = row[s.key];
                      if (v == null) return null;
                      const idx = row[`idx${s.key}`] as number;
                      return (
                        <div key={s.key} className="flex items-center justify-between gap-6 mb-1">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-foreground font-medium">{s.name}</span>
                          </span>
                          <span className="text-foreground">
                            {s.key === "USD" ? `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : Number(v).toFixed(s.digits)}
                            <span className="text-muted-foreground ml-1 text-xs">{s.unit}</span>
                            <span className="text-muted-foreground ml-2 text-xs">idx {idx.toPrecision(3)}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-foreground font-medium ml-2">{value}</span>}
            />
            {SERIES.map((s) => (
              <Line
                isAnimationActive={!prefersReducedMotion()}
                key={s.key}
                type="monotone"
                dataKey={`idx${s.key}`}
                name={bases[s.key] ? `${s.name} (${bases[s.key]!.year} = 100)` : s.name}
                stroke={s.color}
                strokeWidth={3}
                dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-center font-mono">
        Index, log scale: each line starts at 100 in its first year with data. Below 100 = cheaper in that unit; above 100 = more expensive.
      </p>
    </div>
  );
}
