import type { ItemData, PriceDataPoint } from "../data/items";

/** Data points that have a sourced-or-flagged item price (skips known gaps). */
export function pricedPoints(item: ItemData): PriceDataPoint[] {
  return item.data.filter((d) => d.itemPriceUSD !== null);
}

/** "Now" = the latest year in the data for this item (may be the YTD row). */
export function latestPoint(item: ItemData): PriceDataPoint {
  const pts = pricedPoints(item);
  return pts[pts.length - 1];
}

export type EraLookup =
  | { ok: true; point: PriceDataPoint; requestedYear: number; snapped: boolean }
  | { ok: false; reason: "invalid" | "before" | "after"; message: string };

/**
 * Find the data point for a year. Exact match if present, otherwise the
 * truly nearest year with data (ties go to the earlier year). Years outside
 * the data range return a message instead of silently falling back.
 */
export function findEraPoint(item: ItemData, year: number): EraLookup {
  const pts = pricedPoints(item);
  if (!Number.isFinite(year) || !Number.isInteger(year)) {
    return { ok: false, reason: "invalid", message: "Enter a whole year (e.g. 1985)." };
  }
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (year < first.year) {
    return {
      ok: false,
      reason: "before",
      message: `${year} is before our ${item.name} data starts (${first.year}).`,
    };
  }
  if (year > last.year) {
    return {
      ok: false,
      reason: "after",
      message: `${year} is after our latest ${item.name} data (${last.label}).`,
    };
  }
  let best = pts[0];
  for (const p of pts) {
    if (Math.abs(p.year - year) < Math.abs(best.year - year)) best = p;
  }
  return { ok: true, point: best, requestedYear: year, snapped: best.year !== year };
}

/** % change, or null when it can't be computed. */
export function pctChange(start: number | null | undefined, end: number | null | undefined): number | null {
  if (start == null || end == null || !Number.isFinite(start) || !Number.isFinite(end) || start === 0) return null;
  return ((end - start) / start) * 100;
}

/**
 * Format a % so that e.g. -99.93 never shows as "100%" (which would imply
 * free). Returns the absolute value; callers add the sign/word.
 */
export function formatPctAbs(p: number): string {
  const a = Math.abs(p);
  if (a >= 99 && a < 100) {
    const s = a.toFixed(2);
    return s === "100.00" ? "99.99" : s;
  }
  if (a < 10) return a.toFixed(1);
  return Math.round(a).toLocaleString("en-US");
}

/** Signed % string like "+46%" or "−99.93%". */
export function formatPctSigned(p: number): string {
  const sign = p > 0 ? "+" : p < 0 ? "−" : "";
  return `${sign}${formatPctAbs(p)}%`;
}

/** Cost of an item in an asset (oz / BTC / shares), or null. */
export function costIn(itemUSD: number | null, assetUSD: number | null | undefined): number | null {
  if (itemUSD == null || assetUSD == null || assetUSD <= 0) return null;
  return itemUSD / assetUSD;
}
