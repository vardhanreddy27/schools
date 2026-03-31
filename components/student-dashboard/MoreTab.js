import { studentProfileDefaults, studentResources, attendanceMonthly, attendanceLog } from "@/components/student-dashboard/data";
import { X, BookOpen } from "lucide-react"; // Added BookOpen for consistency if you add icons later

export default function MoreTab({ profile, onProfileChange, onProfileSave, profileSaving }) {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const totalDays = attendanceLog.length;
  const presentDays = attendanceLog.filter((log) => log.status === "Present").length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <>
      <section className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Calendar Card */}
          <article className="rounded-3xl bg-linear-to-br from-green-400 to-emerald-600 p-6 shadow-lg flex flex-col gap-2 text-white relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold">Academic Calendar</p>
                <p className="text-xs opacity-90 mt-1">View important academic dates and holidays.</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 self-end rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-white transition-colors"
            >
              View Calendar
            </button>
          </article>

          {/* Leave Request Card */}
          <article className="rounded-3xl bg-linear-to-br from-yellow-400 to-amber-500 p-6 shadow-lg flex flex-col gap-2 text-white relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold">Leave Request</p>
                <p className="text-xs opacity-90 mt-1">Submit a request for leave to your class teacher.</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 self-end rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm hover:bg-white transition-colors"
            >
              Request Leave
            </button>
          </article>

          {/* Report Card */}
          <article className="rounded-3xl bg-linear-to-br from-blue-500 to-indigo-700 p-6 shadow-lg flex flex-col gap-2 text-white relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold">Report Card</p>
                <p className="text-xs opacity-90 mt-1">View or download your latest report card.</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 self-end rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-white transition-colors"
            >
              View Report Card
            </button>
          </article>

          {/* Exams Card */}
          <article className="rounded-3xl bg-linear-to-br from-pink-500 to-rose-500 p-6 shadow-lg flex flex-col gap-2 text-white relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold">View Exams</p>
                <p className="text-xs opacity-90 mt-1">See upcoming and past exam schedules.</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 self-end rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-white transition-colors"
            >
              View Exams
            </button>
          </article>

          {/* NEW: Syllabus Card */}
          <article className="rounded-3xl bg-linear-to-br from-purple-500 to-violet-700 p-6 shadow-lg flex flex-col gap-2 text-white relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold">Syllabus</p>
                <p className="text-xs opacity-90 mt-1">Track your curriculum and subject topics.</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 self-end rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm hover:bg-white transition-colors"
            >
              View Syllabus
            </button>
          </article>
        </div>

        {/* Notes and Resources Card */}
        <article className="rounded-3xl bg-white p-6 shadow-lg mt-6">
          <p className="text-sm text-slate-500">Notes and resources</p>
          <h2 className="mt-1 text-2xl font-semibold">Notes and files</h2>
          <div className="mt-5">
            <ul className="space-y-2">
              {studentResources.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <span className="rounded-full bg-[#fff4d6] px-2 py-1 text-xs font-semibold text-[#8b6400]">{item.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </>
  );
}