export const monthKey = (dateStr) => dateStr.slice(0, 7); // "2026-11"

export const currentMonthKey = () => new Date().toISOString().slice(0, 7);

export function prevMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function lastMonths(count) {
  const keys = [];
  let key = currentMonthKey();
  for (let i = 0; i < count; i++) {
    keys.unshift(key);
    key = prevMonthKey(key);
  }
  return keys;
}

export function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "short" });
}

export function totalsByCategory(expenses) {
  const totals = {};
  expenses.forEach((e) => (totals[e.category] = (totals[e.category] || 0) + e.amountINR));
  return totals;
}

export function buildInsights(expenses) {
  const thisKey = currentMonthKey();
  const lastKey = prevMonthKey(thisKey);
  const thisMonth = expenses.filter((e) => monthKey(e.date) === thisKey);
  const lastMonth = expenses.filter((e) => monthKey(e.date) === lastKey);
  const insights = [];
  if (thisMonth.length === 0) return ["Add an expense to see insights for this month."];

  const a = thisMonth.reduce((s, e) => s + e.amountINR, 0);
  const b = lastMonth.reduce((s, e) => s + e.amountINR, 0);
  if (b > 0) {
    const pct = Math.round(((a - b) / b) * 100);
    insights.push(
      pct >= 0
        ? `You spent ${pct}% more than last month.`
        : `You spent ${Math.abs(pct)}% less than last month. Nice work.`
    );
  }
  const t = totalsByCategory(thisMonth);
  const [topCat, topAmt] = Object.entries(t).sort((x, y) => y[1] - x[1])[0];
  insights.push(`${topCat} is your biggest category this month (${Math.round((topAmt / a) * 100)}% of spending).`);

  const lt = totalsByCategory(lastMonth);
  Object.keys(t).forEach((cat) => {
    if (lt[cat] > 0 && t[cat] > lt[cat] * 1.25 && insights.length < 4) {
      insights.push(`${cat} is up ${Math.round(((t[cat] - lt[cat]) / lt[cat]) * 100)}% from last month.`);
    }
  });
  const day = new Date().getDate();
  insights.push(`At this pace you will spend about ${Math.round((a / day) * 30).toLocaleString("en-IN")} INR by month end.`);
  return insights;
}

export function exportCSV(expenses) {
  const header = ["Date", "Category", "Note", "Amount", "Currency", "Amount (INR)"];
  const rows = expenses.map((e) =>
    [e.date, e.category, `"${e.note.replace(/"/g, '""')}"`, e.amount, e.currency, e.amountINR.toFixed(2)].join(",")
  );
  const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}