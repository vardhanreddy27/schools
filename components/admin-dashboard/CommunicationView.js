import { useMemo, useState } from "react";
import Image from "next/image";
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
    id: "Payroll",
    title: "Payroll",
    description: "Salary processing, payslips, and staff payment management",
    imageSrc: "/salary.png",
    tone: "from-sky-100 to-cyan-100",
  },
  {
    id: "teachers",
    title: "Teachers performance",
    description: "Attendance, completion and participation",
    imageSrc: "/performance.png",
    tone: "from-emerald-100 to-teal-100",
  },
  {
    id: "classes",
    title: "Class performance",
    description: "Subject progress by class and section",
    imageSrc: "/examicon.webp",
    tone: "from-indigo-100 to-violet-100",
  },
  {
    id: "calendar",
    title: "Calendar View",
    description: "Week-first calendar view with upcoming events",
    imageSrc: "/calendericon.webp",
    tone: "from-blue-100 to-indigo-100",
  },
  {
    id: "events",
    title: "Events",
    description: "Planned school programmes and dates",
    imageSrc: "/announcementsicon.png",
    tone: "from-amber-100 to-yellow-100",
  },
  {
    id: "results",
    title: "Results",
    description: "Scheduled result releases and publishing",
    imageSrc: "/quiz.png",
    tone: "from-rose-100 to-pink-100",
  },
  {
    id: "sports",
    title: "Sports",
    description: "Sports activities and meet updates",
    imageSrc: "/performance.png",
    tone: "from-sky-100 to-cyan-100",
  },
  {
    id: "competitions",
    title: "Competitions",
    description: "Upcoming student competitions",
    imageSrc: "/notes.webp",
    tone: "from-amber-100 to-orange-100",
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

// Available months for dropdown
const AVAILABLE_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Indian teacher names data
const INDIAN_TEACHERS = [
  { name: "Dr. Priya Sharma", subject: "Mathematics", baseSalary: 45000, leaveTaken: 1, lossOfPay: 1500, img: "/teacher.avif" },
  { name: "Rajesh Kumar", subject: "Science", baseSalary: 42000, leaveTaken: 2, lossOfPay: 2800, img: "/teacher2.jpg" },
  { name: "Prof. Sunita Reddy", subject: "English", baseSalary: 48000, leaveTaken: 0, lossOfPay: 0, img: "/teacher3.avif" },
  { name: "Anil Deshmukh", subject: "Social Studies", baseSalary: 39000, leaveTaken: 1, lossOfPay: 1300, img: "/teacher4.webp" },
  { name: "Kavita Nair", subject: "Hindi", baseSalary: 37000, leaveTaken: 3, lossOfPay: 3700, img: "/parent.jpg" },
  { name: "Suresh Iyer", subject: "Telugu", baseSalary: 36000, leaveTaken: 0, lossOfPay: 0, img: "/teacher.avif" },
  { name: "Dr. Meera Joshi", subject: "Physics", baseSalary: 52000, leaveTaken: 1, lossOfPay: 1700, img: "/teacher.avif" },
  { name: "Vikram Singh", subject: "Chemistry", baseSalary: 47000, leaveTaken: 2, lossOfPay: 3100, img: "/teacher.avif" },
  { name: "Pooja Verma", subject: "Biology", baseSalary: 44000, leaveTaken: 0, lossOfPay: 0, img: "/teacher.avif" },
  { name: "Ramesh Patil", subject: "History", baseSalary: 38000, leaveTaken: 1, lossOfPay: 1300, img: "/teacher.avif" },
  { name: "Shweta Kapoor", subject: "Geography", baseSalary: 38500, leaveTaken: 2, lossOfPay: 2600, img: "/teacher.avif" },
  { name: "Arvind Menon", subject: "Computer Science", baseSalary: 50000, leaveTaken: 0, lossOfPay: 0, img: "/teacher.avif" },
  { name: "Lakshmi Chandran", subject: "Physical Education", baseSalary: 35000, leaveTaken: 1, lossOfPay: 1200, img: "/teacher.avif" },
];

function ProgressBar({ label, value, color = "#16c7bd" }) {
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

function BackHeader({ title, subtitle, onBack, rightContent }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-2  bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {rightContent && <div>{rightContent}</div>}
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
  commSection,
  setCommSection,
}) {
  // Use controlled commSection from parent if provided, else fallback to local state for safety
  const isControlled = typeof commSection !== "undefined" && typeof setCommSection === "function";
  const [uncontrolledSection, setUncontrolledSection] = useState("menu");
  const activeSection = isControlled ? commSection : uncontrolledSection;
  const setActiveSection = isControlled ? setCommSection : setUncontrolledSection;
  const [teacherQuery, setTeacherQuery] = useState("");
  const [teacherPage, setTeacherPage] = useState(1);
  const [classQuery, setClassQuery] = useState("");
  const [classPage, setClassPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.getMonth(); // Current month as default
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const today = new Date();
    return today.getFullYear();
  });
  // Set default calendar date to previous month
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  });
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
      <section className="-mx-3 mt-6 min-h-[calc(100vh-10rem)] space-y-0 bg-white ">
        <article className="bg-white p-5">
          <p className="text-sm text-slate-500">Administrative tools</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Quick actions</h2>
          <p className="mt-2 text-sm text-slate-500">Access school management features.</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MORE_ITEMS.map((item) => {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setTeacherPage(1);
                    setClassPage(1);
                  }}
                  className={`group rounded-2xl bg-linear-to-br ${item.tone} p-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                      <p className="mt-3 text-[11px] font-medium text-slate-500">Open tool</p>
                    </div>
                    <span className="flex h-16 w-16 items-center justify-center overflow-hidden ">
                      <Image
                        src={item.imageSrc}
                        alt={`${item.title} icon`}
                        width={72}
                        height={72}
                        className="h-14 w-14 object-contain"
                      />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </article>
      </section>
    );
  }

  if (activeSection === "Payroll") {
    const teachers = INDIAN_TEACHERS;
    const totalPay = teachers.reduce((sum, t) => sum + t.baseSalary, 0);
    const totalLossOfPay = teachers.reduce((sum, t) => sum + t.lossOfPay, 0);
    const netPay = totalPay - totalLossOfPay;
    const percentNet = Math.round((netPay / totalPay) * 100);

    // Simple SVG circle graph
    function CircleGraph({ percent }) {
      const radius = 40;
      const stroke = 8;
      const normalizedRadius = radius - stroke / 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      const offset = circumference - (percent / 100) * circumference;
      return (
        <svg height={radius * 2} width={radius * 2} className="block">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#16c7bd"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.5s" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="1.1rem"
            fontWeight="bold"
            fill="#16c7bd"
          >
            {percent}%
          </text>
        </svg>
      );
    }

    // Generate year options (current year and next year)
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear + 1];

    return (
   <section className="mt-4">
  <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
    {/* Header with title and dropdowns on same line */}
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex-1">
        <button
          type="button"
          onClick={() => setActiveSection("menu")}
          className="mb-3 inline-flex items-center gap-2  bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="mt-1 text-2xl font-semibold">Payroll</h2>
        <p className="mt-1 text-sm text-slate-500">Salary details for all teachers.</p>
      </div>
      
      {/* Month and Year Selectors - aligned to the right */}
      <div className="mt-2 flex gap-2 sm:mt-0">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#16c7bd]"
        >
          {AVAILABLE_MONTHS.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#16c7bd]"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Info for selected month/year */}
    <div className="mb-4 rounded-xl bg-slate-50 px-4 py-2 text-center">
      <p className="text-sm text-slate-600">
        Showing payroll data for <span className="font-semibold">{AVAILABLE_MONTHS[selectedMonth]} {selectedYear}</span>
      </p>
    </div>

    {/* Circle Graph Row */}
    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <CircleGraph percent={percentNet} />
        <div>
          <p className="text-sm font-medium text-slate-600">Net Pay Percentage</p>
          <p className="text-xs text-slate-400">{percentNet}% of total gross</p>
        </div>
      </div>
    </div>
    
    {/* Summary Cards - 2 rows with 2 cards each on mobile, 4 in a row on desktop */}
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 p-3 md:p-4">
        <p className="text-[11px] font-medium text-slate-500 md:text-xs">Total Teachers</p>
        <p className="text-xl font-bold text-slate-900 md:text-2xl">{teachers.length}</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-3 md:p-4">
        <p className="text-[11px] font-medium text-slate-500 md:text-xs">Total Pay (Gross)</p>
        <p className="text-sm font-bold text-slate-900 md:text-2xl">₹{totalPay.toLocaleString("en-IN")}</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 p-3 md:p-4">
        <p className="text-[11px] font-medium text-slate-500 md:text-xs">Total Deductions</p>
        <p className="text-sm font-bold text-rose-600 md:text-2xl">-₹{totalLossOfPay.toLocaleString("en-IN")}</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-3 md:p-4">
        <p className="text-[11px] font-medium text-slate-500 md:text-xs">Net Pay</p>
        <p className="text-sm font-bold text-emerald-600 md:text-2xl">₹{netPay.toLocaleString("en-IN")}</p>
      </div>
    </div>

    {/* Teachers List */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <p className="col-span-full font-bold">Teachers</p>
      {teachers.map((t, idx) => (
        <div key={idx} className="group rounded-2xl bg-slate-50 p-4 transition-all duration-300 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm md:h-14 md:w-14">
              <Image 
                src={t.img} 
                alt={t.name} 
                width={56} 
                height={56} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-tight text-slate-900 md:text-base">{t.name}</div>
              <div className="mb-2 text-xs text-slate-500">{t.subject}</div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700 shadow-sm">
                  Base: ₹{t.baseSalary.toLocaleString("en-IN")}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700 shadow-sm">
                  Leave: {t.leaveTaken}
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom row with Loss and Net */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
            <div>
              <p className="text-xs text-rose-500">Loss of Pay</p>
              <p className="text-sm font-semibold text-rose-600">-₹{t.lossOfPay.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-500">Net Pay</p>
              <p className="text-base font-bold text-emerald-600">₹{(t.baseSalary - t.lossOfPay).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      ))}
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
                  <ProgressBar label="Syllabus completion" value={parseInt(row.syllabus, 10)} color="#16c7bd" />
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
                      isToday ? "bg-[#16c7bd] text-white" : hasEvent ? "bg-[#fff4d6] text-[#8b6400]" : "bg-white text-slate-700"
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