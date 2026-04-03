import { Fragment, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";
import { attendanceTrend, teacherPerformance, trendTabs } from "@/components/admin-dashboard/data";

const latecomerDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const classTeacherMap = {
  "1st": "Ms. Priya Sharma",
  "3rd": "Mr. Rajesh Kumar",
  "5th": "Ms. Deepa Singh",
  "7th": "Mr. Vikram Patel",
  "9th": "Ms. Ananya Desai",
  "10th": "Mr. Arjun Nair",
};

const latecomerHeatmapRows = [
  { className: "1st", values: [1, 2, 1, 2, 1] },
  { className: "3rd", values: [2, 3, 2, 2, 1] },
  { className: "5th", values: [3, 4, 3, 4, 2] },
  { className: "7th", values: [4, 5, 4, 3, 4] },
  { className: "9th", values: [5, 6, 7, 5, 6] },
  { className: "10th", values: [4, 6, 5, 6, 7] },
];

const substituteTeacherAssignments = [
  {
    id: 1,
    classSection: "9th A",
    timeRange: "09:00 AM - 10:00 AM",
    absentTeacher: "Ms. Ananya Desai",
    absentSubject: "Mathematics",
    substituteTeacher: "Mr. Vikram Patel",
    substituteSubject: "Mathematics",
    absentTeacherImg: "/teacher.avif",
    substituteTeacherImg: "/teacher3.avif",
  },
  {
    id: 2,
    classSection: "7th B",
    timeRange: "10:00 AM - 11:00 AM",
    absentTeacher: "Mr. Rajesh Kumar",
    absentSubject: "Science",
    substituteTeacher: "Ms. Deepa Singh",
    substituteSubject: "Science",
    absentTeacherImg: "/teacher2.jpg",
    substituteTeacherImg: "/teacher4.webp",
  },
  {
    id: 3,
    classSection: "10th C",
    timeRange: "11:00 AM - 12:00 PM",
    absentTeacher: "Mr. Arjun Nair",
    absentSubject: "English",
    substituteTeacher: "Ms. Priya Sharma",
    substituteSubject: "English",
    absentTeacherImg: "/teacher3.avif",
    substituteTeacherImg: "/teacher.avif",
  },
  {
    id: 4,
    classSection: "5th A",
    timeRange: "12:00 PM - 01:00 PM",
    absentTeacher: "Ms. Deepa Singh",
    absentSubject: "History",
    substituteTeacher: "Mr. Rajesh Kumar",
    substituteSubject: "History",
    absentTeacherImg: "/teacher4.webp",
    substituteTeacherImg: "/teacher2.jpg",
  },
];

const subjectImageMap = {
  Mathematics: "/maths.png",
  Science: "/science.png",
  English: "/english.png",
  History: "/social.png",
  Biology: "/biology.png",
  Hindi: "/hindi.webp",
  Telugu: "/telugu.png",
};

export default function AttendanceView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [activeTrend, setActiveTrend] = useState(trendTabs[0]);
  const [showAllSubstitutes, setShowAllSubstitutes] = useState(false);
  const pageSize = 5;

  const teacherAvatarPool = ["/teacher.avif", "/teacher2.jpg", "/teacher3.avif", "/teacher4.webp", "/teacher.avif"];

  const trend = attendanceTrend[activeTrend] || attendanceTrend.Today;

  const latecomerMax = useMemo(
    () => Math.max(...latecomerHeatmapRows.flatMap((row) => row.values)),
    []
  );

  const topLatecomerClasses = useMemo(() => {
    return latecomerHeatmapRows
      .map((row) => {
        const totalLate = row.values.reduce((sum, value) => sum + value, 0);
        return { className: row.className, totalLate };
      })
      .sort((a, b) => b.totalLate - a.totalLate)
      .slice(0, 3);
  }, []);

  const displayedSubstituteAssignments = showAllSubstitutes
    ? substituteTeacherAssignments
    : substituteTeacherAssignments.slice(0, 2);

  const getLatecomerCellStyle = (value) => {
    const intensity = value / Math.max(latecomerMax, 1);

    if (value <= 2) {
      const alpha = 0.18 + intensity * 0.18;
      return { backgroundColor: `rgba(110, 231, 183, ${alpha.toFixed(3)})` };
    }

    if (value <= 4) {
      const alpha = 0.2 + intensity * 0.16;
      return { backgroundColor: `rgba(190, 242, 100, ${alpha.toFixed(3)})` };
    }

    if (value <= 5) {
      const alpha = 0.2 + intensity * 0.18;
      return { backgroundColor: `rgba(253, 224, 71, ${alpha.toFixed(3)})` };
    }

    if (value <= 6) {
      const alpha = 0.22 + intensity * 0.18;
      return { backgroundColor: `rgba(251, 146, 60, ${alpha.toFixed(3)})` };
    }

    return { backgroundColor: "rgba(244, 63, 94, 0.28)" };
  };

  const teacherRows = teacherPerformance.map((teacher, index) => {
    const [presentRaw, totalRaw] = teacher.attendance.split("/");
    const present = Number(presentRaw) || 0;
    const total = Number(totalRaw) || 0;
    const percent = Math.round((present / Math.max(total, 1)) * 100);

    return {
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      present,
      total,
      percent,
      absentPercent: Math.max(100 - percent, 0),
      avatar: teacherAvatarPool[index % teacherAvatarPool.length],
    };
  });

  const availableSubjects = useMemo(() => {
    const unique = Array.from(new Set(teacherRows.map((row) => row.subject)));
    return ["All", ...unique];
  }, [teacherRows]);

  const filteredTeacherRows = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    const byText = teacherRows.filter((row) => {
      if (!term) {
        return true;
      }

      return [row.name, row.subject, `${row.percent}%`].join(" ").toLowerCase().includes(term);
    });

    const byFilter = byText.filter((row) => {
      if (subjectFilter === "All") {
        return true;
      }

      return row.subject === subjectFilter;
    });

    return byFilter;
  }, [searchQuery, subjectFilter, teacherRows]);

  return (
    <section className="mt-4 space-y-4">
      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div>
          <p className="text-sm text-slate-500">Attendance trend</p>
          <h2 className="mt-1 text-2xl font-semibold">Class wise attendance</h2>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {trendTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTrend(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeTrend === tab ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 min-h-64 h-64 min-w-0 rounded-3xl sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 0, left: 8, bottom: 0 }} barCategoryGap="10%">
              <CartesianGrid vertical horizontal stroke="#dbe3f0" strokeDasharray="2 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                width={36}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
              <Bar dataKey="students" fill="#16c7bd" radius={[8, 8, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div>
          <p className="text-sm text-slate-500">Latecomers graph</p>
          <h2 className="mt-1 text-2xl font-semibold">Class wise late comers </h2>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Higher color = more late arrivals</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Low</span>
              <div className="h-2 w-16 rounded-full bg-linear-to-r from-emerald-200 via-yellow-200 to-rose-300" />
              <span>High</span>
            </div>
          </div>

          <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))] gap-2">
            <div />
            {latecomerDays.map((day) => (
              <p key={day} className="text-center text-xs font-semibold text-slate-600">
                {day}
              </p>
            ))}

            {latecomerHeatmapRows.map((row) => (
              <Fragment key={row.className}>
                <p className="self-center text-xs font-semibold text-slate-700">
                  {row.className}
                </p>
                {row.values.map((value, index) => (
                  <div
                    key={`${row.className}-${latecomerDays[index]}`}
                    className="grid h-9 place-items-center rounded-lg text-[11px] font-semibold text-slate-800 ring-1 ring-white/70"
                    style={getLatecomerCellStyle(value)}
                    title={`${row.className} • ${latecomerDays[index]}: ${value} late students`}
                  >
                    {value}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {topLatecomerClasses.map((item) => (
            <div key={item.className} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-black">Notified</span> :{" "}
                <span className=" ">{item.className}{" "}class</span> {classTeacherMap[item.className]}{" "} 
                <span className="text-slate-600">(Class Teacher)</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div>
          <p className="text-sm text-slate-500">Teacher attendance</p>
          <h2 className="mt-1 text-2xl font-semibold">Daily teacher attendance summary</h2>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search teacher or subject"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
          />

          <select
            value={subjectFilter}
            onChange={(event) => {
              setSubjectFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
          >
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === "All" ? "All subjects" : subject}
              </option>
            ))}
          </select>
        </div>

        {(() => {
          const totalPages = Math.max(Math.ceil(filteredTeacherRows.length / pageSize), 1);
          const safePage = Math.min(page, totalPages);
          const start = (safePage - 1) * pageSize;
          const pagedTeachers = filteredTeacherRows.slice(start, start + pageSize);

          return (
            <>
              <div className="mt-4 space-y-3 md:hidden">
                {pagedTeachers.map((teacher) => (
                  <article key={teacher.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
                          <Image src={teacher.avatar} alt={teacher.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{teacher.name}</p>
                          <p className="text-xs text-slate-600">{teacher.subject}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{teacher.percent}%</p>
                    </div>

                    <div className="mt-3">
                      <div className="h-2.5 overflow-hidden rounded-full bg-rose-100">
                        <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${teacher.percent}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {teacher.present}/{teacher.total} days present · {teacher.absentPercent}% absent
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 hidden rounded-2xl border border-slate-200 md:block">
                <table className="w-full table-fixed text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="w-[32%] px-3 py-2 font-medium">Teacher</th>
                      <th className="w-[18%] px-3 py-2 font-medium">Subject</th>
                      <th className="w-[38%] px-3 py-2 font-medium">Attendance progress</th>
                      <th className="w-[12%] px-3 py-2 text-right font-medium">% Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTeachers.map((teacher) => (
                      <tr key={teacher.id} className="border-t border-slate-100 align-top hover:bg-[#fff4d6]/40">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
                              <Image src={teacher.avatar} alt={teacher.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                            </div>
                            <span className="truncate font-medium text-slate-900">{teacher.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{teacher.subject}</td>
                        <td className="px-3 py-3">
                          <div className="max-w-full">
                            <div className="h-2.5 overflow-hidden rounded-full bg-rose-100">
                              <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${teacher.percent}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              {teacher.present}/{teacher.total} days present · {teacher.absentPercent}% absent
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-slate-900">{teacher.percent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <p>
                  Page {safePage} of {totalPages} · {filteredTeacherRows.length} teachers
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={safePage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={safePage === totalPages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          );
        })()}
      </section>

      <section className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div>
          <p className="text-sm text-slate-500">Teacher coverage</p>
          <h2 className="mt-1 text-2xl font-semibold">Substitute teacher assignments</h2>
        </div>

        <div className="mt-4 space-y-3">
          {displayedSubstituteAssignments.map((assignment) => (
            <div key={assignment.id} className="relative rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-4">
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-700 ring-1 ring-slate-200">
                  {assignment.timeRange}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {assignment.classSection}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="relative rounded-xl bg-white/70 p-3 ring-1 ring-red-200">
                    <span className="absolute right-3 top-3 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                      Absent
                    </span>
                    <div className="mt-2.5 flex items-center gap-3 pr-16">
                      <Image
                        src={assignment.absentTeacherImg}
                        alt={assignment.absentTeacher}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{assignment.absentTeacher}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Image
                            src={subjectImageMap[assignment.absentSubject] || "/social.png"}
                            alt={assignment.absentSubject}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-cover"
                          />
                          <p className="text-xs font-semibold text-slate-600">{assignment.absentSubject}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="rounded-full bg-blue-100 p-2">
                      <svg className="h-4 w-4 text-blue-600 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative rounded-xl bg-white/70 p-3 ring-1 ring-emerald-200">
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Substitute
                    </span>
                    <div className="mt-2.5 flex items-center gap-3 pr-20">
                      <Image
                        src={assignment.substituteTeacherImg}
                        alt={assignment.substituteTeacher}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{assignment.substituteTeacher}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Image
                            src={subjectImageMap[assignment.substituteSubject] || "/social.png"}
                            alt={assignment.substituteSubject}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-cover"
                          />
                          <p className="text-xs font-semibold text-slate-600">{assignment.substituteSubject}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {substituteTeacherAssignments.length === 0 && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm text-slate-600">No substitute assignments today</p>
          </div>
        )}

        {substituteTeacherAssignments.length > 2 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllSubstitutes((prev) => !prev)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {showAllSubstitutes ? "Show less" : "View all"}
            </button>
          </div>
        )}
      </section>

    </section>
  );
}
