import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Baby, Share2, Mail, Users } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import background from "@assets/generated_images/subtle_dark_financial_data_visualization_abstract_background.png";
import { ASSETS, AssetId, DATA_FETCHED, NOW_LABEL } from "@/data/generations";
import { PRESETS, chartRows, compareAll, fmtUnit, kidYearFrom, yearLabel, ItemComparison, UnitCell } from "@/lib/generations";
import { formatPctSigned } from "@/lib/era";
import { drawShareCard, shareOrDownload } from "@/lib/share-card";
import { prefersReducedMotion } from "@/lib/motion";

const NEWSLETTER_URL = "https://hodlmybeermacro.substack.com";

const UNIT_META: Record<AssetId, { label: string; color: string }> = {
  usd: { label: "USD", color: "text-green-400" },
  gold: { label: "Gold", color: "text-yellow-500" },
  btc: { label: "Bitcoin", color: "text-orange-500" },
  spy: { label: "S&P 500", color: "text-blue-400" },
};

const LINE_COLORS: Record<string, string> = {
  home: "hsl(142, 70%, 45%)",
  rent: "hsl(280, 70%, 65%)",
  groceries: "hsl(190, 80%, 50%)",
  gas: "hsl(0, 80%, 62%)",
  beer: "hsl(45, 93%, 47%)",
};

function changeClass(c: number) {
  return c >= 0 ? "text-red-400" : "text-green-400";
}

function Cell({ unit, cell }: { unit: AssetId; cell: UnitCell }) {
  if (cell.kind === "not-invented") return <span className="text-muted-foreground text-xs">not invented yet</span>;
  if (cell.kind === "no-market") return <span className="text-muted-foreground text-xs">no market yet</span>;
  if (cell.kind === "na") return <span className="text-muted-foreground">—</span>;
  return (
    <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
      <span className="font-mono text-xs text-muted-foreground">
        {fmtUnit(unit, cell.then)} → {fmtUnit(unit, cell.now)}
      </span>
      <span className={`font-mono font-bold ${changeClass(cell.change)}`}>{formatPctSigned(cell.change)}</span>
    </span>
  );
}

function ItemCard({ c }: { c: ItemComparison }) {
  const it = c.item;
  return (
    <Card className="bg-card/40 backdrop-blur-md border-border h-full" data-testid={`gen-item-${it.id}`}>
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-2xl">{it.emoji}</span>
              {it.name}
            </h3>
            <p className="text-xs text-muted-foreground">{it.per}</p>
          </div>
          {c.status === "ok" && (
            <div className="text-right text-xs font-mono text-muted-foreground">
              {yearLabel(c.then!.year)} → {yearLabel(c.now!.year)}
            </div>
          )}
        </div>
        {c.status === "ok" ? (
          <dl className="space-y-2 text-sm flex-1">
            {(Object.keys(UNIT_META) as AssetId[]).map((u) => (
              <div key={u} className="flex items-start justify-between gap-3 border-b border-border/30 pb-1.5 last:border-0">
                <dt className={`font-semibold ${UNIT_META[u].color}`}>{UNIT_META[u].label}</dt>
                <dd className="text-right">
                  <Cell unit={u} cell={c.units[u]} />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border/60 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="block font-mono text-xs uppercase tracking-widest text-amber-400 mb-1">
                {c.status === "coming" ? "Data coming" : "No data for this year"}
              </span>
              {c.message}
            </p>
          </div>
        )}
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          {it.sources.length > 0 ? (
            <>
              Source:{" "}
              {it.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ", "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                    {s.label}
                  </a>
                </span>
              ))}
              . {it.basis}. As of: {it.asOf}.{c.status === "ok" && it.note ? ` ${it.note}` : ""}
            </>
          ) : (
            <>No citable source yet.</>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Generations() {
  const { toast } = useToast();
  const [birth, setBirth] = useState("1985");
  const [age, setAge] = useState("30");
  const [unit, setUnit] = useState<AssetId>("usd");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "What did the year your kid was born really cost? | Value Tracker";
    const p = new URLSearchParams(window.location.search);
    const k = Number(p.get("kid"));
    const preset = PRESETS.find((x) => x.kidYear === k);
    if (preset) {
      setBirth(String(preset.parentBirth));
      setAge(String(preset.age));
    }
  }, []);

  const kid = kidYearFrom(birth, age);
  const kidYear = kid.ok ? kid.year : null;
  const comps = useMemo(() => (kidYear ? compareAll(kidYear) : []), [kidYear]);
  const chart = useMemo(() => (kidYear ? chartRows(kidYear, unit) : null), [kidYear, unit]);
  const home = comps.find((c) => c.item.id === "home");

  const onShare = async () => {
    if (!kidYear) return;
    setSharing(true);
    try {
      const canvas = drawShareCard(kidYear, comps);
      const r = await shareOrDownload(canvas, kidYear);
      if (r === "downloaded") toast({ title: "Image saved", description: "Your 1200×675 card was downloaded. Post it anywhere." });
    } catch (e) {
      console.error(e);
      toast({ title: "Couldn't make the image", description: "Please try again." });
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/20">
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-white/10 -ml-3">
              <ArrowLeft className="h-4 w-4" /> Back to Overview
            </Button>
          </Link>
        </div>

        <header className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-wider mb-3">
            GENERATIONS
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-3">
            What did the year your kid was born really cost?
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
            Pick the year your kid arrived. We'll price a home, rent, groceries, gas and a beer in dollars, gold, Bitcoin and the S&amp;P 500, then and now.
          </p>
        </header>

        {/* Inputs */}
        <Card className="bg-card/40 backdrop-blur-md border-border mb-8">
          <CardContent className="p-5 md:p-6 grid gap-5 md:grid-cols-[1fr_1fr_2fr] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="birth">Your birth year</Label>
              <Input id="birth" type="number" inputMode="numeric" min={1900} max={2026} value={birth} onChange={(e) => setBirth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Your age when your kid was born</Label>
              <Input id="age" type="number" inputMode="numeric" min={12} max={70} value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Presets (kid's birth year)
              </Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active = kidYear === p.kidYear && birth === String(p.parentBirth);
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setBirth(String(p.parentBirth));
                        setAge(String(p.age));
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        active ? "bg-blue-500 text-white border-blue-500" : "bg-card text-muted-foreground border-border hover:border-blue-500/50 hover:text-blue-400"
                      }`}
                      data-testid={`gen-preset-${p.kidYear}`}
                    >
                      {p.label} {p.kidYear}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {!kid.ok ? (
          <Card className="border-amber-500/40 bg-amber-500/5 mb-8">
            <CardContent className="p-6 text-amber-300" role="alert" data-testid="gen-error">
              {kid.message}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Hero */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 mb-8" data-testid="gen-hero">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-3">
                  <Baby className="w-4 h-4" /> Your kid was born in {kidYear}
                </div>
                {home && home.status === "ok" && home.units.usd.kind === "ok" ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
                      <div className={`text-6xl md:text-8xl font-display font-bold ${changeClass(home.units.usd.change)}`}>
                        {formatPctSigned(home.units.usd.change)}
                      </div>
                      <p className="text-lg md:text-2xl text-foreground/90 leading-snug pb-2">
                        dollars for a median U.S. home: {fmtUnit("usd", home.units.usd.then)} in {yearLabel(home.then!.year)} →{" "}
                        {fmtUnit("usd", home.units.usd.now)} in {yearLabel(home.now!.year)}.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      {(["gold", "btc", "spy"] as AssetId[]).map((u) => {
                        const c = home.units[u];
                        return (
                          <span key={u} className="px-3 py-1 rounded-full bg-card/70 border border-border">
                            <span className={`font-semibold ${UNIT_META[u].color}`}>In {UNIT_META[u].label}:</span>{" "}
                            {c.kind === "ok" ? (
                              <span className={`font-mono font-bold ${changeClass(c.change)}`}>{formatPctSigned(c.change)}</span>
                            ) : c.kind === "not-invented" ? (
                              <span className="text-muted-foreground">not invented yet</span>
                            ) : c.kind === "no-market" ? (
                              <span className="text-muted-foreground">no market yet</span>
                            ) : (
                              "—"
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-[11px] text-muted-foreground">
                      Source: Census/HUD median sales price via FRED (MSPUS), annual average; {NOW_LABEL} = Q1–Q2 2026. Gold: World Bank annual average. Bitcoin: StatMuse Dec 31 close. S&amp;P 500: Yahoo Finance year-end close (pre-1993: index ÷ 10). Pulled {DATA_FETCHED}.
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No sourced home price for {kidYear}.</p>
                )}
                <Button onClick={onShare} disabled={sharing} className="mt-6 gap-2 bg-blue-500 hover:bg-blue-600 text-white" data-testid="gen-share">
                  <Share2 className="w-4 h-4" /> {sharing ? "Making your card…" : "Share my kid's number"}
                </Button>
              </CardContent>
            </Card>

            {/* Grid */}
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {kidYear} vs. now, in four kinds of money
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
              {comps.map((c) => (
                <ItemCard key={c.item.id} c={c} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mb-10">
              "Then → now" is the cost of the item in each unit (dollars, ounces of gold, BTC, SPY shares). Red = costs more now, green = costs less.
              Gold: {ASSETS.gold.basis} Bitcoin: {ASSETS.btc.basis} S&amp;P 500: {ASSETS.spy.basis}
            </p>

            {/* Chart */}
            {chart && (
              <Card className="bg-card/40 backdrop-blur-md border-border mb-10">
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold">From {yearLabel(chart.start)} to {NOW_LABEL}</h2>
                      <p className="text-xs text-muted-foreground">
                        Each line = cost in {UNIT_META[unit].label}, indexed to 100 at its first year shown (log scale).
                        {unit === "btc" && kidYear !== null && kidYear < 2010 && " Bitcoin had no market price before Jul 2010, so this view starts in 2010."}
                      </p>
                    </div>
                    <div className="inline-flex p-1 rounded-full bg-card/60 border border-border self-start" role="tablist" aria-label="Unit">
                      {(Object.keys(UNIT_META) as AssetId[]).map((u) => (
                        <button
                          key={u}
                          role="tab"
                          aria-selected={unit === u}
                          onClick={() => setUnit(u)}
                          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                            unit === u ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                          }`}
                          data-testid={`gen-unit-${u}`}
                        >
                          {UNIT_META[u].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-[340px] md:h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chart.rows} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" vertical={false} />
                        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} minTickGap={24} style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }} />
                        <YAxis
                          scale="log"
                          domain={["auto", "auto"]}
                          allowDataOverflow
                          width={48}
                          stroke="hsl(var(--muted-foreground))"
                          tickLine={false}
                          axisLine={false}
                          style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
                          tickFormatter={(v: number) => Number(v.toPrecision(2)).toLocaleString(undefined, { maximumSignificantDigits: 2 })}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const row = payload[0].payload as Record<string, number | null>;
                            return (
                              <div className="bg-card/95 border border-border p-3 rounded-lg shadow-xl text-xs font-mono">
                                <p className="text-muted-foreground mb-1">{label}</p>
                                {chart.items.map((it) =>
                                  row[`${it.id}_raw`] != null ? (
                                    <p key={it.id} className="flex justify-between gap-4">
                                      <span style={{ color: LINE_COLORS[it.id] }}>{it.name}</span>
                                      <span>{fmtUnit(unit, row[`${it.id}_raw`] as number)}</span>
                                    </p>
                                  ) : null,
                                )}
                              </div>
                            );
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: 8 }} />
                        {chart.items.map((it) => (
                          <Line
                            key={it.id}
                            isAnimationActive={!prefersReducedMotion()}
                            type="monotone"
                            dataKey={it.id}
                            name={`${it.emoji} ${it.name}`}
                            stroke={LINE_COLORS[it.id]}
                            strokeWidth={2.5}
                            dot={false}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Lines start in the first year each series has sourced data (beer & groceries 1996, rent 2010). Sources as listed on each card above.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Newsletter */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border-orange-500/30 mb-10">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div className="flex items-start gap-3">
              <div className="shrink-0 h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">Get the weekly read on what your money's really worth</h3>
                <p className="text-sm text-muted-foreground">Free newsletter on Substack.</p>
              </div>
            </div>
            <a href={NEWSLETTER_URL} target="_blank" rel="noopener noreferrer" className="shrink-0" data-testid="gen-newsletter">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto">Subscribe on Substack</Button>
            </a>
          </CardContent>
        </Card>

        <footer className="text-center border-t border-border pt-6 pb-4">
          <p className="text-muted-foreground text-xs mb-2">
            Nominal prices. Items: BLS &amp; Census/HUD via FRED, Census ACS. Assets: World Bank (gold), StatMuse (Bitcoin), Yahoo Finance (S&amp;P 500). Data pulled {DATA_FETCHED}. Educational only, not financial advice.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            Part of <a href="https://goodbotai.tech" className="text-primary hover:underline">GoodBotAI</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}
