import { studentTimetable } from "@/components/student-dashboard/data";

export default function TimetableTab() {
  const sampleDay = studentTimetable[0];
  const morningPeriods = [
    { label: "P1", time: "09:00 AM - 10:00 AM", subject: sampleDay?.periods?.[0] || "-" },
    { label: "P2", time: "10:00 AM - 11:00 AM", subject: sampleDay?.periods?.[1] || "-" },
    { label: "P3", time: "11:00 AM - 12:00 PM", subject: sampleDay?.periods?.[2] || "-" },
  ];
  const afternoonPeriods = [
    { label: "P4", time: "12:45 PM - 01:45 PM", subject: sampleDay?.periods?.[3] || "-" },
    { label: "P5", time: "01:45 PM - 02:45 PM", subject: sampleDay?.periods?.[4] || "-" },
    { label: "P6", time: "02:45 PM - 03:45 PM", subject: sampleDay?.periods?.[5] || "-" },
    { label: "P7", time: "03:45 PM - 04:30 PM", subject: sampleDay?.periods?.[6] || "-" },
  ];

  return (
    <section className="mt-4">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Weekly timetable</p>
        <h2 className="mt-1 text-2xl font-semibold">Morning and afternoon plan</h2>

       

        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#eef7ff] px-4 py-3 text-sm text-slate-700">
          Morning prayer: 08:45 AM to 09:00 AM (Everyday)
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Morning</p>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {morningPeriods.map((period) => (
                <tr key={`morning-${period.label}`} className="border-t border-slate-100 text-slate-700 hover:bg-[#fff4d6]/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{period.label}</td>
                  <td className="px-3 py-3">{period.subject}</td>
                  <td className="px-3 py-3 text-slate-600">{period.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-slate-700">
          Lunch break: 12:00 PM to 12:45 PM
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
          <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Afternoon</p>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {afternoonPeriods.map((period) => (
                <tr key={`afternoon-${period.label}`} className="border-t border-slate-100 text-slate-700 hover:bg-[#fff4d6]/40">
                  <td className="px-3 py-3 font-semibold text-slate-900">{period.label}</td>
                  <td className="px-3 py-3">{period.subject}</td>
                  <td className="px-3 py-3 text-slate-600">{period.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
