export const CATEGORIES = {
  Food: "#e07a1f",
  Fuel: "#0f766e",
  Travel: "#2563eb",
  Rent: "#7c3aed",
  Shopping: "#db2777",
  Bills: "#ca8a04",
  Health: "#16a34a",
  Other: "#64748b",
};

const KEYWORDS = {
  Food: ["food", "lunch", "dinner", "breakfast", "tea", "coffee", "snack", "biryani", "grocery", "restaurant"],
  Fuel: ["petrol", "diesel", "fuel", "gas"],
  Travel: ["bus", "train", "flight", "cab", "uber", "ola", "toll", "ticket", "trip"],
  Rent: ["rent", "pg", "hostel"],
  Shopping: ["shirt", "shoes", "amazon", "flipkart", "shopping", "clothes"],
  Bills: ["electricity", "recharge", "wifi", "internet", "water bill", "subscription", "netflix"],
  Health: ["medicine", "doctor", "hospital", "pharmacy", "gym"],
};

export function suggestCategory(note) {
  const text = note.toLowerCase();
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    if (words.some((w) => text.includes(w))) return cat;
  }
  return null;
}