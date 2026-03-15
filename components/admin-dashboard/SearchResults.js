export default function SearchResults({ results, onSelect }) {
  if (!results.length) {
    return null;
  }

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search Results</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((item) => (
          <button
            key={`${item.tab}-${item.title}`}
            type="button"
            onClick={() => onSelect(item.tab)}
            className="rounded-xl bg-white px-3 py-2 text-left text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-[#fff8dc]"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
