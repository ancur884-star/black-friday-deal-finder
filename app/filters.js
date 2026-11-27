// Filtering: which deals a search, a category, a store and a discount tier leave
// standing. Pure functions over the deal list; they know nothing about the page.

import { discountPercent } from "./data.js";

export const CATEGORIES = [
  "TVs",
  "Laptops",
  "Audio",
  "Gaming",
  "Smart home & wearables",
  "Home & kitchen",
];

export const STORES = ["Amazon", "Best Buy", "Dell", "Target"];

// tier: "all" | "50" | "40" | "25" | "under25"
export function filterDeals(deals, state) {
  const query = state.query.trim().toLowerCase();
  return deals.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    const pct = discountPercent(deal);
    if (state.tier === "50" && pct < 50) return false;
    if (state.tier === "40" && pct < 40) return false;
    if (state.tier === "25" && pct < 25) return false;
    if (state.tier === "under25" && pct >= 25) return false;
    if (query) {
      const haystack = (deal.title + " " + deal.store + " " + deal.category).toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}
