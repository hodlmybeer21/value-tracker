export interface PriceDataPoint {
  year: number;
  itemPriceUSD: number;
  goldPriceUSD: number;
  btcPriceUSD: number | null;
}

export interface ItemData {
  id: string;
  name: string;
  description: string;
  unit: string;
  emoji: string;
  data: PriceDataPoint[];
}

// Helper to interpolate roughly for demo purposes if real data points are missing
// In a real app, this would be fetched from the backend API we discussed.
// For this frontend mockup, I am generating representative data.

export const ITEMS: ItemData[] = [
  {
    id: "bread",
    name: "White Bread (1 lb)",
    description: "Average price of a loaf of white bread in U.S. cities.",
    unit: "Loaf",
    emoji: "🍞",
    data: [
      { year: 2010, itemPriceUSD: 1.39, goldPriceUSD: 1224, btcPriceUSD: 0.09 }, // BTC price is effectively 0 for comparison
      { year: 2011, itemPriceUSD: 1.45, goldPriceUSD: 1571, btcPriceUSD: 10 }, 
      { year: 2012, itemPriceUSD: 1.42, goldPriceUSD: 1668, btcPriceUSD: 13 },
      { year: 2013, itemPriceUSD: 1.40, goldPriceUSD: 1411, btcPriceUSD: 750 },
      { year: 2014, itemPriceUSD: 1.41, goldPriceUSD: 1266, btcPriceUSD: 320 },
      { year: 2015, itemPriceUSD: 1.44, goldPriceUSD: 1160, btcPriceUSD: 430 },
      { year: 2016, itemPriceUSD: 1.38, goldPriceUSD: 1250, btcPriceUSD: 960 },
      { year: 2017, itemPriceUSD: 1.35, goldPriceUSD: 1257, btcPriceUSD: 13800 },
      { year: 2018, itemPriceUSD: 1.29, goldPriceUSD: 1268, btcPriceUSD: 3700 },
      { year: 2019, itemPriceUSD: 1.30, goldPriceUSD: 1392, btcPriceUSD: 7200 },
      { year: 2020, itemPriceUSD: 1.50, goldPriceUSD: 1770, btcPriceUSD: 29000 },
      { year: 2021, itemPriceUSD: 1.56, goldPriceUSD: 1799, btcPriceUSD: 46000 },
      { year: 2022, itemPriceUSD: 1.85, goldPriceUSD: 1800, btcPriceUSD: 16500 },
      { year: 2023, itemPriceUSD: 1.95, goldPriceUSD: 2000, btcPriceUSD: 42000 },
      { year: 2024, itemPriceUSD: 2.05, goldPriceUSD: 2300, btcPriceUSD: 65000 },
    ]
  },
  {
    id: "gas",
    name: "Gasoline (1 Gallon)",
    description: "Average price of regular unleaded gasoline per gallon.",
    unit: "Gallon",
    emoji: "⛽",
    data: [
      { year: 2010, itemPriceUSD: 2.78, goldPriceUSD: 1224, btcPriceUSD: 0.09 },
      { year: 2011, itemPriceUSD: 3.52, goldPriceUSD: 1571, btcPriceUSD: 10 },
      { year: 2012, itemPriceUSD: 3.60, goldPriceUSD: 1668, btcPriceUSD: 13 },
      { year: 2013, itemPriceUSD: 3.50, goldPriceUSD: 1411, btcPriceUSD: 750 },
      { year: 2014, itemPriceUSD: 3.35, goldPriceUSD: 1266, btcPriceUSD: 320 },
      { year: 2015, itemPriceUSD: 2.43, goldPriceUSD: 1160, btcPriceUSD: 430 },
      { year: 2016, itemPriceUSD: 2.14, goldPriceUSD: 1250, btcPriceUSD: 960 },
      { year: 2017, itemPriceUSD: 2.42, goldPriceUSD: 1257, btcPriceUSD: 13800 },
      { year: 2018, itemPriceUSD: 2.72, goldPriceUSD: 1268, btcPriceUSD: 3700 },
      { year: 2019, itemPriceUSD: 2.60, goldPriceUSD: 1392, btcPriceUSD: 7200 },
      { year: 2020, itemPriceUSD: 2.17, goldPriceUSD: 1770, btcPriceUSD: 29000 },
      { year: 2021, itemPriceUSD: 3.01, goldPriceUSD: 1799, btcPriceUSD: 46000 },
      { year: 2022, itemPriceUSD: 3.95, goldPriceUSD: 1800, btcPriceUSD: 16500 },
      { year: 2023, itemPriceUSD: 3.52, goldPriceUSD: 2000, btcPriceUSD: 42000 },
      { year: 2024, itemPriceUSD: 3.45, goldPriceUSD: 2300, btcPriceUSD: 65000 },
    ]
  },
  {
    id: "home",
    name: "Median US Home",
    description: "Median sales price of houses sold in the United States.",
    unit: "Home",
    emoji: "🏠",
    data: [
      { year: 2010, itemPriceUSD: 221800, goldPriceUSD: 1224, btcPriceUSD: 0.09 },
      { year: 2011, itemPriceUSD: 227200, goldPriceUSD: 1571, btcPriceUSD: 10 },
      { year: 2012, itemPriceUSD: 238400, goldPriceUSD: 1668, btcPriceUSD: 13 },
      { year: 2013, itemPriceUSD: 268900, goldPriceUSD: 1411, btcPriceUSD: 750 },
      { year: 2014, itemPriceUSD: 282800, goldPriceUSD: 1266, btcPriceUSD: 320 },
      { year: 2015, itemPriceUSD: 296400, goldPriceUSD: 1160, btcPriceUSD: 430 },
      { year: 2016, itemPriceUSD: 307800, goldPriceUSD: 1250, btcPriceUSD: 960 },
      { year: 2017, itemPriceUSD: 323100, goldPriceUSD: 1257, btcPriceUSD: 13800 },
      { year: 2018, itemPriceUSD: 326400, goldPriceUSD: 1268, btcPriceUSD: 3700 },
      { year: 2019, itemPriceUSD: 321500, goldPriceUSD: 1392, btcPriceUSD: 7200 },
      { year: 2020, itemPriceUSD: 336900, goldPriceUSD: 1770, btcPriceUSD: 29000 },
      { year: 2021, itemPriceUSD: 396800, goldPriceUSD: 1799, btcPriceUSD: 46000 },
      { year: 2022, itemPriceUSD: 457475, goldPriceUSD: 1800, btcPriceUSD: 16500 },
      { year: 2023, itemPriceUSD: 417700, goldPriceUSD: 2000, btcPriceUSD: 42000 },
      { year: 2024, itemPriceUSD: 420800, goldPriceUSD: 2300, btcPriceUSD: 65000 },
    ]
  },
  {
    id: "tuition",
    name: "College Tuition (Annual)",
    description: "Average annual tuition and fees at private 4-year colleges.",
    unit: "Year",
    emoji: "🎓",
    data: [
      { year: 2010, itemPriceUSD: 31000, goldPriceUSD: 1224, btcPriceUSD: 0.09 },
      { year: 2011, itemPriceUSD: 32500, goldPriceUSD: 1571, btcPriceUSD: 10 },
      { year: 2012, itemPriceUSD: 33500, goldPriceUSD: 1668, btcPriceUSD: 13 },
      { year: 2013, itemPriceUSD: 34700, goldPriceUSD: 1411, btcPriceUSD: 750 },
      { year: 2014, itemPriceUSD: 36000, goldPriceUSD: 1266, btcPriceUSD: 320 },
      { year: 2015, itemPriceUSD: 37500, goldPriceUSD: 1160, btcPriceUSD: 430 },
      { year: 2016, itemPriceUSD: 39000, goldPriceUSD: 1250, btcPriceUSD: 960 },
      { year: 2017, itemPriceUSD: 40500, goldPriceUSD: 1257, btcPriceUSD: 13800 },
      { year: 2018, itemPriceUSD: 42000, goldPriceUSD: 1268, btcPriceUSD: 3700 },
      { year: 2019, itemPriceUSD: 43500, goldPriceUSD: 1392, btcPriceUSD: 7200 },
      { year: 2020, itemPriceUSD: 37650, goldPriceUSD: 1770, btcPriceUSD: 29000 }, 
      { year: 2021, itemPriceUSD: 38800, goldPriceUSD: 1799, btcPriceUSD: 46000 },
      { year: 2022, itemPriceUSD: 39400, goldPriceUSD: 1800, btcPriceUSD: 16500 },
      { year: 2023, itemPriceUSD: 41540, goldPriceUSD: 2000, btcPriceUSD: 42000 },
      { year: 2024, itemPriceUSD: 43000, goldPriceUSD: 2300, btcPriceUSD: 65000 },
    ]
  },
  {
    id: "eggs",
    name: "Eggs (Dozen)",
    description: "Average price for a dozen Grade A large eggs.",
    unit: "Dozen",
    emoji: "🥚",
    data: [
      { year: 2010, itemPriceUSD: 1.66, goldPriceUSD: 1224, btcPriceUSD: 0.09 },
      { year: 2011, itemPriceUSD: 1.77, goldPriceUSD: 1571, btcPriceUSD: 10 },
      { year: 2012, itemPriceUSD: 1.80, goldPriceUSD: 1668, btcPriceUSD: 13 },
      { year: 2013, itemPriceUSD: 1.90, goldPriceUSD: 1411, btcPriceUSD: 750 },
      { year: 2014, itemPriceUSD: 2.00, goldPriceUSD: 1266, btcPriceUSD: 320 },
      { year: 2015, itemPriceUSD: 2.50, goldPriceUSD: 1160, btcPriceUSD: 430 },
      { year: 2016, itemPriceUSD: 1.68, goldPriceUSD: 1250, btcPriceUSD: 960 },
      { year: 2017, itemPriceUSD: 1.47, goldPriceUSD: 1257, btcPriceUSD: 13800 },
      { year: 2018, itemPriceUSD: 1.74, goldPriceUSD: 1268, btcPriceUSD: 3700 },
      { year: 2019, itemPriceUSD: 1.40, goldPriceUSD: 1392, btcPriceUSD: 7200 },
      { year: 2020, itemPriceUSD: 1.51, goldPriceUSD: 1770, btcPriceUSD: 29000 },
      { year: 2021, itemPriceUSD: 1.67, goldPriceUSD: 1799, btcPriceUSD: 46000 },
      { year: 2022, itemPriceUSD: 2.86, goldPriceUSD: 1800, btcPriceUSD: 16500 },
      { year: 2023, itemPriceUSD: 4.82, goldPriceUSD: 2000, btcPriceUSD: 42000 },
      { year: 2024, itemPriceUSD: 3.00, goldPriceUSD: 2300, btcPriceUSD: 65000 },
    ]
  }
];
