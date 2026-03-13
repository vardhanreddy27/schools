import { signOut } from "next-auth/react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Bus,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  LayoutGrid,
  Megaphone,
  Search,
  ShieldAlert,
  UserCircle2,
  UserRoundCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trendTabs = ["Today", "Weekly", "Monthly"];

const attendanceTrend = {
  Today: [
    { label: "8 AM", students: 76, teachers: 84 },
    { label: "9 AM", students: 89, teachers: 92 },
    { label: "10 AM", students: 93, teachers: 95 },
    { label: "11 AM", students: 94, teachers: 96 },
    { label: "12 PM", students: 95, teachers: 95 },
  ],
  Weekly: [
    { label: "Sun", students: 52, teachers: 58 },
    { label: "Mon", students: 90, teachers: 94 },
    { label: "Tue", students: 89, teachers: 93 },
    { label: "Wed", students: 92, teachers: 95 },
    { label: "Thu", students: 93, teachers: 95 },
    { label: "Fri", students: 94, teachers: 96 },
    { label: "Sat", students: 87, teachers: 90 },
  ],
  Monthly: [
    { label: "W1", students: 88, teachers: 92 },
    { label: "W2", students: 90, teachers: 94 },
    { label: "W3", students: 92, teachers: 95 },
    { label: "W4", students: 89, teachers: 93 },
  ],
};

const attendanceWindows = [
  { period: "Morning", studentsPresent: 1218, studentsTotal: 1286, teachersPresent: 46, teachersTotal: 48 },
  { period: "Evening", studentsPresent: 1194, studentsTotal: 1286, teachersPresent: 45, teachersTotal: 48 },
];

const sectionWiseAttendance = [
  { section: "1-A", morning: "87/90", evening: "85/90", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "1-B", morning: "85/89", evening: "84/89", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "2-A", morning: "88/91", evening: "86/91", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "2-B", morning: "86/90", evening: "84/90", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "3-A", morning: "84/88", evening: "82/88", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "4-A", morning: "90/94", evening: "88/94", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "5-A", morning: "89/93", evening: "87/93", teachersMorning: "3/3", teachersEvening: "3/3" },
  { section: "6-A", morning: "76/81", evening: "74/81", teachersMorning: "4/4", teachersEvening: "4/4" },
  { section: "7-A", morning: "79/85", evening: "77/85", teachersMorning: "4/4", teachersEvening: "4/4" },
  { section: "8-A", morning: "80/86", evening: "78/86", teachersMorning: "4/4", teachersEvening: "4/4" },
  { section: "9-A", morning: "82/89", evening: "80/89", teachersMorning: "5/5", teachersEvening: "5/5" },
  { section: "10-A", morning: "82/90", evening: "79/90", teachersMorning: "5/5", teachersEvening: "5/5" },
];

const topMetrics = [
  { title: "Teaching Staff", value: "48", icon: Users, tone: "text-emerald-600" },
  { title: "Non-Teaching Staff", value: "21", icon: Briefcase, tone: "text-sky-600" },
  { title: "Students", value: "1,286", icon: GraduationCap, tone: "text-violet-600" },
  { title: "Classes", value: "18", icon: LayoutGrid, tone: "text-blue-600" },
  { title: "Sections", value: "32", icon: LayoutGrid, tone: "text-indigo-600" },
  { title: "Transport Buses", value: "12", icon: Bus, tone: "text-amber-600" },
];

const highlights = [
  { title: "Open Alerts", value: 4, subtitle: "Need action", color: "#111827" },
  { title: "Pending Leaves", value: 3, subtitle: "Waiting approval", color: "#d97706" },
  { title: "Approved", value: 10, subtitle: "Completed", color: "#059669" },
];

const alerts = [
  {
    title: "Attendance not submitted by teachers",
    detail: "3 teachers still need to submit morning attendance.",
    priority: "High",
    icon: ShieldAlert,
  },
  {
    title: "Timetable updated",
    detail: "2 classes updated timetable for evening schedule.",
    priority: "Medium",
    icon: CalendarDays,
  },
  {
    title: "Smart substitute allocated",
    detail: "Mr. Rakesh allocated to Grade 7-B period 1.",
    priority: "High",
    icon: UserRoundCheck,
  },
];

const initialLeaveRequests = [
  { id: 1, name: "Kavya R", role: "Math Teacher", staffType: "Teaching", leaveType: "Medical", startDate: "2026-03-17", endDate: "2026-03-19", days: 3, status: "Pending" },
  { id: 2, name: "Anil Kumar", role: "Lab Assistant", staffType: "Non-Teaching", leaveType: "Casual", startDate: "2026-03-16", endDate: "2026-03-16", days: 1, status: "Pending" },
  { id: 3, name: "Sowmya", role: "English Teacher", staffType: "Teaching", leaveType: "Medical", startDate: "2026-03-14", endDate: "2026-03-15", days: 2, status: "Approved" },
  { id: 4, name: "Prasad", role: "Transport Incharge", staffType: "Non-Teaching", leaveType: "Emergency", startDate: "2026-03-13", endDate: "2026-03-13", days: 1, status: "Rejected" },
];

const notices = [
  { audience: "Teachers", icon: Bell, sentToday: 6 },
  { audience: "Students", icon: BookOpen, sentToday: 9 },
  { audience: "Parents", icon: Megaphone, sentToday: 12 },
];

const teacherPerformance = [
  { name: "Ms. Kavya", subject: "Mathematics", attendance: "22/23", syllabus: "86%", rating: "A" },
  { name: "Mr. Rakesh", subject: "Science", attendance: "21/23", syllabus: "82%", rating: "A" },
  { name: "Ms. Sowmya", subject: "English", attendance: "23/23", syllabus: "89%", rating: "A+" },
  { name: "Mr. Harish", subject: "Social", attendance: "20/23", syllabus: "78%", rating: "B+" },
];

const initialBroadcastMessages = [
  { id: 1, audience: "Teachers", message: "Submit evening attendance by 4:15 PM.", time: "10:30 AM" },
  { id: 2, audience: "Parents", message: "PTM schedule shared in parent app.", time: "11:20 AM" },
];

const upcomingModules = [
  { title: "Sports Meet", detail: "Inter-house athletics on Friday, 9:30 AM" },
  { title: "Competitions", detail: "Math and Science competitions registration closes tomorrow" },
  { title: "Results", detail: "Unit test results publication scheduled for 21 March" },
  { title: "Calendar", detail: "Parent meeting and lab schedule synced to academic calendar" },
];

const timetableModules = [
  { title: "Timetable Update", detail: "Class 7-B and 8-A evening periods rebalanced" },
  { title: "Substitute Engine", detail: "Absent teacher slots auto-assigned by workload rules" },
  { title: "Attendance Exceptions", detail: "2 late teachers flagged and mapped to backup coverage" },
];

const syllabusBySection = [
  { section: "6-A", Mathematics: 82, Science: 76, English: 88, Social: 72 },
  { section: "6-B", Mathematics: 79, Science: 71, English: 86, Social: 70 },
  { section: "7-A", Mathematics: 84, Science: 81, English: 89, Social: 75 },
  { section: "7-B", Mathematics: 77, Science: 74, English: 83, Social: 69 },
  { section: "8-A", Mathematics: 88, Science: 83, English: 91, Social: 79 },
  { section: "8-B", Mathematics: 85, Science: 79, English: 87, Social: 76 },
];

const performanceBySection = [
  { section: "6-A", students: 84, teachers: 88 },
  { section: "6-B", students: 79, teachers: 85 },
  { section: "7-A", students: 91, teachers: 89 },
  { section: "7-B", students: 86, teachers: 92 },
  { section: "8-A", students: 89, teachers: 90 },
  { section: "8-B", students: 83, teachers: 87 },
];

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "approvals", label: "Approvals", icon: UserRoundCheck },
  { id: "communication", label: "Communication", icon: Bell },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];

function statusClass(status) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700";
  if (status === "Rejected") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function SidebarNav({ activeMenu, onMenuChange }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">N</div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
            <p className="text-sm text-slate-400">Principal Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeMenu === id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/Admin_login" })}
          className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function MobileBottomNav({ activeMenu, onMenuChange }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium ${
              activeMenu === id ? "bg-blue-50 text-blue-700" : "text-slate-500"
            }`}
          >
            <Icon className="mb-1 h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon }) {
  return (
    <article className="h-28 rounded-3xl bg-white p-4 shadow-sm">
      <p className="truncate text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-3xl font-semibold text-slate-950">{value}</p>
        <div className="flex items-center justify-center text-slate-500">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

function OverviewView({ activeTrend, onTrendChange, leaveRequests }) {
  const trend = attendanceTrend[activeTrend];

  return (
    <>
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {topMetrics.map((item) => (
          <MetricCard key={item.title} {...item} />
        ))}
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Attendance trend</p>
            <h2 className="mt-1 text-2xl font-semibold">Students and teachers</h2>
          </div>

          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {trendTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTrendChange(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeTrend === tab ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 min-w-0 min-h-[18rem] h-72 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#dbe3f0" strokeDasharray="4 4" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="#2563eb" fill="url(#studentsFill)" strokeWidth={3} />
              <Area type="monotone" dataKey="teachers" stroke="#0f172a" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Students line
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Teachers line
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Operational highlights</p>
        <h2 className="mt-1 text-2xl font-semibold">Action cards</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] p-6"
              style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: item.color }}>{item.title}</p>
              <p className="mt-2 text-6xl font-bold leading-none" style={{ color: item.color }}>{item.title === "Pending Leaves" ? leaveRequests.filter((x) => x.status === "Pending").length : item.title === "Approved" ? leaveRequests.filter((x) => x.status === "Approved").length : item.value}</p>
              <p className="mt-2 text-sm" style={{ color: item.color }}>{item.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm text-slate-500">Upcoming modules</p>
          <h2 className="mt-1 text-2xl font-semibold">Events, sports and calendar</h2>
          <div className="mt-5 space-y-3">
            {upcomingModules.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm text-slate-500">Timetable and substitution</p>
          <h2 className="mt-1 text-2xl font-semibold">Automation status</h2>
          <div className="mt-5 space-y-3">
            {timetableModules.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function AttendanceView() {
  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Daily attendance windows</p>
        <h2 className="mt-1 text-2xl font-semibold">Morning and evening attendance</h2>

        <div className="mt-6 min-w-0 min-h-[18rem] h-72 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceWindows} barGap={14}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="studentsPresent" name="Students Present" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="teachersPresent" name="Teachers Present" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {attendanceWindows.map((item) => (
            <div key={item.period} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">{item.period}</p>
              <p className="mt-1 text-sm text-slate-600">Students: {item.studentsPresent}/{item.studentsTotal}</p>
              <p className="text-sm text-slate-600">Teachers: {item.teachersPresent}/{item.teachersTotal}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Teachers attendance mode</p>
        <h2 className="mt-1 text-xl font-semibold">Geo-fence configuration</h2>
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <p className="font-semibold text-emerald-700">Device readiness</p>
            <p className="mt-1">96% teacher devices are geo-fence ready.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p className="font-semibold text-amber-700">Pending setup</p>
            <p className="mt-1">2 teachers need location permission update.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-700">Logs per day</p>
            <p className="mt-1">Morning once and evening once for both teachers and students.</p>
          </div>
        </div>
      </article>

      <article className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Section attendance (A/B/C)</p>
        <h2 className="mt-1 text-2xl font-semibold">Present count by section</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Section</th>
                <th className="px-3 py-2 font-medium">Students Morning</th>
                <th className="px-3 py-2 font-medium">Students Evening</th>
                <th className="px-3 py-2 font-medium">Teachers Morning</th>
                <th className="px-3 py-2 font-medium">Teachers Evening</th>
              </tr>
            </thead>
            <tbody>
              {sectionWiseAttendance.map((row) => (
                <tr key={row.section} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-3 py-3 text-slate-700">{row.morning}</td>
                  <td className="px-3 py-3 text-slate-700">{row.evening}</td>
                  <td className="px-3 py-3 text-slate-700">{row.teachersMorning}</td>
                  <td className="px-3 py-3 text-slate-700">{row.teachersEvening}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function ApprovalsView({ leaveRequests, onDecision }) {
  const summary = useMemo(() => {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };
    leaveRequests.forEach((item) => {
      counts[item.status] += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: name === "Approved" ? "#2563eb" : name === "Pending" ? "#f59e0b" : "#ef4444",
    }));
  }, [leaveRequests]);

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Leave approvals</p>
        <h2 className="mt-1 text-2xl font-semibold">Teachers and non-teaching staff</h2>

        <div className="mt-5 space-y-3">
          {leaveRequests.map((request) => (
            <div key={request.id} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{request.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{request.role} • {request.staffType} • {request.leaveType} • {request.days} day(s)</p>
                  <p className="mt-1 text-xs text-slate-400">{request.startDate} to {request.endDate}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>{request.status}</span>
                  {request.status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onDecision(request.id, "Approved")}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onDecision(request.id, "Rejected")}
                        className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Approval summary</p>
        <h2 className="mt-1 text-xl font-semibold">Current status</h2>
        <div className="mt-5 min-w-0 min-h-[14rem] h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={summary} dataKey="value" innerRadius={40} outerRadius={72} stroke="none">
                {summary.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {summary.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>
                  {item.name} {item.name === "Approved" ? "(Blue)" : item.name === "Pending" ? "(Amber)" : "(Red)"}
                </span>
              </div>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function CommunicationView({ broadcastMessages, onBroadcastInputChange, onBroadcastSend, broadcastForm }) {
  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Communication</p>
        <h2 className="mt-1 text-2xl font-semibold">Send message to apps</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onBroadcastSend();
          }}
        >
          <select
            name="audience"
            value={broadcastForm.audience}
            onChange={onBroadcastInputChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="Teachers">Teachers</option>
            <option value="Students">Students</option>
            <option value="Parents">Parents</option>
          </select>
          <textarea
            name="message"
            value={broadcastForm.message}
            onChange={onBroadcastInputChange}
            placeholder="Type principal message..."
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Send message</button>
        </form>

        <div className="mt-5 space-y-3">
          {broadcastMessages.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.audience}</p>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {notices.map(({ audience, icon: Icon, sentToday }) => (
            <div key={audience} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-800">{audience}</span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{sentToday}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-500">Teacher performance</p>
        <h2 className="mt-1 text-2xl font-semibold">Daily teaching effectiveness</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Teacher</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Attendance</th>
                <th className="px-3 py-2 font-medium">Syllabus</th>
                <th className="px-3 py-2 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {teacherPerformance.map((row) => (
                <tr key={row.name} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-3 py-3 text-slate-700">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-700">{row.attendance}</td>
                  <td className="px-3 py-3 text-slate-700">{row.syllabus}</td>
                  <td className="px-3 py-3 text-slate-700">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">Syllabus completion</p>
        <h2 className="mt-1 text-2xl font-semibold">Subject wise per section</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Section</th>
                <th className="px-3 py-2 font-medium">Math</th>
                <th className="px-3 py-2 font-medium">Science</th>
                <th className="px-3 py-2 font-medium">English</th>
                <th className="px-3 py-2 font-medium">Social</th>
              </tr>
            </thead>
            <tbody>
              {syllabusBySection.map((row) => (
                <tr key={row.section} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-3 py-3 text-slate-700">{row.Mathematics}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.Science}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.English}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.Social}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function ProfileView({ profileForm, onProfileChange, onProfileSave, profileSaving, profileMessage }) {
  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Profile</p>
        <h2 className="mt-1 text-2xl font-semibold">Editable details</h2>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-name">Name</label>
            <input id="profile-name" name="name" value={profileForm.name} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-email">Email</label>
            <input id="profile-email" name="email" type="email" value={profileForm.email} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-number">Number</label>
            <input id="profile-number" name="number" value={profileForm.number} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium  text-slate-600" htmlFor="profile-role">Role</label>
            <input id="profile-role" name="role"   readOnly
 value={profileForm.role}  
className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 bg-slate-100 "            
            />
          </div>

          {profileMessage ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p>
          ) : null}

          <button type="submit" disabled={profileSaving} className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
            {profileSaving ? "Saving..." : "Update profile"}
          </button>
        </form>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Principal usage shortcuts</p>
        <h2 className="mt-1 text-2xl font-semibold">Quick actions</h2>
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Attendance checks: morning and evening windows</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Leave approvals with start and end date</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Send broadcast to teachers, students and parents</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Track syllabus and teacher performance</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Review events, calendar, timetable and auto-substitute status</div>
        </div>
      </article>
    </section>
  );
}

export default function AdminDashboard({ user = {} }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [activeTrend, setActiveTrend] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [broadcastMessages, setBroadcastMessages] = useState(initialBroadcastMessages);
  const [broadcastForm, setBroadcastForm] = useState({ audience: "Teachers", message: "" });
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    number: user.number || "",
    role: user.role || "principal",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const filteredAlerts = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return alerts;
    return alerts.filter((item) => item.title.toLowerCase().includes(term) || item.detail.toLowerCase().includes(term));
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];

    const index = [
      { tab: "overview", title: "Overview", text: "kpi teaching staff non teaching students classes sections transport" },
      { tab: "overview", title: "Attendance trend", text: "students teachers trend today weekly monthly" },
      { tab: "attendance", title: "Daily attendance windows", text: "morning evening students teachers count present" },
      { tab: "attendance", title: "Section attendance", text: "section a b c class 1st 10th 87/90" },
      { tab: "approvals", title: "Leave approvals", text: "leave start end date approve reject" },
      { tab: "communication", title: "Communication", text: "notifications teachers students parents message send" },
      { tab: "communication", title: "Syllabus completion", text: "syllabus completion subject section" },
      { tab: "communication", title: "Teacher performance", text: "teacher performance rating attendance" },
      { tab: "profile", title: "Profile", text: "profile name email number role" },
      { tab: "overview", title: "Events and calendar", text: "event sports competition calendar timetable auto substitute" },
    ];

    return index.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(term)).slice(0, 8);
  }, [searchQuery]);

  function handleLeaveDecision(id, decision) {
    setLeaveRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: decision } : request)));
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBroadcastInputChange(event) {
    const { name, value } = event.target;
    setBroadcastForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBroadcastSend() {
    if (!broadcastForm.message.trim()) {
      return;
    }

    setBroadcastMessages((prev) => [
      {
        id: Date.now(),
        audience: broadcastForm.audience,
        message: broadcastForm.message.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setBroadcastForm((prev) => ({ ...prev, message: "" }));
  }

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMessage("");

    const response = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });

    const payload = await response.json();
    setProfileSaving(false);

    if (!response.ok) {
      setProfileMessage(payload.error || "Unable to update profile.");
      return;
    }

    setProfileForm({
      name: payload.user.name || "",
      email: payload.user.email || "",
      number: payload.user.number || "",
      role: payload.user.role || "principal",
    });
    setProfileMessage("Profile updated successfully.");
  }

  return (
    <div className="min-h-dvh bg-[#eef3fb] text-slate-950 lg:flex">
      <SidebarNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pt-8">
          <section className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-base font-bold text-white">N</div>
                  <div>
                    <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                    <p className="text-sm text-slate-500">Principal Dashboard</p>
                  </div>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {profileForm.name || "Principal"}</h1>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/Admin_login" })}
                className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 lg:inline-flex"
              >
                Logout
              </button>
            </div>

            <div className="mt-5 flex items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search alerts, leaves, attendance, classes..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {searchResults.length > 0 ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search Results</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {searchResults.map((item) => (
                    <button
                      key={`${item.tab}-${item.title}`}
                      type="button"
                      onClick={() => setActiveMenu(item.tab)}
                      className="rounded-xl bg-white px-3 py-2 text-left text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {activeMenu === "overview" ? <OverviewView activeTrend={activeTrend} onTrendChange={setActiveTrend} leaveRequests={leaveRequests} /> : null}
          {activeMenu === "attendance" ? <AttendanceView /> : null}
          {activeMenu === "approvals" ? <ApprovalsView leaveRequests={leaveRequests} onDecision={handleLeaveDecision} /> : null}
          {activeMenu === "communication" ? (
            <CommunicationView
              broadcastMessages={broadcastMessages}
              onBroadcastInputChange={handleBroadcastInputChange}
              onBroadcastSend={handleBroadcastSend}
              broadcastForm={broadcastForm}
            />
          ) : null}
          {activeMenu === "profile" ? (
            <ProfileView
              profileForm={profileForm}
              onProfileChange={handleProfileChange}
              onProfileSave={handleProfileSave}
              profileSaving={profileSaving}
              profileMessage={profileMessage}
            />
          ) : null}
        </div>

        <MobileBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/Admin_login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: session.user?.id || "admin",
        name: session.user?.name || "Principal",
        email: session.user?.email ?? null,
        number: session.user?.phone ?? null,
        role: session.user?.role || "principal",
      },
    },
  };
}
