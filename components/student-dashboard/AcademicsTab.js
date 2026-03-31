import { useState } from "react";
import { studentAssignments, subjectProgress, upcomingTests } from "@/components/student-dashboard/data";

const quizSubjects = [
  { name: "Math", questions: 12, theme: "blue" },
  { name: "Telugu", questions: 10, theme: "amber" },
  { name: "English", questions: 15, theme: "rose" },
  { name: "Science", questions: 8, theme: "emerald" },
  { name: "Biology", questions: 6, theme: "teal" },
  { name: "Social", questions: 10, theme: "indigo" }
];

function openQuizApp(subject) {
  const quizShellUrl = new URL("/Student_quiz", window.location.origin);
  quizShellUrl.searchParams.set("subject", subject);
  window.location.assign(quizShellUrl.toString());
}

export default function AcademicsTab() {
  const [selectedQuizSubject, setSelectedQuizSubject] = useState(quizSubjects[0].name);

  // Mapping images to match the "Prepare this week" icons
  const subjectImgMap = {
    Maths: '/maths.png', 
    Math: '/maths.png', 
    Science: '/science.png',
    English: '/english.png', 
    Telugu: '/telugu.png', 
    Social: '/social.png', 
    Hindi: '/hindi.webp', 
    Biology: '/biology.png' 
  };

  const getThemeClasses = (theme) => {
    const themes = {
      blue: "border-blue-200 hover:border-blue-500 hover:bg-blue-50/30",
      amber: "border-amber-200 hover:border-amber-500 hover:bg-amber-50/30",
      rose: "border-rose-200 hover:border-rose-500 hover:bg-rose-50/30",
      emerald: "border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/30",
      teal: "border-teal-200 hover:border-teal-500 hover:bg-teal-50/30",
      indigo: "border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/30",
    };
    return themes[theme] || themes.amber;
  };

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr] w-full overflow-x-hidden px-0 sm:px-0">
      {/* PRACTICE QUIZZES SECTION */}
      <article className="xl:col-span-2 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-6 lg:p-8 w-full overflow-x-hidden">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Practice quizzes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl text-left">Select subject and start quiz</h2>
        </div>

        <div className="grid gap-4 w-full">
          {quizSubjects.map((subject) => {
            const themeClasses = getThemeClasses(subject.theme);
            const imgSrc = subjectImgMap[subject.name] || '/logo.png';

            return (
              <button
                key={subject.name}
                type="button"
                onClick={() => openQuizApp(subject.name)}
                className={`flex w-full items-center justify-between rounded-3xl border p-5 transition-all duration-200 active:scale-[0.98] group ${themeClasses}`}
              >
                <div className="flex items-center gap-5">
                  {/* Subject Image - Clean version with no bg, border, or shadow */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <img src={imgSrc} alt={subject.name} className="object-contain w-full h-full" />
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                      {subject.name}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 italic mt-0.5">
                      {subject.questions} Questions available
                    </p>
                  </div>
                </div>

                {/* CTA Area: Includes quiz.png icon next to the arrow */}
                <div className="flex items-center gap-3 font-black text-sm uppercase tracking-wider text-black">
                  <span className="hidden sm:inline">Start Quiz</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <img 
                      src="/quiz.png" 
                      alt="" 
                      className="h-12 w-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                    <svg className="h-5 w-5 stroke-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      {/* UPCOMING TESTS */}
      <article className="rounded-4xl bg-white p-4 sm:p-5 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] w-full overflow-x-hidden">
        <p className="text-sm text-slate-500 font-medium">Upcoming tests</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Prepare this week</h2>
        <div className="mt-4 flex flex-col gap-4 w-full">
          {upcomingTests.map((test) => {
            const subjectImgMap = {
              Maths: '/maths.png', Math: '/maths.png', Science: '/science.png',
              English: '/english.png', Telugu: '/telugu.png', Social: '/social.png', Hindi: '/hindi.webp',
            };
            const imgSrc = subjectImgMap[test.subject] || '/logo.png';
            const dateObj = new Date(test.date);
            return (
              <div key={test.id} className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex-shrink-0 w-14 h-14 overflow-hidden flex items-center justify-center">
                  <img src={imgSrc} alt={test.subject} className="object-contain w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-lg text-slate-900">{test.subject}</span>
                  <div className="mt-0.5 text-sm text-slate-600 font-medium truncate">{test.chapter}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#fff4d6] border border-[#f3e3b7] flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#b07e10] leading-none">{dateObj.getDate()}</span>
                  <span className="text-[10px] font-bold text-[#8b6400] uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {/* SUBJECT PERFORMANCE */}
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5 w-full overflow-x-hidden">
        <p className="text-sm text-slate-500 font-medium">Subject performance</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Syllabus and score</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
          {subjectProgress.slice(0, 6).map((item, idx) => {
            const ringColors = ['#c79216', '#1e90ff', '#43a047', '#e53935', '#8e24aa', '#ff9800'];
            const color = ringColors[idx % ringColors.length];
            const radius = 38;
            const stroke = 7;
            const normalizedRadius = radius - stroke / 2;
            const circumference = 2 * Math.PI * normalizedRadius;
            const offset = circumference - (item.completion / 100) * circumference;
            return (
              <div key={item.subject} className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg width={radius * 2} height={radius * 2}>
                    <circle stroke="#f1f5f9" fill="none" strokeWidth={stroke} cx={radius} cy={radius} r={normalizedRadius} />
                    <circle stroke={color} fill="none" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" cx={radius} cy={radius} r={normalizedRadius} className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-[10px] text-slate-700 text-center uppercase tracking-tighter">{item.subject}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 font-semibold">{item.completion}% Done</div>
                  <div className="text-xs text-slate-900 font-bold">{item.score}% Score</div>
                </div>
              </div>
            );
          })}
        </div>
      </article>

    </section>
  );
}