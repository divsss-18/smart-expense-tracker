import { lastMonths, monthKey, monthLabel } from "../utils/helpers";
import { formatINR } from "../utils/currency";

export default function BarChart({ expenses }) {
  const months = lastMonths(6);
  const data = months.map((m) => ({
    key: m,
    total: expenses.filter((e) => monthKey(e.date) === m).reduce((s, e) => s + e.amountINR, 0),
  }));
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div className="panel">
      <h2>Last 6 months</h2>
      <div className="bars">
        {data.map((d) => (
          <div className="bar-col" key={d.key} title={formatINR(d.total)}>
            <span className="bar-val">{d.total ? formatINR(d.total) : ""}</span>
            <div className="bar" style={{ height: `${(d.total / max) * 100}%` }} />
            <span>{monthLabel(d.key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}