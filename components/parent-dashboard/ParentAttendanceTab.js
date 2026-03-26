import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { attendanceMonthly, attendanceLog } from "./data";

export default function ParentAttendanceTab() {
  const totalDays = attendanceMonthly.reduce((sum, week) => sum + week.present + week.absent, 0);
  const totalPresent = attendanceMonthly.reduce((sum, week) => sum + week.present, 0);
  const attendancePercentage = Math.round((totalPresent / totalDays) * 100);

  return (
    <div className="space-y-6 py-6">
      {/* Attendance Overview */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
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
            <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />
            <p className="text-sm text-rose-800 font-medium">
              Attendance is below 75%. Follow up on absences.
            </p>
          </div>
        )}
      </section>

      {/* Weekly Attendance Chart */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">WEEKLY BREAKDOWN</h3>
        <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0 ${
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
              <div className="text-right flex-shrink-0">
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
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
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
