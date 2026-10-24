// Dense annual series for /generations. Every value is sourced (see SERIES
// sources); years without a sourced value are simply absent.
// Generated from the sources below, pulled Oct 24, 2026.
import { ASSET_SOURCES, DATA_FETCHED, SourceRef } from "./items";

export { DATA_FETCHED };
export const NOW_YEAR = 2026;
export const NOW_LABEL = "2026 YTD";

export type AssetId = "usd" | "gold" | "btc" | "spy";

export const ASSETS: Record<Exclude<AssetId, "usd">, { name: string; unit: string; basis: string; sources: SourceRef[]; values: Record<number, number> }> = {
  gold: {
    name: "Gold",
    unit: "oz",
    basis: ASSET_SOURCES.gold.basis,
    sources: ASSET_SOURCES.gold.sources,
    values: { 1970: 35.9, 1971: 40.8, 1972: 58.2, 1973: 97.3, 1974: 159.2, 1975: 161, 1976: 124.8, 1977: 147.7, 1978: 193.2, 1979: 306.7, 1980: 607.9, 1981: 459.8, 1982: 375.8, 1983: 422.5, 1984: 360.5, 1985: 317.9, 1986: 367.7, 1987: 446.5, 1988: 437, 1989: 381.4, 1990: 383.5, 1991: 362.2, 1992: 343.7, 1993: 359.8, 1994: 384, 1995: 384.2, 1996: 387.7, 1997: 331.1, 1998: 294.2, 1999: 278.8, 2000: 279, 2001: 271, 2002: 310, 2003: 363.5, 2004: 409.2, 2005: 444.8, 2006: 604.3, 2007: 696.7, 2008: 871.7, 2009: 973, 2010: 1224.7, 2011: 1569.2, 2012: 1669.5, 2013: 1411.5, 2014: 1265.6, 2015: 1160.7, 2016: 1249, 2017: 1257.6, 2018: 1269.2, 2019: 1392.5, 2020: 1770.3, 2021: 1799.6, 2022: 1800.6, 2023: 1942.7, 2024: 2387.7, 2025: 3441.5, 2026: 4552 },
  },
  btc: {
    name: "Bitcoin",
    unit: "BTC",
    basis: ASSET_SOURCES.btc.basis,
    sources: ASSET_SOURCES.btc.sources,
    values: { 2010: 0.3, 2011: 4.61, 2012: 13.53, 2013: 754.01, 2014: 320.19, 2015: 430.57, 2016: 963.74, 2017: 14156.4, 2018: 3742.7, 2019: 7193.6, 2020: 29001.72, 2021: 46306.45, 2022: 16547.5, 2023: 42265.19, 2024: 93429.2, 2025: 87508.83, 2026: 81074.19 },
  },
  spy: {
    name: "S&P 500",
    unit: "SPY shares",
    basis: "Last trading-day close, not dividend-adjusted (Yahoo Finance). Before 1993: S&P 500 index ÷ 10 (SPY launched Jan 1993). 2026 YTD = Oct 23, 2026 close.",
    sources: ASSET_SOURCES.spy.sources,
    values: { 1970: 9.22, 1971: 10.21, 1972: 11.81, 1973: 9.76, 1974: 6.86, 1975: 9.02, 1976: 10.75, 1977: 9.51, 1978: 9.61, 1979: 10.79, 1980: 13.58, 1981: 12.26, 1982: 14.06, 1983: 16.49, 1984: 16.72, 1985: 21.13, 1986: 24.22, 1987: 24.71, 1988: 27.77, 1989: 35.34, 1990: 33.02, 1991: 41.71, 1992: 43.57, 1993: 46.59, 1994: 45.56, 1995: 61.48, 1996: 73.84, 1997: 97.06, 1998: 123.31, 1999: 146.88, 2000: 131.19, 2001: 114.3, 2002: 88.23, 2003: 111.28, 2004: 120.87, 2005: 124.51, 2006: 141.62, 2007: 146.21, 2008: 90.24, 2009: 111.44, 2010: 125.75, 2011: 125.5, 2012: 142.41, 2013: 184.69, 2014: 205.54, 2015: 203.87, 2016: 223.53, 2017: 266.86, 2018: 249.92, 2019: 321.86, 2020: 373.88, 2021: 474.96, 2022: 382.43, 2023: 475.31, 2024: 586.08, 2025: 681.92, 2026: 759.97 },
  },
};

export interface GenItem {
  id: string;
  name: string;
  emoji: string;
  /** e.g. "per gallon" */
  per: string;
  /** "coming" = no sourced series yet; shown as "data coming". */
  status: "sourced" | "coming";
  basis: string;
  sources: SourceRef[];
  asOf: string;
  note?: string;
  values: Record<number, number>;
}

const fred = (id: string, agency = "U.S. Bureau of Labor Statistics"): SourceRef => ({
  label: `${agency} via FRED (${id})`,
  url: `https://fred.stlouisfed.org/series/${id}`,
});

export const GEN_ITEMS: GenItem[] = [
  {
    id: "home",
    name: "Median home",
    emoji: "🏠",
    per: "median sales price",
    status: "sourced",
    basis: "Median sales price of houses sold, annual average of quarters",
    sources: [fred("MSPUS", "U.S. Census Bureau & HUD")],
    asOf: "2026 YTD = Q1–Q2 2026",
    values: { 1970: 23475, 1971: 25225, 1972: 27525, 1973: 32600, 1974: 36050, 1975: 39275, 1976: 44225, 1977: 48900, 1978: 55850, 1979: 62750, 1980: 64750, 1981: 68950, 1982: 69225, 1983: 75375, 1984: 79950, 1985: 84275, 1986: 92025, 1987: 104700, 1988: 112225, 1989: 120425, 1990: 122300, 1991: 119975, 1992: 121375, 1993: 126500, 1994: 130425, 1995: 133475, 1996: 140250, 1997: 145000, 1998: 151925, 1999: 160125, 2000: 167550, 2001: 173100, 2002: 186025, 2003: 192125, 2004: 218150, 2005: 236550, 2006: 243750, 2007: 244950, 2008: 229550, 2009: 215650, 2010: 222700, 2011: 224900, 2012: 244400, 2013: 266225, 2014: 285775, 2015: 294150, 2016: 305125, 2017: 322425, 2018: 325275, 2019: 320250, 2020: 328150, 2021: 383000, 2022: 432950, 2023: 426525, 2024: 418975, 2025: 415400, 2026: 409600 },
  },
  {
    id: "rent",
    name: "Rent",
    emoji: "🏢",
    per: "median gross rent / month",
    status: "sourced",
    basis: "Census ACS 1-year median gross rent (B25064); series starts 2010 here",
    sources: [{ label: "U.S. Census Bureau, ACS 1-year B25064", url: "https://data.census.gov/table/ACSDT1Y2024.B25064" }],
    asOf: "latest = 2024 (2025 ACS releases Oct 29, 2026)",
    note: "No standard ACS 1-year estimate for 2020.",
    values: { 2010: 855, 2011: 871, 2012: 884, 2013: 905, 2014: 934, 2015: 959, 2016: 981, 2017: 1012, 2018: 1058, 2019: 1097, 2021: 1191, 2022: 1300, 2023: 1406, 2024: 1487 },
  },
  {
    id: "childcare",
    name: "Child care",
    emoji: "🧸",
    per: "per year",
    status: "coming",
    basis: "No national annual price series we can cite yet",
    sources: [],
    asOf: "",
    note: "Data coming. We won't show a child-care number until it has a citable national source.",
    values: {},
  },
  {
    id: "groceries",
    name: "Grocery staples",
    emoji: "🛒",
    per: "1 lb bread + 1 dozen eggs + 1 gal milk",
    status: "sourced",
    basis: "Sum of three BLS average prices (annual means); milk series starts 1995, so this basket starts 1996",
    sources: [fred("APU0000702111"), fred("APU0000708111"), fred("APU0000709112")],
    asOf: "2026 YTD = Jan–Sep 2026",
    values: { 1996: 4.61, 1997: 4.54, 1998: 4.6, 1999: 4.69, 2000: 4.62, 2001: 4.81, 2002: 4.81, 2003: 5, 2004: 5.47, 2005: 5.45, 2006: 5.47, 2007: 6.39, 2008: 7.16, 2009: 6.16, 2010: 6.29, 2011: 6.78, 2012: 6.75, 2013: 6.78, 2014: 7.11, 2015: 7.33, 2016: 6.25, 2017: 6.03, 2018: 5.93, 2019: 5.74, 2020: 6.28, 2021: 6.73, 2022: 8.65, 2023: 8.79, 2024: 9.12, 2025: 10.19, 2026: 8.3 },
  },
  {
    id: "gas",
    name: "Gas",
    emoji: "⛽",
    per: "per gallon, unleaded regular",
    status: "sourced",
    basis: "BLS average price, annual mean; series starts 1976",
    sources: [fred("APU000074714")],
    asOf: "2026 YTD = Jan–Sep 2026",
    values: { 1976: 0.61, 1977: 0.66, 1978: 0.67, 1979: 0.9, 1980: 1.25, 1981: 1.38, 1982: 1.3, 1983: 1.24, 1984: 1.21, 1985: 1.2, 1986: 0.93, 1987: 0.95, 1988: 0.95, 1989: 1.02, 1990: 1.16, 1991: 1.14, 1992: 1.13, 1993: 1.11, 1994: 1.11, 1995: 1.15, 1996: 1.23, 1997: 1.23, 1998: 1.06, 1999: 1.17, 2000: 1.51, 2001: 1.46, 2002: 1.36, 2003: 1.59, 2004: 1.88, 2005: 2.3, 2006: 2.59, 2007: 2.8, 2008: 3.27, 2009: 2.35, 2010: 2.79, 2011: 3.53, 2012: 3.64, 2013: 3.53, 2014: 3.37, 2015: 2.45, 2016: 2.14, 2017: 2.41, 2018: 2.74, 2019: 2.64, 2020: 2.17, 2021: 3.05, 2022: 4.09, 2023: 3.66, 2024: 3.45, 2025: 3.26, 2026: 3.97 },
  },
  {
    id: "beer",
    name: "Beer",
    emoji: "🍺",
    per: "per 16 oz (malt beverages)",
    status: "sourced",
    basis: "BLS average price, malt beverages, all types, per 16 oz, annual mean; series starts mid-1995",
    sources: [fred("APU0000720111")],
    asOf: "2026 YTD = Jan–Sep 2026",
    values: { 1996: 0.84, 1997: 0.84, 1998: 0.86, 1999: 0.88, 2000: 0.92, 2001: 0.96, 2002: 0.99, 2003: 1.01, 2004: 1.07, 2005: 1.09, 2006: 1.11, 2007: 1.12, 2008: 1.16, 2009: 1.21, 2010: 1.23, 2011: 1.24, 2012: 1.25, 2013: 1.28, 2014: 1.28, 2015: 1.32, 2016: 1.35, 2017: 1.39, 2018: 1.41, 2019: 1.44, 2020: 1.48, 2021: 1.53, 2022: 1.66, 2023: 1.74, 2024: 1.78, 2025: 1.83, 2026: 1.87 },
  },
];
