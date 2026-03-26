import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  AlertTriangle,
  GraduationCap,
  LayoutGrid,
  UserCircle2,
  TrendingDown,
} from "lucide-react";

export const parentMenuItems = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "reports", label: "Reports", icon: TrendingDown },
];

export const parentSummary = [
  { title: "Attendance", value: "93%", note: "Present 26 / 28 days", tone: "emerald" },
  { title: "Homework Pending", value: "3", note: "3 subjects", tone: "amber" },
  { title: "Weak Subjects", value: "2", note: "Math, Social", tone: "rose" },
  { title: "Upcoming Tests", value: "2", note: "This week", tone: "blue" },
];

// Child info shown in parent dashboard
export const childInfo = {
  name: "Arjun Kumar",
  className: "8th",
  section: "A",
  rollNumber: "23",
  photo: null,
};

// Pending homework - shows what's due when
export const pendingHomework = [
  { id: 1, subject: "English", title: "Essay writing on 'My School'", dueDate: "2026-03-28", priority: "high", description: "Write 500 words essay" },
  { id: 2, subject: "Mathematics", title: "Algebra worksheet - Equations", dueDate: "2026-03-29", priority: "high", description: "Complete exercises 5.1 to 5.3" },
  { id: 3, subject: "Science", title: "Digestive system diagram", dueDate: "2026-03-30", priority: "medium", description: "Labeled diagram with explanation" },
  { id: 4, subject: "Social", title: "Chapter notes - Climate", dueDate: "2026-03-31", priority: "medium", description: "Complete chapter 12 handwritten notes" },
];

// Subject performance - SHOWS WHERE CHILD IS LACKING
export const subjectPerformance = [
  { subject: "English", score: 78, target: 85, completion: 82, trend: "up", status: "good" },
  { subject: "Mathematics", score: 62, target: 80, completion: 76, trend: "down", status: "weak" }, // WEAK
  { subject: "Science", score: 81, target: 85, completion: 80, trend: "up", status: "good" },
  { subject: "Social", score: 68, target: 80, completion: 73, trend: "down", status: "weak" }, // WEAK
  { subject: "Hindi", score: 80, target: 85, completion: 84, trend: "stable", status: "good" },
  { subject: "Telugu", score: 83, target: 85, completion: 88, trend: "up", status: "good" },
];

// Performance alerts for parent
export const performanceAlerts = [
  { type: "weak-subject", subject: "Mathematics", score: 62, message: "Math score dropped 8 points. Focus needed.", severity: "high" },
  { type: "weak-subject", subject: "Social", score: 68, message: "Social Science is below average. Review notes.", severity: "high" },
  { type: "pending-homework", subject: "English", message: "Essay due tomorrow - not yet submitted", severity: "medium" },
  { type: "attendance", message: "2 absences this month - monitor carefully", severity: "medium" },
];

// Attendance tracking
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

// Child's timetable
export const childTimetable = [
  { day: "Mon", periods: ["English", "Math", "Science", "Telugu", "Social", "Games"] },
  { day: "Tue", periods: ["Math", "English", "Hindi", "Science", "Computer", "Library"] },
  { day: "Wed", periods: ["Science", "Math", "English", "Social", "Telugu", "Art"] },
  { day: "Thu", periods: ["English", "Science", "Math", "Hindi", "Social", "Games"] },
  { day: "Fri", periods: ["Math", "English", "Computer", "Science", "Social", "Club"] },
  { day: "Sat", periods: ["Assembly", "English", "Math", "Science", "Activity", "PT"] },
];

// Upcoming tests
export const upcomingTests = [
  { id: 1, subject: "Mathematics", chapter: "Linear Equations", date: "2026-03-28", syllabus: "Exercises 5.1 to 5.3", difficulty: "High", needsAttention: true },
  { id: 2, subject: "Science", chapter: "Nutrition in Animals", date: "2026-03-31", syllabus: "Chapter 7 full", difficulty: "Medium" },
  { id: 3, subject: "English", chapter: "Prose + Grammar", date: "2026-04-03", syllabus: "Lesson 4 and tenses", difficulty: "Medium" },
];

// Performance insights and analysis
export const performanceInsights = [
  {
    title: "Areas Needing Improvement",
    items: [
      "Mathematics: Score dropped from 70 to 62 - focus on equations and algebra",
      "Social Studies: Consistent underperformance (68%) - needs structured study plan",
    ],
    severity: "high",
  },
  {
    title: "Strengths",
    items: [
      "Telugu: Consistently high performance (83%)",
      "Science: Steady improvement with last test score of 81%",
      "English: Good literary analysis done in essays",
    ],
    severity: "low",
  },
  {
    title: "Recommendations",
    items: [
      '1. Spend 30 mins daily on Math - focus on problem solving',
      "2. Review Social Studies notes weekly instead of cramming",
      "3. Encourage participation in Science club to build confidence",
      "4. Continue Telugu - maintain momentum by extra reading",
    ],
    severity: "info",
  },
];

// Progress trend data
export const monthlyProgressTrend = [
  { month: "January", avg: 75 },
  { month: "February", avg: 76 },
  { month: "March", avg: 74 },
];

export const parentProfileDefaults = {
  parentName: "Parent",
  contact: "+91 9XXXXXXXXX",
  childName: "Arjun Kumar",
  childClass: "8th",
  childSection: "A",
  childRollNumber: "23",
};

// Function to get color for weak subjects
export function getSubjectStatus(score) {
  if (score >= 80) return { status: "good", color: "emerald", icon: "✓" };
  if (score >= 70) return { status: "fair", color: "amber", icon: "!" };
  return { status: "weak", color: "rose", icon: "!" };
}
