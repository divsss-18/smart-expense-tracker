import { CATEGORIES } from "../utils/categories";

export default function FilterBar({ filters, setFilters }) {
  const set = (k, v) => setFilters({ ...filters, [k]: v });
  return (
    <div className="panel filters">
      <input placeholder="Search notes" value={filters.search} onChange={(e) => set("search", e.target.value)} />
      <select value={filters.category} onChange={(e) => set("category", e.target.value)}>
        <option value="">All categories</option>
        {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
      </select>
      <input type="date" value={filters.from} onChange={(e) => set("from", e.target.value)} aria-label="From date" />
      <input type="date" value={filters.to} onChange={(e) => set("to", e.target.value)} aria-label="To date" />
    </div>
  );
}