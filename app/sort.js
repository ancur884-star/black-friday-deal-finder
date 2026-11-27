// Sorting: the orders a shopper can put the deals in. Pure functions over a deal
// list; they know nothing about the page.

import { discountPercent } from "./data.js";

// NEW LOW beats STRONG beats ROUTINE beats INFLATED.
const VERDICT_RANK = { "NEW LOW": 0, STRONG: 1, ROUTINE: 2, INFLATED: 3 };

// mode: "best" | "discount" | "price-asc" | "price-desc"
export function sortDeals(deals, mode) {
  const list = [...deals];
  if (mode === "discount") {
    return list.sort((a, b) => discountPercent(b) - discountPercent(a) || a.price - b.price);
  }
  if (mode === "price-asc") {
    return list.sort((a, b) => a.price - b.price);
  }
  if (mode === "price-desc") {
    return list.sort((a, b) => b.price - a.price);
  }
  // Best deals first: verdict, then biggest discount, then lowest price.
  return list.sort(
    (a, b) =>
      VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
      discountPercent(b) - discountPercent(a) ||
      a.price - b.price,
  );
}
