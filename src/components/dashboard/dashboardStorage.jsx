import { CATEGORY_OPTIONS } from "./categoryOptions";
import { extractHex } from "./colorUtils";

function cloneCategories() {
  return CATEGORY_OPTIONS.map((item) => ({ ...item }));
}

export function getDefaultDashboardData() {
  return {
    categories: cloneCategories(),
    events: [],
  };
}

const DEFAULT_BY_VALUE = new Map(CATEGORY_OPTIONS.map((item) => [item.value, item]));

function isMojibake(text) {
  return /[\u0080-\u009F]/.test(text || "");
}

function normalizeCategory(category) {
  const fallback = DEFAULT_BY_VALUE.get(category.value);
  const colorHex = extractHex(category.color) || fallback?.color || "#A8A8A8";
  const label = fallback && isMojibake(category.label) ? fallback.label : category.label;
  return {
    ...category,
    label,
    color: colorHex,
  };
}

export async function loadDashboardData() {
  if (typeof window === "undefined") {
    return getDefaultDashboardData();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const response = await fetch(`${baseUrl}/api/dashboard`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return getDefaultDashboardData();
    }
    const parsed = await response.json();
    return {
      categories: Array.isArray(parsed?.categories) && parsed.categories.length
        ? parsed.categories.map(normalizeCategory)
        : cloneCategories(),
      events: Array.isArray(parsed?.events) ? parsed.events : [],
    };
  } catch (error) {
    return getDefaultDashboardData();
  }

}

export async function saveDashboardData(data) {
  if (typeof window === "undefined") return;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  await fetch(`${baseUrl}/api/dashboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2),
  });
}

export function createEventId() {
  return `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
