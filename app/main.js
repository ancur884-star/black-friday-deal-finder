// Wiring: page state, the controls, and the hash a shared link can carry.
// A link can open a filtered view: #/search/airpods, #/category/audio,
// #/store/amazon. Everything else lives in filters.js, sort.js and render.js.

import { comparisons, deals } from "./data.js";
import { CATEGORIES, STORES, filterDeals } from "./filters.js";
import { sortDeals } from "./sort.js";
import { renderComparisons, renderCount, renderDeals } from "./render.js";

const state = {
  query: "",
  category: "All",
  store: "All",
  tier: "all",
  sort: "best",
};

const grid = document.getElementById("deals");
const count = document.getElementById("count");
const searchBox = document.getElementById("search");
const storeSelect = document.getElementById("store-filter");
const tierSelect = document.getElementById("tier-filter");
const sortSelect = document.getElementById("sort");
const chips = document.getElementById("category-chips");

function applyState() {
  const filtered = filterDeals(deals, state);
  const sorted = sortDeals(filtered, state.sort);
  renderDeals(grid, sorted);
  renderCount(count, filtered.length, deals.length);
}

function buildChips() {
  const names = ["All", ...CATEGORIES];
  chips.innerHTML = names
    .map(
      (name) =>
        `<button type="button" class="chip${name === state.category ? " active" : ""}" ` +
        `data-category="${name}">${name}</button>`,
    )
    .join("");
  chips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      buildChips();
      applyState();
    });
  });
}

function buildSelects() {
  storeSelect.innerHTML =
    `<option value="All">All stores</option>` +
    STORES.map((store) => `<option value="${store}">${store}</option>`).join("");
  tierSelect.innerHTML =
    `<option value="all">Any discount</option>` +
    `<option value="50">50% off or more</option>` +
    `<option value="40">40% off or more</option>` +
    `<option value="25">25% off or more</option>` +
    `<option value="under25">Under 25% off</option>`;
  sortSelect.innerHTML =
    `<option value="best">Best deals first</option>` +
    `<option value="discount">Biggest discount</option>` +
    `<option value="price-asc">Price: low to high</option>` +
    `<option value="price-desc">Price: high to low</option>`;
}

// A shared link's filter: #/search/airpods, #/category/audio, #/store/amazon,
// or #/compare to jump to the same-product comparisons.
function readHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [kind, ...rest] = hash.split("/");
  const value = decodeURIComponent(rest.join("/"));
  if (kind === "search" && value) {
    state.query = value;
    searchBox.value = value;
  } else if (kind === "category" && CATEGORIES.includes(value)) {
    state.category = value;
  } else if (kind === "store" && STORES.includes(value)) {
    state.store = value;
    storeSelect.value = value;
  } else if (kind === "compare") {
    requestAnimationFrame(() => {
      document.getElementById("compare-section").scrollIntoView();
    });
  }
}

searchBox.addEventListener("input", () => {
  state.query = searchBox.value;
  applyState();
});
storeSelect.addEventListener("change", () => {
  state.store = storeSelect.value;
  applyState();
});
tierSelect.addEventListener("change", () => {
  state.tier = tierSelect.value;
  applyState();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  applyState();
});

buildSelects();
readHash();
buildChips();
renderComparisons(document.getElementById("comparisons"), comparisons);
applyState();
