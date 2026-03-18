import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { attendanceWindows, sectionWiseAttendance } from "@/components/admin-dashboard/data";

export default function AttendanceView() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [activeSectionId, setActiveSectionId] = useState(sectionWiseAttendance[0]?.id ?? null);
  const pageSize = 8;

  const filteredSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return sectionWiseAttendance;
    }

    return sectionWiseAttendance.filter((row) => {
      return [row.className, row.section, row.studentsMorning, row.studentsEvening, row.boysMorning, row.girlsMorning]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [query]);

  const totalPages = Math.max(Math.ceil(filteredSections.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pagedSections = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSections.slice(start, start + pageSize);
  }, [filteredSections, safePage]);

  const activeSection = sectionWiseAttendance.find((item) => item.id === activeSectionId) || pagedSections[0] || null;

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Daily attendance windows</p>
        <h2 className="mt-1 text-2xl font-semibold">Morning and evening attendance</h2>

        <div className="mt-5 min-w-0 min-h-64 h-64 rounded-3xl bg-slate-50 p-4 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceWindows} barGap={14}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="studentsPresent" name="Students Present" fill="#f2b705" radius={[8, 8, 0, 0]} />
              <Bar dataKey="teachersPresent" name="Teachers Present" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff8dc] px-3 py-1 text-[#8b6400]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f2b705]" />
            Students
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Teachers
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {attendanceWindows.map((item) => (
            <div key={item.period} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{item.period}</p>
              <p className="mt-1 text-sm text-slate-600">Students: {item.studentsPresent}/{item.studentsTotal}</p>
              <p className="text-sm text-slate-600">Teachers: {item.teachersPresent}/{item.teachersTotal}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Teachers attendance mode</p>
        <h2 className="mt-1 text-xl font-semibold">Geo-fence configuration</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-700">Device readiness</p>
            <p className="mt-1">96% teacher devices are geo-fence ready.</p>
          </div>
          <div className="rounded-2xl bg-[#fff8dc] p-4">
            <p className="font-semibold text-[#8b6400]">Pending setup</p>
            <p className="mt-1">2 teachers need location permission update.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-700">Logs per day</p>
            <p className="mt-1">Morning once and evening once for both teachers and students.</p>
          </div>
        </div>
      </article>

      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Section attendance (a/b/c/d)</p>
        <h2 className="mt-1 text-2xl font-semibold">Present count by section</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by class or section"
            className="min-w-56 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
          />
          <span className="rounded-full bg-[#fff8dc] px-3 py-1 text-xs font-semibold text-[#8b6400]">
            {filteredSections.length} sections
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Class</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 font-medium">Students Morning</th>
                  <th className="px-3 py-2 font-medium">Students Evening</th>
                  <th className="px-3 py-2 font-medium">Teachers Morning</th>
                  <th className="px-3 py-2 font-medium">Teachers Evening</th>
                </tr>
              </thead>
              <tbody>
                {pagedSections.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setActiveSectionId(row.id)}
                    className={`cursor-pointer border-t border-slate-100 text-slate-700 hover:bg-[#fff8dc]/50 ${
                      activeSectionId === row.id ? "bg-[#fff8dc]/60" : ""
                    }`}
                  >
                    <td className="px-3 py-3">{row.className}</td>
                    <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                    <td className="px-3 py-3">{row.studentsMorning}</td>
                    <td className="px-3 py-3">{row.studentsEvening}</td>
                    <td className="px-3 py-3">{row.teachersMorning}</td>
                    <td className="px-3 py-3">{row.teachersEvening}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <div className="rounded-2xl bg-[#fff8dc] p-4">
            <p className="text-sm font-semibold text-[#8b6400]">Selected section details</p>
            {activeSection ? (
              <>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{activeSection.className} - Section {activeSection.section}</h3>
                <p className="text-sm text-slate-600">Click any section row to inspect boys and girls attendance.</p>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="font-semibold text-slate-900">Morning</p>
                    <p className="text-slate-700">Boys: {activeSection.boysMorning}</p>
                    <p className="text-slate-700">Girls: {activeSection.girlsMorning}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="font-semibold text-slate-900">Evening</p>
                    <p className="text-slate-700">Boys: {activeSection.boysEvening}</p>
                    <p className="text-slate-700">Girls: {activeSection.girlsEvening}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No section available for this filter.</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
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
