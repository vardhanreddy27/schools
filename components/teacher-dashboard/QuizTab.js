import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  PlusCircle,
  BookOpen,
  ArrowLeft,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { teacherSections, quizChaptersBySection } from "./data";

const studentAvatarPool = ["/student1.png", "/student2.png", "/student3.png", "/student4.png", "/student.jpeg"];

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
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
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

function getPendingQuizLabel(sectionId) {
  const sectionChapters = quizChaptersBySection[sectionId] || [];
  const pendingIndex = sectionChapters.findIndex((chapter) => chapter.status === "none");

  if (pendingIndex === -1) {
    return "All quizzes submitted";
  }

  const chapterTitle = sectionChapters[pendingIndex]?.title || "Next chapter";
  return `Quiz ${pendingIndex + 1} (${chapterTitle}) pending`;
}

export default function QuizTab() {
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedScoreSectionId, setSelectedScoreSectionId] = useState("9-a");
  const [scorePage, setScorePage] = useState(1);
  const [draftByChapter, setDraftByChapter] = useState({});
  const [statusOverrides, setStatusOverrides] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [isScoreSectionMenuOpen, setIsScoreSectionMenuOpen] = useState(false);
  const [openAnswerDropdown, setOpenAnswerDropdown] = useState(null);
  const scoreSectionMenuRef = useRef(null);

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

  const selectedScoreSection = useMemo(
    () => teacherSections.find((item) => item.id === selectedScoreSectionId) || teacherSections[0] || null,
    [selectedScoreSectionId]
  );

  const quizScoreRows = useMemo(() => {
    if (!selectedScoreSection) return [];

    return (selectedScoreSection.studentPerformance || []).map((student, index) => ({
      id: `${selectedScoreSection.id}-${student.name}`,
      name: student.name,
      quizScore: student.subjectPerformance,
      avatar: studentAvatarPool[index % studentAvatarPool.length],
    }));
  }, [selectedScoreSection]);

  const scorePageSize = 5;
  const scoreTotalPages = Math.max(1, Math.ceil(quizScoreRows.length / scorePageSize));
  const safeScorePage = Math.min(scorePage, scoreTotalPages);
  const pagedQuizScoreRows = quizScoreRows.slice((safeScorePage - 1) * scorePageSize, safeScorePage * scorePageSize);

  const chapterKey = selectedSection && selectedChapter ? `${selectedSection.id}:${selectedChapter.id}` : "";
  const activeQuestions = chapterKey ? draftByChapter[chapterKey] || createQuestionSet() : [];
  const displayedChapters = selectedChapter ? [selectedChapter] : chapters;

  // Close dropdowns when clicking outside
  const handleClickOutside = (e) => {
    if (scoreSectionMenuRef.current && !scoreSectionMenuRef.current.contains(e.target)) {
      setIsScoreSectionMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <article className="stagger-item bg-(--app-surface)  sm:p-5" style={{ "--stagger-delay": "40ms" }}>
          <p className="text-sm text-slate-500">Quiz center</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Select class to create quiz</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {teacherSections.map((section, sectionIndex) => {
              const avatars = Array.from({ length: 4 }, (_, idx) => studentAvatarPool[(sectionIndex + idx) % studentAvatarPool.length]);
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => openSection(section.id)}
                  className="group aspect-square rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-3 text-left shadow-[0_10px_24px_-22px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16c7bd] hover:from-[#effdfa] hover:to-[#e8f8f6] active:scale-[0.99] sm:p-4"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 sm:text-base">
                        Class {section.className} - Section {section.section}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{section.totalStudents} students</p>
                    </div>

                    <div className="flex">
                      <div className="inline-flex items-center -space-x-2.5 rounded-full px-2.5 py-1.5">
                        {avatars.map((avatar, idx) => (
                          <div key={`${section.id}-avatar-${idx}`} className="h-7 w-7 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white">
                            <Image src={avatar} alt="Student avatar" width={28} height={28} className="h-7 w-7 object-cover" />
                          </div>
                        ))}
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-700 text-[10px] font-bold text-white ring-2 ring-white">
                          +46
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">Next to start</p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#0b7f78] sm:text-[13px]">
                        {getPendingQuizLabel(section.id)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <article className="mt-5 overflow-visible rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-28px_rgba(15,23,42,0.55)]">
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
              <div className="mb-3">
                <p className="text-sm text-slate-500">Quiz score table</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">Student quiz scores</h3>
              </div>

              <div className="relative w-full sm:w-64 z-50" ref={scoreSectionMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsScoreSectionMenuOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-400"
                  aria-haspopup="listbox"
                  aria-expanded={isScoreSectionMenuOpen}
                >
                  <span>{selectedScoreSection?.className} - {selectedScoreSection?.section}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isScoreSectionMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isScoreSectionMenuOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="py-1" role="listbox" aria-label="Select class and section">
                      {teacherSections.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => {
                            setSelectedScoreSectionId(section.id);
                            setScorePage(1);
                            setIsScoreSectionMenuOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-slate-100 ${
                            selectedScoreSection?.id === section.id ? "bg-blue-50 text-slate-900" : "text-slate-700"
                          }`}
                          role="option"
                          aria-selected={selectedScoreSection?.id === section.id}
                        >
                          {section.className} - {section.section}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <table className="w-full table-fixed text-left">
                <thead className="bg-white text-xs font-semibold uppercase tracking-[0.09em] text-slate-500">
                  <tr>
                    <th className="w-[72%] px-3 py-2.5 sm:px-4">Student</th>
                    <th className="w-[28%] px-3 py-2.5 text-right">Quiz score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedQuizScoreRows.map((student) => (
                    <tr key={student.id}>
                      <td className="px-3 py-2.5 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                            <Image
                              src={student.avatar}
                              alt={student.name}
                              width={36}
                              height={36}
                              className="h-9 w-9 object-cover"
                            />
                          </div>
                          <p className="truncate text-sm font-semibold text-slate-900">{student.name}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          {student.quizScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 sm:px-4">
                <span>
                  Page {safeScorePage} of {scoreTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScorePage((prev) => Math.max(1, prev - 1))}
                    disabled={safeScorePage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setScorePage((prev) => Math.min(scoreTotalPages, prev + 1))}
                    disabled={safeScorePage === scoreTotalPages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </article>
        </article>
      ) : (
        <article className="stagger-item bg-(--app-surface) p-4 sm:p-5" style={{ "--stagger-delay": "60ms" }}>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={backToClassList}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          <div className="mt-3">
            <p className="text-sm text-slate-500">Selected class</p>
            <h3 className="text-lg font-semibold text-slate-900">
              Class {selectedSection.className} - Section {selectedSection.section}
            </h3>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {displayedChapters.map((chapter) => {
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
                      ? "border-sky-300 bg-sky-50"
                      : "border-(--app-border) bg-(--app-surface-muted)"
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
        <article className="stagger-item bg-(--app-surface) p-4 sm:p-5" style={{ "--stagger-delay": "120ms" }}>
          <div className="relative">
            <div className="pr-20">
              <p className="text-sm text-slate-500">Quiz builder</p>
              <h3 className="text-lg font-semibold text-slate-900">{selectedChapter.title}</h3>
            </div>
            <span className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI 
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activeQuestions.map((item, qIdx) => (
              <div key={item.id} className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Question {item.id}</p>
                <textarea
                  value={item.question}
                  onChange={(event) => updateQuestion(qIdx, "question", event.target.value)}
                  rows={2}
                  placeholder="Type your question"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-(--app-accent)"
                />

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.options.map((opt, optIdx) => (
                    <input
                      key={`${item.id}-${optIdx}`}
                      value={opt}
                      onChange={(event) => updateOption(qIdx, optIdx, event.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-(--app-accent)"
                    />
                  ))}
                </div>

                <div className="mt-3 sm:max-w-xs relative z-40">
                  <button
                    type="button"
                    onClick={() => setOpenAnswerDropdown(openAnswerDropdown === item.id ? null : item.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-400"
                    aria-haspopup="listbox"
                    aria-expanded={openAnswerDropdown === item.id}
                  >
                    <span>{item.answer ? `Option ${item.answer}` : "Select correct answer"}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${openAnswerDropdown === item.id ? "rotate-180" : ""}`} />
                  </button>

                  {openAnswerDropdown === item.id && (
                    <div className="absolute left-0 top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="py-1" role="listbox" aria-label="Select correct answer">
                        {["A", "B", "C", "D"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              updateQuestion(qIdx, "answer", option);
                              setOpenAnswerDropdown(null);
                            }}
                            className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-slate-100 ${
                              item.answer === option ? "bg-blue-50 text-slate-900" : "text-slate-700"
                            }`}
                            role="option"
                            aria-selected={item.answer === option}
                          >
                            Option {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {flashMessage ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              {flashMessage}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={saveQuizDraft}
              className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              <ClipboardCheck className="h-4 w-4" />
              Save Quiz
            </button>
            <button
              type="button"
              onClick={submitQuiz}
              className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-[#19c7be] hover:bg-[#1299a7] px-4 py-2.5 text-sm font-semibold text-white"
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
