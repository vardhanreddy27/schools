import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Medal, Search, Star } from "lucide-react";
import { teacherPerformance } from "@/components/admin-dashboard/data";

const performanceWindows = ["Monthly", "Quarterly","Half Yearly"];
const subjectOrder = ["Telugu", "Hindi", "English", "Maths", "Science", "Social"];

const sectionMap = {
  1: ["A", "B"],
  2: ["A", "B", "C"],
  3: ["A", "B"],
  4: ["A", "B", "C"],
  5: ["A", "B"],
  6: ["A", "B", "C"],
  7: ["A", "B", "C"],
  8: ["A", "B", "C"],
  9: ["A", "B", "C", "D"],
  10: ["A", "B", "D"],
};

const periodOffset = {
  Monthly: 0,
  "Quarterly": 3,
  "Half Yearly": 6,
};

const studentQuizLeaderboard = [
  { id: 1, name: "Saanvi", className: "X", section: "A", score: 98, quizzes: 12, avatar: "/student1.png", stars: 5 },
  { id: 2, name: "Arjun", className: "IX", section: "C", score: 96, quizzes: 11, avatar: "/student2.png", stars: 5 },
  { id: 3, name: "Rithvik", className: "VIII", section: "B", score: 95, quizzes: 11, avatar: "/student3.png", stars: 4 },
  { id: 4, name: "Meera", className: "X", section: "B", score: 94, quizzes: 10, avatar: "/student4.png", stars: 4 },
  { id: 5, name: "Aadya", className: "VII", section: "A", score: 92, quizzes: 10, avatar: "/student.jpeg", stars: 4 },
  { id: 6, name: "Varun", className: "VI", section: "C", score: 90, quizzes: 9, avatar: "/student6.avif", stars: 3 },
];

const quizAvatarBg = [
  "bg-rose-100",
  "bg-sky-100",
  "bg-amber-100",
  "bg-emerald-100",
  "bg-violet-100",
  "bg-cyan-100",
];

const teacherAvatarPool = ["/teacher.avif", "/teacher2.jpg", "/teacher3.avif", "/teacher4.webp"];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toRoman(num) {
  const map = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return map[num] || `${num}`;
}

function medalNode(rank) {
  if (rank === 1) return <Medal className="h-5 w-5 text-amber-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
  return <span>{rank}</span>;
}

function getSectionTone(score) {
  if (score < 70) return "bg-linear-to-br from-rose-100 to-orange-100 border-rose-200 text-rose-900";
  if (score < 82) return "bg-linear-to-br from-amber-100 to-yellow-100 border-amber-200 text-amber-900";
  return "bg-linear-to-br from-emerald-100 to-cyan-100 border-emerald-200 text-emerald-900";
}

export default function TimetableView() {
  const [activeWindow, setActiveWindow] = useState(performanceWindows[0]);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [showAllTeachers, setShowAllTeachers] = useState(false);

  const sectionPerformanceRows = useMemo(() => {
    const offset = periodOffset[activeWindow] ?? 0;

    return Array.from({ length: 10 }, (_, index) => index + 1).flatMap((grade) => {
      const sections = sectionMap[grade] || ["A"];

      return sections.map((section, sectionIndex) => {
        const academics = clamp(62 + grade * 2 + sectionIndex * 2 + offset, 55, 98);
        const syllabus = clamp(58 + grade * 2 + sectionIndex + offset + (grade % 3), 50, 97);
        return {
          classLabel: toRoman(grade),
          classSection: `${toRoman(grade)}-${section}`,
          academics,
          syllabus,
          score: Math.round((academics + syllabus) / 2),
        };
      });
    });
  }, [activeWindow]);

  const classSummary = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => index + 1).map((grade) => {
      const roman = toRoman(grade);
      const rows = sectionPerformanceRows.filter((item) => item.classLabel === roman);
      const academics = Math.round(rows.reduce((sum, item) => sum + item.academics, 0) / Math.max(rows.length, 1));
      const syllabus = Math.round(rows.reduce((sum, item) => sum + item.syllabus, 0) / Math.max(rows.length, 1));

      return { classLabel: roman, academics, syllabus };
    });
  }, [sectionPerformanceRows]);

  const subjectPerformance = useMemo(() => {
    const offset = periodOffset[activeWindow] ?? 0;

    return subjectOrder.map((subject, index) => {
      const academics = clamp(66 + index * 4 + offset, 55, 98);
      const syllabus = clamp(61 + index * 5 + offset, 50, 98);
      return { subject, short: subject.slice(0, 3), academics, syllabus };
    });
  }, [activeWindow]);

  const topClass = useMemo(() => {
    return classSummary
      .map((item) => ({ ...item, score: Math.round((item.academics + item.syllabus) / 2) }))
      .sort((a, b) => b.score - a.score)[0];
  }, [classSummary]);

  const teacherRows = useMemo(() => {
    return teacherPerformance.slice(0, 10).map((teacher, index) => {
      const [presentRaw, totalRaw] = teacher.attendance.split("/");
      const present = Number(presentRaw) || 0;
      const total = Number(totalRaw) || 0;
      const attendancePercent = Math.round((present / Math.max(total, 1)) * 100);
      const syllabusCompletion = Number((teacher.syllabus || "0").replace("%", "")) || 0;
      const classOne = toRoman((index % 10) + 1);
      const classTwo = toRoman(((index + 3) % 10) + 1);
      const sectionOne = ["A", "B", "C", "D"][index % 4];
      const sectionTwo = ["A", "B", "C", "D"][(index + 1) % 4];

      return {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        attendanceText: teacher.attendance,
        attendancePercent,
        syllabusCompletion,
        classesHandled: `${classOne}-${sectionOne}, ${classTwo}-${sectionTwo}`,
        avatar: teacherAvatarPool[index % teacherAvatarPool.length],
      };
    });
  }, []);

  const filteredTeacherRows = useMemo(() => {
    const term = teacherSearch.trim().toLowerCase();
    if (!term) return teacherRows;
    return teacherRows.filter((teacher) =>
      [teacher.name, teacher.subject, teacher.classesHandled].join(" ").toLowerCase().includes(term)
    );
  }, [teacherRows, teacherSearch]);

  const visibleTeacherRows = showAllTeachers ? filteredTeacherRows : filteredTeacherRows.slice(0, 5);

  return (
    <section className="mt-4 space-y-4">
      <article className="rounded-4xl bg-white shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="p-3">
            <p className="text-sm text-slate-500">Performance command center</p>
            <h2 className="mt-1 text-2xl font-semibold">Class wise academics performance</h2>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              {performanceWindows.map((window) => (
                <button
                  key={window}
                  type="button"
                  onClick={() => setActiveWindow(window)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 ${activeWindow === window ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
                >
                  {window}
                </button>
              ))}
            </div>
          </div>
        </div>

    
        <div className="mt-5 h-72 w-full rounded-3xl  sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={classSummary} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#dbe3f0" strokeDasharray="3 3" />
              <XAxis dataKey="classLabel" tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="academics" fill="#60a5fa" radius={[8, 8, 0, 0]} barSize={18} name="Academics %" />
              <Line dataKey="syllabus" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} name="Syllabus %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Class and section intelligence</p>
          <h3 className="mt-1 text-xl font-semibold">Section performance map </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 font-semibold text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Low
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> High
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {sectionPerformanceRows.map((item) => (
              <div
                key={item.classSection}
                className={`rounded-xl border border-slate-200 p-2 text-center ${getSectionTone(item.score)}`}
                title={`${item.classSection}: Academics ${item.academics}%, Syllabus ${item.syllabus}%`}
              >
                <p className="text-[11px] font-semibold">{item.classSection}</p>
                <p className="mt-1 text-xs font-bold">{item.score}%</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-4xl bg-white shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm px-3 pt-3 text-slate-500">Subject trend</p>
          <h3 className="mt-1 px-3 text-xl font-semibold">Core subjects performance</h3>

          <div className="mt-4 h-72 w-full p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="short" tickLine={false} axisLine={false} interval={0} />
                <YAxis domain={[50, 100]} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="academics" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Academics %" />
                <Bar dataKey="syllabus" fill="#a78bfa" radius={[6, 6, 0, 0]} name="Syllabus %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Quiz performance</p>
          <h3 className="mt-1 text-xl font-semibold">Top student leaderboard</h3>

          <div className="mt-4 space-y-2">
            {studentQuizLeaderboard.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex w-8 justify-center text-sm font-bold text-slate-500">{medalNode(index + 1)}</span>
                  <span className={`h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200 ${quizAvatarBg[index % quizAvatarBg.length]}`}>
                    <Image src={student.avatar} alt={student.name} width={36} height={36} className="h-9 w-9 object-cover" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">Class {student.className}-{student.section} • {student.quizzes} quizzes</p>
                  </div>
                </div>

                <div className="inline-flex items-center -space-x-1 rounded-full  px-2.5 py-1.5">
                  {Array.from({ length: student.stars }).map((_, idx) => (
                    <Star key={`${student.id}-star-${idx}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Teaching quality</p>
          <h3 className="mt-1 text-xl font-semibold">Teacher performance tracker</h3>

          <div className="mt-3 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={teacherSearch}
              onChange={(event) => {
                setTeacherSearch(event.target.value);
                setShowAllTeachers(false);
              }}
              placeholder="Search teacher, subject, class handled"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="mt-4 overflow-hidden ">
            <div className="hidden bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid md:grid-cols-[1.8fr_1fr_1fr]">
              <span>Teacher</span>
              <span>Attendance Graph</span>
              <span>Syllabus Completion Graph</span>
            </div>

            <div className="divide-y divide-slate-200">
              {visibleTeacherRows.map((teacher) => (
                <div key={teacher.id} className="grid gap-2 bg-white px-4 py-3 md:grid-cols-[1.8fr_1fr_1fr] md:items-center">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200">
                      <Image src={teacher.avatar} alt={teacher.name} width={40} height={40} className="h-10 w-10 object-cover" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{teacher.name}</p>
                      <p className="text-xs text-slate-600">{teacher.subject}</p>
                      <p className="text-xs text-slate-500">Classes: {teacher.classesHandled}</p>
                    </div>
                  </div>

                  <div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-2.5 rounded-full bg-sky-500" style={{ width: `${teacher.attendancePercent}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{teacher.attendanceText} • {teacher.attendancePercent}% present</p>
                  </div>

                  <div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-2.5 rounded-full bg-violet-500" style={{ width: `${teacher.syllabusCompletion}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{teacher.syllabusCompletion}% syllabus covered</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredTeacherRows.length > 5 ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllTeachers((prev) => !prev)}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {showAllTeachers ? "Show less" : "View all"}
              </button>
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
