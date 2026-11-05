import { useState } from "react";
import { formatINR } from "../utils/currency";

export default function BudgetCard({ budget, setBudget, spent }) {
  const [draft, setDraft] = useState(budget || "");
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const level = pct >= 100 ? "over" : pct >= 80 ? "warn" : "ok";
  return (
    <div className="panel">
      <h2>Monthly budget</h2>
      <div className="row">
        <input type="number" min="0" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Set budget in INR" />
        <button onClick={() => setBudget(Number(draft) || 0)}>Save budget</button>
      </div>
      {budget > 0 ? (
        <>
          <div className="bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
            <div className={`bar-fill ${level}`} style={{ width: `${pct}%` }} />
          </div>
          <p>{formatINR(spent)} of {formatINR(budget)} spent ({pct}%)</p>
          {level === "warn" && <p className="error">You have used over 80% of this month's budget.</p>}
          {level === "over" && <p className="error">You are over budget by {formatINR(spent - budget)}.</p>}
        </>
      ) : (
        <p className="muted">Set a budget to track your progress.</p>
      )}
    </div>
  );
}