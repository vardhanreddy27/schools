import { X } from "lucide-react";
import { useState } from "react";
import { moreTools, moreToolDetails } from "./data";

export function MoreTab({ onOpenToolModal }) {
  return (
    <section className="mt-4">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
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
                className="aspect-square rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-[#fff8dc]"
              >
                <Icon className="h-5 w-5 text-[#b88600]" />
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
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-subject" className="text-sm font-medium text-slate-600">Subject</label>
            <input
              id="teacher-profile-subject"
              name="subject"
              value={profileForm.subject}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
            />
          </div>

          <div>
            <label htmlFor="teacher-profile-number" className="text-sm font-medium text-slate-600">Number</label>
            <input
              id="teacher-profile-number"
              name="number"
              value={profileForm.number}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
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
              className="w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:bg-[#f3da84]"
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
  const [quizTitle, setQuizTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
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

  if (!activeTool) return null;

  const details = moreToolDetails[activeTool];

  const sectionPerformanceRows = [
    { classRef: "8th A", completion: "84%", avgScore: "71%" },
    { classRef: "9th B", completion: "79%", avgScore: "68%" },
    { classRef: "10th A", completion: "88%", avgScore: "76%" },
  ];

  const subjectMarks = [
    { subject: "English", marks: 78 },
    { subject: "Maths", marks: 66 },
    { subject: "Science", marks: 72 },
    { subject: "Social", marks: 69 },
    { subject: "Hindi", marks: 74 },
    { subject: "Telugu", marks: 81 },
  ];

  function addQuiz() {
    if (!quizTitle.trim()) return;
    setQuizItems((prev) => [{ id: Date.now(), classRef: selectedClass, title: quizTitle.trim() }, ...prev]);
    setQuizTitle("");
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

  function removeItem(setter, id) {
    setter((prev) => prev.filter((item) => item.id !== id));
  }

  function renderToolContent() {
    if (activeTool === "sectionPerformance") {
      return (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">Section progress</p>
          {sectionPerformanceRows.map((row) => (
            <div key={row.classRef} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{row.classRef}</p>
                <p className="text-xs font-semibold text-slate-600">{row.completion}</p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-[#f2b705]" style={{ width: row.completion }} />
              </div>
              <p className="mt-1 text-xs text-slate-600">Average score: {row.avgScore}</p>
            </div>
          ))}

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">All subjects marks</p>
            <div className="mt-2 space-y-2">
              {subjectMarks.map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>{item.subject}</span>
                    <span>{item.marks}/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.marks}%` }} />
                  </div>
                </div>
              ))}
            </div>
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
            <button type="button" onClick={addQuiz} className="rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white">
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
            <button type="button" onClick={addNote} className="rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white">
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
            <button type="button" onClick={addAnnouncement} className="rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white">
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
          className="mt-5 w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
