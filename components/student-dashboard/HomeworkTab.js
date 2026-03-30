import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Atom,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  FlaskConical,
  Languages,
  Leaf,
  Sigma,
} from "lucide-react";
import { studentAssignments } from "./data";

export default function HomeworkTab() {
  const [activeSegment, setActiveSegment] = useState("homework");
  const trackedSubjects = new Set(["science", "telugu", "english"]);
  const subjectImageMap = {
    science: "/science.png",
    telugu: "/telugu.png",
    english: "/english.png",
  };

  const subjectIconMap = {
    english: Languages,
    Maths: Sigma,
    math: Sigma,
    physics: Atom,
    chemistry: FlaskConical,
    science: FlaskConical,
    biology: Leaf,
    "biological science": Leaf,
    telugu: Languages,
    hindi: Languages,
    bangla: Languages,
  };

  const withMeta = studentAssignments.map((item) => {
    const normalized = item.subject.toLowerCase();
    const Icon = subjectIconMap[normalized] || BookOpen;
    const isComplete = item.status === "Submitted";
    return {
      ...item,
      normalized,
      Icon,
      imageSrc: subjectImageMap[normalized] || null,
      isComplete,
      marks: "10 marks",
    };
  }).filter((item) => trackedSubjects.has(item.normalized));

  const pendingAssignments = withMeta.filter((hw) => !hw.isComplete);
  const completedAssignments = withMeta.filter((hw) => hw.isComplete);

  const urgentAssignment = pendingAssignments[0] || null;
  const assignmentCards = activeSegment === "homework" ? withMeta : [...pendingAssignments, ...completedAssignments];

  const getCardTone = (isComplete) => {
    if (isComplete) {
      return "border-emerald-300 bg-emerald-50/70";
    }

    return "border-amber-300 bg-white";
  };

  return (
    <div className="space-y-6 py-6">
      <section className="rounded-3xl bg-slate-100 p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveSegment("homework")}
            className={`rounded-2xl py-3 text-lg font-semibold transition-all ${
              activeSegment === "homework" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Home Work
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment("assignments")}
            className={`rounded-2xl py-3 text-lg font-semibold transition-all ${
              activeSegment === "assignments" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Assignments
          </button>
        </div>
      </section>

      {urgentAssignment ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-600">URGENT - DUE SOON</h3>
          <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <CircleAlert className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-3xl font-semibold text-slate-950">{urgentAssignment.subject}</p>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">1 Day Left</span>
                </div>
                <p className="text-base text-slate-600">{urgentAssignment.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1">
                    <CalendarDays className="h-4 w-4" />
                    Tomorrow
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1">
                    <ClipboardList className="h-4 w-4" />
                    {urgentAssignment.marks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-slate-600">
            {activeSegment === "homework" ? "HOME WORK" : "ASSIGNMENTS BY SUBJECT"}
          </h3>
          <CalendarDays className="h-6 w-6 text-slate-500" />
        </div>

        <div className="space-y-4">
          {assignmentCards.map((hw) => {
            const SubjectIcon = hw.Icon;

            return (
              <article key={`${activeSegment}-${hw.id}`} className={`rounded-3xl border p-4 ${getCardTone(hw.isComplete)}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-slate-700 ring-1 ring-slate-200">
                      {hw.imageSrc ? (
                        <Image src={hw.imageSrc} alt={`${hw.subject} icon`} fill sizes="48px" className="object-contain p-1" />
                      ) : (
                        <SubjectIcon className="h-6 w-6" />
                      )}
                    </span>
                    <h4 className="text-3xl font-semibold text-slate-900">{hw.subject}</h4>
                  </div>

                  {hw.isComplete ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">
                      <AlertCircle className="h-5 w-5" />
                      In Complete
                    </span>
                  )}
                </div>

                <p className={`text-base text-slate-600 ${hw.isComplete ? "line-through text-slate-400" : ""}`}>{hw.title}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
                    <ClipboardList className="h-4 w-4" />
                    {hw.marks}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Study Tips */}
      <section className="rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 p-6">
        <h3 className="mb-3 font-semibold text-slate-950">Tips for Parents</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            {`Start assignments early, don't wait until the last day`}
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            {`Ask for help if you don't understand the task`}
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Submit before the due date to avoid penalties
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Keep all reference materials ready
          </li>
        </ul>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{pendingAssignments.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-xs text-emerald-700">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{completedAssignments.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-amber-700">Total</p>
          <p className="mt-1 text-2xl font-semibold text-amber-700">{withMeta.length}</p>
        </div>
      </section>
    </div>
  );
}
