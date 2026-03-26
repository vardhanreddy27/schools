import { childTimetable } from "./data";

export default function ParentTimetableTab() {
  return (
    <div className="space-y-6 py-6">
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">DAILY CLASS SCHEDULE</h3>
        <div className="space-y-4">
          {childTimetable.map((daySchedule, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="bg-[#fff4d6] px-4 py-3 border-b border-slate-200">
                <h4 className="font-semibold text-slate-950">{daySchedule.day}day</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {daySchedule.periods.map((period, pIdx) => (
                  <div key={pIdx} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c79216] text-sm font-bold text-white">
                        P{pIdx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{period}</p>
                        <p className="text-xs text-slate-500">Period {pIdx + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* School Timings */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-4">SCHOOL TIMINGS</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-700">School Opening</span>
            <span className="font-semibold text-slate-900">08:40 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Lunch Break</span>
            <span className="font-semibold text-slate-900">11:30 AM - 12:15 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-700">School Closure</span>
            <span className="font-semibold text-slate-900">04:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Each Period</span>
            <span className="font-semibold text-slate-900">45 minutes</span>
          </div>
        </div>
      </section>

      {/* Tips for Parents */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Parent Tips</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-amber-600 font-bold">→</span>
            Ensure child arrives at school by 8:30 AM
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 font-bold">→</span>
            Pack lunch & water bottle daily (especially for gap between P3 & P5)
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 font-bold">→</span>
            Check the timetable weekly for any class changes
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600 font-bold">→</span>
            Arrange transport for 4:00 PM school closure time
          </li>
        </ul>
      </section>
    </div>
  );
}
