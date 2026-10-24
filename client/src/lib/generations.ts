import { ASSETS, AssetId, GEN_ITEMS, GenItem, NOW_LABEL, NOW_YEAR } from "../data/generations";
import { pctChange } from "./era";

export const MIN_KID_YEAR = 1970;

export const PRESETS = [
  { label: "Boomer", kidYear: 1985, parentBirth: 1955, age: 30 },
  { label: "Gen X", kidYear: 2007, parentBirth: 1975, age: 32 },
  { label: "Millennial", kidYear: 2015, parentBirth: 1985, age: 30 },
  { label: "Gen Z", kidYear: 2021, parentBirth: 1997, age: 24 },
] as const;

export const yearLabel = (y: number) => (y === NOW_YEAR ? NOW_LABEL : String(y));

export type KidYearResult = { ok: true; year: number } | { ok: false; message: string };

export function kidYearFrom(parentBirth: string, age: string): KidYearResult {
  const b = Number(parentBirth);
  const a = Number(age);
  if (!parentBirth.trim() || !age.trim() || !Number.isInteger(b) || !Number.isInteger(a)) {
    return { ok: false, message: "Enter your birth year and your age when your kid was born." };
  }
  if (a < 12 || a > 70) return { ok: false, message: "Age at your kid's birth should be between 12 and 70." };
  const y = b + a;
  if (y < MIN_KID_YEAR) return { ok: false, message: `${y} is before our data starts (${MIN_KID_YEAR}).` };
  if (y > NOW_YEAR) return { ok: false, message: `${y} is in the future. Our latest data is ${NOW_LABEL}.` };
  return { ok: true, year: y };
}

/** Value for a year: exact, or the adjacent year (±1) when the series has a one-year gap (e.g. rent 2020). */
export function valueAt(values: Record<number, number>, year: number): { year: number; value: number } | null {
  if (values[year] !== undefined) return { year, value: values[year] };
  for (const y of [year - 1, year + 1]) if (values[y] !== undefined) return { year: y, value: values[y] };
  return null;
}

export function latest(values: Record<number, number>): { year: number; value: number } | null {
  const ys = Object.keys(values).map(Number);
  if (!ys.length) return null;
  const y = Math.max(...ys);
  return { year: y, value: values[y] };
}

export function firstYear(values: Record<number, number>): number | null {
  const ys = Object.keys(values).map(Number);
  return ys.length ? Math.min(...ys) : null;
}

export type UnitCell =
  | { kind: "ok"; then: number; now: number; change: number }
  | { kind: "not-invented" } // Bitcoin before 2009
  | { kind: "no-market" } // Bitcoin 2009 (existed, no market price until Jul 2010)
  | { kind: "na" };

/** Cost of `usd` in an asset at a year (oz, BTC, shares). */
export function priceIn(unit: AssetId, usd: number, year: number): number | null {
  if (unit === "usd") return usd;
  const a = ASSETS[unit].values[year];
  return a ? usd / a : null;
}

export function btcStatus(year: number): "not-invented" | "no-market" | null {
  if (year < 2009) return "not-invented";
  if (year < 2010) return "no-market";
  return null;
}

export interface ItemComparison {
  item: GenItem;
  status: "ok" | "coming" | "no-data";
  message?: string;
  then?: { year: number; value: number };
  now?: { year: number; value: number };
  units: Record<AssetId, UnitCell>;
}

const UNITS: AssetId[] = ["usd", "gold", "btc", "spy"];

export function compareItem(item: GenItem, kidYear: number): ItemComparison {
  const empty = Object.fromEntries(UNITS.map((u) => [u, { kind: "na" } as UnitCell])) as Record<AssetId, UnitCell>;
  if (item.status === "coming") return { item, status: "coming", message: item.note, units: empty };
  const then = valueAt(item.values, kidYear);
  const now = latest(item.values);
  if (!then || !now) {
    const fy = firstYear(item.values);
    return {
      item,
      status: "no-data",
      message: kidYear < (fy ?? 0) ? `No sourced data for ${kidYear} (series starts ${fy}).` : `No sourced data for ${kidYear}.`,
      units: empty,
    };
  }
  const units = {} as Record<AssetId, UnitCell>;
  for (const u of UNITS) {
    if (u === "btc") {
      const s = btcStatus(then.year);
      if (s) {
        units[u] = { kind: s };
        continue;
      }
    }
    const a = priceIn(u, then.value, then.year);
    const b = priceIn(u, now.value, now.year);
    const c = pctChange(a, b);
    units[u] = a !== null && b !== null && c !== null ? { kind: "ok", then: a, now: b, change: c } : { kind: "na" };
  }
  return { item, status: "ok", then, now, units };
}

export function compareAll(kidYear: number): ItemComparison[] {
  return GEN_ITEMS.map((i) => compareItem(i, kidYear));
}

/** Chart rows from startYear to NOW, each item indexed to 100 at its first point, priced in `unit`. */
export function chartRows(kidYear: number, unit: AssetId) {
  const start = unit === "btc" ? Math.max(kidYear, 2010) : kidYear;
  const items = GEN_ITEMS.filter((i) => i.status === "sourced");
  const base: Record<string, number> = {};
  const rows: Record<string, number | string | null>[] = [];
  for (let y = start; y <= NOW_YEAR; y++) {
    const row: Record<string, number | string | null> = { year: y, label: yearLabel(y) };
    for (const it of items) {
      const v = it.values[y];
      const p = v === undefined ? null : priceIn(unit, v, y);
      if (p !== null && base[it.id] === undefined) base[it.id] = p;
      row[it.id] = p !== null && base[it.id] ? (p / base[it.id]) * 100 : null;
      row[`${it.id}_raw`] = p;
    }
    rows.push(row);
  }
  return { start, rows, items: items.filter((i) => base[i.id] !== undefined), base };
}

/** Format a cost in a unit for display. */
export function fmtUnit(unit: AssetId, v: number): string {
  if (unit === "usd") {
    if (v >= 1000) return `$${Math.round(v).toLocaleString("en-US")}`;
    return `$${v.toFixed(2)}`;
  }
  const digits = v >= 100 ? 0 : v >= 1 ? 2 : v >= 0.01 ? 4 : v >= 0.0001 ? 6 : 8;
  const s = v.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: Math.min(digits, 2) });
  return `${s} ${unit === "gold" ? "oz" : unit === "btc" ? "BTC" : "sh"}`;
}
