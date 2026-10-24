import { AlertTriangle } from "lucide-react";
import { ASSET_SOURCES, DATA_FETCHED, ItemData } from "@/data/items";

/** Per-item + per-asset sources, basis and as-of line. */
export function DataSources({ item, compact = false }: { item: ItemData; compact?: boolean }) {
  const unverifiedYears = item.data.filter((d) => d.itemUnverified && d.itemPriceUSD !== null).map((d) => d.label);
  return (
    <div className="text-xs text-muted-foreground space-y-2 text-left">
      {item.status === "estimate" ? (
        <p className="flex items-start gap-2 text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Estimate, unverified.</strong> {item.name} prices are not backed by an authoritative annual series yet. Treat them as illustrative.
          </span>
        </p>
      ) : (
        <p>
          <span className="font-semibold text-foreground">{item.name}:</span> {item.basis}. Source:{" "}
          {item.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && "; "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {s.label}
              </a>
            </span>
          ))}
          .
        </p>
      )}
      {item.status === "partial" && unverifiedYears.length > 0 && (
        <p className="text-amber-400">Unverified years: {unverifiedYears.join(", ")}.</p>
      )}
      {item.status !== "estimate" && item.notes.map((n) => <p key={n}>{n}</p>)}
      {!compact && (
        <>
          <p>
            <span className="font-semibold text-yellow-500">Gold:</span> {ASSET_SOURCES.gold.basis}{" "}
            <a href={ASSET_SOURCES.gold.sources[0].url} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">World Bank</a>
          </p>
          <p>
            <span className="font-semibold text-orange-500">Bitcoin:</span> {ASSET_SOURCES.btc.basis}{" "}
            <a href={ASSET_SOURCES.btc.sources[0].url} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">StatMuse</a>
          </p>
          <p>
            <span className="font-semibold text-blue-400">S&amp;P 500:</span> {ASSET_SOURCES.spy.basis}{" "}
            <a href={ASSET_SOURCES.spy.sources[0].url} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">Yahoo Finance</a>
          </p>
          <p>
            Note: Bitcoin and SPY use year-end closes while gold and item prices are yearly averages, so fast-moving years can look different from a pure average-vs-average view.
            Data pulled {DATA_FETCHED}.
          </p>
        </>
      )}
    </div>
  );
}
