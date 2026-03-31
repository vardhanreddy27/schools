import { useState } from "react";
import { studentAssignments, subjectProgress, upcomingTests } from "@/components/student-dashboard/data";

const quizSubjects = ["Math", "Telugu", "English", "Science","Biology", "Social"];

function openQuizApp(subject) {
  const quizShellUrl = new URL("/Student_quiz", window.location.origin);
  quizShellUrl.searchParams.set("subject", subject);
  window.location.assign(quizShellUrl.toString());
}

export default function AcademicsTab() {
  const [selectedQuizSubject, setSelectedQuizSubject] = useState(quizSubjects[0]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Practice quizzes</p>
        <h2 className="mt-1 text-2xl font-semibold">Select subject and start quiz</h2>

        <div className="mt-4 grid gap-4 grid-cols-2">
          {quizSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => openQuizApp(subject)}
              className="rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-800 text-lg font-bold flex items-center justify-center aspect-square min-h-[100px] sm:min-h-[120px] transition-all duration-200 hover:border-[#c79216] hover:bg-[#fff4d6] active:scale-95 shadow-sm"
            >
              {subject}
            </button>
          ))}
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 sm:p-5">
        <p className="text-sm text-slate-500">Upcoming tests</p>
        <h2 className="mt-1 text-2xl font-semibold">Prepare this week</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingTests.map((test) => {
            // Map subject to image filename
            const subjectImgMap = {
              Maths: '/maths.png',
              Math: '/maths.png',
              Science: '/science.png',
              English: '/english.png',
              Telugu: '/telugu.png',
              Social: '/social.png',
              Hindi: '/hindi.webp',
            };
            const imgSrc = subjectImgMap[test.subject] || '/logo.png';
            // Format date for box
            const dateObj = new Date(test.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('default', { month: 'short' });
            return (
              <div
                key={test.id}
                className="flex items-center gap-4 rounded-3xl bg-white p-4"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                  <img src={imgSrc} alt={test.subject} className="object-contain w-12 h-12" />
                </div>
               
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg truncate">{test.subject}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-800 font-medium truncate">{test.chapter}</div>
                  <div className="mt-0.5 text-xs text-slate-500 truncate">{test.syllabus}</div>
                </div>
                 <div className="flex flex-col items-center justify-center mr-2">
                  <div className="w-12 h-12 rounded-xl bg-[#fff4d6] border border-[#f3e3b7] flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#b07e10] leading-none">{day}</span>
                    <span className="text-xs font-semibold text-[#8b6400] mt-0.5 uppercase">{month}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Subject performance</p>
        <h2 className="mt-1 text-2xl font-semibold">Syllabus and score</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {subjectProgress.map((item, idx) => {
            const subjectImgMap = {
              English: '/english.png',
              Maths: '/maths.png',
              Science: '/science.png',
              Social: '/social.png',
              Hindi: '/hindi.webp',
              Telugu: '/telugu.png',
            };
            const ringColors = [
              '#c79216', // gold
              '#1e90ff', // blue
              '#43a047', // green
              '#e53935', // red
              '#8e24aa', // purple
              '#ff9800', // orange
            ];
            const imgSrc = subjectImgMap[item.subject] || '/logo.png';
            const color = ringColors[idx % ringColors.length];
            const radius = 38;
            const stroke = 7;
            const normalizedRadius = radius - stroke / 2;
            const circumference = 2 * Math.PI * normalizedRadius;
            const progress = item.completion;
            const offset = circumference - (progress / 100) * circumference;
            return (
              <div key={item.subject} className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg width={radius * 2} height={radius * 2} className="block">
                    <circle
                      stroke="#f3f3f3"
                      fill="none"
                      strokeWidth={stroke}
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                    />
                    <circle
                      stroke={color}
                      fill="none"
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                      style={{ transition: 'stroke-dashoffset 0.6s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-xs text-[#8b6400] text-center leading-tight">{item.subject}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Syllabus: {item.completion}%</div>
                  <div className="text-xs text-[#c79216] font-bold">Performance: {item.score}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </article>

   

      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <h2 className="mt-1 text-2xl font-semibold">Assignments</h2>
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
