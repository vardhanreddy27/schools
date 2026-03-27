import { useState } from "react";
import { studentAssignments, subjectProgress, upcomingTests } from "@/components/student-dashboard/data";

const quizSubjects = ["Math", "Telugu", "English", "Science", "Social", "Games"];

function openQuizApp(subject) {
  const quizUrl = new URL("https://rizzrunner.vercel.app/");
  quizUrl.searchParams.set("subject", subject);
  quizUrl.searchParams.set("source", "nms-student");

  // Use same-window navigation to keep the transition app-like in PWA mode.
  window.location.assign(quizUrl.toString());
}

export default function AcademicsTab() {
  const [selectedQuizSubject, setSelectedQuizSubject] = useState(quizSubjects[0]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Practice quizzes</p>
        <h2 className="mt-1 text-2xl font-semibold">Select subject and start quiz</h2>

        <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {quizSubjects.map((subject) => {
            const active = selectedQuizSubject === subject;

            return (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedQuizSubject(subject)}
                className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  active
                    ? "border-[#c79216] bg-[#fff4d6] text-[#8b6400]"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
          <p className="text-sm text-slate-700">
            Selected: <span className="font-semibold text-slate-950">{selectedQuizSubject}</span>
          </p>
          <button
            type="button"
            onClick={() => openQuizApp(selectedQuizSubject)}
            className="rounded-full bg-[#c79216] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-18px_rgba(199,146,22,0.8)] transition-all duration-200 hover:bg-[#b07e10] active:scale-[0.98]"
          >
            Start {selectedQuizSubject} Quiz
          </button>
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Subject performance</p>
        <h2 className="mt-1 text-2xl font-semibold">Syllabus and score</h2>
        <div className="mt-4 space-y-3">
          {subjectProgress.map((item) => (
            <div key={item.subject} className="rounded-2xl bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>{item.subject}</span>
                <span>Score: {item.score}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[#c79216]" style={{ width: `${item.completion}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">Syllabus completion: {item.completion}%</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Upcoming tests</p>
        <h2 className="mt-1 text-2xl font-semibold">Prepare this week</h2>
        <div className="mt-4 space-y-2">
          {upcomingTests.map((test) => (
            <div key={test.id} className="rounded-2xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{test.subject} • {test.date}</p>
              <p className="mt-1 text-sm text-slate-700">{test.chapter}</p>
              <p className="text-xs text-slate-500">{test.syllabus}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Assignments</p>
        <h2 className="mt-1 text-2xl font-semibold">Class work and homework</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Due date</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentAssignments.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 text-slate-700 hover:bg-[#fff4d6]/40">
                  <td className="px-3 py-3">{item.subject}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-3 py-3">{item.dueDate}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === "Submitted" ? "bg-emerald-50 text-emerald-700" : "bg-[#fff4d6] text-[#8b6400]"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
