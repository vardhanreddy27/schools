import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { teacherSections } from "@/components/teacher-dashboard/data";
import { menuItems } from "@/components/teacher-dashboard/TeacherNav";

const avatarPool = ["/student.jpeg", "/student1.png", "/student2.png", "/student3.png", "/student4.png"];

function getRankedStudents(list) {
  return [...list].sort((a, b) => b.subjectPerformance - a.subjectPerformance);
}

export default function TeacherSectionDetailsPage() {
  const router = useRouter();
  const { sectionId } = router.query;
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState("");

  const section = teacherSections.find((item) => item.id === sectionId);
  const studentPerformance = section?.studentPerformance || [];
  const studentsWithMeta = studentPerformance.map((student, index) => ({
    ...student,
    rollNo: `${section?.className || ""}${section?.section || ""}${String(index + 1).padStart(2, "0")}`,
    avatar: avatarPool[index % avatarPool.length],
  }));

  if (!section) {
    return (
      <main className="min-h-dvh bg-white px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">Section not found</p>
          <h1 className="mt-2 text-2xl font-bold">Unable to load section details</h1>
          <Link
            href="/Teacherdashboard"
            className="mt-4 inline-block rounded-xl bg-[var(--app-accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(studentsWithMeta.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedStudents = studentsWithMeta.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const ranked = getRankedStudents(studentsWithMeta);
  const topPerformers = ranked.slice(0, 3);
  const weakPerformers = ranked.filter((student) => student.subjectPerformance < 60);
  const lowAttendance = studentsWithMeta.filter((student) => student.attendance < 75);
  const taskDates = [
    { day: "27", month: "Apr" },
    { day: "29", month: "Apr" },
    { day: "02", month: "May" },
    { day: "05", month: "May" },
  ];

  function getDashboardHref(menuId) {
    return `/Teacherdashboard?tab=${menuId}`;
  }

  function handleNotifyParent(studentName) {
    setActionMessage(`Parent notified for ${studentName}.`);
  }

  function handleAssignTask(studentName) {
    setActionMessage(`Improvement task assigned to ${studentName}.`);
  }

  return (
    <main className="min-h-dvh bg-white text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur sm:px-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/Teacherdashboard"
              className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500 hover:text-slate-700"
            >
              Back
            </Link>
            <h1 className="text-lg font-bold sm:text-xl">Section Details</h1>
            <span className="text-[11px] font-semibold text-slate-500">Teacher View</span>
          </div>
        </div>
      </div>

      <div className="page-enter mx-auto max-w-6xl space-y-5 px-3 py-4 pb-24 sm:px-5 sm:py-6">
        <section className="stagger-item " style={{ "--stagger-delay": "30ms" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Class {section.className} - Section {section.section}
              </h2>
            </div>
            {section.isClassTeacher ? (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                Class Teacher Responsibility
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Total Students</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{section.totalStudents}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">Class Attendance</p>
              <p className="mt-1 text-lg font-bold text-amber-800">{section.attendancePercent}%</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">Performance</p>
              <p className="mt-1 text-lg font-bold text-emerald-800">{section.performancePercent}%</p>
            </div>
          </div>

        </section>

        <section className="stagger-item grid gap-4 lg:grid-cols-[1.45fr_0.55fr]" style={{ "--stagger-delay": "70ms" }}>
          <article className="rounded-3xl bg-[var(--app-surface)] p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 whitespace-nowrap">Student performance and attendance</p>
                <h2 className="mt-1 text-xl font-semibold">Section student list</h2>
              </div>
            </div>

            <div className="mt-4 space-y-2 md:hidden">
              {pagedStudents.map((student) => (
                <div key={student.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Image
                        src={student.avatar}
                        alt={student.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{student.name}</p>
                        <p className="text-[11px] text-slate-500">Roll No: {student.rollNo}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {student.attendance}% attendance
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Performance
                  </p>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-emerald-500"
                      style={{ width: `${student.subjectPerformance}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-600">{student.subjectPerformance}%</p>
                </div>
              ))}
            </div>

            <div className="mt-4 hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.09em] text-slate-500">
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">Subject Performance</th>
                    <th className="px-3 py-2 text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedStudents.map((student) => (
                    <tr key={student.name}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">Roll No: {student.rollNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="h-2.5 w-full rounded-full bg-slate-200">
                          <div
                            className="h-2.5 rounded-full bg-emerald-500"
                            style={{ width: `${student.subjectPerformance}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{student.subjectPerformance}%</p>
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-semibold text-slate-700">{student.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <span className="text-xs font-semibold text-slate-500">{currentPage}/{totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </article>

          <div className="space-y-4">
            <article className="rounded-3xl bg-[var(--app-surface)] p-4 sm:p-5">
            <p className="text-sm text-slate-500">Section tasks</p>
            <h2 className="mt-1 text-xl font-semibold">Upcoming work</h2>
            <ul className="mt-4 space-y-2">
              {section.upcomingTasks.map((task, index) => {
                const taskDate = taskDates[index % taskDates.length];
                return (
                  <li key={task} className="flex items-center gap-3 rounded-xl bg-sky-50 px-3 py-2.5 text-sm font-medium text-sky-800">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-sky-800 ring-1 ring-sky-100">
                      <span className="text-base font-bold leading-none">{taskDate.day}</span>
                      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em]">{taskDate.month}</span>
                    </div>
                    <span className="leading-snug">{task}</span>
                  </li>
                );
              })}
            </ul>
            </article>

            {actionMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {actionMessage}
              </div>
            ) : null}
          </div>
        </section>

        <section className="stagger-item grid gap-4 lg:grid-cols-3" style={{ "--stagger-delay": "110ms" }}>
          <article className="rounded-3xl bg-[var(--app-surface)] p-4 sm:p-5">
            <p className="text-sm text-slate-500">Top performers</p>
            <div className="mt-3 space-y-2">
              {topPerformers.map((student, index) => (
                <div key={student.name} className="rounded-xl bg-emerald-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={avatarPool[index % avatarPool.length]}
                        alt={student.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold ">{student.name}</p>
                        <p className="text-[11px] ">Roll No: {student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-full"
                        style={{
                          background: `conic-gradient(#059669 ${Math.min(100, Math.max(0, Number(student.subjectPerformance || 0))) * 3.6}deg, #a7f3d0 0deg)`,
                        }}
                      >
                        <div className="grid h-6.5 w-6.5 place-items-center rounded-full bg-emerald-50 text-[9px] font-semibold text-emerald-800">
                          {student.subjectPerformance}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-[var(--app-surface)] p-4 sm:p-5">
            <p className="text-sm text-slate-500">Weak performers</p>
            <div className="mt-3 space-y-2">
              {weakPerformers.length === 0 ? (
                <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">No weak performers currently.</p>
              ) : (
                weakPerformers.map((student) => (
                  <div key={student.name} className="relative rounded-xl bg-rose-50 px-3 py-2.5 pr-34">
                    <div className="flex items-start gap-3">
                      <div className="flex items-start gap-2.5">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={32}
                          height={32}
                          className="mt-0.5 h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold ">{student.name}</p>
                          <p className="text-[11px] ">Roll No: {student.rollNo}</p>
                          <p className="text-xs ">{student.subjectPerformance}% Performance</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAssignTask(student.name)}
                      className="absolute right-3 top-1/2 inline-flex h-10 min-w-30 -translate-y-1/2 items-center justify-center rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      Assign Task
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-3xl bg-[var(--app-surface)] p-4 sm:p-5">
            <p className="text-sm text-slate-500">Low attendance</p>
            <div className="mt-3 space-y-2">
              {lowAttendance.length === 0 ? (
                <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">No low attendance alerts.</p>
              ) : (
                lowAttendance.map((student) => (
                  <div key={student.name} className="relative rounded-xl bg-amber-50 px-3 py-2.5 pr-34">
                    <div className="flex items-start gap-3">
                      <div className="flex items-start gap-2.5">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={32}
                          height={32}
                          className="mt-0.5 h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold">{student.name}</p>
                          <p className="text-[11px] ">Roll No: {student.rollNo}</p>
                          <p className="text-xs ">{student.attendance}% attendance</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotifyParent(student.name)}
                      className="absolute right-3 top-1/2 inline-flex h-10 min-w-30 -translate-y-1/2 items-center justify-center rounded-xl bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Notify Parent
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_24px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1 px-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              href={getDashboardHref(id)}
              className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-95 ${
                id === "home" ? "bg-(--app-accent-soft) text-[#8b6400]" : "text-slate-500"
              }`}
            >
              <span
                className={`mb-0.5 block h-0.75 w-5 rounded-full bg-(--app-accent) transition-all duration-250 ${
                  id === "home" ? "opacity-100" : "opacity-0"
                }`}
              />
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
