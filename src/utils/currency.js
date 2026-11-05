// Free API, no key needed: https://frankfurter.dev
const cache = {};

export async function getRateToINR(from) {
  if (from === "INR") return 1;
  if (cache[from]) return cache[from];
  const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=INR`);
  if (!res.ok) throw new Error("Could not fetch exchange rate");
  const data = await res.json();
  cache[from] = data.rates.INR;
  return cache[from];
}

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);