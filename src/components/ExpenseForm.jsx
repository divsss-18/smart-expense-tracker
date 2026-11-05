import { useState, useEffect } from "react";
import { CATEGORIES, suggestCategory } from "../utils/categories";
import { CURRENCIES, getRateToINR } from "../utils/currency";

const today = () => new Date().toISOString().slice(0, 10);
const empty = { amount: "", currency: "INR", category: "Food", date: today(), note: "" };

export default function ExpenseForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [touchedCategory, setTouchedCategory] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    if (editing) {
      setForm({ amount: editing.amount, currency: editing.currency, category: editing.category, date: editing.date, note: editing.note });
      setTouchedCategory(true);
    } else {
      setForm(empty);
      setTouchedCategory(false);
    }
  }, [editing]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const onNote = (value) => {
    set("note", value);
    if (!touchedCategory) {
      const guess = suggestCategory(value);
      if (guess) set("category", guess);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return setStatus({ loading: false, error: "Enter an amount greater than 0." });
    setStatus({ loading: true, error: "" });
    try {
      const rate = await getRateToINR(form.currency);
      onSave({ ...form, amount, amountINR: amount * rate, id: editing ? editing.id : Date.now() });
      setForm({ ...empty, date: today() });
      setTouchedCategory(false);
      setStatus({ loading: false, error: "" });
    } catch {
      setStatus({ loading: false, error: "Exchange rate failed to load. Check your internet or use INR." });
    }
  };

  return (
    <form className="panel form" onSubmit={submit}>
      <h2>{editing ? "Edit expense" : "Add expense"}</h2>
      <label>
        Note
        <input value={form.note} onChange={(e) => onNote(e.target.value)} placeholder="e.g. petrol for Hyderabad trip" />
      </label>
      <div className="row">
        <label>
          Amount
          <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
        </label>
        <label>
          Currency
          <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <div className="row">
        <label>
          Category
          <select value={form.category} onChange={(e) => { set("category", e.target.value); setTouchedCategory(true); }}>
            {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </label>
      </div>
      {status.error && <p className="error" role="alert">{status.error}</p>}
      <div className="row">
        <button className="primary" disabled={status.loading}>
          {status.loading ? "Converting..." : editing ? "Save changes" : "Add expense"}
        </button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}