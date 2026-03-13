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
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Daily attendance windows</p>
        <h2 className="mt-1 text-2xl font-semibold">Morning and evening attendance</h2>

        <div className="mt-5 min-w-0 min-h-[16rem] h-64 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceWindows} barGap={14}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="studentsPresent" name="Students Present" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="teachersPresent" name="Teachers Present" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {attendanceWindows.map((item) => (
            <div key={item.period} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">{item.period}</p>
              <p className="mt-1 text-sm text-slate-600">Students: {item.studentsPresent}/{item.studentsTotal}</p>
              <p className="text-sm text-slate-600">Teachers: {item.teachersPresent}/{item.teachersTotal}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Teachers attendance mode</p>
        <h2 className="mt-1 text-xl font-semibold">Geo-fence configuration</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <p className="font-semibold text-emerald-700">Device readiness</p>
            <p className="mt-1">96% teacher devices are geo-fence ready.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="font-semibold text-amber-700">Pending setup</p>
            <p className="mt-1">2 teachers need location permission update.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-700">Logs per day</p>
            <p className="mt-1">Morning once and evening once for both teachers and students.</p>
          </div>
        </div>
      </article>

      <article className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Section attendance (A/B/C)</p>
        <h2 className="mt-1 text-2xl font-semibold">Present count by section</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Section</th>
                <th className="px-3 py-2 font-medium">Students Morning</th>
                <th className="px-3 py-2 font-medium">Students Evening</th>
                <th className="px-3 py-2 font-medium">Teachers Morning</th>
                <th className="px-3 py-2 font-medium">Teachers Evening</th>
              </tr>
            </thead>
            <tbody>
              {sectionWiseAttendance.map((row) => (
                <tr key={row.section} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-3 py-3 text-slate-700">{row.morning}</td>
                  <td className="px-3 py-3 text-slate-700">{row.evening}</td>
                  <td className="px-3 py-3 text-slate-700">{row.teachersMorning}</td>
                  <td className="px-3 py-3 text-slate-700">{row.teachersEvening}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
