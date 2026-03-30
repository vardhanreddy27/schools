import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Medal,
  Trophy,
  Users,
} from "lucide-react";
import { syllabusBySection, teacherPerformance } from "@/components/admin-dashboard/data";

const MORE_ITEMS = [
  {
    id: "alerts",
    title: "Alerts",
    description: "School-wide notices and reminders",
    icon: Bell,
  },
  {
    id: "teachers",
    title: "Teachers performance",
    description: "Attendance, completion and participation",
    icon: Users,
  },
  {
    id: "classes",
    title: "Class performance",
    description: "Subject progress by class and section",
    icon: GraduationCap,
  },
  {
    id: "calendar",
    title: "Calendar View",
    description: "Week-first calendar view with upcoming events",
    icon: CalendarDays,
  },
  {
    id: "events",
    title: "Events",
    description: "Planned school programmes and dates",
    icon: Bell,
  },
  {
    id: "results",
    title: "Results",
    description: "Scheduled result releases and publishing",
    icon: FileText,
  },
  {
    id: "sports",
    title: "Sports",
    description: "Sports activities and meet updates",
    icon: Trophy,
  },
  {
    id: "competitions",
    title: "Competitions",
    description: "Upcoming student competitions",
    icon: Medal,
  },
];

const SUBJECT_PROGRESS = [
  { key: "Telugu", label: "Telugu", color: "#f59e0b" },
  { key: "English", label: "English", color: "#16a34a" },
  { key: "Hindi", label: "Hindi", color: "#ec4899" },
  { key: "Maths", label: "Maths", color: "#8b5cf6" },
  { key: "Science", label: "Science", color: "#14b8a6" },
  { key: "Social", label: "Social", color: "#ef4444" },
];

const EXTRA_PANELS = {
  events: [
    { title: "Science exhibition", detail: "Model presentation by classes 7 to 10 on 22 March.", meta: "Auditorium" },
    { title: "Parent orientation", detail: "Orientation session for new admissions on 26 March.", meta: "Seminar hall" },
    { title: "Annual day rehearsal", detail: "Stage rehearsal continues this week after lunch.", meta: "Main stage" },
  ],
  results: [
    { title: "Unit test 3 results", detail: "Marks entry closes on 20 March and results will be published on 21 March.", meta: "Academic office" },
    { title: "Progress cards", detail: "Printed progress cards will be distributed on 25 March.", meta: "Class teachers" },
  ],
  sports: [
    { title: "Inter-house athletics", detail: "Track and field events begin Friday at 9:30 AM.", meta: "School ground" },
    { title: "Kho-kho practice", detail: "Final team shortlist to be announced this Saturday.", meta: "Practice block" },
  ],
  competitions: [
    { title: "Math talent test", detail: "Registrations close tomorrow evening for classes 6 to 10.", meta: "Exam cell" },
    { title: "Science quiz", detail: "Preliminary round will be held next Monday.", meta: "Lab 2" },
    { title: "Essay writing", detail: "English and Telugu essay topics will be shared in the morning assembly.", meta: "Language club" },
  ],
};

const CALENDAR_EVENTS = [
  { date: "2026-03-18", title: "Teachers meeting", detail: "Monthly academic review with subject heads." },
  { date: "2026-03-21", title: "Unit test results", detail: "Result publication for classes 1 to 10." },
  { date: "2026-03-22", title: "Science exhibition", detail: "Student exhibits and parent visits." },
  { date: "2026-03-26", title: "Parent orientation", detail: "Orientation for new admissions." },
  { date: "2026-04-03", title: "Sports meet", detail: "Inter-house athletics events." },
];

function ProgressBar({ label, value, color = "#c79216" }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function BackHeader({ title, subtitle, onBack }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-sm text-slate-500">More</p>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function formatMonth(date) {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function sameMonth(dateString, currentDate) {
  const eventDate = new Date(dateString);
  return eventDate.getFullYear() === currentDate.getFullYear() && eventDate.getMonth() === currentDate.getMonth();
}

function buildCalendarDays(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    if (dayNumber < 1 || dayNumber > lastDay.getDate()) {
      return null;
    }

    return new Date(year, month, dayNumber);
  });
}

export default function CommunicationView({
  broadcastMessages,
  onBroadcastInputChange,
  onBroadcastSend,
  broadcastForm,
}) {
  const [activeSection, setActiveSection] = useState("menu");
  const [teacherQuery, setTeacherQuery] = useState("");
  const [teacherPage, setTeacherPage] = useState(1);
  const [classQuery, setClassQuery] = useState("");
  const [classPage, setClassPage] = useState(1);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const teacherPageSize = 4;
  const classPageSize = 4;

  const filteredTeachers = useMemo(() => {
    const term = teacherQuery.trim().toLowerCase();
    if (!term) {
      return teacherPerformance;
    }

    return teacherPerformance.filter((row) => {
      return [row.name, row.subject, row.attendance, row.syllabus, row.activityParticipation]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [teacherQuery]);

  const teacherTotalPages = Math.max(Math.ceil(filteredTeachers.length / teacherPageSize), 1);
  const safeTeacherPage = Math.min(teacherPage, teacherTotalPages);
  const teacherRows = useMemo(() => {
    const start = (safeTeacherPage - 1) * teacherPageSize;
    return filteredTeachers.slice(start, start + teacherPageSize);
  }, [filteredTeachers, safeTeacherPage]);

  const filteredClasses = useMemo(() => {
    const term = classQuery.trim().toLowerCase();
    if (!term) {
      return syllabusBySection;
    }

    return syllabusBySection.filter((row) => {
      return [
        row.className,
        row.section,
        row.Telugu,
        row.English,
        row.Hindi,
        row.Maths,
        row.Science,
        row.Social,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [classQuery]);

  const classTotalPages = Math.max(Math.ceil(filteredClasses.length / classPageSize), 1);
  const safeClassPage = Math.min(classPage, classTotalPages);
  const classRows = useMemo(() => {
    const start = (safeClassPage - 1) * classPageSize;
    return filteredClasses.slice(start, start + classPageSize);
  }, [filteredClasses, safeClassPage]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarDate), [calendarDate]);
  const currentMonthEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter((item) => sameMonth(item.date, calendarDate));
  }, [calendarDate]);

  const selectedCards = EXTRA_PANELS[activeSection] || [];

  if (activeSection === "menu") {
    return (
      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">More</p>
          <h2 className="mt-1 text-2xl font-semibold">School tools and updates</h2>
          <p className="mt-2 text-sm text-slate-500">Open the area you want to review.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setTeacherPage(1);
                    setClassPage(1);
                  }}
                  className="rounded-3xl bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-[#fff4d6]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff4d6] text-[#8b6400]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                </button>
              );
            })}
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "alerts") {
    return (
      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <BackHeader title="Alerts" subtitle="Share notices with teachers, students and parents." onBack={() => setActiveSection("menu")} />
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <form
              className="space-y-3 rounded-2xl bg-slate-50 p-4"
              onSubmit={(event) => {
                event.preventDefault();
                onBroadcastSend();
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Create alert</p>
              <select
                name="audience"
                value={broadcastForm.audience}
                onChange={onBroadcastInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Everyone">Everyone</option>
                <option value="Teachers">Teachers</option>
                <option value="Students">Students</option>
                <option value="Parents">Parents</option>
              </select>
              <textarea
                name="message"
                value={broadcastForm.message}
                onChange={onBroadcastInputChange}
                placeholder="Write the alert message..."
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <button type="submit" className="w-full rounded-xl bg-[#c79216] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b07e10] active:scale-[0.98]">Send alert</button>
            </form>

            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent alerts</p>
              <div className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
                {broadcastMessages.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="rounded-full bg-[#fff4d6] px-2 py-1 text-xs font-semibold text-[#8b6400]">To: {item.audience}</p>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "teachers") {
    return (
      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <BackHeader title="Teachers performance" subtitle="Attendance, completion and participation at a glance." onBack={() => setActiveSection("menu")} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={teacherQuery}
              onChange={(event) => {
                setTeacherQuery(event.target.value);
                setTeacherPage(1);
              }}
              placeholder="Search teacher or subject"
              className="w-full flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring sm:min-w-48"
            />
            <span className="rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">{filteredTeachers.length} staff</span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {teacherRows.map((row) => (
              <div key={row.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">{row.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{row.subject}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    Attendance: {row.attendance}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <ProgressBar label="Syllabus completion" value={parseInt(row.syllabus, 10)} color="#c79216" />
                  <ProgressBar label="Activity participation" value={parseInt(row.activityParticipation, 10)} color="#16a34a" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <p>Page {safeTeacherPage} of {teacherTotalPages}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTeacherPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeTeacherPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition-all duration-150 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setTeacherPage((prev) => Math.min(prev + 1, teacherTotalPages))}
                disabled={safeTeacherPage === teacherTotalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition-all duration-150 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "classes") {
    return (
      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <BackHeader title="Class performance" subtitle="Progress by class and section for all subjects." onBack={() => setActiveSection("menu")} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={classQuery}
              onChange={(event) => {
                setClassQuery(event.target.value);
                setClassPage(1);
              }}
              placeholder="Search class section"
              className="w-full flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring sm:min-w-48"
            />
            <span className="rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">{filteredClasses.length} sections</span>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {classRows.map((row) => (
              <div key={`${row.className}-${row.section}`} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-slate-900">{row.className}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">Section {row.section}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {SUBJECT_PROGRESS.map((subject) => (
                    <ProgressBar key={subject.key} label={subject.label} value={row[subject.key]} color={subject.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <p>Page {safeClassPage} of {classTotalPages}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setClassPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeClassPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition-all duration-150 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setClassPage((prev) => Math.min(prev + 1, classTotalPages))}
                disabled={safeClassPage === classTotalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 transition-all duration-150 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "calendar") {
    return (
      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <BackHeader title="Admin calendar view" subtitle="Week-first calendar with upcoming school events." onBack={() => setActiveSection("menu")} />
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="rounded-full bg-white p-2 text-slate-700 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="text-lg font-semibold text-slate-900">{formatMonth(calendarDate)}</h3>
              <button
                type="button"
                onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="rounded-full bg-white p-2 text-slate-700 hover:bg-slate-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-12 rounded-xl bg-transparent" />;
                }

                const hasEvent = CALENDAR_EVENTS.some((item) => item.date === date.toISOString().slice(0, 10));
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={date.toISOString()}
                    className={`flex h-12 items-center justify-center rounded-xl text-sm font-medium ${
                      isToday ? "bg-[#c79216] text-white" : hasEvent ? "bg-[#fff4d6] text-[#8b6400]" : "bg-white text-slate-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Calendar events this month</p>
            <div className="mt-3 space-y-3">
              {currentMonthEvents.length ? currentMonthEvents.map((item) => (
                <div key={item.date + item.title} className="rounded-2xl bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <span className="rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">
                      {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No scheduled events for this month.</p>
              )}
            </div>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="mt-4">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <BackHeader
          title={MORE_ITEMS.find((item) => item.id === activeSection)?.title || "More"}
          subtitle="Important school updates in one place."
          onBack={() => setActiveSection("menu")}
        />
        <div className="grid gap-3">
          {selectedCards.map((item) => (
            <div key={item.title} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                <span className="rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">{item.meta}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
