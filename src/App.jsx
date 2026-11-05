import { useState, useMemo, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import FilterBar from "./components/FilterBar";
import BudgetCard from "./components/BudgetCard";
import DonutChart from "./components/DonutChart";
import BarChart from "./components/BarChart";
import InsightsPanel from "./components/InsightsPanel";
import { currentMonthKey, monthKey, totalsByCategory, exportCSV } from "./utils/helpers";

export default function App() {
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [budget, setBudget] = useLocalStorage("budget", 0);
  const [dark, setDark] = useLocalStorage("dark", false);
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", from: "", to: "" });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const saveExpense = (exp) => {
    setExpenses((list) => (editing ? list.map((e) => (e.id === exp.id ? exp : e)) : [exp, ...list]));
    setEditing(null);
  };
  const deleteExpense = (id) => {
    if (window.confirm("Delete this expense?")) setExpenses((list) => list.filter((e) => e.id !== id));
  };

  const thisMonth = useMemo(() => expenses.filter((e) => monthKey(e.date) === currentMonthKey()), [expenses]);
  const spent = thisMonth.reduce((s, e) => s + e.amountINR, 0);

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => (filters.category ? e.category === filters.category : true))
        .filter((e) => (filters.search ? e.note.toLowerCase().includes(filters.search.toLowerCase()) : true))
        .filter((e) => (filters.from ? e.date >= filters.from : true))
        .filter((e) => (filters.to ? e.date <= filters.to : true))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, filters]
  );

  return (
    <div className="app">
      <header>
        <h1>Smart Expense Tracker</h1>
        <nav>
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab === "expenses" ? "active" : ""} onClick={() => setTab("expenses")}>Expenses</button>
          <button onClick={() => setDark(!dark)}>{dark ? "Light mode" : "Dark mode"}</button>
        </nav>
      </header>

      {tab === "dashboard" && (
        <main className="grid">
          <BudgetCard budget={budget} setBudget={setBudget} spent={spent} />
          <InsightsPanel expenses={expenses} />
          <DonutChart totals={totalsByCategory(thisMonth)} />
          <BarChart expenses={expenses} />
        </main>
      )}

      {tab === "expenses" && (
        <main className="split">
          <ExpenseForm editing={editing} onSave={saveExpense} onCancel={() => setEditing(null)} />
          <section>
            <FilterBar filters={filters} setFilters={setFilters} />
            <div className="toolbar">
              <span>{filtered.length} expenses</span>
              <button onClick={() => exportCSV(filtered)} disabled={!filtered.length}>Export CSV</button>
            </div>
            <ExpenseList expenses={filtered} onEdit={setEditing} onDelete={deleteExpense} />
          </section>
        </main>
      )}
    </div>
  );
}