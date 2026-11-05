import { CATEGORIES } from "../utils/categories";
import { formatINR } from "../utils/currency";

export default function DonutChart({ totals }) {
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  if (sum === 0) return <div className="panel"><h2>By category</h2><p className="muted">No spending this month yet.</p></div>;

  let offset = 25; // start at top
  return (
    <div className="panel">
      <h2>By category</h2>
      <div className="donut-wrap">
        <svg viewBox="0 0 42 42" className="donut" role="img" aria-label="Spending by category">
          <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--track)" strokeWidth="6" />
          {entries.map(([cat, val]) => {
            const pct = (val / sum) * 100;
            const el = (
              <circle key={cat} cx="21" cy="21" r="15.9155" fill="none" stroke={CATEGORIES[cat]}
                strokeWidth="6" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} />
            );
            offset -= pct;
            return el;
          })}
          <text x="21" y="22" textAnchor="middle" className="donut-total">{formatINR(sum)}</text>
        </svg>
        <ul className="legend">
          {entries.map(([cat, val]) => (
            <li key={cat}><span className="dot" style={{ background: CATEGORIES[cat] }} />{cat}<b>{formatINR(val)}</b></li>
          ))}
        </ul>
      </div>
    </div>
  );
}