import { attendanceLog, attendanceMonthly } from "@/components/student-dashboard/data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AttendanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const present = payload[0]?.value ?? 0;
  const weekData = payload[0]?.payload || {};
  const absent = weekData.absent ?? 0;
  const attendancePercent = Math.round((present / Math.max(1, present + absent)) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-700">Present: {present} days</p>
      <p className="text-sm font-semibold text-rose-600">Absent: {absent} days</p>
      <p className="mt-1 text-xs text-slate-500">Attendance: {attendancePercent}%</p>
    </div>
  );
}

export default function AttendanceTab() {
  const totalPresent = attendanceMonthly.reduce((sum, week) => sum + week.present, 0);
  const totalAbsent = attendanceMonthly.reduce((sum, week) => sum + week.absent, 0);
  const overallAttendance = Math.round((totalPresent / Math.max(1, totalPresent + totalAbsent)) * 100);
  const attendanceWeekly = attendanceMonthly.map((week) => ({
    ...week,
    attendancePct: Math.round((week.present / Math.max(1, week.present + week.absent)) * 100),
  }));

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Monthly attendance</p>
            <h2 className="mt-1 text-2xl font-semibold">Weekly present graph</h2>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
            <p className="text-xs font-medium text-emerald-700">Overall attendance</p>
            <p className="text-2xl font-bold text-emerald-700">{overallAttendance}%</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3">
          <div>
            <p className="text-xs text-slate-500">Present</p>
            <p className="text-lg font-semibold text-emerald-700">{totalPresent}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Absent</p>
            <p className="text-lg font-semibold text-rose-600">{totalAbsent}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Target</p>
            <p className="text-lg font-semibold text-slate-900">75%</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Present days by week</p>
            <p className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Target: 5+ days</p>
          </div>

          <div className="h-64 rounded-2xl bg-linear-to-b from-white to-slate-50/80 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeekly} barGap={12}>
                <defs>
                  <linearGradient id="studentPresentBarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity={0.88} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#dbe3f0" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 6, 7]} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="4 4" />
                <Tooltip content={<AttendanceTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="present" fill="url(#studentPresentBarFill)" radius={[12, 12, 8, 8]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {attendanceWeekly.map((week) => (
              <div key={week.label} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                <p className="text-xs font-medium text-slate-500">{week.label}</p>
                <p className="text-sm font-semibold text-slate-900">{week.attendancePct}% present</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Daily log</p>
        <h2 className="mt-1 text-2xl font-semibold">Recent attendance</h2>
        <div className="mt-4 space-y-2">
          {attendanceLog.map((row) => (
            <div key={row.date} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{row.date}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Present" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {row.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Check-in: {row.checkIn}</p>
              <p className="text-xs text-slate-500">{row.note}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
