import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { AlertTriangle } from "lucide-react";
import { attendanceMonthly, attendanceLog } from "./data";

function WeeklyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const present = payload[0]?.value ?? 0;
  const weekData = payload[0]?.payload || {};
  const absent = weekData.absent ?? 0;
  const total = present + absent;
  const percent = Math.round((present / Math.max(1, total)) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-700">Present: {present} days</p>
      <p className="text-sm font-semibold text-rose-600">Absent: {absent} days</p>
      <p className="mt-1 text-xs text-slate-500">Weekly attendance: {percent}%</p>
    </div>
  );
}

export default function ParentAttendanceTab() {
  const totalDays = attendanceMonthly.reduce((sum, week) => sum + week.present + week.absent, 0);
  const totalPresent = attendanceMonthly.reduce((sum, week) => sum + week.present, 0);
  const attendancePercentage = Math.round((totalPresent / totalDays) * 100);
  const attendanceWeekly = attendanceMonthly.map((week) => ({
    ...week,
    attendancePct: Math.round((week.present / Math.max(1, week.present + week.absent)) * 100),
  }));

  return (
    <div className="space-y-6 py-6">
      {/* Attendance Overview */}
      <section className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-4">ATTENDANCE OVERVIEW</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-600 font-medium">Attendance %</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{attendancePercentage}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium">Present Days</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{totalPresent}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium">Absent Days</p>
            <p className="mt-2 text-3xl font-bold text-rose-600">{totalDays - totalPresent}</p>
          </div>
        </div>
        {attendancePercentage < 75 && (
          <div className="mt-4 flex gap-2 rounded-lg bg-rose-100 p-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-800 font-medium">
              Attendance is below 75%. Follow up on absences.
            </p>
          </div>
        )}
      </section>

      {/* Weekly Attendance Chart */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">WEEKLY PRESENT GRAPH</h3>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Present days by week</p>
            <p className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Target: 5+ days</p>
          </div>

          <div className="h-60 w-full rounded-xl bg-linear-to-b from-white to-slate-50/80 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeekly} barGap={12}>
                <defs>
                  <linearGradient id="presentBarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.88} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 6, 7]} tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="4 4" />
                <Tooltip content={<WeeklyTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="present" fill="url(#presentBarFill)" radius={[12, 12, 8, 8]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {attendanceWeekly.map((week) => (
              <div key={week.label} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-500">{week.label}</p>
                <p className="text-sm font-semibold text-slate-900">{week.attendancePct}% present</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Attendance Log */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">DAILY LOG</h3>
        <div className="space-y-2">
          {attendanceLog.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg p-3 ${
                log.status === "Present"
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-rose-50 border border-rose-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    log.status === "Present" ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                >
                  {log.status === "Present" ? "✓" : "✕"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(log.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-600">{log.note}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-sm font-semibold ${log.status === "Present" ? "text-emerald-700" : "text-rose-700"}`}>
                  {log.status}
                </p>
                {log.checkIn !== "-" && (
                  <p className="text-xs text-slate-600">{log.checkIn}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance Tips */}
      <section className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Important Notes</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            Regular attendance ensures better academic performance
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            School requires minimum 75% attendance
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            Inform office in advance for planned absences
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            Medical certificates needed for extended absence
          </li>
        </ul>
      </section>
    </div>
  );
}
