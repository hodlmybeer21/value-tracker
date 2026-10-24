import { test } from "node:test";
import assert from "node:assert/strict";
import { ITEMS, BASE_FINANCIALS, YTD_YEAR } from "../data/items";
import { findEraPoint, latestPoint, pctChange, formatPctAbs, formatPctSigned } from "./era";

const home = ITEMS.find((i) => i.id === "home")!;
const rent = ITEMS.find((i) => i.id === "rent")!;
const coffee = ITEMS.find((i) => i.id === "coffee")!;

test("no BTC market price before Jul 2010", () => {
  assert.equal(BASE_FINANCIALS[2009].btc, null);
  for (const item of ITEMS) for (const d of item.data) if (d.year < 2010) assert.equal(d.btcPriceUSD, null);
});

test("audited high-severity values", () => {
  assert.equal(BASE_FINANCIALS[2025].btc, 87508.83);
  assert.equal(BASE_FINANCIALS[2025].gold, 3441.5);
  assert.equal(rent.data.find((d) => d.year === 2022)!.itemPriceUSD, 1300);
  assert.equal(rent.data.find((d) => d.year === 2023)!.itemPriceUSD, 1406);
});

test("gold never drops below the prior year's annual average in 2025", () => {
  assert.ok(BASE_FINANCIALS[2025].gold > BASE_FINANCIALS[2024].gold);
});

test("now = latest year in the data", () => {
  assert.equal(latestPoint(home).year, YTD_YEAR);
  assert.equal(latestPoint(home).label, `${YTD_YEAR} YTD`);
  assert.equal(latestPoint(coffee).year, 2025); // estimates have no YTD row
  assert.equal(latestPoint(rent).year, 2024); // 2025 ACS not yet released
});

test("nearest-year snapping picks the truly nearest year", () => {
  const r = findEraPoint(home, 2007);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.point.year, 2008);
    assert.equal(r.snapped, true);
  }
  const exact = findEraPoint(home, 2015);
  assert.ok(exact.ok && exact.point.year === 2015 && !exact.snapped);
  const r2 = findEraPoint(home, 2006);
  assert.ok(r2.ok && r2.point.year === 2005);
  const r3 = findEraPoint(home, 1972);
  assert.ok(r3.ok && r3.point.year === 1970);
});

test("snapping skips known gaps (rent 2020 not published)", () => {
  const r = findEraPoint(rent, 2020);
  assert.ok(r.ok && r.point.itemPriceUSD !== null && r.point.year !== 2020);
});

test("out-of-range years never fall back to 1970", () => {
  const future = findEraPoint(home, 2030);
  assert.equal(future.ok, false);
  if (!future.ok) assert.equal(future.reason, "after");
  const past = findEraPoint(home, 1958);
  assert.equal(past.ok, false);
  if (!past.ok) assert.equal(past.reason, "before");
  const blank = findEraPoint(home, parseInt(""));
  assert.equal(blank.ok, false);
  if (!blank.ok) assert.equal(blank.reason, "invalid");
});

test("percent formatting never rounds 99.9% to 100%", () => {
  assert.equal(formatPctAbs(-99.93), "99.93");
  assert.equal(formatPctAbs(99.999), "99.99");
  assert.equal(formatPctSigned(46.2), "+46%");
  assert.equal(formatPctSigned(-4.25), "−4.3%");
  assert.equal(pctChange(0, 5), null);
  assert.equal(pctChange(null, 5), null);
});
