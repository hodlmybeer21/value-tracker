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

// Base financial data (Gold/BTC history) to ensure consistency across items
const BASE_FINANCIALS: Record<number, { gold: number, btc: number | null }> = {
  1970: { gold: 36, btc: null },
  1975: { gold: 161, btc: null },
  1980: { gold: 615, btc: null },
  1985: { gold: 317, btc: null },
  1990: { gold: 383, btc: null },
  1995: { gold: 384, btc: null },
  2000: { gold: 279, btc: null },
  2005: { gold: 444, btc: null },
  2008: { gold: 871, btc: null },
  2009: { gold: 972, btc: 0.0009 },
  2010: { gold: 1224, btc: 0.09 }, 
  2011: { gold: 1571, btc: 10 }, 
  2012: { gold: 1668, btc: 13 },
  2013: { gold: 1411, btc: 750 },
  2014: { gold: 1266, btc: 320 },
  2015: { gold: 1160, btc: 430 },
  2016: { gold: 1250, btc: 960 },
  2017: { gold: 1257, btc: 13800 },
  2018: { gold: 1268, btc: 3700 },
  2019: { gold: 1392, btc: 7200 },
  2020: { gold: 1770, btc: 29000 },
  2021: { gold: 1799, btc: 46000 },
  2022: { gold: 1800, btc: 16500 },
  2023: { gold: 2000, btc: 42000 },
  2024: { gold: 2300, btc: 65000 },
};

// Helper to construct data points
function createItemData(usdPrices: Record<number, number>): PriceDataPoint[] {
  return Object.keys(BASE_FINANCIALS).map(yStr => {
    const year = parseInt(yStr);
    const financials = BASE_FINANCIALS[year];
    // Use the exact year price if available, otherwise find the closest previous year (interpolation/fill forward)
    let price = usdPrices[year];
    if (price === undefined) {
       // Simple fill forward for gaps in the input map if specific year missing
       const availableYears = Object.keys(usdPrices).map(Number).sort((a,b) => a-b);
       const prevYear = availableYears.reverse().find(y => y <= year);
       price = prevYear ? usdPrices[prevYear] : 0;
    }
    
    return {
      year,
      itemPriceUSD: price,
      goldPriceUSD: financials.gold,
      btcPriceUSD: financials.btc
    };
  });
}

export const ITEMS: ItemData[] = [
  {
    id: "bread",
    name: "White Bread (1 lb)",
    description: "Average price of a loaf of white bread in U.S. cities.",
    unit: "Loaf",
    emoji: "🍞",
    data: createItemData({
      1970: 0.24, 1975: 0.36, 1980: 0.51, 1985: 0.55, 1990: 0.70, 1995: 0.79,
      2000: 0.93, 2005: 1.05, 2008: 1.37, 2009: 1.39, 2010: 1.39, 2011: 1.45,
      2012: 1.42, 2013: 1.40, 2014: 1.41, 2015: 1.44, 2016: 1.38, 2017: 1.35,
      2018: 1.29, 2019: 1.30, 2020: 1.50, 2021: 1.56, 2022: 1.85, 2023: 1.95, 2024: 2.05
    })
  },
  {
    id: "milk",
    name: "Milk (1 Gallon)",
    description: "Average price of a gallon of whole fortified milk.",
    unit: "Gallon",
    emoji: "🥛",
    data: createItemData({
      1970: 1.15, 1975: 1.57, 1980: 2.16, 1985: 2.20, 1990: 2.78, 1995: 2.48,
      2000: 2.79, 2005: 3.20, 2008: 3.80, 2009: 3.10, 2010: 3.16, 2011: 3.50,
      2012: 3.40, 2013: 3.45, 2014: 3.60, 2015: 3.42, 2016: 3.20, 2017: 3.23,
      2018: 2.90, 2019: 3.05, 2020: 3.32, 2021: 3.55, 2022: 4.00, 2023: 3.96, 2024: 4.05
    })
  },
  {
    id: "eggs",
    name: "Eggs (Dozen)",
    description: "Average price for a dozen Grade A large eggs.",
    unit: "Dozen",
    emoji: "🥚",
    data: createItemData({
      1970: 0.61, 1975: 0.77, 1980: 0.84, 1985: 0.80, 1990: 1.00, 1995: 0.87,
      2000: 0.91, 2005: 1.20, 2008: 2.20, 2009: 1.66, 2010: 1.66, 2011: 1.77,
      2012: 1.80, 2013: 1.90, 2014: 2.00, 2015: 2.50, 2016: 1.68, 2017: 1.47,
      2018: 1.74, 2019: 1.40, 2020: 1.51, 2021: 1.67, 2022: 2.86, 2023: 4.82, 2024: 3.00
    })
  },
  {
    id: "coffee",
    name: "Cup of Coffee",
    description: "Average price of a standard cup of brewed coffee.",
    unit: "Cup",
    emoji: "☕",
    data: createItemData({
      1970: 0.25, 1975: 0.35, 1980: 0.45, 1985: 0.55, 1990: 0.75, 1995: 0.90,
      2000: 1.00, 2005: 1.75, 2008: 1.95, 2009: 2.00, 2010: 2.10, 2011: 2.25,
      2012: 2.30, 2013: 2.35, 2014: 2.38, 2015: 2.45, 2016: 2.50, 2017: 2.60,
      2018: 2.70, 2019: 2.70, 2020: 2.90, 2021: 2.95, 2022: 3.00, 2023: 3.05, 2024: 3.08
    })
  },
  {
    id: "grocery",
    name: "Grocery Basket",
    description: "Estimated cost of a standard weekly grocery basket for a family of four.",
    unit: "Basket",
    emoji: "🛒",
    data: createItemData({
      1970: 30, 1975: 45, 1980: 60, 1985: 75, 1990: 92, 1995: 105,
      2000: 120, 2005: 140, 2008: 165, 2009: 160, 2010: 162, 2011: 175,
      2012: 180, 2013: 182, 2014: 185, 2015: 188, 2016: 185, 2017: 190,
      2018: 195, 2019: 200, 2020: 215, 2021: 235, 2022: 265, 2023: 280, 2024: 295
    })
  },
  {
    id: "gas",
    name: "Gasoline (1 Gallon)",
    description: "Average price of regular unleaded gasoline per gallon.",
    unit: "Gallon",
    emoji: "⛽",
    data: createItemData({
      1970: 0.36, 1975: 0.57, 1980: 1.19, 1985: 1.12, 1990: 1.16, 1995: 1.15,
      2000: 1.51, 2005: 2.30, 2008: 3.27, 2009: 2.35, 2010: 2.78, 2011: 3.52,
      2012: 3.60, 2013: 3.50, 2014: 3.35, 2015: 2.43, 2016: 2.14, 2017: 2.42,
      2018: 2.72, 2019: 2.60, 2020: 2.17, 2021: 3.01, 2022: 3.95, 2023: 3.52, 2024: 3.45
    })
  },
  {
    id: "propane",
    name: "Propane (1 Gallon)",
    description: "Average residential price per gallon of propane (heating season).",
    unit: "Gallon",
    emoji: "🔥",
    data: createItemData({
      1970: 0.20, 1975: 0.35, 1980: 0.65, 1985: 0.80, 1990: 0.95, 1995: 0.98,
      2000: 1.25, 2005: 1.80, 2008: 2.40, 2009: 2.30, 2010: 2.50, 2011: 2.80,
      2012: 2.70, 2013: 2.65, 2014: 3.20, 2015: 2.40, 2016: 2.10, 2017: 2.30,
      2018: 2.45, 2019: 2.50, 2020: 2.35, 2021: 2.60, 2022: 2.85, 2023: 2.75, 2024: 2.80
    })
  },
  {
    id: "electricity",
    name: "Electricity (kWh)",
    description: "Average price per kilowatt-hour of residential electricity.",
    unit: "kWh",
    emoji: "⚡",
    data: createItemData({
      1970: 0.021, 1975: 0.032, 1980: 0.054, 1985: 0.074, 1990: 0.078, 1995: 0.084,
      2000: 0.082, 2005: 0.094, 2008: 0.112, 2009: 0.115, 2010: 0.115, 2011: 0.117,
      2012: 0.119, 2013: 0.121, 2014: 0.125, 2015: 0.126, 2016: 0.125, 2017: 0.129,
      2018: 0.128, 2019: 0.130, 2020: 0.131, 2021: 0.136, 2022: 0.151, 2023: 0.168, 2024: 0.174
    })
  },
  {
    id: "washer",
    name: "Washing Machine",
    description: "Average cost of a standard washing machine.",
    unit: "Unit",
    emoji: "🧺",
    data: createItemData({
      1970: 350, 1975: 400, 1980: 500, 1985: 550, 1990: 500, 1995: 450,
      2000: 400, 2005: 400, 2008: 350, 2009: 350, 2010: 350, 2011: 320,
      2012: 300, 2013: 350, 2014: 400, 2015: 450, 2016: 500, 2017: 550,
      2018: 600, 2019: 650, 2020: 700, 2021: 850, 2022: 800, 2023: 780, 2024: 775
    })
  },
  {
    id: "monopoly",
    name: "Monopoly Game",
    description: "Standard edition Monopoly board game price.",
    unit: "Game",
    emoji: "🎲",
    data: createItemData({
      1970: 4.00, 1975: 5.00, 1980: 7.00, 1985: 9.00, 1990: 12.00, 1995: 15.00,
      2000: 18.00, 2005: 18.00, 2008: 18.00, 2009: 18.00, 2010: 18.00, 2011: 18.00,
      2012: 18.00, 2013: 18.00, 2014: 18.00, 2015: 20.00, 2016: 20.00, 2017: 20.00,
      2018: 20.00, 2019: 20.00, 2020: 20.00, 2021: 20.00, 2022: 21.00, 2023: 22.00, 2024: 22.00
    })
  },
  {
    id: "clothes",
    name: "Kids' Clothing Set",
    description: "Average cost of a basic outfit (shirt + pants) for a child.",
    unit: "Outfit",
    emoji: "👕",
    data: createItemData({
      1970: 15.00, 1975: 18.00, 1980: 22.00, 1985: 25.00, 1990: 30.00, 1995: 32.00,
      2000: 30.00, 2005: 28.00, 2008: 28.00, 2009: 28.00, 2010: 28.00, 2011: 29.00,
      2012: 29.00, 2013: 29.00, 2014: 30.00, 2015: 30.00, 2016: 30.00, 2017: 30.00,
      2018: 30.00, 2019: 30.00, 2020: 32.00, 2021: 35.00, 2022: 38.00, 2023: 40.00, 2024: 42.00
    })
  },
  {
    id: "home",
    name: "Median US Home",
    description: "Median sales price of houses sold in the United States.",
    unit: "Home",
    emoji: "🏠",
    data: createItemData({
      1970: 23400, 1975: 39300, 1980: 64600, 1985: 84300, 1990: 122900, 1995: 133900,
      2000: 169000, 2005: 240900, 2008: 232100, 2009: 216700, 2010: 221800, 2011: 227200,
      2012: 238400, 2013: 268900, 2014: 282800, 2015: 296400, 2016: 307800, 2017: 323100,
      2018: 326400, 2019: 321500, 2020: 336900, 2021: 396800, 2022: 457475, 2023: 417700, 2024: 420800
    })
  },
  {
    id: "rent",
    name: "Apartment Rent",
    description: "Median gross rent for an apartment in the United States.",
    unit: "Month",
    emoji: "🏢",
    data: createItemData({
      1970: 108, 1975: 155, 1980: 243, 1985: 350, 1990: 447, 1995: 520,
      2000: 602, 2005: 750, 2008: 800, 2009: 820, 2010: 844, 2011: 870,
      2012: 900, 2013: 930, 2014: 960, 2015: 1000, 2016: 1050, 2017: 1100,
      2018: 1150, 2019: 1200, 2020: 1250, 2021: 1400, 2022: 1700, 2023: 2000, 2024: 2150
    })
  },
  {
    id: "childcare",
    name: "Child Care (Annual)",
    description: "Average annual cost of center-based child care for an infant/toddler.",
    unit: "Year",
    emoji: "🧸",
    data: createItemData({
      1970: 1500, 1975: 2200, 1980: 3000, 1985: 4500, 1990: 5500, 1995: 7000,
      2000: 8500, 2005: 10500, 2008: 12000, 2009: 12200, 2010: 12500, 2011: 12800,
      2012: 13000, 2013: 13500, 2014: 13800, 2015: 14000, 2016: 14500, 2017: 15000,
      2018: 15500, 2019: 16000, 2020: 16500, 2021: 17500, 2022: 18500, 2023: 19500, 2024: 20500
    })
  },
  {
    id: "tuition",
    name: "College Tuition",
    description: "Average annual tuition and fees at private 4-year colleges.",
    unit: "Year",
    emoji: "🎓",
    data: createItemData({
      1970: 1800, 1975: 2400, 1980: 3600, 1985: 5400, 1990: 9340, 1995: 12200,
      2000: 16000, 2005: 21000, 2008: 25000, 2009: 26200, 2010: 31000, 2011: 32500,
      2012: 33500, 2013: 34700, 2014: 36000, 2015: 37500, 2016: 39000, 2017: 40500,
      2018: 42000, 2019: 43500, 2020: 37650, 2021: 38800, 2022: 39400, 2023: 41540, 2024: 43000
    })
  },
  {
    id: "car",
    name: "New Car Price",
    description: "Average transaction price for a new vehicle in the US.",
    unit: "Car",
    emoji: "🚗",
    data: createItemData({
      1970: 3542, 1975: 4950, 1980: 7210, 1985: 11500, 1990: 15473, 1995: 18500,
      2000: 21850, 2005: 24000, 2008: 25500, 2009: 26000, 2010: 29217, 2011: 29800,
      2012: 30500, 2013: 31200, 2014: 32000, 2015: 33000, 2016: 34000, 2017: 35000,
      2018: 36000, 2019: 37000, 2020: 38000, 2021: 42000, 2022: 46000, 2023: 48000, 2024: 48500
    })
  },
  {
    id: "wage",
    name: "Avg Hourly Wage",
    description: "Average hourly earnings of production and nonsupervisory employees.",
    unit: "Hour",
    emoji: "⏱️",
    data: createItemData({
      1970: 3.40, 1975: 4.80, 1980: 6.85, 1985: 8.70, 1990: 10.33, 1995: 11.60,
      2000: 14.02, 2005: 16.00, 2008: 18.00, 2009: 18.50, 2010: 22.60, 2011: 23.00,
      2012: 23.50, 2013: 24.00, 2014: 24.50, 2015: 25.00, 2016: 25.50, 2017: 26.00,
      2018: 27.00, 2019: 28.00, 2020: 29.50, 2021: 31.00, 2022: 32.50, 2023: 34.00, 2024: 35.00
    })
  },
  {
    id: "movie",
    name: "Movie Ticket",
    description: "Average price of a movie ticket in the United States.",
    unit: "Ticket",
    emoji: "🎟️",
    data: createItemData({
      1970: 1.55, 1975: 2.03, 1980: 2.69, 1985: 3.55, 1990: 4.22, 1995: 4.35,
      2000: 5.39, 2005: 6.41, 2008: 7.18, 2009: 7.50, 2010: 7.89, 2011: 7.93,
      2012: 7.96, 2013: 8.13, 2014: 8.17, 2015: 8.43, 2016: 8.65, 2017: 8.97,
      2018: 9.11, 2019: 9.16, 2020: 9.37, 2021: 10.17, 2022: 10.53, 2023: 11.90, 2024: 12.50
    })
  },
  {
    id: "stamp",
    name: "Postage Stamp",
    description: "Cost of a First-Class Mail letter stamp.",
    unit: "Stamp",
    emoji: "📮",
    data: createItemData({
      1970: 0.06, 1975: 0.10, 1980: 0.15, 1985: 0.22, 1990: 0.25, 1995: 0.32,
      2000: 0.33, 2005: 0.37, 2008: 0.42, 2009: 0.44, 2010: 0.44, 2011: 0.44,
      2012: 0.45, 2013: 0.46, 2014: 0.49, 2015: 0.49, 2016: 0.47, 2017: 0.49,
      2018: 0.50, 2019: 0.55, 2020: 0.55, 2021: 0.58, 2022: 0.60, 2023: 0.66, 2024: 0.73
    })
  },
  {
    id: "disney",
    name: "Disney World Ticket",
    description: "Price of a single-day admission ticket to Magic Kingdom.",
    unit: "Ticket",
    emoji: "🎢",
    data: createItemData({
      1970: 3.50, 1975: 6.00, 1980: 9.50, 1985: 21.50, 1990: 31.00, 1995: 37.00,
      2000: 46.00, 2005: 59.75, 2008: 75.00, 2009: 79.00, 2010: 82.00, 2011: 85.00,
      2012: 89.00, 2013: 95.00, 2014: 99.00, 2015: 105.00, 2016: 110.00, 2017: 115.00,
      2018: 122.00, 2019: 125.00, 2020: 135.00, 2021: 145.00, 2022: 159.00, 2023: 164.00, 2024: 184.00
    })
  },
  {
    id: "beer",
    name: "Beer (6-pack)",
    description: "Average price of a 6-pack of domestic beer.",
    unit: "6-pack",
    emoji: "🍺",
    data: createItemData({
      1970: 1.50, 1975: 2.25, 1980: 3.15, 1985: 3.95, 1990: 4.75, 1995: 5.50,
      2000: 6.25, 2005: 7.50, 2008: 8.50, 2009: 8.75, 2010: 8.99, 2011: 9.25,
      2012: 9.50, 2013: 9.75, 2014: 9.99, 2015: 10.25, 2016: 10.50, 2017: 10.75,
      2018: 10.99, 2019: 11.25, 2020: 11.50, 2021: 11.99, 2022: 12.50, 2023: 13.50, 2024: 14.25
    })
  },
  {
    id: "burger",
    name: "Big Mac",
    description: "Average price of a Big Mac burger in the US.",
    unit: "Burger",
    emoji: "🍔",
    data: createItemData({
      1970: 0.55, 1975: 0.75, 1980: 1.30, 1985: 1.60, 1990: 2.20, 1995: 2.30,
      2000: 2.50, 2005: 3.15, 2008: 3.57, 2009: 3.57, 2010: 3.73, 2011: 4.07,
      2012: 4.33, 2013: 4.56, 2014: 4.62, 2015: 4.79, 2016: 4.93, 2017: 5.06,
      2018: 5.28, 2019: 5.58, 2020: 5.67, 2021: 5.93, 2022: 6.30, 2023: 6.58, 2024: 6.95
    })
  },
  {
    id: "superbowl",
    name: "Super Bowl Ticket",
    description: "Face value price of a Super Bowl ticket (non-resale).",
    unit: "Ticket",
    emoji: "🏈",
    data: createItemData({
      1970: 15, 1975: 20, 1980: 30, 1985: 60, 1990: 125, 1995: 200,
      2000: 325, 2005: 600, 2008: 700, 2009: 800, 2010: 900, 2011: 900,
      2012: 1200, 2013: 1200, 2014: 1500, 2015: 2000, 2016: 2500, 2017: 2500,
      2018: 2500, 2019: 2500, 2020: 2500, 2021: 3000, 2022: 3000, 2023: 3500, 2024: 4000
    })
  },
  {
    id: "jeans",
    name: "Levi's 501 Jeans",
    description: "Average price of a pair of Levi's 501 jeans.",
    unit: "Pair",
    emoji: "👖",
    data: createItemData({
      1970: 7.00, 1975: 13.50, 1980: 17.00, 1985: 24.00, 1990: 28.00, 1995: 35.00,
      2000: 45.00, 2005: 46.00, 2008: 48.00, 2009: 48.00, 2010: 48.00, 2011: 54.00,
      2012: 58.00, 2013: 58.00, 2014: 58.00, 2015: 59.50, 2016: 59.50, 2017: 59.50,
      2018: 59.50, 2019: 69.50, 2020: 69.50, 2021: 69.50, 2022: 79.50, 2023: 79.50, 2024: 89.50
    })
  },
  {
    id: "coke",
    name: "Coca-Cola (Can)",
    description: "Price of a single can of Coke from a vending machine.",
    unit: "Can",
    emoji: "🥤",
    data: createItemData({
      1970: 0.10, 1975: 0.20, 1980: 0.35, 1985: 0.50, 1990: 0.65, 1995: 0.75,
      2000: 1.00, 2005: 1.00, 2008: 1.25, 2009: 1.25, 2010: 1.25, 2011: 1.35,
      2012: 1.50, 2013: 1.50, 2014: 1.50, 2015: 1.50, 2016: 1.50, 2017: 1.50,
      2018: 1.75, 2019: 1.75, 2020: 2.00, 2021: 2.00, 2022: 2.25, 2023: 2.50, 2024: 2.75
    })
  },
  {
    id: "pizza",
    name: "Slice of Pizza (NYC)",
    description: "Average price of a plain slice of pizza in NYC.",
    unit: "Slice",
    emoji: "🍕",
    data: createItemData({
      1970: 0.25, 1975: 0.45, 1980: 0.75, 1985: 1.00, 1990: 1.25, 1995: 1.50,
      2000: 1.75, 2005: 2.00, 2008: 2.25, 2009: 2.25, 2010: 2.50, 2011: 2.50,
      2012: 2.50, 2013: 2.75, 2014: 2.75, 2015: 2.75, 2016: 2.75, 2017: 3.00,
      2018: 3.00, 2019: 3.00, 2020: 3.00, 2021: 3.25, 2022: 3.50, 2023: 3.75, 2024: 4.00
    })
  }
];

// Helper to expand with variations if needed for scale testing
const createVariation = (base: ItemData, index: number): ItemData => {
  const variationFactor = 1 + (index * 0.05); // 5% increase per variation
  return {
    id: `${base.id}_var_${index}`,
    name: `${base.name} (Type ${index + 1})`,
    description: `Variation ${index + 1} of ${base.name}`,
    unit: base.unit,
    emoji: base.emoji,
    data: base.data.map(d => ({
      ...d,
      itemPriceUSD: Number((d.itemPriceUSD * variationFactor).toFixed(2))
    }))
  };
};

// Generate 50 extra mock items based on existing ones to flesh out the list
for (let i = 0; i < 50; i++) {
  const baseItem = ITEMS[i % 10]; // Cycle through first 10 items
  ITEMS.push(createVariation(baseItem, i));
}

