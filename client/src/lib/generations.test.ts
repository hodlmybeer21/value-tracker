import { test } from "node:test";
import assert from "node:assert/strict";
import { compareItem, kidYearFrom, chartRows, valueAt, btcStatus } from "./generations";
import { GEN_ITEMS } from "../data/generations";

const item = (id: string) => GEN_ITEMS.find((i) => i.id === id)!;

test("kid year = birth year + age, validated", () => {
  assert.deepEqual(kidYearFrom("1985", "30"), { ok: true, year: 2015 });
  assert.equal(kidYearFrom("1930", "30").ok, false);
  assert.equal(kidYearFrom("2010", "30").ok, false);
  assert.equal(kidYearFrom("", "30").ok, false);
});

test("bitcoin before 2009 is not invented, 2009 has no market", () => {
  assert.equal(btcStatus(1985), "not-invented");
  assert.equal(btcStatus(2009), "no-market");
  assert.equal(btcStatus(2010), null);
  assert.equal(compareItem(item("home"), 2007).units.btc.kind, "not-invented");
});

test("child care shows data coming, never a number", () => {
  const c = compareItem(item("childcare"), 2015);
  assert.equal(c.status, "coming");
  assert.equal(c.then, undefined);
});

test("series that start later say so instead of inventing data", () => {
  const b = compareItem(item("beer"), 1985);
  assert.equal(b.status, "no-data");
  assert.match(b.message!, /starts 1996/);
});

test("home 2015 vs 2026 YTD uses sourced values", () => {
  const h = compareItem(item("home"), 2015);
  assert.equal(h.then!.value, 294150);
  assert.equal(h.now!.value, 409600);
  assert.equal(h.now!.year, 2026);
});

test("rent 2020 gap uses adjacent year", () => {
  assert.equal(valueAt(item("rent").values, 2020)!.year, 2019);
});

test("chart in BTC starts at 2010", () => {
  assert.equal(chartRows(1985, "btc").start, 2010);
  assert.equal(chartRows(1985, "usd").start, 1985);
});
