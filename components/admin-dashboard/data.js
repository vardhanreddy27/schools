import {
  Bell,
  BookOpen,
  Briefcase,
  Bus,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutGrid,
  Megaphone,
  ShieldAlert,
  UserCircle2,
  UserRoundCheck,
  Users,
} from "lucide-react";

export const trendTabs = ["Today", "Weekly", "Monthly"];

export const attendanceTrend = {
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

export const attendanceWindows = [
  { period: "Morning", studentsPresent: 1218, studentsTotal: 1286, teachersPresent: 46, teachersTotal: 48 },
  { period: "Evening", studentsPresent: 1194, studentsTotal: 1286, teachersPresent: 45, teachersTotal: 48 },
];

export const sectionWiseAttendance = [
  { section: "9-A", morning: "39/42", evening: "38/42", teachersMorning: "5/5", teachersEvening: "5/5" },
  { section: "9-B", morning: "37/40", evening: "36/40", teachersMorning: "5/5", teachersEvening: "4/5" },
  { section: "9-C", morning: "35/38", evening: "34/38", teachersMorning: "5/5", teachersEvening: "5/5" },
  { section: "10-A", morning: "42/45", evening: "41/45", teachersMorning: "5/5", teachersEvening: "5/5" },
  { section: "10-B", morning: "40/44", evening: "39/44", teachersMorning: "5/5", teachersEvening: "5/5" },
  { section: "10-C", morning: "38/42", evening: "37/42", teachersMorning: "5/5", teachersEvening: "5/5" },
];

export const topMetrics = [
  { key: "teaching", title: "Teaching Staff", value: "48", icon: Users },
  { key: "nonTeaching", title: "Non-Teaching Staff", value: "21", icon: Briefcase },
  { key: "students", title: "Students", value: "1,286", icon: GraduationCap },
  { key: "classes", title: "Classes", value: "18", icon: LayoutGrid },
  { key: "sections", title: "Sections", value: "32", icon: LayoutGrid },
  { key: "buses", title: "Transport Buses", value: "12", icon: Bus },
];

export const metricDrilldown = {
  teaching: {
    title: "Teaching Staff Details",
    subtitle: "Subject, class ownership and attendance",
    columns: ["Teacher", "Subject", "Classes", "Today"],
    rows: [
      ["Ms. Kavya", "Mathematics", "9-A, 10-A", "Present"],
      ["Mr. Rakesh", "Science", "8-B, 9-B", "Present"],
      ["Ms. Sowmya", "English", "7-A, 8-A", "Present"],
      ["Mr. Harish", "Social", "9-C, 10-C", "On Leave"],
    ],
  },
  nonTeaching: {
    title: "Non-Teaching Staff Details",
    subtitle: "Support teams and today status",
    columns: ["Name", "Role", "Shift", "Today"],
    rows: [
      ["Anil Kumar", "Lab Assistant", "Morning", "Present"],
      ["Prasad", "Transport Incharge", "Full Day", "Present"],
      ["Sunitha", "Admin Office", "Morning", "Present"],
      ["Ramu", "Security", "Evening", "Present"],
    ],
  },
  students: {
    title: "Student Distribution",
    subtitle: "Class-wise and section-wise student strength",
    columns: ["Class", "Sections", "Total Students", "Today"],
    rows: [
      ["9th", "A, B, C", "120", "111/120"],
      ["10th", "A, B, C", "131", "120/131"],
      ["8th", "A, B", "86", "80/86"],
      ["7th", "A, B", "85", "79/85"],
    ],
  },
  classes: {
    title: "Classes Overview",
    subtitle: "Total classes and mapped sections",
    columns: ["Grade", "Sections", "Class Teacher", "Room"],
    rows: [
      ["9th", "A, B, C", "Ms. Kavya", "R-21"],
      ["10th", "A, B, C", "Mr. Rakesh", "R-24"],
      ["8th", "A, B", "Ms. Sowmya", "R-17"],
      ["7th", "A, B", "Mr. Harish", "R-13"],
    ],
  },
  sections: {
    title: "Sections Overview",
    subtitle: "Section strength and attendance",
    columns: ["Section", "Students", "Class Teacher", "Attendance"],
    rows: [
      ["9-A", "42", "Ms. Kavya", "39/42"],
      ["9-B", "40", "Mr. Rakesh", "37/40"],
      ["10-A", "45", "Ms. Sowmya", "42/45"],
      ["10-C", "42", "Mr. Harish", "38/42"],
    ],
  },
  buses: {
    title: "Transport Buses",
    subtitle: "Route, live location, driver and onboard students",
    columns: ["Bus", "Route", "Driver", "Onboard"],
    rows: [
      ["Bus-01", "North Zone", "Ravi", "41 students"],
      ["Bus-04", "East Zone", "Suresh", "38 students"],
      ["Bus-08", "South Zone", "Mahesh", "44 students"],
      ["Bus-11", "West Zone", "Naresh", "36 students"],
    ],
  },
};

export const highlights = [
  { title: "Open Alerts", value: 4, subtitle: "Need action", color: "#111827" },
  { title: "Pending Leaves", value: 2, subtitle: "Waiting approval", color: "#d97706" },
  { title: "Approved", value: 1, subtitle: "Completed", color: "#059669" },
];

export const alerts = [
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
    detail: "Absent teacher periods auto-assigned to available subject teachers.",
    priority: "High",
    icon: UserRoundCheck,
  },
];

export const initialLeaveRequests = [
  { id: 1, name: "Kavya R", role: "Math Teacher", staffType: "Teaching", leaveType: "Medical", startDate: "2026-03-17", endDate: "2026-03-19", days: 3, status: "Pending" },
  { id: 2, name: "Anil Kumar", role: "Lab Assistant", staffType: "Non-Teaching", leaveType: "Casual", startDate: "2026-03-16", endDate: "2026-03-16", days: 1, status: "Pending" },
  { id: 3, name: "Sowmya", role: "English Teacher", staffType: "Teaching", leaveType: "Medical", startDate: "2026-03-14", endDate: "2026-03-15", days: 2, status: "Approved" },
  { id: 4, name: "Prasad", role: "Transport Incharge", staffType: "Non-Teaching", leaveType: "Emergency", startDate: "2026-03-13", endDate: "2026-03-13", days: 1, status: "Rejected" },
];

export const notices = [
  { audience: "Teachers", icon: Bell, sentToday: 6 },
  { audience: "Students", icon: BookOpen, sentToday: 9 },
  { audience: "Parents", icon: Megaphone, sentToday: 12 },
];

export const teacherPerformance = [
  { name: "Ms. Kavya", subject: "Mathematics", attendance: "22/23", syllabus: "86%", rating: "A" },
  { name: "Mr. Rakesh", subject: "Science", attendance: "21/23", syllabus: "82%", rating: "A" },
  { name: "Ms. Sowmya", subject: "English", attendance: "23/23", syllabus: "89%", rating: "A+" },
  { name: "Mr. Harish", subject: "Social", attendance: "20/23", syllabus: "78%", rating: "B+" },
];

export const initialBroadcastMessages = [
  { id: 1, audience: "Teachers", message: "Submit evening attendance by 4:15 PM.", time: "10:30 AM" },
  { id: 2, audience: "Parents", message: "PTM schedule shared in parent app.", time: "11:20 AM" },
];

export const upcomingModules = [
  { title: "Sports Meet", detail: "Inter-house athletics on Friday, 9:30 AM" },
  { title: "Competitions", detail: "Math and Science competitions registration closes tomorrow" },
  { title: "Results", detail: "Unit test results publication scheduled for 21 March" },
  { title: "Calendar", detail: "Parent meeting and lab schedule synced to academic calendar" },
];

export const timetableModules = [
  { title: "Timetable Update", detail: "Class 9-B and 10-A evening periods rebalanced" },
  { title: "Substitute Engine", detail: "Absent teacher slots auto-assigned by workload rules" },
  { title: "Attendance Exceptions", detail: "2 late teachers flagged and mapped to backup coverage" },
];

export const syllabusBySection = [
  { section: "9-A", Mathematics: 82, Science: 76, English: 88, Social: 72 },
  { section: "9-B", Mathematics: 79, Science: 71, English: 86, Social: 70 },
  { section: "10-A", Mathematics: 84, Science: 81, English: 89, Social: 75 },
  { section: "10-B", Mathematics: 77, Science: 74, English: 83, Social: 69 },
];

export const navItems = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "approvals", label: "Approvals", icon: UserRoundCheck },
  { id: "communication", label: "Communication", icon: Bell },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];
