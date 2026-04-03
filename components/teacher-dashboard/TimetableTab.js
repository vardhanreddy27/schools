import { todayClasses } from "@/components/teacher-dashboard/data";

function SectionHeader({ title, tone = "morning" }) {
  const toneClass = tone === "afternoon" ? "bg-orange-500 text-white" : "bg-[#00b5ffd6] text-white";

  return (
    <p className={`border-b border-slate-100 px-4 py-3 uppercase tracking-[0.2em] ${toneClass}`}>
      {title}
    </p>
  );
}

export default function TeacherTimetableTab() {
  // Enhanced filtering logic
  const morningPeriods = todayClasses.filter(cls => {
    const timeStr = cls.time.toLowerCase();
    return timeStr.includes("am") || (timeStr.startsWith("12") && !timeStr.includes("pm"));
  });

  const afternoonPeriods = todayClasses.filter(cls => {
    const timeStr = cls.time.toLowerCase();
    return timeStr.includes("pm") && !timeStr.startsWith("12:00");
  });

  return (
    <section className="space-y-6 px-3 pt-2 font-sans">
      <header className="px-1">
        <p className="text-sm font-medium text-slate-500">Weekly Schedule</p>
        <h2 className="text-[28px] font-black text-slate-900 leading-tight">
Morning and afternoon plan
        </h2>
      </header>

  <div className="mt-4 rounded-2xl border border-slate-200 bg-[#eef7ff] px-4 py-3 text-sm text-slate-700">
          Morning prayer: 08:45 AM to 09:00 AM (Everyday)
        </div>
      {/* MORNING SESSIONS */}
      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm">
        <SectionHeader title="Morning Sessions" tone="morning" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3 text-center">Period</th>
                <th className="px-3 py-3 text-center">Class</th>
                <th className="px-3 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {morningPeriods.map((cls) => (
                <tr key={cls.period} className="hover:bg-slate-50/50 transition-colors">
                  {/* Text Centered */}
                  <td className="px-3 py-3 text-center  text-xs font-bold">
                    {cls.period}
                  </td>
                  {/* Text Centered */}
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {cls.className}-{cls.section}
                    </span>
                  </td>
                  {/* Time kept Right-Aligned for readability */}
                  <td className="px-3 py-3 text-right text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {cls.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lunch Break Pill */}
      <div className="rounded-3xl border border-slate-100 bg-[#f8fafc] px-6 py-4 text-center">
        <p className="text-sm font-bold text-slate-500">
          Lunch break: 12:00 PM to 12:45 PM
        </p>
      </div>

      {/* AFTERNOON SESSIONS */}
      <div className="overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-sm">
        <SectionHeader title="Afternoon Sessions" tone="afternoon" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3 text-center">Period</th>
                <th className="px-3 py-3 text-center">Class</th>
                <th className="px-3 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {afternoonPeriods.map((cls) => (
                <tr key={cls.period} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-3 py-3 text-center text-xs font-bold text-slate-900">
                    {cls.period}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {cls.className}-{cls.section}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {cls.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}