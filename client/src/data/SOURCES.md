# Value Tracker data sources

Data pulled Oct 24, 2026. Every value in `items.ts` is either sourced below or
flagged (`unverifiedYears` / `status: "estimate"`) and shown as unverified in the UI.

## Assets (`BASE_FINANCIALS`)
| Series | Basis | Source |
|---|---|---|
| Gold | Annual average USD/oz. 2026 YTD = Jan–Sep 2026 average (9 monthly values) | World Bank Pink Sheet, Oct 2026 release: [annual](https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Annual.xlsx), [monthly](https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Monthly.xlsx) |
| Bitcoin | Dec 31 close. `null` before 2010 (no market price until Jul 2010). 2026 YTD = latest daily close on Oct 24, 2026 | [StatMuse Money](https://www.statmuse.com/money/ask/bitcoin-price-history-yearly) |
| S&P 500 / SPY | Last trading-day close, not dividend-adjusted. Before 1993 = ^GSPC ÷ 10; 1993+ = SPY (only 1970–1990 and 1995+ are used here). 2026 YTD = Oct 23, 2026 close | Yahoo Finance chart API (SPY, ^GSPC) |

Bases are mixed on purpose and labeled in the UI (audit M1): gold and item prices are
annual averages; Bitcoin and SPY are year-end closes.

## Items
| Item | Verified years | Source | Unverified |
|---|---|---|---|
| Bread | 1980–2026 YTD | BLS via FRED APU0000702111 (annual mean) | 1970, 1975 |
| Milk | 2000–2026 YTD | BLS via FRED APU0000709112 | 1970–1995 (series starts Jul 1995) |
| Eggs | 1980–2026 YTD | BLS via FRED APU0000708111 | 1970, 1975 |
| Gas | 1980–2026 YTD | BLS via FRED APU000074714 | 1970, 1975 |
| Electricity | 1980–2026 YTD | BLS via FRED APU000072610 | 1970, 1975 |
| Home | all (2026 = Q1–Q2) | Census/HUD via FRED MSPUS | — |
| Wage | all | BLS via FRED AHETPI (production & nonsupervisory) | — |
| Rent | 2010–2019, 2021–2024 | Census ACS 1-yr B25064 (data.census.gov) | pre-2010; 2020 not published; 2025 due Oct 29, 2026 |
| Tuition | 2019, 2025 | College Board Trends in College Pricing | 1970–2009, 2020–2024; 2010–2018 removed |
| Stamp | 2025 (78¢ from Jul 13, 2025) | USPS | other years |
| Big Mac | 2000–2026 YTD | The Economist Big Mac index source data | 1970–1995 |
| coffee, grocery, propane, washer, monopoly, clothes, childcare, car, movie, disney, beer, superbowl, jeans, coke, pizza | — | none | all (status "estimate") |
