import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutGrid,
  UserCircle2,
} from "lucide-react";

export const studentMenuItems = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "more", label: "More", icon: UserCircle2 },
];

export const studentSummary = [
  { title: "Attendance", value: "93%", note: "Present 26 / 28 days", tone: "emerald" },
  { title: "Homework Due", value: "3", note: "English, Math, Science", tone: "amber" },
  { title: "Upcoming Tests", value: "2", note: "Math (Fri), Science (Mon)", tone: "blue" },
  { title: "Announcements", value: "4", note: "2 new today", tone: "rose" },
];

export const studentTodaySchedule = [
  { period: "P1", time: "08:40 AM", subject: "English", teacher: "Ms. Sowmya" },
  { period: "P2", time: "09:35 AM", subject: "Maths", teacher: "Mr. Rakesh" },
  { period: "P3", time: "10:30 AM", subject: "Science", teacher: "Ms. Nisha" },
  { period: "P5", time: "12:45 PM", subject: "Social", teacher: "Mr. Harish" },
];

export const studentAssignments = [
  { id: 1, subject: "English", title: "Essay writing", dueDate: "2026-03-28", status: "Pending" },
  { id: 2, subject: "Maths", title: "Algebra worksheet", dueDate: "2026-03-29", status: "Pending" },
  { id: 3, subject: "Science", title: "Digestive system diagram", dueDate: "2026-03-30", status: "Pending" },
  { id: 4, subject: "Telugu", title: "Poem reading", dueDate: "2026-03-27", status: "Submitted" },
];

export const studentAnnouncements = [
  {
    id: 1,
    title: "Principal Message: Assembly Update",
    detail: "Monday assembly starts 15 minutes early. Be in uniform and report by 8:15 AM.",
    sourceRole: "Principal",
    sourceName: "Mrs. Kavitha",
    category: "School",
    priority: "high",
    actionLabel: "View Notice",
    date: "2026-03-30T08:05:00+05:30",
    icon: Bell,
  },
  {
    id: 2,
    title: "Math Teacher Reminder",
    detail: "Submit algebra worksheet tomorrow and revise exercise 5.3 for quick test.",
    sourceRole: "Subject Teacher",
    sourceName: "Mr. Rakesh",
    category: "Academics",
    priority: "high",
    actionLabel: "Open Homework",
    date: "2026-03-30T10:45:00+05:30",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "PET Notice: Practice Session",
    detail: "Inter-house athletics practice starts at 4:00 PM. Bring shoes and water bottle.",
    sourceRole: "PET",
    sourceName: "Mr. Raghav",
    category: "Sports",
    priority: "medium",
    actionLabel: "View Schedule",
    date: "2026-03-30T12:20:00+05:30",
    icon: CalendarDays,
  },
  {
    id: 4,
    title: "Class Teacher Update",
    detail: "Bring signed test papers tomorrow. Parent signature is mandatory for records.",
    sourceRole: "Class Teacher",
    sourceName: "Ms. Nisha",
    category: "Academics",
    priority: "medium",
    actionLabel: "Acknowledge",
    date: "2026-03-29T16:10:00+05:30",
    icon: Bell,
  },
  {
    id: 5,
    title: "Library Reminder",
    detail: "Return your borrowed story book by Wednesday to avoid late fee.",
    sourceRole: "Library",
    sourceName: "Library Desk",
    category: "School",
    priority: "low",
    actionLabel: "View Details",
    date: "2026-03-29T11:35:00+05:30",
    icon: BookOpen,
  },
  {
    id: 6,
    title: "Transport Desk Alert",
    detail: "Bus route 3 may be delayed by 10 minutes due to roadwork near main junction.",
    sourceRole: "Transport",
    sourceName: "Transport Desk",
    category: "Transport",
    priority: "medium",
    actionLabel: "Track Bus",
    date: "2026-03-28T07:40:00+05:30",
    icon: CalendarDays,
  },
  {
    id: 7,
    title: "Counsellor Session Slot",
    detail: "Optional stress-management session available before exams. Register if interested.",
    sourceRole: "Counsellor",
    sourceName: "Ms. Prerna",
    category: "Wellbeing",
    priority: "low",
    actionLabel: "Book Slot",
    date: "2026-03-27T14:20:00+05:30",
    icon: Bell,
  },
];

export const attendanceMonthly = [
  { label: "Week 1", present: 6, absent: 0 },
  { label: "Week 2", present: 5, absent: 1 },
  { label: "Week 3", present: 6, absent: 0 },
  { label: "Week 4", present: 5, absent: 1 },
];

export const attendanceLog = [
  { date: "2026-03-26", status: "Present", checkIn: "08:32 AM", note: "On time" },
  { date: "2026-03-25", status: "Present", checkIn: "08:36 AM", note: "On time" },
  { date: "2026-03-24", status: "Absent", checkIn: "-", note: "Medical leave" },
  { date: "2026-03-23", status: "Present", checkIn: "08:34 AM", note: "On time" },
  { date: "2026-03-22", status: "Present", checkIn: "08:37 AM", note: "On time" },
  { date: "2026-03-21", status: "Absent", checkIn: "-", note: "Dummy data entry" },
  { date: "2026-03-20", status: "Present", checkIn: "08:31 AM", note: "Dummy data entry" },
];

export const studentTimetable = [
  { day: "Mon", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Tue", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Wed", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Thu", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Fri", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Sat", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
];

export const upcomingTests = [
  { id: 1, subject: "Maths", chapter: "Linear Equations", date: "2026-03-28", syllabus: "Exercises 5.1 to 5.3" },
  { id: 2, subject: "Science", chapter: "Nutrition in Animals", date: "2026-03-31", syllabus: "Chapter 7 full" },
  { id: 3, subject: "English", chapter: "Prose + Grammar", date: "2026-04-03", syllabus: "Lesson 4 and tenses" },
];

export const subjectProgress = [
  { subject: "English", completion: 82, score: 78 },
  { subject: "Maths", completion: 76, score: 74 },
  { subject: "Science", completion: 80, score: 81 },
  { subject: "Social", completion: 73, score: 77 },
  { subject: "Hindi", completion: 84, score: 80 },
  { subject: "Telugu", completion: 88, score: 83 },
];

export const studentResources = [
  { id: 1, title: "Math Formula Sheet", type: "PDF", updated: "Today" },
  { id: 2, title: "Science Diagrams Pack", type: "PDF", updated: "Yesterday" },
  { id: 3, title: "English Grammar Notes", type: "Doc", updated: "2 days ago" },
];

export const studentProfileDefaults = {
  name: "Student",
  className: "8th",
  section: "A",
  rollNumber: "23",
  parentName: "Suresh Kumar",
  contact: "+91 9XXXXXXXXX",
};
