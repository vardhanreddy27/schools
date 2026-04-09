import Image from "next/image";
import { X, Paperclip, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { moreTools, moreToolDetails } from "./data";
import TeacherHeroCard from "./TeacherHeroCard";

const teacherMoreCardAssets = {
  sectionPerformance: { imageSrc: "/performance.png", tone: "from-sky-100 to-cyan-100" },
  enrollStudents: { imageSrc: "/classenrollment.webp", tone: "from-amber-100 to-orange-100" },
  leaveRequests: { imageSrc: "/leaveicon.webp", tone: "from-amber-100 to-orange-100" },
  quizResults: { imageSrc: "/examicon.webp", tone: "from-indigo-100 to-violet-100" },
  notesCenter: { imageSrc: "/notes.webp", tone: "from-emerald-100 to-teal-100" },
  announcements: { imageSrc: "/announcementsicon.png", tone: "from-amber-100 to-yellow-100" },
  learningResources: { imageSrc: "/syllbusicon.webp", tone: "from-rose-100 to-pink-100" },
  academicCalendar: { imageSrc: "/calendericon.webp", tone: "from-blue-100 to-indigo-100" },
};

// Academic Calendar Tool as a separate component
function AcademicCalendarTool() {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([...require("./data").monthlyCalendarEvents]);
  const [eventType, setEventType] = useState("quiz");
  const [eventTitle, setEventTitle] = useState("");
  const [activeDate, setActiveDate] = useState(null);
  const { weekPlan } = require("./data");
  const { buildMonthCalendar, dayKey, eventDotColor, statusStyles } = require("./utils");
  const monthGrid = buildMonthCalendar(calendarDate);
  const today = new Date();
  const todayKey = dayKey(today);
  const monthEventsByDate = calendarEvents.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
  const orderedMonthEvents = calendarEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === calendarDate.getFullYear() &&
        eventDate.getMonth() === calendarDate.getMonth()
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const activeDateEvents = activeDate ? monthEventsByDate[activeDate] || [] : [];
  function openDatePopup(key) {
    setActiveDate(key);
    setEventType("quiz");
    setEventTitle("");
  }
  function closeDatePopup() {
    setActiveDate(null);
    setEventTitle("");
    setEventType("quiz");
  }
  function addEventToDate() {
    if (!activeDate || !eventTitle.trim()) return;
    setCalendarEvents((prev) => [
      ...prev,
      { date: activeDate, type: eventType, title: eventTitle.trim() },
    ]);
    setEventTitle("");
  }
  function removeEventFromDate(eventToRemove) {
    setCalendarEvents((prev) => prev.filter((item) => !(item.date === eventToRemove.date && item.title === eventToRemove.title && item.type === eventToRemove.type)));
  }
  function getDateLabel(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      {/* Left — Monthly calendar with event markers */}
      <article className="bg-[--app-surface] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-1 text-xl font-semibold">Quiz and exam markers</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-800">
          {calendarDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs text-slate-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {monthGrid.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-12 rounded-xl bg-transparent" />;
            }
            const key = dayKey(date);
            const events = monthEventsByDate[key] || [];
            const isToday = key === todayKey;
            return (
              <button
                type="button"
                key={key}
                onClick={() => openDatePopup(key)}
                className={`flex h-12 flex-col items-center justify-center rounded-xl ${isToday ? "border border-[--app-accent] bg-[--app-accent-soft]" : "bg-slate-50"}`}
              >
                <span className={`text-sm font-semibold ${isToday ? "text-[#8b6400]" : "text-slate-800"}`}>{date.getDate()}</span>
                <div className="mt-1 flex items-center gap-0.5">
                  {events.slice(0, 2).map((event) => (
                    <span key={`${key}-${event.type}-${event.title}`} className={`h-1.5 w-1.5 rounded-full ${eventDotColor(event.type)}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Quiz day</span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Exam day</span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Homework review</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Meeting</span>
        </div>
        {orderedMonthEvents.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Upcoming this month</p>
            {orderedMonthEvents.map((event) => (
              <div key={`${event.date}-${event.title}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${eventDotColor(event.type)}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
      {/* Right — Calendar timings and weekly plan */}
      <article className="bg-[--app-surface] p-4 sm:p-5">
        <p className="text-sm text-slate-500">Calendar timings</p>
        <h2 className="mt-1 text-xl font-semibold">Upcoming academic flow</h2>
        <div className="mt-4 space-y-3">
          {weekPlan.map((item) => (
            <div key={`${item.label}-${item.focus}`} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${statusStyles(item.status)}`}>{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
            </div>
          ))}
        </div>
      </article>
      {/* Date event popup */}
      {activeDate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={closeDatePopup}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 ring-1 ring-[--app-border]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Manage date events</p>
                <h3 className="text-lg font-semibold text-slate-900">{getDateLabel(activeDate)}</h3>
              </div>
              <button type="button" onClick={closeDatePopup} className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" aria-label="Close date event popup">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[0.34fr_1fr_auto]">
              <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200">
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="homework">Homework</option>
                <option value="meeting">General</option>
              </select>
              <input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder="e.g. 9th B - Quiz on Tenses" className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              <button type="button" onClick={addEventToDate} className="rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">Add</button>
            </div>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
              {activeDateEvents.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">No events for this date yet.</p>
              ) : (
                activeDateEvents.map((eventItem) => (
                  <div key={`${eventItem.date}-${eventItem.type}-${eventItem.title}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{eventItem.title}</p>
                      <p className="text-xs text-slate-500">Type: {eventItem.type}</p>
                    </div>
                    <button type="button" onClick={() => removeEventFromDate(eventItem)} className="text-xs font-semibold text-rose-600">Remove</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}



export function MoreTab({
  onOpenToolModal,
  displayName = "Harika",
  subject = "Physics",
  classesToday = 4,
  avatarSrc = "/teacher.avif",
  onAvatarClick,
}) {
  return (
    <section className=" mt-6 min-h-[calc(100vh-10rem)] space-y-0 bg-white mb-9">
      <TeacherHeroCard
        displayName={displayName}
        subject={subject}
        classesToday={classesToday}
        avatarSrc={avatarSrc}
        onAvatarClick={onAvatarClick}
      />

      <article className=" bg-white -mx-3  p-5">
        <p className="text-sm text-slate-500">Teacher control</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Quick actions</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {moreTools.map((tool) => {
            const cardAsset = teacherMoreCardAssets[tool.key] || { imageSrc: "/logo.jpg", tone: "from-slate-100 to-slate-200" };

            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => onOpenToolModal(tool.key)}
                className={`group rounded-2xl bg-linear-to-br ${cardAsset.tone} p-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">{tool.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{tool.subtitle}</p>
                    <p className="mt-3 text-[11px] font-medium text-slate-500">Open tool</p>
                  </div>
                  <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl">
                    <Image
                      src={cardAsset.imageSrc}
                      alt={`${tool.title} icon`}
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
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-subject" className="text-sm font-medium text-slate-600">Subject</label>
            <input
              id="teacher-profile-subject"
              name="subject"
              value={profileForm.subject}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-number" className="text-sm font-medium text-slate-600">Number</label>
            <input
              id="teacher-profile-number"
              name="number"
              value={profileForm.number}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
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

          <div className="sm:col-span-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[#16c7bd] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12a79f] disabled:cursor-not-allowed disabled:bg-[#8fded8]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
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
  const [selectedQuizName, setSelectedQuizName] = useState(null);
  const [selectedQuizSection, setSelectedQuizSection] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteAttachments, setNoteAttachments] = useState({});
  const [announcementText, setAnnouncementText] = useState("");
  const noteFileInputRef = useRef({});
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, fromDate: "2026-03-22", toDate: "2026-03-23", days: 2, reason: "Medical appointment", status: "Pending" },
  ]);
  const [quizItems, setQuizItems] = useState([
    { id: 1, classRef: "9th B", title: "Grammar Quiz - Tenses" },
    { id: 2, classRef: "8th A", title: "Vocabulary Quiz - Synonyms" },
  ]);
  const [notes, setNotes] = useState([
    { id: 1, classRef: "9th B", text: "Complete chapter 4 discussion and recap worksheet.", attachments: [] },
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
      quizName: "Grammar Quiz - Tenses",
      sectionResults: [
        { classRef: "9th B", attempted: 29, avgScore: 74, topper: "Diya - 95", pass: 24, fail: 5 },
        { classRef: "8th A", attempted: 31, avgScore: 76, topper: "Aarav - 96", pass: 28, fail: 3 },
        { classRef: "10th A", attempted: 33, avgScore: 83, topper: "Saanvi - 98", pass: 31, fail: 2 },
      ],
    },
    {
      id: 2,
      quizName: "Vocabulary Quiz - Synonyms",
      sectionResults: [
        { classRef: "8th A", attempted: 35, avgScore: 73, topper: "Moksha - 94", pass: 30, fail: 5 },
        { classRef: "9th B", attempted: 32, avgScore: 75, topper: "Karthik - 96", pass: 28, fail: 4 },
      ],
    },
    {
      id: 3,
      quizName: "Comprehension",
      sectionResults: [
        { classRef: "10th A", attempted: 40, avgScore: 81, topper: "Saanvi - 97", pass: 37, fail: 3 },
        { classRef: "9th B", attempted: 28, avgScore: 78, topper: "Diya - 93", pass: 25, fail: 3 },
      ],
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
  const selectedQuiz = quizResultItems.find((item) => item.id === selectedQuizName) || null;

  function handleNoteFileUpload(noteId, event) {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      setNoteAttachments((prev) => ({
        ...prev,
        [noteId]: [
          ...(prev[noteId] || []),
          {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
          },
        ],
      }));
    });
    event.target.value = "";
  }

  function removeNoteAttachment(noteId, attachId) {
    setNoteAttachments((prev) => ({
      ...prev,
      [noteId]: (prev[noteId] || []).filter((att) => att.id !== attachId),
    }));
  }

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
    setNotes((prev) => [{ id: Date.now() + Math.random(), classRef: selectedClass, text: noteText.trim(), attachments: noteAttachments["temp"] || [] }, ...prev]);
    setNoteText("");
    setNoteAttachments((prev) => ({ ...prev, temp: [] }));
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
                className={`rounded-xl border px-3 py-2.5 text-left ${selectedSection === row.classRef ? "border-[--app-accent] bg-[--app-accent-soft]" : "border-slate-200 bg-slate-50"}`}
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
            className="w-full rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enroll Student
          </button>

          <div className="rounded-xl bg-[--app-accent-soft] px-3 py-2 text-sm text-[#8b6400]">
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

          <div className="rounded-xl bg-[--app-accent-soft] px-3 py-2 text-sm text-[#8b6400]">
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
            className="w-full rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:opacity-50"
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
            <button type="button" onClick={addQuiz} className="rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
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
        </div>
      );
    }

    if (activeTool === "quizResults") {
      return (
        <div className="mt-4 space-y-3">
          {!selectedQuizName ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Select a quiz to view section-wise results</p>
              <div className="space-y-2">
                {quizResultItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedQuizName(item.id);
                      setSelectedQuizSection(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left hover:bg-[--app-accent-soft]"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.quizName}</p>
                    <p className="text-xs text-slate-600 mt-1">{item.sectionResults.length} section(s) attempted</p>
                  </button>
                ))}
              </div>
            </>
          ) : selectedQuizSection ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedQuizSection(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2"
              >
                ← Back to sections
              </button>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">{selectedQuiz.quizName}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Results for {selectedQuizSection.classRef}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                    <span className="text-xs text-slate-600">Attempted:</span>{" "}
                    <span className="font-semibold">{selectedQuizSection.attempted}</span>
                  </p>
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
                    <span className="text-xs text-slate-600">Average:</span>{" "}
                    <span className="font-semibold">{selectedQuizSection.avgScore}%</span>
                  </p>
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                    <span className="text-xs text-emerald-600">Pass:</span>{" "}
                    <span className="font-semibold">{selectedQuizSection.pass}</span>
                  </p>
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">
                    <span className="text-xs text-rose-600">Fail:</span>{" "}
                    <span className="font-semibold">{selectedQuizSection.fail}</span>
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Topper: <span className="font-semibold">{selectedQuizSection.topper}</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSelectedQuizName(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2"
              >
                ← Back to quizzes
              </button>
              <p className="text-sm font-semibold text-slate-900">{selectedQuiz.quizName}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500 mt-2">Results by section</p>
              <div className="space-y-2">
                {selectedQuiz.sectionResults.map((section) => (
                  <button
                    key={section.classRef}
                    type="button"
                    onClick={() => setSelectedQuizSection(section)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left hover:bg-[--app-accent-soft]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{section.classRef}</p>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Avg: {section.avgScore}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">Attempted: {section.attempted} | Topper: {section.topper}</p>
                  </button>
                ))}
              </div>
            </>
          )}
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
            <button type="button" onClick={addNote} className="rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
              Add
            </button>
          </div>

          {noteText && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => noteFileInputRef.current["temp"]?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Paperclip className="h-3.5 w-3.5" />
                Attach file
              </button>
              <input
                ref={(el) => {
                  if (el) noteFileInputRef.current["temp"] = el;
                }}
                type="file"
                multiple
                onChange={(e) => handleNoteFileUpload("temp", e)}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              {(noteAttachments["temp"] || []).length > 0 && (
                <div className="mt-2 space-y-1">
                  {(noteAttachments["temp"] || []).map((att) => (
                    <div key={att.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Paperclip className="h-3.5 w-3.5" />
                        {att.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNoteAttachment("temp", att.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 space-y-2">
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{note.classRef}</p>
                    <p className="text-sm text-slate-800 mt-1">{note.text}</p>
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {note.attachments.map((att) => (
                          <div key={att.id} className="flex items-center gap-2 text-xs text-slate-600">
                            <Paperclip className="h-3.5 w-3.5" />
                            {att.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => removeItem(setNotes, note.id)} className="text-xs font-semibold text-rose-600">
                    Remove
                  </button>
                </div>
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
            <button type="button" onClick={addAnnouncement} className="rounded-xl bg-[--app-accent] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b07e10]">
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

    // Academic Calendar tool
    if (activeTool === "academicCalendar") {
      return <AcademicCalendarTool />;
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
          className="mt-5 w-full rounded-2xl bg-[--app-accent] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
