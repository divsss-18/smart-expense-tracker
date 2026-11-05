import { buildInsights } from "../utils/helpers";

export default function InsightsPanel({ expenses }) {
  return (
    <div className="panel">
      <h2>Insights</h2>
      <ul className="insights">
        {buildInsights(expenses).map((text, i) => <li key={i}>{text}</li>)}
      </ul>
    </div>
  );
}