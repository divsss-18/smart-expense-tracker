import { CATEGORIES } from "../utils/categories";
import { formatINR } from "../utils/currency";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <div className="panel empty">No expenses match. Add one using the form.</div>;
  }
  return (
    <ul className="panel list">
      {expenses.map((e) => (
        <li key={e.id}>
          <span className="dot" style={{ background: CATEGORIES[e.category] }} />
          <div className="grow">
            <strong>{e.note || e.category}</strong>
            <small>{e.category} on {e.date}</small>
          </div>
          <div className="amount">
            {formatINR(e.amountINR)}
            {e.currency !== "INR" && <small>{e.amount} {e.currency}</small>}
          </div>
          <button onClick={() => onEdit(e)}>Edit</button>
          <button className="danger" onClick={() => onDelete(e.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}