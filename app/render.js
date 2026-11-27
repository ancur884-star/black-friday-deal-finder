// Rendering: turning deals and comparisons into page markup. It takes a list of
// deals and writes them into the page; it never filters or sorts anything itself.

import { CHECKED_LABEL, discountPercent, formatPrice } from "./data.js";

const VERDICT_CLASS = {
  "NEW LOW": "verdict-newlow",
  STRONG: "verdict-strong",
  ROUTINE: "verdict-routine",
  INFLATED: "verdict-inflated",
};

function dealCard(deal) {
  const pct = discountPercent(deal);
  return (
    `<article class="card">` +
    `<div class="card-top"><span class="store">${deal.store}</span>` +
    `<span class="category">${deal.category}</span></div>` +
    `<h3>${deal.title}</h3>` +
    `<div class="prices"><span class="price">${formatPrice(deal.price)}</span>` +
    `<span class="was">${formatPrice(deal.was)}</span>` +
    `<span class="off">&minus;${pct}%</span></div>` +
    `<p class="verdict ${VERDICT_CLASS[deal.verdict]}">` +
    `<span class="badge">${deal.verdict}</span> ${deal.evidence}</p>` +
    `<p class="meta">Checked ${CHECKED_LABEL} &middot; ${deal.source}</p>` +
    `<a class="store-link" href="${deal.url}" target="_blank" rel="noopener">` +
    `View at ${deal.store} &rarr;</a>` +
    `</article>`
  );
}

export function renderDeals(container, deals) {
  if (deals.length === 0) {
    container.innerHTML =
      `<p class="empty">No deals match that search. Try a different word, or clear a filter.</p>`;
    return;
  }
  container.innerHTML = deals.map(dealCard).join("");
}

function comparisonCard(comparison) {
  const [first, second] = comparison.options;
  const cheaper = first.price <= second.price ? first : second;
  const saving = Math.abs(first.price - second.price);
  const option = (entry) => {
    const pct = Math.round(((entry.was - entry.price) / entry.was) * 100);
    const mark =
      entry === cheaper
        ? `<span class="cheaper">Cheaper by ${formatPrice(saving)}</span>`
        : `<span class="dearer">&nbsp;</span>`;
    return (
      `<div class="compare-option">` +
      `<span class="compare-store">${entry.store}</span>` +
      `<span class="compare-price">${formatPrice(entry.price)}</span>` +
      `<span class="compare-was">${formatPrice(entry.was)} &middot; &minus;${pct}%</span>` +
      `<span class="badge ${VERDICT_CLASS[entry.verdict]}">${entry.verdict}</span>` +
      `${mark}` +
      `<a class="store-link" href="${entry.url}" target="_blank" rel="noopener">` +
      `View at ${entry.store} &rarr;</a>` +
      `</div>`
    );
  };
  return (
    `<article class="compare-card">` +
    `<h3>${comparison.title}</h3>` +
    `<p class="compare-note">${comparison.note}</p>` +
    `<div class="compare-options">${option(first)}${option(second)}</div>` +
    `</article>`
  );
}

export function renderComparisons(container, comparisons) {
  container.innerHTML = comparisons.map(comparisonCard).join("");
}

export function renderCount(element, shown, total) {
  element.textContent =
    shown === total
      ? `${total} deals`
      : `${shown} of ${total} deals`;
}
