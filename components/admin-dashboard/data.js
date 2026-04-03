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
  MoreHorizontal,
  ShieldAlert,
  UserCircle2,
  UserRoundCheck,
  Users,
} from "lucide-react";

export const trendTabs = ["Today", "Weekly", "Monthly"];

export const attendanceTrend = {
  Today: [
    { label: "I", students: 81 },
    { label: "II", students: 92 },
    { label: "III", students: 60 },
    { label: "IV", students: 93 },
    { label: "V", students: 71 },
    { label: "VI", students: 94 },
    { label: "VII", students: 95 },
    { label: "VIII", students: 75 },
    { label: "IX", students: 86 },
    { label: "X", students: 97 },
  ],
  Weekly: [
    { label: "I", students: 89 },
    { label: "II", students: 60 },
    { label: "III", students: 88 },
    { label: "IV", students: 91 },
    { label: "V", students: 89 },
    { label: "VI", students: 92 },
    { label: "VII", students: 93 },
    { label: "VIII", students: 53 },
    { label: "IX", students: 94 },
    { label: "X", students: 95 },
  ],
  Monthly: [
    { label: "I", students: 87 },
    { label: "II", students: 88 },
    { label: "III", students: 86 },
    { label: "IV", students: 89 },
    { label: "V", students: 87 },
    { label: "VI", students: 90 },
    { label: "VII", students: 91 },
    { label: "VIII", students: 91 },
    { label: "IX", students: 92 },
    { label: "X", students: 94 },
  ],
};

export const attendanceWindows = [
  { period: "Morning", studentsPresent: 1218, studentsTotal: 1286, teachersPresent: 46, teachersTotal: 48 },
  { period: "Evening", studentsPresent: 1194, studentsTotal: 1286, teachersPresent: 45, teachersTotal: 48 },
];

function formatGradeLabel(grade) {
  if (grade === 1) return "1st class";
  if (grade === 2) return "2nd class";
  if (grade === 3) return "3rd class";
  return `${grade}th class`;
}

export const gradeSectionMap = [
  { grade: 1, sections: ["a", "b"] },
  { grade: 2, sections: ["a", "b", "c"] },
  { grade: 3, sections: ["a", "b"] },
  { grade: 4, sections: ["a", "b", "c"] },
  { grade: 5, sections: ["a", "b"] },
  { grade: 6, sections: ["a", "b", "c"] },
  { grade: 7, sections: ["a", "b", "c"] },
  { grade: 8, sections: ["a", "b", "c"] },
  { grade: 9, sections: ["a", "b", "c", "d"] },
  { grade: 10, sections: ["a", "b", "c", "d"] },
];

const gradeStrength = {
  1: 95,
  2: 112,
  3: 98,
  4: 118,
  5: 105,
  6: 124,
  7: 128,
  8: 132,
  9: 176,
  10: 198,
};

export const classSectionStrength = gradeSectionMap.map((item, index) => {
  const total = gradeStrength[item.grade];
  const todayPresent = Math.max(total - (index % 4) - 6, 0);
  return {
    grade: formatGradeLabel(item.grade),
    sections: item.sections.join(", "),
    total,
    today: `${todayPresent}/${total}`,
  };
});

export const sectionWiseAttendance = gradeSectionMap.flatMap((gradeItem, gradeIndex) => {
  return gradeItem.sections.map((sectionName, sectionIndex) => {
    const sectionTotal = Math.floor(gradeStrength[gradeItem.grade] / gradeItem.sections.length);
    const studentsPresentMorning = Math.max(sectionTotal - ((gradeIndex + sectionIndex) % 4), 0);
    const studentsPresentEvening = Math.max(studentsPresentMorning - (sectionIndex % 2), 0);
    const boysTotal = Math.floor(sectionTotal * 0.52);
    const girlsTotal = sectionTotal - boysTotal;
    const boysPresentMorning = Math.max(boysTotal - ((gradeIndex + sectionIndex) % 3), 0);
    const girlsPresentMorning = Math.max(studentsPresentMorning - boysPresentMorning, 0);
    const boysPresentEvening = Math.max(boysPresentMorning - (sectionIndex % 2), 0);
    const girlsPresentEvening = Math.max(studentsPresentEvening - boysPresentEvening, 0);

    return {
      id: `${gradeItem.grade}-${sectionName}`,
      className: formatGradeLabel(gradeItem.grade),
      section: sectionName,
      studentsMorning: `${studentsPresentMorning}/${sectionTotal}`,
      studentsEvening: `${studentsPresentEvening}/${sectionTotal}`,
      teachersMorning: `${4 + (gradeIndex % 2)}/${4 + (gradeIndex % 2)}`,
      teachersEvening: `${4 + ((gradeIndex + 1) % 2)}/${4 + (gradeIndex % 2)}`,
      boysMorning: `${boysPresentMorning}/${boysTotal}`,
      girlsMorning: `${girlsPresentMorning}/${girlsTotal}`,
      boysEvening: `${boysPresentEvening}/${boysTotal}`,
      girlsEvening: `${girlsPresentEvening}/${girlsTotal}`,
    };
  });
});

export const topMetrics = [
  { key: "teaching", title: "Teaching Staff", value: "48", icon: Users },
  { key: "nonTeaching", title: "Non-Teaching Staff", value: "21", icon: Briefcase },
  { key: "students", title: "Students", value: "1,286", icon: GraduationCap, breakdown: { male: 670, female: 616 } },
  { key: "classes", title: "Classes / Sections", value: "18 / 32", helper: "", icon: LayoutGrid },
  { key: "buses", title: "Track Buses", value: "4", icon: Bus },
];

export const metricDrilldown = {
  teaching: {
    title: "Teaching Staff Details",
    subtitle: "Subject, class ownership and attendance",
    columns: ["Teacher", "Subject", "Classes", "Today"],
    rows: [
      ["Ms. Kavya", "Maths", "9th-a, 10th-a", "Present"],
      ["Mr. Rakesh", "Science", "8th-b, 9th-b", "Present"],
      ["Ms. Sowmya", "English", "7th-a, 8th-a", "Present"],
      ["Mr. Harish", "Social", "9th-c, 10th-c", "On Leave"],
      ["Ms. Nisha", "Biology", "10th-b, 10th-c", "Present"],
      ["Mr. Praveen", "Physics", "9th-d, 10th-d", "Present"],
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
      ["Srinivas", "Accounts", "Morning", "Present"],
      ["Latha", "Library", "Morning", "Present"],
    ],
  },
  students: {
    title: "Student Distribution",
    subtitle: "Class-wise and section-wise student strength",
    columns: ["Class", "Sections", "Total Students", "Today"],
    rows: classSectionStrength.map((item) => [item.grade, item.sections, String(item.total), item.today]),
  },
  classes: {
    title: "Classes Overview",
    subtitle: "Total classes and mapped sections",
    columns: ["Grade", "Sections", "Class Teacher", "Room"],
    rows: classSectionStrength.map((item, index) => [
      item.grade,
      item.sections,
      ["Ms. Kavya", "Mr. Rakesh", "Ms. Sowmya", "Mr. Harish", "Ms. Nisha"][index % 5],
      `R-${11 + index}`,
    ]),
  },
  sections: {
    title: "Sections Overview",
    subtitle: "Section strength and attendance",
    columns: ["Class", "Section", "Students", "Class Teacher", "Attendance"],
    rows: sectionWiseAttendance.map((item, index) => [
      item.className,
      item.section,
      item.studentsMorning.split("/")[1],
      ["Ms. Kavya", "Mr. Rakesh", "Ms. Sowmya", "Mr. Harish", "Ms. Nisha"][index % 5],
      item.studentsMorning,
    ]),
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
  { key: "alerts", title: "Open Alerts", value: 4, subtitle: "Need action", color: "#111827", actionLabel: "Open alerts panel" },
  { key: "pendingLeaves", title: "Pending Leaves", value: 2, subtitle: "Waiting approval", color: "#8b6400", actionLabel: "Go to approvals" },
  { key: "approved", title: "Approved", value: 1, subtitle: "Completed", color: "#16c7bd", actionLabel: "View approved" },
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
  { id: 5, name: "Renuka", role: "Biology Teacher", staffType: "Teaching", leaveType: "Casual", startDate: "2026-03-20", endDate: "2026-03-20", days: 1, status: "Pending" },
  { id: 6, name: "Murali", role: "PET", staffType: "Teaching", leaveType: "Official", startDate: "2026-03-18", endDate: "2026-03-18", days: 1, status: "Approved" },
  { id: 7, name: "Keerthi", role: "Office Staff", staffType: "Non-Teaching", leaveType: "Medical", startDate: "2026-03-22", endDate: "2026-03-23", days: 2, status: "Pending" },
  { id: 8, name: "Rahul", role: "Science Teacher", staffType: "Teaching", leaveType: "Casual", startDate: "2026-03-25", endDate: "2026-03-25", days: 1, status: "Rejected" },
];

export const notices = [
  { audience: "Teachers", icon: Bell, sentToday: 6 },
  { audience: "Students", icon: BookOpen, sentToday: 9 },
  { audience: "Parents", icon: Megaphone, sentToday: 12 },
  { audience: "Everyone", icon: Megaphone, sentToday: 4 },
];

const staffNames = [
  "Ms. Kavya", "Mr. Rakesh", "Ms. Sowmya", "Mr. Harish", "Ms. Nisha", "Mr. Praveen", "Ms. Anusha", "Mr. Mahesh",
  "Ms. Sirisha", "Mr. Teja", "Ms. Divya", "Mr. Rohan", "Ms. Meghana", "Mr. Kiran", "Ms. Harika", "Mr. Aditya",
  "Ms. Pooja", "Mr. Santhosh", "Ms. Renu", "Mr. Vamshi", "Ms. Priya", "Mr. Dinesh", "Ms. Navya", "Mr. Lokesh",
  "Ms. Bhavya", "Mr. Chandra", "Ms. Sushma", "Mr. Arvind", "Ms. Tejaswi", "Mr. Sai",
];

const subjects = ["Telugu", "English", "Hindi", "Maths", "Science", "Social"];

export const teacherPerformance = staffNames.map((name, index) => {
  const attendancePresent = 20 + (index % 4);
  const attendanceTotal = 23;
  const syllabus = 76 + ((index * 3) % 16);
  const activityParticipation = 72 + ((index * 4) % 22);

  return {
    id: `staff-${index + 1}`,
    name,
    subject: subjects[index % subjects.length],
    attendance: `${attendancePresent}/${attendanceTotal}`,
    syllabus: `${syllabus}%`,
    activityParticipation: `${activityParticipation}%`,
  };
});

export const initialBroadcastMessages = [
  { id: 4, audience: "Students", message: "Tomorrow periods 1 and 2 will run as per revised timetable.", time: "11:56 AM" },
  { id: 3, audience: "Everyone", message: "Final exam prep timetable is now visible in the calendar section.", time: "09:20 AM" },
  { id: 1, audience: "Teachers", message: "Submit evening attendance by 4:15 PM.", time: "10:30 AM" },
  { id: 2, audience: "Parents", message: "PTM schedule shared in parent app.", time: "11:20 AM" },
];

export const upcomingModules = [
  { key: "sports", title: "Sports Meet", detail: "Inter-house athletics on Friday, 9:30 AM", linkTo: "attendance" },
  { key: "competitions", title: "Competitions", detail: "Math and Science competitions registration closes tomorrow", linkTo: "communication" },
  { key: "results", title: "Results", detail: "Unit test results publication scheduled for 21 March", linkTo: "overview" },
  { key: "calendar", title: "Calendar", detail: "Parent meeting and lab schedule synced to academic calendar", linkTo: "timetable" },
];

export const timetableModules = [
  { key: "timetableUpdate", title: "Timetable Update", detail: "Class 9-B and 10-A evening periods rebalanced", linkTo: "timetable" },
  { key: "substituteEngine", title: "Substitute Engine", detail: "Absent teacher slots auto-assigned by workload rules", linkTo: "timetable" },
  { key: "attendanceExceptions", title: "Attendance Exceptions", detail: "2 late teachers flagged and mapped to backup coverage", linkTo: "timetable" },
];

export const syllabusBySection = gradeSectionMap.flatMap((item, gradeIndex) => {
  return item.sections.map((sectionName, sectionIndex) => {
    const base = 68 + gradeIndex + sectionIndex;
    return {
      className: formatGradeLabel(item.grade),
      section: sectionName,
      Telugu: Math.min(base + 8, 94),
      Hindi: Math.min(base + 9, 95),
      Maths: Math.min(base + 10, 95),
      Science: Math.min(base + 7, 95),
      English: Math.min(base + 12, 96),
      Social: Math.min(base + 6, 93),
    };
  });
});

export const initialTimetableUpdates = [
  {
    id: 1,
    className: "9th",
    section: "b",
    period: "P5",
    subject: "Science",
    previousTeacher: "Mr. Rakesh",
    previousTeacherSubject: "Science",
    reasonType: "Late",
    reason: "Late by 25 mins",
    replacementTeacher: "Ms. Nisha",
    replacementTeacherSubject: "Biology",
    replacementOptions: ["Ms. Nisha", "Mr. Teja", "Mr. Rohan"],
    status: "Auto-assigned",
  },
  {
    id: 2,
    className: "10th",
    section: "a",
    period: "P6",
    subject: "Math",
    previousTeacher: "Ms. Kavya",
    previousTeacherSubject: "Maths",
    reasonType: "Absent",
    reason: "Medical leave",
    replacementTeacher: "Mr. Praveen",
    replacementTeacherSubject: "Physics",
    replacementOptions: ["Mr. Praveen", "Ms. Harika", "Mr. Aditya"],
    status: "Auto-assigned",
  },
  {
    id: 3,
    className: "7th",
    section: "c",
    period: "P3",
    subject: "English",
    previousTeacher: "Ms. Sirisha",
    previousTeacherSubject: "English",
    reasonType: "Absent",
    reason: "On duty",
    replacementTeacher: "Ms. Divya",
    replacementTeacherSubject: "English",
    replacementOptions: ["Ms. Divya", "Ms. Pooja", "Ms. Renu"],
    status: "Scheduled",
  },
  {
    id: 4,
    className: "5th",
    section: "b",
    period: "P4",
    subject: "Social",
    previousTeacher: "Mr. Harish",
    previousTeacherSubject: "Social",
    reasonType: "Late",
    reason: "Late by 15 mins",
    replacementTeacher: "Mr. Teja",
    replacementTeacherSubject: "Social",
    replacementOptions: ["Mr. Teja", "Mr. Santhosh", "Mr. Lokesh"],
    status: "Auto-assigned",
  },
  {
    id: 5,
    className: "8th",
    section: "a",
    period: "P2",
    subject: "Science",
    previousTeacher: "Ms. Anusha",
    previousTeacherSubject: "Science",
    reasonType: "Absent",
    reason: "Absent",
    replacementTeacher: "Mr. Rohan",
    replacementTeacherSubject: "Chemistry",
    replacementOptions: ["Mr. Rohan", "Ms. Meghana", "Mr. Kiran"],
    status: "Auto-assigned",
  },
];

export const navItems = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "approvals", label: "Approvals", icon: UserRoundCheck },
  { id: "communication", label: "More", icon: MoreHorizontal },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];
