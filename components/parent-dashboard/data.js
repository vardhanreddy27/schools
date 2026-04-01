import {
  Bell,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  GraduationCap,
  LayoutGrid,
  MoreHorizontal,
  UserCircle2,
  TrendingDown,
} from "lucide-react";

export const parentMenuItems = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "academics", label: "Academics", icon: GraduationCap },
  { id: "more", label: "More", icon: MoreHorizontal },
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
  { id: 2, subject: "Maths", title: "Algebra worksheet - Equations", dueDate: "2026-03-29", priority: "high", description: "Complete exercises 5.1 to 5.3" },
  { id: 3, subject: "Science", title: "Digestive system diagram", dueDate: "2026-03-30", priority: "medium", description: "Labeled diagram with explanation" },
  { id: 4, subject: "Social", title: "Chapter notes - Climate", dueDate: "2026-03-31", priority: "medium", description: "Complete chapter 12 handwritten notes" },
];

// Assignments - shown separately in assignments tab
export const studentAssignments = [
  { id: 1, subject: "English", title: "Essay writing", dueDate: "2026-03-28", status: "Pending", description: "Write 500 words essay" },
  { id: 2, subject: "Maths", title: "Algebra worksheet", dueDate: "2026-03-29", status: "Pending", description: "Complete exercises 5.1 to 5.3" },
  { id: 3, subject: "Science", title: "Digestive system diagram", dueDate: "2026-03-30", status: "Submitted", description: "Labeled diagram with explanation" },
  { id: 4, subject: "Social", title: "Chapter notes - Climate", dueDate: "2026-03-31", status: "Pending", description: "Complete chapter 12 handwritten notes" },
];

// Subject performance - SHOWS WHERE CHILD IS LACKING
export const subjectPerformance = [
  { subject: "English", score: 78, target: 85, completion: 82, trend: "up", status: "good" },
  { subject: "Maths", score: 62, target: 80, completion: 76, trend: "down", status: "weak" }, // WEAK
  { subject: "Science", score: 81, target: 85, completion: 80, trend: "up", status: "good" },
  { subject: "Social", score: 68, target: 80, completion: 73, trend: "down", status: "weak" }, // WEAK
  { subject: "Hindi", score: 80, target: 85, completion: 84, trend: "stable", status: "good" },
  { subject: "Telugu", score: 83, target: 85, completion: 88, trend: "up", status: "good" },
];

// Performance alerts for parent
export const performanceAlerts = [
  { type: "weak-subject", subject: "Maths", score: 62, message: "Math score dropped 8 points. Focus needed.", severity: "high" },
  { type: "weak-subject", subject: "Social", score: 68, message: "Social Science is below average. Review notes.", severity: "high" },
  { type: "pending-homework", subject: "English", message: "Essay due tomorrow - not yet submitted", severity: "medium" },
  { type: "attendance", message: "2 absences this month - monitor carefully", severity: "medium" },
];

// School-wide and class-level messages shown in parent dashboard
export const parentNotifications = [
  {
    id: 1,
    title: "Parent-Teacher Meeting This Friday",
    message: "The term review meeting is scheduled for Friday at 4:00 PM. Please confirm your slot from the school portal.",
    sourceRole: "Principal",
    sourceName: "Dr. N. Sreenivas",
    category: "School",
    priority: "high",
    actionLabel: "Book Slot",
    date: "2026-03-29T09:30:00+05:30",
  },
  {
    id: 2,
    title: "Maths Revision Sheet Shared",
    message: "A short practice sheet has been uploaded for linear equations and word problems. Please complete it by Monday.",
    sourceRole: "Class Teacher",
    sourceName: "Ms. Kavya",
    category: "Academics",
    priority: "high",
    actionLabel: "Open Sheet",
    date: "2026-03-29T14:10:00+05:30",
  },
  {
    id: 3,
    title: "Sports Practice Moved Earlier",
    message: "Athletics practice begins 30 minutes early tomorrow. Please send sports shoes and a water bottle.",
    sourceRole: "PET",
    sourceName: "Mr. Raghav",
    category: "Sports",
    priority: "medium",
    actionLabel: "Acknowledge",
    date: "2026-03-28T18:20:00+05:30",
  },
  {
    id: 4,
    title: "Bus Route Delay Notice",
    message: "Morning pickup for your route may run 10 minutes late tomorrow because of road maintenance.",
    sourceRole: "Transport",
    sourceName: "Transport Desk",
    category: "Transport",
    priority: "medium",
    actionLabel: "View Update",
    date: "2026-03-28T20:05:00+05:30",
  },
  {
    id: 5,
    title: "Unit Test Timetable Published",
    message: "The next unit test schedule is now live. Please review the dates and subjects with your child.",
    sourceRole: "Exam Cell",
    sourceName: "Assessment Team",
    category: "Exams",
    priority: "high",
    actionLabel: "Open Timetable",
    date: "2026-03-27T11:00:00+05:30",
  },
  {
    id: 6,
    title: "Counsellor Check-In Available",
    message: "Weekly well-being support sessions are open for students preparing for exams and presentations.",
    sourceRole: "Counsellor",
    sourceName: "Ms. Prerna",
    category: "Wellbeing",
    priority: "low",
    actionLabel: "Request Slot",
    date: "2026-03-27T16:25:00+05:30",
  },
  {
    id: 7,
    title: "Library Book Return Reminder",
    message: "One library book is due for return by Monday to avoid a late fee.",
    sourceRole: "Library",
    sourceName: "Library Desk",
    category: "School",
    priority: "medium",
    actionLabel: "View Details",
    date: "2026-03-26T12:40:00+05:30",
  },
  {
    id: 8,
    title: "Science Activity Materials",
    message: "Please bring chart paper and color pens for Monday's digestive system activity.",
    sourceRole: "Subject Teacher",
    sourceName: "Mr. Harish",
    category: "Academics",
    priority: "low",
    actionLabel: "View Materials",
    date: "2026-03-25T17:10:00+05:30",
  },
  {
    id: 9,
    title: "Safety Drill This Week",
    message: "A school safety drill is planned this week. Students will follow class teacher instructions.",
    sourceRole: "Principal",
    sourceName: "Dr. N. Sreenivas",
    category: "School",
    priority: "medium",
    actionLabel: "Read Advisory",
    date: "2026-03-24T08:30:00+05:30",
  },
  {
    id: 10,
    title: "Fitness Log Submission",
    message: "Please sign and send the weekly fitness log tomorrow for participation tracking.",
    sourceRole: "PET",
    sourceName: "Mr. Raghav",
    category: "Sports",
    priority: "low",
    actionLabel: "Open Log",
    date: "2026-03-23T19:00:00+05:30",
  },
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
  { day: "Mon", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Tue", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Wed", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Thu", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Fri", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
  { day: "Sat", periods: ["Math", "Telugu", "English", "Science", "Social", "Games"] },
];

// Upcoming tests
export const upcomingTests = [
  { id: 1, subject: "Maths", chapter: "Linear Equations", date: "2026-03-28", syllabus: "Exercises 5.1 to 5.3", difficulty: "High", needsAttention: true },
  { id: 2, subject: "Science", chapter: "Nutrition in Animals", date: "2026-03-31", syllabus: "Chapter 7 full", difficulty: "Medium" },
  { id: 3, subject: "English", chapter: "Prose + Grammar", date: "2026-04-03", syllabus: "Lesson 4 and tenses", difficulty: "Medium" },
];

// Performance insights and analysis
export const performanceInsights = [
  {
    title: "Areas Needing Improvement",
    items: [
      "Maths: Score dropped from 70 to 62 - focus on equations and algebra",
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
  contact: "+91 9346362201",
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
