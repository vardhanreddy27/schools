import { useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, ClipboardCheck, PlusCircle, BookOpen, ArrowLeft } from "lucide-react";
import { teacherSections, quizChaptersBySection } from "./data";

function createQuestionSet() {
  return Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    question: "",
    options: ["", "", "", ""],
    answer: "",
  }));
}

function statusPill(status) {
  if (status === "submitted") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }
  if (status === "added") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }
  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
}

function statusLabel(status) {
  if (status === "submitted") return "Submitted";
  if (status === "added") return "Quiz Added";
  return "Not Added";
}

function statusIcon(status) {
  if (status === "submitted") return CheckCircle2;
  if (status === "added") return PlusCircle;
  return CircleDashed;
}

export default function QuizTab() {
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [draftByChapter, setDraftByChapter] = useState({});
  const [statusOverrides, setStatusOverrides] = useState({});
  const [flashMessage, setFlashMessage] = useState("");

  const selectedSection = useMemo(
    () => teacherSections.find((item) => item.id === selectedSectionId) || null,
    [selectedSectionId]
  );

  const chapters = useMemo(() => {
    if (!selectedSectionId) return [];
    return quizChaptersBySection[selectedSectionId] || [];
  }, [selectedSectionId]);

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === selectedChapterId) || null,
    [chapters, selectedChapterId]
  );

  const chapterKey = selectedSection && selectedChapter ? `${selectedSection.id}:${selectedChapter.id}` : "";

  const activeQuestions = chapterKey ? draftByChapter[chapterKey] || createQuestionSet() : [];

  function getEffectiveStatus(chapter) {
    return statusOverrides[`${selectedSectionId}:${chapter.id}`] || chapter.status;
  }

  function updateQuestion(questionIndex, field, value) {
    if (!chapterKey) return;

    setDraftByChapter((prev) => {
      const existing = prev[chapterKey] || createQuestionSet();
      const updated = existing.map((item, idx) => {
        if (idx !== questionIndex) return item;
        return { ...item, [field]: value };
      });
      return { ...prev, [chapterKey]: updated };
    });
  }

  function updateOption(questionIndex, optionIndex, value) {
    if (!chapterKey) return;

    setDraftByChapter((prev) => {
      const existing = prev[chapterKey] || createQuestionSet();
      const updated = existing.map((item, idx) => {
        if (idx !== questionIndex) return item;
        const options = [...item.options];
        options[optionIndex] = value;
        return { ...item, options };
      });
      return { ...prev, [chapterKey]: updated };
    });
  }

  function saveQuizDraft() {
    if (!chapterKey) return;
    setStatusOverrides((prev) => ({ ...prev, [chapterKey]: "added" }));
    setFlashMessage("Quiz draft saved for this chapter.");
  }

  function submitQuiz() {
    if (!chapterKey) return;
    setStatusOverrides((prev) => ({ ...prev, [chapterKey]: "submitted" }));
    setFlashMessage("Quiz submitted successfully.");
  }

  function openSection(sectionId) {
    setSelectedSectionId(sectionId);
    setSelectedChapterId("");
    setFlashMessage("");
  }

  function openChapter(chapterId) {
    setSelectedChapterId(chapterId);
    setFlashMessage("");
  }

  function backToClassList() {
    setSelectedSectionId("");
    setSelectedChapterId("");
    setFlashMessage("");
  }

  return (
    <section className="page-enter space-y-4 pb-24">
      {!selectedSection ? (
        <article className="stagger-item bg-[var(--app-surface)] p-4 sm:p-5" style={{ "--stagger-delay": "40ms" }}>
          <p className="text-sm text-slate-500">Quiz center</p>
          <h2 className="mt-1 text-l font-semibold">Select class to create quiz</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {teacherSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => openSection(section.id)}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-left transition active:scale-[0.99]"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Class {section.className} - Section {section.section}
                </p>
                <p className="mt-1 text-xs text-slate-600">{section.totalStudents} students</p>
              </button>
            ))}
          </div>
        </article>
      ) : (
        <article className="stagger-item bg-[var(--app-surface)] p-4 sm:p-5" style={{ "--stagger-delay": "60ms" }}>
          <button
            type="button"
            onClick={backToClassList}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-3">
            <p className="text-sm text-slate-500">Selected class</p>
            <h3 className="text-lg font-semibold text-slate-900">
              Class {selectedSection.className} - Section {selectedSection.section}
            </h3>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {chapters.map((chapter) => {
              const effectiveStatus = getEffectiveStatus(chapter);
              const Icon = statusIcon(effectiveStatus);
              const isActive = selectedChapterId === chapter.id;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => openChapter(chapter.id)}
                  className={`rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                    isActive
                      ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)]"
                      : "border-[var(--app-border)] bg-[var(--app-surface-muted)]"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{chapter.title}</p>
                  <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusPill(effectiveStatus)}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {statusLabel(effectiveStatus)}
                  </span>
                </button>
              );
            })}
          </div>
        </article>
      )}

      {selectedChapter ? (
        <article className="stagger-item bg-[var(--app-surface)] p-4 sm:p-5" style={{ "--stagger-delay": "120ms" }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-slate-500">Quiz builder</p>
              <h3 className="text-lg font-semibold text-slate-900">{selectedChapter.title}</h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              <BookOpen className="h-3.5 w-3.5" />
              6 Questions Required
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activeQuestions.map((item, qIdx) => (
              <div key={item.id} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Question {item.id}</p>
                <textarea
                  value={item.question}
                  onChange={(event) => updateQuestion(qIdx, "question", event.target.value)}
                  rows={2}
                  placeholder="Type your question"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[var(--app-accent)]"
                />

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.options.map((opt, optIdx) => (
                    <input
                      key={`${item.id}-${optIdx}`}
                      value={opt}
                      onChange={(event) => updateOption(qIdx, optIdx, event.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[var(--app-accent)]"
                    />
                  ))}
                </div>

                <div className="mt-3 sm:max-w-xs">
                  <select
                    value={item.answer}
                    onChange={(event) => updateQuestion(qIdx, "answer", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[var(--app-accent)]"
                  >
                    <option value="">Select correct answer</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {flashMessage ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              {flashMessage}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveQuizDraft}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              <ClipboardCheck className="h-4 w-4" />
              Save Quiz
            </button>
            <button
              type="button"
              onClick={submitQuiz}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--app-accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Quiz
            </button>
          </div>
        </article>
      ) : null}
    </section>
  );
}
