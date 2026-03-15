import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

export default function TimetableView({ assignments, onReassign }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingSelection, setPendingSelection] = useState({});

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return assignments;
    }

    return assignments.filter((item) => {
      return [
        item.className,
        item.section,
        item.period,
        item.subject,
        item.previousTeacher,
        item.previousTeacherSubject,
        item.replacementTeacher,
        item.replacementTeacherSubject,
        item.reasonType,
        item.reason,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [assignments, query]);

  const lateCount = assignments.filter((item) => item.reasonType === "Late").length;
  const absentCount = assignments.filter((item) => item.reasonType === "Absent").length;
  const reassignedCount = assignments.filter((item) => item.status === "Reassigned by Principal").length;

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <section className="mt-4">
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Timetable and substitution</p>
        <h2 className="mt-1 text-2xl font-semibold">Auto allocation for late or absent teachers</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#fff8dc] p-4 ring-1 ring-[#f7e2a3]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8b6400]">Late teachers</p>
            <p className="mt-2 text-3xl font-bold text-[#6f5221]">{lateCount}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700">Absent teachers</p>
            <p className="mt-2 text-3xl font-bold text-rose-800">{absentCount}</p>
          </div>
          <div className="rounded-2xl bg-[#fff8dc] p-4 ring-1 ring-[#f7e2a3]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8b6400]">Principal changes</p>
            <p className="mt-2 text-3xl font-bold text-[#6f5221]">{reassignedCount}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by class, teacher, reason or status"
            className="min-w-[16rem] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
          />
          <span className="rounded-full bg-[#fff8dc] px-3 py-1 text-xs font-semibold text-[#8b6400]">
            {filtered.length} records
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {paginated.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{row.className} • Section {row.section} • {row.period}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{row.subject}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.reasonType === "Late" ? "bg-[#fff8dc] text-[#8b6400]" : "bg-rose-50 text-rose-700"}`}>
                    {row.reasonType}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Reassigned by Principal" ? "bg-[#fff8dc] text-[#8b6400]" : "bg-emerald-50 text-emerald-700"}`}>
                    {row.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-slate-600 lg:grid-cols-[1fr_1fr_auto]">
                <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Original</p>
                  <p className="mt-2 font-semibold text-slate-900">{row.previousTeacher}</p>
                  <p className="mt-1">Subject: {row.previousTeacherSubject}</p>
                  <p>Reason: {row.reason}</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Allocated</p>
                  <p className="mt-2 font-semibold text-slate-900">{row.replacementTeacher}</p>
                  <p className="mt-1">From subject: {row.previousTeacherSubject}</p>
                  <p>To subject: {row.replacementTeacherSubject}</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Principal action</p>
                  <select
                    value={pendingSelection[row.id] ?? row.replacementTeacher}
                    onChange={(event) => setPendingSelection((prev) => ({ ...prev, [row.id]: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-2 py-2 text-xs"
                  >
                    {row.replacementOptions.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => onReassign(row.id, pendingSelection[row.id] ?? row.replacementTeacher)}
                    className="mt-2 w-full rounded-lg bg-[#f2b705] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d9a300]"
                  >
                    Save change
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
