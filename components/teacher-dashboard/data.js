import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  FileText,
  Megaphone,
  Notebook,
  UserPlus,
  UserCircle2,
} from "lucide-react";

export const TEACHER_SUBJECT = "Physics";

export const todayClasses = [
  { period: "P1", time: "08:40 AM", subject: "Physics", className: "8th", section: "A", room: "R-204" },
  { period: "P3", time: "10:30 AM", subject: "Physics", className: "9th", section: "A", room: "R-307" },
  { period: "P4", time: "11:30 AM", subject: "Physics", className: "10th", section: "A", room: "R-307" },
  { period: "P5", time: "12:45 PM", subject: "Physics", className: "9th", section: "B", room: "R-307" },
  { period: "P7", time: "02:50 PM", subject: "Physics", className: "10th", section: "B", room: "R-403" },
  { period: "P8", time: "04:50 PM", subject: "Physics", className: "10th", section: "A", room: "R-403" },
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

export const teacherSections = [
  {
    id: "9-a",
    className: "9th",
    section: "A",
    isClassTeacher: false,
    totalStudents: 41,
    attendancePercent: 92,
    performancePercent: 78,
    trend: [84, 86, 88, 91, 92],
    students: [
      "Aarav",
      "Diya",
      "Rohan",
      "Sneha",
      "Nikhil",
      "Tanvi",
      "Karthik",
      "Moksha",
      "Pranav",
      "Ishita",
    ],
    studentPerformance: [
      { name: "Aarav", subjectPerformance: 91, attendance: 97 },
      { name: "Diya", subjectPerformance: 88, attendance: 95 },
      { name: "Rohan", subjectPerformance: 48, attendance: 82 },
      { name: "Sneha", subjectPerformance: 76, attendance: 94 },
      { name: "Nikhil", subjectPerformance: 51, attendance: 86 },
      { name: "Tanvi", subjectPerformance: 72, attendance: 72 },
      { name: "Karthik", subjectPerformance: 85, attendance: 93 },
      { name: "Moksha", subjectPerformance: 67, attendance: 74 },
      { name: "Pranav", subjectPerformance: 49, attendance: 90 },
      { name: "Ishita", subjectPerformance: 83, attendance: 96 },
    ],
    weakPerformers: ["Rohan - 48%", "Nikhil - 51%", "Pranav - 49%"],
    lowAttendance: ["Tanvi - 72%", "Moksha - 74%"],
    upcomingTasks: [
      "Grammar worksheet review",
      "Parent call for low attendance students",
      "Reading quiz on Friday",
    ],
  },
  {
    id: "9-b",
    className: "9th",
    section: "B",
    isClassTeacher: false,
    totalStudents: 39,
    attendancePercent: 89,
    performancePercent: 75,
    trend: [79, 82, 84, 87, 89],
    students: [
      "Saanvi",
      "Anika",
      "Vihaan",
      "Krishna",
      "Meera",
      "Harsha",
      "Ritika",
      "Dev",
      "Nitya",
      "Arjun",
    ],
    studentPerformance: [
      { name: "Saanvi", subjectPerformance: 90, attendance: 96 },
      { name: "Anika", subjectPerformance: 86, attendance: 94 },
      { name: "Vihaan", subjectPerformance: 79, attendance: 91 },
      { name: "Krishna", subjectPerformance: 46, attendance: 88 },
      { name: "Meera", subjectPerformance: 81, attendance: 93 },
      { name: "Harsha", subjectPerformance: 63, attendance: 70 },
      { name: "Ritika", subjectPerformance: 68, attendance: 73 },
      { name: "Dev", subjectPerformance: 52, attendance: 85 },
      { name: "Nitya", subjectPerformance: 77, attendance: 89 },
      { name: "Arjun", subjectPerformance: 84, attendance: 92 },
    ],
    weakPerformers: ["Krishna - 46%", "Dev - 52%"],
    lowAttendance: ["Harsha - 70%", "Ritika - 73%"],
    upcomingTasks: [
      "Unit test paper discussion",
      "Notebook check completion",
      "Doubt-clearing session",
    ],
  },
  {
    id: "8-a",
    className: "8th",
    section: "A",
    isClassTeacher: true,
    totalStudents: 44,
    attendancePercent: 94,
    performancePercent: 81,
    trend: [85, 88, 90, 93, 94],
    students: [
      "Aadhya",
      "Vivaan",
      "Charan",
      "Ira",
      "Naveen",
      "Suhani",
      "Ritesh",
      "Pooja",
      "Laksh",
      "Myra",
    ],
    studentPerformance: [
      { name: "Aadhya", subjectPerformance: 93, attendance: 98 },
      { name: "Vivaan", subjectPerformance: 87, attendance: 96 },
      { name: "Charan", subjectPerformance: 66, attendance: 71 },
      { name: "Ira", subjectPerformance: 82, attendance: 95 },
      { name: "Naveen", subjectPerformance: 50, attendance: 84 },
      { name: "Suhani", subjectPerformance: 79, attendance: 92 },
      { name: "Ritesh", subjectPerformance: 54, attendance: 86 },
      { name: "Pooja", subjectPerformance: 85, attendance: 94 },
      { name: "Laksh", subjectPerformance: 81, attendance: 91 },
      { name: "Myra", subjectPerformance: 89, attendance: 97 },
    ],
    weakPerformers: ["Naveen - 50%", "Ritesh - 54%"],
    lowAttendance: ["Charan - 71%"],
    upcomingTasks: [
      "Class teacher meeting prep",
      "Progress report submission",
      "Speaking activity assessment",
    ],
  },
  {
    id: "10-b",
    className: "10th",
    section: "B",
    isClassTeacher: false,
    totalStudents: 37,
    attendancePercent: 87,
    performancePercent: 74,
    trend: [76, 78, 81, 84, 87],
    students: [
      "Reyansh",
      "Siri",
      "Aditya",
      "Harini",
      "Naman",
      "Sakshi",
      "Tejas",
      "Aisha",
      "Yash",
      "Vidhi",
    ],
    studentPerformance: [
      { name: "Reyansh", subjectPerformance: 88, attendance: 95 },
      { name: "Siri", subjectPerformance: 84, attendance: 92 },
      { name: "Aditya", subjectPerformance: 72, attendance: 69 },
      { name: "Harini", subjectPerformance: 79, attendance: 91 },
      { name: "Naman", subjectPerformance: 47, attendance: 83 },
      { name: "Sakshi", subjectPerformance: 82, attendance: 90 },
      { name: "Tejas", subjectPerformance: 53, attendance: 85 },
      { name: "Aisha", subjectPerformance: 68, attendance: 72 },
      { name: "Yash", subjectPerformance: 50, attendance: 84 },
      { name: "Vidhi", subjectPerformance: 86, attendance: 94 },
    ],
    weakPerformers: ["Naman - 47%", "Tejas - 53%", "Yash - 50%"],
    lowAttendance: ["Aditya - 69%", "Aisha - 72%"],
    upcomingTasks: [
      "Board exam writing practice",
      "Revision test scheduling",
      "Parent communication for remediation",
    ],
  },
];

export const quizChaptersBySection = {
  "8-a": [
    { id: "motion-force", title: "Force and Pressure", status: "submitted" },
    { id: "light", title: "Light", status: "added" },
    { id: "sound", title: "Sound", status: "none" },
    { id: "chemical-effects", title: "Chemical Effects of Electric Current", status: "none" },
  ],
  "9-a": [
    { id: "matter-nature", title: "Matter in Our Surroundings", status: "added" },
    { id: "atoms-molecules", title: "Atoms and Molecules", status: "submitted" },
    { id: "gravitation", title: "Gravitation", status: "none" },
    { id: "work-energy", title: "Work and Energy", status: "none" },
  ],
  "9-b": [
    { id: "laws-motion", title: "Laws of Motion", status: "added" },
    { id: "sound", title: "Sound", status: "none" },
    { id: "floatation", title: "Floatation", status: "none" },
    { id: "natural-resources", title: "Natural Resources", status: "submitted" },
  ],
  "10-b": [
    { id: "electricity", title: "Electricity", status: "submitted" },
    { id: "magnetic-effects", title: "Magnetic Effects of Electric Current", status: "added" },
    { id: "sources-energy", title: "Sources of Energy", status: "none" },
    { id: "human-eye", title: "The Human Eye and Colourful World", status: "none" },
  ],
};

export const moreTools = [
  { key: "sectionPerformance", title: "Class Performance", subtitle: "My subject by class/section", icon: UserCircle2 },
  { key: "enrollStudents", title: "Class Enrollment", subtitle: "Enroll and track class strength", icon: UserPlus },
  { key: "leaveRequests", title: "Leave Request", subtitle: "Apply leave with date range", icon: ClipboardCheck },
  { key: "quizCenter", title: "Add Lesson Quiz", subtitle: "Create and review quizzes", icon: FileText },
  { key: "quizResults", title: "View Quiz Results", subtitle: "Open quiz-wise student scores", icon: BarChart3 },
  { key: "notesCenter", title: "Class Notes", subtitle: "Add and manage notes", icon: Notebook },
  { key: "announcements", title: "Announcements", subtitle: "Send class updates", icon: Megaphone },
  { key: "learningResources", title: "Learning Resources", subtitle: "Share notes and links", icon: BookOpen },
  { key: "academicCalendar", title: "Academic Calendar", subtitle: "View and manage the academic calendar", icon: BookOpen},
];

export const moreToolDetails = {
  sectionPerformance: {
    title: "Class Performance",
    summary: "View your subject performance section-wise and spot classes that need remediation support.",
  },
  enrollStudents: {
    title: "Class Enrollment",
    summary: "Enroll students into a class and instantly see the updated class strength.",
  },
  leaveRequests: {
    title: "Leave Request",
    summary: "Pick from and to dates, auto-calculate leave days, and submit reason for approval.",
  },
  quizCenter: {
    title: "Add Lesson Quiz",
    summary: "Create quiz sets by class and section, then review all active and draft quizzes.",
  },
  quizResults: {
    title: "View Quiz Results",
    summary: "Open each quiz and check attempts, score split, and top student performance.",
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
  }, acadamicCalender: {
    title: "Academic Calendar",
    summary: "View and manage the academic calendar for the current term.",
  },
};
