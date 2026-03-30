import { studentAssignments, studentAnnouncements, studentTodaySchedule, subjectProgress } from "@/components/student-dashboard/data";

function HalfProgressGauge({ value }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="mx-auto mt-1 w-full max-w-36 sm:max-w-40">
      <svg viewBox="0 0 120 80" className="h-auto w-full" aria-hidden="true">
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${clamped} 100`}
        />
        <text
          x="60"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-950 text-[20px] font-semibold sm:text-[24px]"
        >
          {clamped}%
        </text>
      </svg>
    </div>
  );
}

export default function HomeTab() {
  const pendingHomework = studentAssignments.filter((item) => item.status !== "Submitted");
  const homeworkPreviewItems = pendingHomework.slice(0, 3);
  const announcementsPreviewItems = [
    "Maths - Mr. Rakesh: Submit algebra worksheet by tomorrow.",
    "Science - Ms. Nisha: Bring lab record for correction.",
    "Principal - Mrs. Kavitha (Principal): Parents meeting this Friday at 10:00 AM.",
  ];
  const averageScore = Math.round(
    subjectProgress.reduce((sum, item) => sum + item.score, 0) / Math.max(subjectProgress.length, 1)
  );
  const orderedSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];
  const subjectScoreMap = subjectProgress.reduce((map, item) => {
    map[item.subject] = item.score;
    return map;
  }, {});
  const subjectBars = orderedSubjects.map((subject) => ({
    subject,
    score: subjectScoreMap[subject] ?? 0,
  }));
  const chartBarColors = [
    "bg-amber-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  const weakSubjects = [...subjectProgress]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => item.subject)
    .join(", ");

  return (
    <>
      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <h2 className="mt-1 text-2xl font-semibold">Subject Performance</h2>

        <div className="mt-4 rounded-3xl py-3 pe-3">
          <div className="grid grid-cols-[2.8rem_1fr]">
            <div className="flex h-52 items-center justify-center text-[11px] font-semibold text-slate-500">
              <span style={{ writingMode: "vertical-rl" }} className="-rotate-180 text-center">
                Percentage (%) of marks scored
              </span>
            </div>

            <div>
              <div className="relative h-52">
                <div className="relative z-10 grid h-full grid-cols-6 items-end gap-2">
                  {subjectBars.map((item, index) => (
                    <div key={item.subject} className="flex h-full flex-col items-center justify-end gap-1">
                      <span className="text-[11px] font-semibold text-slate-700">{item.score}%</span>
                      <div
                        className={`w-full rounded-t-lg border border-slate-300/70 transition-all duration-300 ${chartBarColors[index % chartBarColors.length]}`}
                        style={{ height: `${Math.max(item.score, 10)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-slate-600">
                {subjectBars.map((item) => (
                  <span key={item.subject}>{item.subject.slice(0, 3)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-slate-900">Key Metrics</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Quiz Performance</p>
            <div className="flex items-center justify-center">
              <HalfProgressGauge value={averageScore} />
            </div>
            <p className="inline-flex self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Average quiz score
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Homework Due</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{homeworkPreviewItems.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-amber-50/90 p-2 ring-1 ring-amber-100">
                {homeworkPreviewItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={`${item.subject}: ${item.title}`}>
                      {item.subject}: {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">
              Pending Tasks 
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Announcements</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{announcementsPreviewItems.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-rose-50/90 p-2 ring-1 ring-rose-100">
                {announcementsPreviewItems.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={item}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Latest school updates
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Weak Subjects</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold leading-tight text-slate-950 sm:text-xl">{weakSubjects || "None"}</p>
            </div>
            <p className="inline-flex self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Need extra focus
            </p>
          </article>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Today schedule</p>
          <h2 className="mt-1 text-2xl font-semibold">Classes and rooms</h2>
          <div className="mt-4 space-y-3">
            {studentTodaySchedule.map((slot) => (
              <div key={`${slot.period}-${slot.subject}`} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{slot.period} • {slot.subject}</p>
                  <p className="text-xs font-semibold text-slate-500">{slot.time}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{slot.teacher}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Homework tracker</p>
          <h2 className="mt-1 text-2xl font-semibold">Pending and submitted</h2>
          <div className="mt-4 space-y-2">
            {studentAssignments.slice(0, 4).map((work) => (
              <div key={work.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{work.subject}: {work.title}</p>
                  <p className="text-xs text-slate-500">Due: {work.dueDate}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${work.status === "Submitted" ? "bg-emerald-50 text-emerald-700" : "bg-[#fff4d6] text-[#8b6400]"}`}>
                  {work.status}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Announcements</p>
        <h2 className="mt-1 text-2xl font-semibold">Latest updates</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {studentAnnouncements.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4d6] text-[#8b6400]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{item.time}</p>
                </div>
                <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
