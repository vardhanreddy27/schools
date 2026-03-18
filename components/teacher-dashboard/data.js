import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Megaphone,
  Notebook,
  UserCircle2,
} from "lucide-react";

export const TEACHER_SUBJECT = "English";

export const todayClasses = [
  { period: "P1", time: "08:40 AM", subject: "English", className: "8th", section: "A", room: "R-204" },
  { period: "P2", time: "09:35 AM", subject: "English", className: "7th", section: "C", room: "R-112" },
  { period: "P4", time: "11:20 AM", subject: "English", className: "9th", section: "B", room: "R-307" },
  { period: "P6", time: "01:55 PM", subject: "English", className: "10th", section: "A", room: "R-403" },
];

export const weekPlan = [
  { label: "Today", time: "08:30 AM", focus: "Grammar quiz briefing - Class 8A", status: "quiz" },
  { label: "Tomorrow", time: "09:15 AM", focus: "Reading check - Class 7C", status: "homework" },
  { label: "Thu", time: "11:00 AM", focus: "Unit test revision block", status: "exam" },
  { label: "Fri", time: "01:30 PM", focus: "Essay evaluation hour", status: "grading" },
  { label: "Sat", time: "10:00 AM", focus: "Parent feedback notes", status: "meeting" },
];

export const monthlyCalendarEvents = [
  { date: "2026-03-18", type: "quiz", title: "9th B - Grammar Quiz" },
  { date: "2026-03-19", type: "homework", title: "General: Notebook check" },
  { date: "2026-03-21", type: "meeting", title: "General: Staff meeting" },
  { date: "2026-03-24", type: "exam", title: "10th A - Unit test" },
  { date: "2026-03-27", type: "quiz", title: "8th A - Vocabulary quiz" },
  { date: "2026-03-29", type: "meeting", title: "General: Parent connect prep" },
];

export const attendanceClasses = [
  {
    id: "class-8a",
    className: "8th",
    section: "A",
    strength: 42,
  },
  {
    id: "class-5a",
    className: "5th",
    section: "A",
    strength: 38,
  },
  {
    id: "class-9b",
    className: "9th",
    section: "B",
    strength: 44,
  },
];

export const teacherSelfAttendance = {
  morning: { status: "Present", checkIn: "08:24 AM" },
  afternoon: { status: "Pending", checkIn: "Not marked" },
  monthSummary: "16 / 17 working days",
};

export const dashboardInsights = [
  { title: "Attendance to submit", value: "2 sessions", note: "9A, 8B", tone: "amber" },
  { title: "Assignments to review", value: "18", note: "Essay set from 9B and 10A", tone: "blue" },
  { title: "Quiz papers ready", value: "3", note: "Grammar + Vocabulary", tone: "emerald" },
  { title: "Parent updates pending", value: "5", note: "Low attendance alerts", tone: "rose" },
];

export const moreTools = [
  { key: "sectionPerformance", title: "Section Performance", subtitle: "My subject by class/section", icon: UserCircle2 },
  { key: "lessonPlanner", title: "Lesson Planner", subtitle: "Plan weekly delivery", icon: ClipboardCheck },
  { key: "quizCenter", title: "Add Lesson Quiz", subtitle: "Create and review quizzes", icon: FileText },
  { key: "notesCenter", title: "Class Notes", subtitle: "Add and manage notes", icon: Notebook },
  { key: "announcements", title: "Announcements", subtitle: "Send class updates", icon: Megaphone },
  { key: "learningResources", title: "Learning Resources", subtitle: "Share notes and links", icon: BookOpen },
];

export const moreToolDetails = {
  sectionPerformance: {
    title: "Section Performance",
    summary: "View your subject performance section-wise and spot classes that need remediation support.",
  },
  lessonPlanner: {
    title: "Lesson Planner",
    summary: "Plan lesson flow by class, set outcomes, and track completion across weekly periods.",
  },
  quizCenter: {
    title: "Add Lesson Quiz",
    summary: "Create quiz sets by class and section, then review all active and draft quizzes.",
  },
  notesCenter: {
    title: "Class Notes",
    summary: "Maintain classroom notes per lesson and section with quick edit and archive support.",
  },
  announcements: {
    title: "Announcements",
    summary: "Draft updates for classes and parents, then post announcements section-wise.",
  },
  learningResources: {
    title: "Learning Resources",
    summary: "Upload revision worksheets for the monthly exam and tag class sections directly.",
  },
};
