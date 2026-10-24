// Value Tracker data. Every number here is either sourced (see each item's
// `sources`) or listed in `unverifiedYears` / marked status "estimate" so the
// UI can flag it. Do not add numbers without a source. Regenerate from the
// sources listed in client/src/data/SOURCES.md.

export type DataStatus = "sourced" | "partial" | "estimate";

export interface SourceRef {
  label: string;
  url: string;
}

export interface PriceDataPoint {
  year: number;
  /** Display label, e.g. "2025" or "2026 YTD". */
  label: string;
  /** True for the current, partial year. */
  ytd: boolean;
  /** null = no sourced value for this year (shown as a gap / "no data"). */
  itemPriceUSD: number | null;
  /** True when this year's item price is not backed by a cited source. */
  itemUnverified: boolean;
  goldPriceUSD: number;
  /** null = no market price (before Jul 2010). */
  btcPriceUSD: number | null;
  spyPriceUSD: number | null;
}

export interface ItemData {
  id: string;
  name: string;
  description: string;
  unit: string;
  emoji: string;
  status: DataStatus;
  basis: string;
  sources: SourceRef[];
  notes: string[];
  data: PriceDataPoint[];
}

/** Partial current year shown as "YTD". */
export const YTD_YEAR = 2026;
export const YTD_LABEL = `${YTD_YEAR} YTD`;

/** When the data was pulled from its sources. */
export const DATA_FETCHED = "Oct 24, 2026";

/** Bitcoin had no exchange market price before Jul 2010. */
export const BTC_FIRST_MARKET_DATE = "Jul 2010";

export const ASSET_SOURCES = {
  gold: {
    basis: "Annual average price (World Bank Pink Sheet). 2026 YTD = Jan–Sep 2026 average.",
    sources: [
      {
        label: "World Bank Commodity Price Data (Pink Sheet), annual, Oct 2026",
        url: "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Annual.xlsx",
      },
      {
        label: "World Bank Pink Sheet, monthly (2026 YTD)",
        url: "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Monthly.xlsx",
      },
    ] as SourceRef[],
  },
  btc: {
    basis: "Dec 31 close (StatMuse Money). No market price before Jul 2010. 2026 YTD = latest daily close, fetched Oct 24, 2026.",
    sources: [
      { label: "StatMuse Money, Bitcoin yearly price history", url: "https://www.statmuse.com/money/ask/bitcoin-price-history-yearly" },
    ] as SourceRef[],
  },
  spy: {
    basis: "Dec 31 close, not dividend-adjusted (Yahoo Finance). Before 1995: S&P 500 index ÷ 10 (SPY launched 1993). 2026 YTD = Oct 23, 2026 close.",
    sources: [
      { label: "Yahoo Finance, SPY history", url: "https://finance.yahoo.com/quote/SPY/history" },
      { label: "Yahoo Finance, S&P 500 (^GSPC) history", url: "https://finance.yahoo.com/quote/%5EGSPC/history" },
    ] as SourceRef[],
  },
};

// gold = annual average USD/oz; btc = Dec 31 close (null = no market);
// spy = Dec 31 close (pre-1995: S&P 500 index / 10). 2026 = YTD (see ASSET_SOURCES).
export const BASE_FINANCIALS: Record<number, { gold: number; btc: number | null; spy: number | null }> = {
  1970: { gold: 35.9, btc: null, spy: 9.22 },
  1975: { gold: 161, btc: null, spy: 9.02 },
  1980: { gold: 607.9, btc: null, spy: 13.58 },
  1985: { gold: 317.9, btc: null, spy: 21.13 },
  1990: { gold: 383.5, btc: null, spy: 33.02 },
  1995: { gold: 384.2, btc: null, spy: 61.48 },
  2000: { gold: 279, btc: null, spy: 131.19 },
  2005: { gold: 444.8, btc: null, spy: 124.51 },
  2008: { gold: 871.7, btc: null, spy: 90.24 },
  2009: { gold: 973, btc: null, spy: 111.44 },
  2010: { gold: 1224.7, btc: 0.3, spy: 125.75 },
  2011: { gold: 1569.2, btc: 4.61, spy: 125.5 },
  2012: { gold: 1669.5, btc: 13.53, spy: 142.41 },
  2013: { gold: 1411.5, btc: 754.01, spy: 184.69 },
  2014: { gold: 1265.6, btc: 320.19, spy: 205.54 },
  2015: { gold: 1160.7, btc: 430.57, spy: 203.87 },
  2016: { gold: 1249, btc: 963.74, spy: 223.53 },
  2017: { gold: 1257.6, btc: 14156.4, spy: 266.86 },
  2018: { gold: 1269.2, btc: 3742.7, spy: 249.92 },
  2019: { gold: 1392.5, btc: 7193.6, spy: 321.86 },
  2020: { gold: 1770.3, btc: 29001.72, spy: 373.88 },
  2021: { gold: 1799.6, btc: 46306.45, spy: 474.96 },
  2022: { gold: 1800.6, btc: 16547.5, spy: 382.43 },
  2023: { gold: 1942.7, btc: 42265.19, spy: 475.31 },
  2024: { gold: 2387.7, btc: 93429.2, spy: 586.08 },
  2025: { gold: 3441.5, btc: 87508.83, spy: 681.92 },
  2026: { gold: 4552, btc: 81074.19, spy: 759.97 },
};

interface ItemSpec {
  id: string;
  name: string;
  description: string;
  unit: string;
  emoji: string;
  status: DataStatus;
  basis: string;
  sources: SourceRef[];
  notes: string[];
  unverifiedYears: number[] | "ALL";
  /** Only years listed here get a data point. null = known gap. No fill-forward. */
  prices: Record<number, number | null>;
}

function makeItem(spec: ItemSpec): ItemData {
  const unverified = spec.unverifiedYears;
  const data: PriceDataPoint[] = Object.keys(spec.prices)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((year) => BASE_FINANCIALS[year] !== undefined)
    .map((year) => {
      const fin = BASE_FINANCIALS[year];
      const ytd = year === YTD_YEAR;
      return {
        year,
        label: ytd ? YTD_LABEL : String(year),
        ytd,
        itemPriceUSD: spec.prices[year],
        itemUnverified: unverified === "ALL" || unverified.includes(year),
        goldPriceUSD: fin.gold,
        btcPriceUSD: fin.btc,
        spyPriceUSD: fin.spy,
      };
    });
  return {
    id: spec.id,
    name: spec.name,
    description: spec.description,
    unit: spec.unit,
    emoji: spec.emoji,
    status: spec.status,
    basis: spec.basis,
    sources: spec.sources,
    notes: spec.notes,
    data,
  };
}

const ALL = "ALL" as const;

export const ITEMS: ItemData[] = [
  makeItem({
    id: "bread",
    name: "White Bread (1 lb)",
    description: "Average price of a loaf of white bread in U.S. cities.",
    unit: "Loaf",
    emoji: "🍞",
    status: "partial",
    basis: "Annual average (BLS average price; 2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series APU0000702111", url: "https://fred.stlouisfed.org/series/APU0000702111" }
    ],
    notes: ["Values before 1980 are not in the BLS series and are unverified estimates."],
    unverifiedYears: [1970, 1975],
    prices: { 1970: 0.24, 1975: 0.36, 1980: 0.51, 1985: 0.55, 1990: 0.69, 1995: 0.79, 2000: 0.93, 2005: 1.04, 2008: 1.37, 2009: 1.39, 2010: 1.37, 2011: 1.44, 2012: 1.42, 2013: 1.41, 2014: 1.4, 2015: 1.44, 2016: 1.37, 2017: 1.33, 2018: 1.29, 2019: 1.3, 2020: 1.45, 2021: 1.52, 2022: 1.7, 2023: 1.96, 2024: 1.97, 2025: 1.87, 2026: 1.83 },
  }),
  makeItem({
    id: "milk",
    name: "Milk (1 Gallon)",
    description: "Average price of a gallon of whole fortified milk.",
    unit: "Gallon",
    emoji: "🥛",
    status: "partial",
    basis: "Annual average (BLS average price; 2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series APU0000709112", url: "https://fred.stlouisfed.org/series/APU0000709112" }
    ],
    notes: ["Values before 2000 are not in the BLS series and are unverified estimates."],
    unverifiedYears: [1970, 1975, 1980, 1985, 1990, 1995],
    prices: { 1970: 1.15, 1975: 1.57, 1980: 2.16, 1985: 2.2, 1990: 2.78, 1995: 2.48, 2000: 2.78, 2005: 3.19, 2008: 3.8, 2009: 3.11, 2010: 3.26, 2011: 3.57, 2012: 3.49, 2013: 3.46, 2014: 3.69, 2015: 3.42, 2016: 3.2, 2017: 3.23, 2018: 2.9, 2019: 3.04, 2020: 3.32, 2021: 3.54, 2022: 4.09, 2023: 4.03, 2024: 3.98, 2025: 4.07, 2026: 4.17 },
  }),
  makeItem({
    id: "eggs",
    name: "Eggs (Dozen)",
    description: "Average price for a dozen Grade A large eggs.",
    unit: "Dozen",
    emoji: "🥚",
    status: "partial",
    basis: "Annual average (BLS average price; 2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series APU0000708111", url: "https://fred.stlouisfed.org/series/APU0000708111" }
    ],
    notes: ["Values before 1980 are not in the BLS series and are unverified estimates."],
    unverifiedYears: [1970, 1975],
    prices: { 1970: 0.61, 1975: 0.77, 1980: 0.84, 1985: 0.8, 1990: 1.01, 1995: 0.92, 2000: 0.91, 2005: 1.22, 2008: 1.99, 2009: 1.66, 2010: 1.66, 2011: 1.77, 2012: 1.84, 2013: 1.91, 2014: 2.02, 2015: 2.47, 2016: 1.68, 2017: 1.47, 2018: 1.74, 2019: 1.4, 2020: 1.51, 2021: 1.67, 2022: 2.86, 2023: 2.8, 2024: 3.17, 2025: 4.25, 2026: 2.3 },
  }),
  makeItem({
    id: "coffee",
    name: "Cup of Coffee",
    description: "Average price of a standard cup of brewed coffee.",
    unit: "Cup",
    emoji: "☕",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 0.25, 1975: 0.35, 1980: 0.45, 1985: 0.55, 1990: 0.75, 1995: 0.9, 2000: 1, 2005: 1.75, 2008: 1.95, 2009: 2, 2010: 2.1, 2011: 2.25, 2012: 2.3, 2013: 2.35, 2014: 2.38, 2015: 2.45, 2016: 2.5, 2017: 2.6, 2018: 2.7, 2019: 2.7, 2020: 2.9, 2021: 2.95, 2022: 3, 2023: 3.05, 2024: 3.08, 2025: 3.15 },
  }),
  makeItem({
    id: "grocery",
    name: "Grocery Basket",
    description: "Estimated cost of a standard weekly grocery basket for a family of four.",
    unit: "Basket",
    emoji: "🛒",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 30, 1975: 45, 1980: 60, 1985: 75, 1990: 92, 1995: 105, 2000: 120, 2005: 140, 2008: 165, 2009: 160, 2010: 162, 2011: 175, 2012: 180, 2013: 182, 2014: 185, 2015: 188, 2016: 185, 2017: 190, 2018: 195, 2019: 200, 2020: 215, 2021: 235, 2022: 265, 2023: 280, 2024: 295, 2025: 305 },
  }),
  makeItem({
    id: "gas",
    name: "Gasoline (1 Gallon)",
    description: "Average price of regular unleaded gasoline per gallon.",
    unit: "Gallon",
    emoji: "⛽",
    status: "partial",
    basis: "Annual average (BLS average price; 2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series APU000074714", url: "https://fred.stlouisfed.org/series/APU000074714" }
    ],
    notes: ["Values before 1980 are not in the BLS series and are unverified estimates.", "Before the BLS series (1976) the grade was leaded regular, not unleaded."],
    unverifiedYears: [1970, 1975],
    prices: { 1970: 0.36, 1975: 0.57, 1980: 1.25, 1985: 1.2, 1990: 1.16, 1995: 1.15, 2000: 1.51, 2005: 2.3, 2008: 3.27, 2009: 2.35, 2010: 2.79, 2011: 3.53, 2012: 3.64, 2013: 3.53, 2014: 3.37, 2015: 2.45, 2016: 2.14, 2017: 2.41, 2018: 2.74, 2019: 2.64, 2020: 2.17, 2021: 3.05, 2022: 4.09, 2023: 3.66, 2024: 3.45, 2025: 3.26, 2026: 3.97 },
  }),
  makeItem({
    id: "propane",
    name: "Propane (1 Gallon)",
    description: "Average residential price per gallon of propane (heating season).",
    unit: "Gallon",
    emoji: "🔥",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 0.2, 1975: 0.35, 1980: 0.65, 1985: 0.8, 1990: 0.95, 1995: 0.98, 2000: 1.25, 2005: 1.8, 2008: 2.4, 2009: 2.3, 2010: 2.5, 2011: 2.8, 2012: 2.7, 2013: 2.65, 2014: 3.2, 2015: 2.4, 2016: 2.1, 2017: 2.3, 2018: 2.45, 2019: 2.5, 2020: 2.35, 2021: 2.6, 2022: 2.85, 2023: 2.75, 2024: 2.8, 2025: 2.85 },
  }),
  makeItem({
    id: "electricity",
    name: "Electricity (kWh)",
    description: "Average price per kilowatt-hour of residential electricity.",
    unit: "kWh",
    emoji: "⚡",
    status: "partial",
    basis: "Annual average (BLS average price; 2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series APU000072610", url: "https://fred.stlouisfed.org/series/APU000072610" }
    ],
    notes: ["Values before 1980 are not in the BLS series and are unverified estimates."],
    unverifiedYears: [1970, 1975],
    prices: { 1970: 0.021, 1975: 0.032, 1980: 0.06, 1985: 0.081, 1990: 0.084, 1995: 0.094, 2000: 0.087, 2005: 0.1, 2008: 0.123, 2009: 0.127, 2010: 0.128, 2011: 0.13, 2012: 0.13, 2013: 0.132, 2014: 0.137, 2015: 0.138, 2016: 0.135, 2017: 0.138, 2018: 0.136, 2019: 0.136, 2020: 0.135, 2021: 0.141, 2022: 0.159, 2023: 0.168, 2024: 0.176, 2025: 0.185, 2026: 0.194 },
  }),
  makeItem({
    id: "washer",
    name: "Washing Machine",
    description: "Average cost of a standard washing machine.",
    unit: "Unit",
    emoji: "🧺",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 350, 1975: 400, 1980: 500, 1985: 550, 1990: 500, 1995: 450, 2000: 400, 2005: 400, 2008: 350, 2009: 350, 2010: 350, 2011: 320, 2012: 300, 2013: 350, 2014: 400, 2015: 450, 2016: 500, 2017: 550, 2018: 600, 2019: 650, 2020: 700, 2021: 850, 2022: 800, 2023: 780, 2024: 775, 2025: 790 },
  }),
  makeItem({
    id: "monopoly",
    name: "Monopoly Game",
    description: "Standard edition Monopoly board game price.",
    unit: "Game",
    emoji: "🎲",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 4, 1975: 5, 1980: 7, 1985: 9, 1990: 12, 1995: 15, 2000: 18, 2005: 18, 2008: 18, 2009: 18, 2010: 18, 2011: 18, 2012: 18, 2013: 18, 2014: 18, 2015: 20, 2016: 20, 2017: 20, 2018: 20, 2019: 20, 2020: 20, 2021: 20, 2022: 21, 2023: 22, 2024: 22, 2025: 22.5 },
  }),
  makeItem({
    id: "clothes",
    name: "Kids' Clothing Set",
    description: "Average cost of a basic outfit (shirt + pants) for a child.",
    unit: "Outfit",
    emoji: "👕",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 15, 1975: 18, 1980: 22, 1985: 25, 1990: 30, 1995: 32, 2000: 30, 2005: 28, 2008: 28, 2009: 28, 2010: 28, 2011: 29, 2012: 29, 2013: 29, 2014: 30, 2015: 30, 2016: 30, 2017: 30, 2018: 30, 2019: 30, 2020: 32, 2021: 35, 2022: 38, 2023: 40, 2024: 42, 2025: 44 },
  }),
  makeItem({
    id: "home",
    name: "Median US Home",
    description: "Median sales price of houses sold in the United States.",
    unit: "Home",
    emoji: "🏠",
    status: "sourced",
    basis: "Annual average of quarterly median sales price (2026 = Q1–Q2 average)",
    sources: [
      { label: "U.S. Census Bureau & HUD via FRED, series MSPUS", url: "https://fred.stlouisfed.org/series/MSPUS" }
    ],
    notes: [],
    unverifiedYears: [],
    prices: { 1970: 23475, 1975: 39275, 1980: 64750, 1985: 84275, 1990: 122300, 1995: 133475, 2000: 167550, 2005: 236550, 2008: 229550, 2009: 215650, 2010: 222700, 2011: 224900, 2012: 244400, 2013: 266225, 2014: 285775, 2015: 294150, 2016: 305125, 2017: 322425, 2018: 325275, 2019: 320250, 2020: 328150, 2021: 383000, 2022: 432950, 2023: 426525, 2024: 418975, 2025: 415400, 2026: 409600 },
  }),
  makeItem({
    id: "rent",
    name: "Median Gross Rent",
    description: "Median gross rent (rent + utilities) in the United States, Census ACS.",
    unit: "Month",
    emoji: "🏢",
    status: "partial",
    basis: "Annual ACS 1-year estimate",
    sources: [
      { label: "U.S. Census Bureau, ACS 1-year, table B25064 (median gross rent)", url: "https://data.census.gov/table/ACSDT1Y2024.B25064" }
    ],
    notes: ["Before 2010: unverified estimates.", "2020: Census did not publish standard ACS 1-year estimates.", "2025: ACS 1-year data is scheduled for release Oct 29, 2026."],
    unverifiedYears: [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2008, 2009],
    prices: { 1970: 108, 1975: 155, 1980: 243, 1985: 350, 1990: 447, 1995: 520, 2000: 602, 2005: 750, 2008: 800, 2009: 820, 2010: 855, 2011: 871, 2012: 884, 2013: 905, 2014: 934, 2015: 959, 2016: 981, 2017: 1012, 2018: 1058, 2019: 1097, 2020: null, 2021: 1191, 2022: 1300, 2023: 1406, 2024: 1487, 2025: null },
  }),
  makeItem({
    id: "childcare",
    name: "Child Care (Annual)",
    description: "Average annual cost of center-based child care for an infant/toddler.",
    unit: "Year",
    emoji: "🧸",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 1500, 1975: 2200, 1980: 3000, 1985: 4500, 1990: 5500, 1995: 7000, 2000: 8500, 2005: 10500, 2008: 12000, 2009: 12200, 2010: 12500, 2011: 12800, 2012: 13000, 2013: 13500, 2014: 13800, 2015: 14000, 2016: 14500, 2017: 15000, 2018: 15500, 2019: 16000, 2020: 16500, 2021: 17500, 2022: 18500, 2023: 19500, 2024: 20500, 2025: 21500 },
  }),
  makeItem({
    id: "tuition",
    name: "College Tuition",
    description: "Average published tuition and fees at private nonprofit 4-year colleges.",
    unit: "Year",
    emoji: "🎓",
    status: "partial",
    basis: "Published tuition & fees for the academic year starting that fall (current dollars)",
    sources: [
      { label: "College Board, Trends in College Pricing 2025 (2025-26)", url: "https://research.collegeboard.org/media/pdf/Trends-in-College-Pricing-and-Student-Aid-2025-final.pdf" },
      { label: "College Board, Trends in College Pricing 2019 (2019-20)", url: "https://research.collegeboard.org/media/pdf/trends-college-pricing-2019-full-report.pdf" }
    ],
    notes: ["Only 2019 and 2025 are verified. 2010–2018 were removed because they looked inflation-adjusted (they created a fake drop in 2020)."],
    unverifiedYears: [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2008, 2009, 2020, 2021, 2022, 2023, 2024],
    prices: { 1970: 1800, 1975: 2400, 1980: 3600, 1985: 5400, 1990: 9340, 1995: 12200, 2000: 16000, 2005: 21000, 2008: 25000, 2009: 26200, 2010: null, 2011: null, 2012: null, 2013: null, 2014: null, 2015: null, 2016: null, 2017: null, 2018: null, 2019: 36880, 2020: 37650, 2021: 38800, 2022: 39400, 2023: 41540, 2024: 43000, 2025: 45000 },
  }),
  makeItem({
    id: "car",
    name: "New Car Price",
    description: "Average transaction price for a new vehicle in the US.",
    unit: "Car",
    emoji: "🚗",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 3542, 1975: 4950, 1980: 7210, 1985: 11500, 1990: 15473, 1995: 18500, 2000: 21850, 2005: 24000, 2008: 25500, 2009: 26000, 2010: 29217, 2011: 29800, 2012: 30500, 2013: 31200, 2014: 32000, 2015: 33000, 2016: 34000, 2017: 35000, 2018: 36000, 2019: 37000, 2020: 38000, 2021: 42000, 2022: 46000, 2023: 48000, 2024: 48500, 2025: 49000 },
  }),
  makeItem({
    id: "wage",
    name: "Avg Hourly Wage",
    description: "Average hourly earnings of production and nonsupervisory employees (BLS AHETPI).",
    unit: "Hour",
    emoji: "⏱️",
    status: "sourced",
    basis: "Annual average, production & nonsupervisory employees (2026 = Jan–Sep average)",
    sources: [
      { label: "U.S. Bureau of Labor Statistics via FRED, series AHETPI", url: "https://fred.stlouisfed.org/series/AHETPI" }
    ],
    notes: [],
    unverifiedYears: [],
    prices: { 1970: 3.4, 1975: 4.74, 1980: 6.85, 1985: 8.73, 1990: 10.2, 1995: 11.65, 2000: 14.01, 2005: 16.11, 2008: 18.07, 2009: 18.61, 2010: 19.05, 2011: 19.44, 2012: 19.72, 2013: 20.13, 2014: 20.6, 2015: 21.03, 2016: 21.54, 2017: 22.04, 2018: 22.7, 2019: 23.51, 2020: 24.68, 2021: 25.91, 2022: 27.56, 2023: 28.92, 2024: 30.12, 2025: 31.34, 2026: 32.29 },
  }),
  makeItem({
    id: "movie",
    name: "Movie Ticket",
    description: "Average price of a movie ticket in the United States.",
    unit: "Ticket",
    emoji: "🎟️",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 1.55, 1975: 2.03, 1980: 2.69, 1985: 3.55, 1990: 4.22, 1995: 4.35, 2000: 5.39, 2005: 6.41, 2008: 7.18, 2009: 7.5, 2010: 7.89, 2011: 7.93, 2012: 7.96, 2013: 8.13, 2014: 8.17, 2015: 8.43, 2016: 8.65, 2017: 8.97, 2018: 9.11, 2019: 9.16, 2020: 9.37, 2021: 10.17, 2022: 10.53, 2023: 11.9, 2024: 12.5, 2025: 12.88 },
  }),
  makeItem({
    id: "stamp",
    name: "Postage Stamp",
    description: "Cost of a First-Class Mail letter stamp.",
    unit: "Stamp",
    emoji: "📮",
    status: "partial",
    basis: "Rate in effect at year end",
    sources: [
      { label: "USPS: 73¢ → 78¢ on Jul 13, 2025", url: "https://news.usps.com/2025/07/14/usps-adjusts-prices/" }
    ],
    notes: ["Only 2025 is verified (73¢ until Jul 13, 2025, then 78¢)."],
    unverifiedYears: [1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    prices: { 1970: 0.06, 1975: 0.1, 1980: 0.15, 1985: 0.22, 1990: 0.25, 1995: 0.32, 2000: 0.33, 2005: 0.37, 2008: 0.42, 2009: 0.44, 2010: 0.44, 2011: 0.44, 2012: 0.45, 2013: 0.46, 2014: 0.49, 2015: 0.49, 2016: 0.47, 2017: 0.49, 2018: 0.5, 2019: 0.55, 2020: 0.55, 2021: 0.58, 2022: 0.6, 2023: 0.66, 2024: 0.73, 2025: 0.78 },
  }),
  makeItem({
    id: "disney",
    name: "Disney World Ticket",
    description: "Price of a single-day admission ticket to Magic Kingdom.",
    unit: "Ticket",
    emoji: "🎢",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 3.5, 1975: 6, 1980: 9.5, 1985: 21.5, 1990: 31, 1995: 37, 2000: 46, 2005: 59.75, 2008: 75, 2009: 79, 2010: 82, 2011: 85, 2012: 89, 2013: 95, 2014: 99, 2015: 105, 2016: 110, 2017: 115, 2018: 122, 2019: 125, 2020: 135, 2021: 145, 2022: 159, 2023: 164, 2024: 184, 2025: 194 },
  }),
  makeItem({
    id: "beer",
    name: "Beer (6-pack)",
    description: "Average price of a 6-pack of domestic beer.",
    unit: "6-pack",
    emoji: "🍺",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 1.5, 1975: 2.25, 1980: 3.15, 1985: 3.95, 1990: 4.75, 1995: 5.5, 2000: 6.25, 2005: 7.5, 2008: 8.5, 2009: 8.75, 2010: 8.99, 2011: 9.25, 2012: 9.5, 2013: 9.75, 2014: 9.99, 2015: 10.25, 2016: 10.5, 2017: 10.75, 2018: 10.99, 2019: 11.25, 2020: 11.5, 2021: 11.99, 2022: 12.5, 2023: 13.5, 2024: 14.25, 2025: 15 },
  }),
  makeItem({
    id: "burger",
    name: "Big Mac",
    description: "Average price of a Big Mac burger in the US.",
    unit: "Burger",
    emoji: "🍔",
    status: "partial",
    basis: "Average of that year's Big Mac index releases (2026 = Jan + Jul)",
    sources: [
      { label: "The Economist Big Mac index, US price (source data)", url: "https://github.com/TheEconomist/big-mac-data" }
    ],
    notes: ["Before 2000: unverified estimates (the index's U.S. history before 2000 was not checked)."],
    unverifiedYears: [1970, 1975, 1980, 1985, 1990, 1995],
    prices: { 1970: 0.55, 1975: 0.75, 1980: 1.3, 1985: 1.6, 1990: 2.2, 1995: 2.3, 2000: 2.24, 2005: 2.58, 2008: 3.21, 2009: 3.43, 2010: 3.48, 2011: 3.64, 2012: 3.88, 2013: 4.11, 2014: 4.27, 2015: 4.29, 2016: 4.39, 2017: 4.5, 2018: 4.62, 2019: 4.71, 2020: 4.82, 2021: 4.91, 2022: 5.1, 2023: 5.47, 2024: 5.69, 2025: 5.9, 2026: 6.17 },
  }),
  makeItem({
    id: "superbowl",
    name: "Super Bowl Ticket",
    description: "Face value price of a Super Bowl ticket (non-resale).",
    unit: "Ticket",
    emoji: "🏈",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 15, 1975: 20, 1980: 30, 1985: 60, 1990: 125, 1995: 200, 2000: 325, 2005: 600, 2008: 700, 2009: 800, 2010: 900, 2011: 900, 2012: 1200, 2013: 1200, 2014: 1500, 2015: 2000, 2016: 2500, 2017: 2500, 2018: 2500, 2019: 2500, 2020: 2500, 2021: 3000, 2022: 3000, 2023: 3500, 2024: 4000, 2025: 4500 },
  }),
  makeItem({
    id: "jeans",
    name: "Levi's 501 Jeans",
    description: "Average price of a pair of Levi's 501 jeans.",
    unit: "Pair",
    emoji: "👖",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 7, 1975: 13.5, 1980: 17, 1985: 24, 1990: 28, 1995: 35, 2000: 45, 2005: 46, 2008: 48, 2009: 48, 2010: 48, 2011: 54, 2012: 58, 2013: 58, 2014: 58, 2015: 59.5, 2016: 59.5, 2017: 59.5, 2018: 59.5, 2019: 69.5, 2020: 69.5, 2021: 69.5, 2022: 79.5, 2023: 79.5, 2024: 89.5, 2025: 95 },
  }),
  makeItem({
    id: "coke",
    name: "Coca-Cola (Can)",
    description: "Price of a single can of Coke from a vending machine.",
    unit: "Can",
    emoji: "🥤",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 0.1, 1975: 0.2, 1980: 0.35, 1985: 0.5, 1990: 0.65, 1995: 0.75, 2000: 1, 2005: 1, 2008: 1.25, 2009: 1.25, 2010: 1.25, 2011: 1.35, 2012: 1.5, 2013: 1.5, 2014: 1.5, 2015: 1.5, 2016: 1.5, 2017: 1.5, 2018: 1.75, 2019: 1.75, 2020: 2, 2021: 2, 2022: 2.25, 2023: 2.5, 2024: 2.75, 2025: 3 },
  }),
  makeItem({
    id: "pizza",
    name: "Slice of Pizza (NYC)",
    description: "Average price of a plain slice of pizza in NYC.",
    unit: "Slice",
    emoji: "🍕",
    status: "estimate",
    basis: "Estimate",
    sources: [],
    notes: ["Unverified estimate: no authoritative annual series was found for this item."],
    unverifiedYears: ALL,
    prices: { 1970: 0.25, 1975: 0.45, 1980: 0.75, 1985: 1, 1990: 1.25, 1995: 1.5, 2000: 1.75, 2005: 2, 2008: 2.25, 2009: 2.25, 2010: 2.5, 2011: 2.5, 2012: 2.5, 2013: 2.75, 2014: 2.75, 2015: 2.75, 2016: 2.75, 2017: 3, 2018: 3, 2019: 3, 2020: 3, 2021: 3.25, 2022: 3.5, 2023: 3.75, 2024: 4, 2025: 4.25 },
  }),
];
