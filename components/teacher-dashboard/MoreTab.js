import { X } from "lucide-react";
import { useState } from "react";
import { moreTools, moreToolDetails } from "./data";

export function MoreTab({ onOpenToolModal }) {
  return (
    <section className="mt-4">
      <article className="bg-[var(--app-surface)] p-4 sm:p-5">
        <p className="text-sm text-slate-500">More tools</p>
        <h2 className="mt-1 text-xl font-semibold">Teacher utility modules</h2>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {moreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => onOpenToolModal(tool.key)}
                className="aspect-square rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-left transition hover:bg-[var(--app-accent-soft)]"
              >
                <Icon className="h-5 w-5 text-[var(--app-accent)]" />
                <p className="mt-3 text-sm font-semibold text-slate-900">{tool.title}</p>
                <p className="mt-1 text-xs text-slate-600">{tool.subtitle}</p>
              </button>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export function ProfileBottomSheet({
  open,
  onClose,
  profileForm,
  onProfileChange,
  onProfileSave,
  profileSaving,
  profileMessage,
  onLogout,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Teacher profile details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close profile popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label htmlFor="teacher-profile-id" className="text-sm font-medium text-slate-600">Teacher ID</label>
            <input
              id="teacher-profile-id"
              name="id"
              readOnly
              value={profileForm.id}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-name" className="text-sm font-medium text-slate-600">Name</label>
            <input
              id="teacher-profile-name"
              name="name"
              value={profileForm.name}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[var(--app-accent)] focus:ring-4 focus:ring-[var(--app-accent-soft)]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-subject" className="text-sm font-medium text-slate-600">Subject</label>
            <input
              id="teacher-profile-subject"
              name="subject"
              value={profileForm.subject}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[var(--app-accent)] focus:ring-4 focus:ring-[var(--app-accent-soft)]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-number" className="text-sm font-medium text-slate-600">Number</label>
            <input
              id="teacher-profile-number"
              name="number"
              value={profileForm.number}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[var(--app-accent)] focus:ring-4 focus:ring-[var(--app-accent-soft)]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-doj" className="text-sm font-medium text-slate-600">Date of joining</label>
            <input
              id="teacher-profile-doj"
              name="doj"
              readOnly
              value={profileForm.doj}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-gender" className="text-sm font-medium text-slate-600">Gender</label>
            <input
              id="teacher-profile-gender"
              name="gender"
              readOnly
              value={profileForm.gender}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900"
            />
          </div>

          {profileMessage ? (
            <p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {profileMessage}
            </p>
          ) : null}

          <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[var(--app-accent)] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:bg-[#e6cc8a]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ToolModal({ activeTool, onClose }) {
  const [selectedClass, setSelectedClass] = useState("9th B");
  const [selectedSection, setSelectedSection] = useState("8th A");
  const [selectedEnrollClass, setSelectedEnrollClass] = useState("8th A");
  const [enrollStudentName, setEnrollStudentName] = useState("");
  const [enrollStudentRoll, setEnrollStudentRoll] = useState("");
  const [selectedQuizResultId, setSelectedQuizResultId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, fromDate: "2026-03-22", toDate: "2026-03-23", days: 2, reason: "Medical appointment", status: "Pending" },
  ]);
  const [quizItems, setQuizItems] = useState([
    { id: 1, classRef: "9th B", title: "Grammar Quiz - Tenses" },
    { id: 2, classRef: "8th A", title: "Vocabulary Quiz - Synonyms" },
  ]);
  const [notes, setNotes] = useState([
    { id: 1, classRef: "9th B", text: "Complete chapter 4 discussion and recap worksheet." },
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, classRef: "General", text: "Parents meeting on Friday at 3:30 PM." },
  ]);
  const [enrolledByClass, setEnrolledByClass] = useState({
    "8th A": [
      { id: 1, name: "Aarav", roll: "01" },
      { id: 2, name: "Diya", roll: "02" },
    ],
    "9th B": [{ id: 3, name: "Karthik", roll: "09" }],
    "10th A": [{ id: 4, name: "Saanvi", roll: "04" }],
  });

  if (!activeTool) return null;

  const details = moreToolDetails[activeTool];

  const sectionPerformanceRows = [
    { classRef: "8th A", completion: 84, avgScore: 71 },
    { classRef: "9th B", completion: 79, avgScore: 68 },
    { classRef: "10th A", completion: 88, avgScore: 76 },
  ];

  const subjectMarksBySection = {
    "8th A": [
      { subject: "English", marks: 78 },
      { subject: "Maths", marks: 66 },
      { subject: "Science", marks: 72 },
      { subject: "Social", marks: 69 },
      { subject: "Hindi", marks: 74 },
      { subject: "Telugu", marks: 81 },
    ],
    "9th B": [
      { subject: "English", marks: 74 },
      { subject: "Maths", marks: 64 },
      { subject: "Science", marks: 70 },
      { subject: "Social", marks: 66 },
      { subject: "Hindi", marks: 72 },
      { subject: "Telugu", marks: 76 },
    ],
    "10th A": [
      { subject: "English", marks: 82 },
      { subject: "Maths", marks: 71 },
      { subject: "Science", marks: 78 },
      { subject: "Social", marks: 75 },
      { subject: "Hindi", marks: 77 },
      { subject: "Telugu", marks: 84 },
    ],
  };

  const sectionLeaderboard = [
    { classRef: "8th A", avgScore: 76, attempts: 31, topper: "Aarav (96)" },
    { classRef: "8th B", avgScore: 72, attempts: 28, topper: "Moksha (93)" },
    { classRef: "9th A", avgScore: 80, attempts: 34, topper: "Karthik (97)" },
    { classRef: "9th B", avgScore: 74, attempts: 30, topper: "Diya (95)" },
    { classRef: "10th A", avgScore: 83, attempts: 33, topper: "Saanvi (98)" },
  ];

  const quizResultItems = [
    {
      id: 1,
      classRef: "9th B",
      title: "Quiz-1",
      topic: "Tenses",
      attempted: 29,
      avgScore: 74,
      topper: "Diya - 95",
      pass: 24,
      fail: 5,
    },
    {
      id: 2,
      classRef: "8th A",
      title: "Quiz-2",
      topic: "Synonyms",
      attempted: 31,
      avgScore: 76,
      topper: "Aarav - 96",
      pass: 28,
      fail: 3,
    },
    {
      id: 3,
      classRef: "10th A",
      title: "Quiz-1",
      topic: "Comprehension",
      attempted: 33,
      avgScore: 83,
      topper: "Saanvi - 98",
      pass: 31,
      fail: 2,
    },
  ];

  const leaveDays = (() => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) return 0;
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.floor((end - start) / dayMs) + 1;
  })();

  const activeSubjects = subjectMarksBySection[selectedSection] || [];
  const subjectColors = {
    English: "#f59e0b",
    Maths: "#3b82f6",
    Science: "#16a34a",
    Social: "#8b5cf6",
    Hindi: "#ef4444",
    Telugu: "#06b6d4",
  };
  const enrolledStudents = enrolledByClass[selectedEnrollClass] || [];
  const selectedQuizResult = quizResultItems.find((item) => item.id === selectedQuizResultId) || null;

  function addQuiz() {
    if (!quizTitle.trim()) return;
    setQuizItems((prev) => [{ id: Date.now(), classRef: selectedClass, title: quizTitle.trim() }, ...prev]);
    setQuizTitle("");
  }

  function addLeaveRequest() {
    if (!fromDate || !toDate || !leaveReason.trim() || !leaveDays) return;

    setLeaveRequests((prev) => [
      {
        id: Date.now(),
        fromDate,
        toDate,
        days: leaveDays,
        reason: leaveReason.trim(),
        status: "Pending",
      },
      ...prev,
    ]);

    setFromDate("");
    setToDate("");
    setLeaveReason("");
  }

  function addNote() {
    if (!noteText.trim()) return;
    setNotes((prev) => [{ id: Date.now(), classRef: selectedClass, text: noteText.trim() }, ...prev]);
    setNoteText("");
  }

  function addAnnouncement() {
    if (!announcementText.trim()) return;
    setAnnouncements((prev) => [{ id: Date.now(), classRef: selectedClass, text: announcementText.trim() }, ...prev]);
    setAnnouncementText("");
  }

  function addEnrollment() {
    if (!enrollStudentName.trim() || !enrollStudentRoll.trim()) return;
    setEnrolledByClass((prev) => ({
      ...prev,
      [selectedEnrollClass]: [
        ...(prev[selectedEnrollClass] || []),
        { id: Date.now(), name: enrollStudentName.trim(), roll: enrollStudentRoll.trim() },
      ],
    }));
    setEnrollStudentName("");
    setEnrollStudentRoll("");
  }

  function removeItem(setter, id) {
    setter((prev) => prev.filter((item) => item.id !== id));
  }

  function CircularMetric({ label, value, color }) {
    const degrees = Math.max(0, Math.min(100, value)) * 3.6;
    return (
      <div className="rounded-xl bg-white px-3 py-3 text-center ring-1 ring-slate-200">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(${color} ${degrees}deg, #e2e8f0 ${degrees}deg)` }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700">
            {value}%
          </div>
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-700">{label}</p>
      </div>
    );
  }

  function renderToolContent() {
    if (activeTool === "sectionPerformance") {
      return (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Section progress</p>
          <div className="grid gap-2">
            {sectionPerformanceRows.map((row) => (
              <button
                key={row.classRef}
                type="button"
                onClick={() => setSelectedSection(row.classRef)}
                className={`rounded-xl border px-3 py-2.5 text-left ${selectedSection === row.classRef ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)]" : "border-slate-200 bg-slate-50"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{row.classRef}</p>
                  <p className="text-xs font-semibold text-slate-600">{row.completion}%</p>
                </div>
                <p className="mt-1 text-xs text-slate-600">Average score: {row.avgScore}%</p>
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">All subjects marks - {selectedSection}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {activeSubjects.map((item) => (
                <CircularMetric
                  key={item.subject}
                  label={item.subject}
                  value={item.marks}
                  color={subjectColors[item.subject] || "var(--app-accent)"}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTool === "enrollStudents") {
      return (
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="enroll-class" className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Class</label>
            <select
              id="enroll-class"
              value={selectedEnrollClass}
              onChange={(event) => setSelectedEnrollClass(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option>8th A</option>
              <option>9th B</option>
              <option>10th A</option>
            </select>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={enrollStudentName}
              onChange={(event) => setEnrollStudentName(event.target.value)}
              placeholder="Student name"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
            <input
              value={enrollStudentRoll}
              onChange={(event) => setEnrollStudentRoll(event.target.value)}
              placeholder="Roll no"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={addEnrollment}
            disabled={!enrollStudentName.trim() || !enrollStudentRoll.trim()}
            className="w-full rounded-xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enroll Student
          </button>

          <div className="rounded-xl bg-[var(--app-accent-soft)] px-3 py-2 text-sm text-[#8b6400]">
            Total students in {selectedEnrollClass}: <span className="font-semibold">{enrolledStudents.length}</span>
          </div>

          <div className="space-y-2">
            {enrolledStudents.map((student) => (
              <div key={student.id} className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-600">Roll: {student.roll}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTool === "leaveRequests") {
      return (
        <div className="mt-4 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="leave-from" className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">From</label>
              <input
                id="leave-from"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="leave-to" className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">To</label>
              <input
                id="leave-to"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[var(--app-accent-soft)] px-3 py-2 text-sm text-[#8b6400]">
            Leave days: <span className="font-semibold">{leaveDays || 0}</span>
          </div>

          <textarea
            value={leaveReason}
            onChange={(event) => setLeaveReason(event.target.value)}
            rows={3}
            placeholder="Reason for leave"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />

          <button
            type="button"
            onClick={addLeaveRequest}
            disabled={!fromDate || !toDate || !leaveReason.trim() || !leaveDays}
            className="w-full rounded-xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Leave Request
          </button>

          <div className="space-y-2">
            {leaveRequests.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.fromDate} to {item.toDate}
                  </p>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">Days: {item.days}</p>
                <p className="mt-1 text-sm text-slate-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTool === "quizCenter") {
      return (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-[0.42fr_1fr_auto]">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option>8th A</option>
              <option>9th B</option>
              <option>10th A</option>
              <option>General</option>
            </select>
            <input
              value={quizTitle}
              onChange={(event) => setQuizTitle(event.target.value)}
              placeholder="Quiz title for lesson"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
            <button type="button" onClick={addQuiz} className="rounded-xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
              Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {quizItems.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                <p className="text-sm text-slate-800">{quiz.classRef}: {quiz.title}</p>
                <button type="button" onClick={() => removeItem(setQuizItems, quiz.id)} className="text-xs font-semibold text-rose-600">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Quiz leaderboard by section</p>
            <div className="mt-2 space-y-2">
              {sectionLeaderboard.map((row, index) => (
                <div key={row.classRef} className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">#{index + 1} {row.classRef}</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      Avg: {row.avgScore}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Attempts: {row.attempts} | Topper: {row.topper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTool === "quizResults") {
      return (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Tap a quiz to view results</p>
          <div className="space-y-2">
            {quizResultItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedQuizResultId(item.id)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left"
              >
                <p className="text-sm font-semibold text-slate-900">{item.classRef} - {item.title}</p>
                <p className="text-xs text-slate-600">Topic: {item.topic}</p>
              </button>
            ))}
          </div>

          {selectedQuizResult ? (
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">{selectedQuizResult.classRef} - {selectedQuizResult.title}</p>
              <p className="mt-1 text-xs text-slate-600">Topic: {selectedQuizResult.topic}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">Attempted: {selectedQuizResult.attempted}</p>
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">Average: {selectedQuizResult.avgScore}%</p>
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">Pass: {selectedQuizResult.pass}</p>
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">Fail: {selectedQuizResult.fail}</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">Topper: <span className="font-semibold">{selectedQuizResult.topper}</span></p>
            </div>
          ) : null}
        </div>
      );
    }

    if (activeTool === "notesCenter") {
      return (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-[0.42fr_1fr_auto]">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option>8th A</option>
              <option>9th B</option>
              <option>10th A</option>
              <option>General</option>
            </select>
            <input
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add classroom note"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
            <button type="button" onClick={addNote} className="rounded-xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
              Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                <p className="text-sm text-slate-800">{note.classRef}: {note.text}</p>
                <button type="button" onClick={() => removeItem(setNotes, note.id)} className="text-xs font-semibold text-rose-600">Remove</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTool === "announcements") {
      return (
        <div className="mt-4">
          <div className="grid gap-2 sm:grid-cols-[0.42fr_1fr_auto]">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            >
              <option>General</option>
              <option>8th A</option>
              <option>9th B</option>
              <option>10th A</option>
            </select>
            <input
              value={announcementText}
              onChange={(event) => setAnnouncementText(event.target.value)}
              placeholder="Write announcement"
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            />
            <button type="button" onClick={addAnnouncement} className="rounded-xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
              Post
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <p className="text-sm text-slate-800">{announcement.classRef}: {announcement.text}</p>
                <button
                  type="button"
                  onClick={() => removeItem(setAnnouncements, announcement.id)}
                  className="text-xs font-semibold text-rose-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">{details?.title || "Tool"}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close tool popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {details?.summary || "This tool is ready for your classroom workflow."}
        </p>

        {renderToolContent()}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[var(--app-accent)] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
