import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, ClipboardList } from "lucide-react";
import { studentAssignments } from "./data";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeekMonday(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const mondayOffset = (day + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return d;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function keyOf(date) {
  return date.toISOString().slice(0, 10);
}

function isSameDate(a, b) {
  return keyOf(a) === keyOf(b);
}

export default function HomeworkTab() {
  const [activeSegment, setActiveSegment] = useState("homework");
  const today = startOfDay(new Date());
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [completedIds, setCompletedIds] = useState(
    () => new Set(studentAssignments.filter((item) => item.status === "Submitted").map((item) => item.id))
  );
  const weekStripRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const subjectImageMap = {
    science: "/science.png",
    telugu: "/telugu.png",
    english: "/english.png",
    maths: "/maths.png",
    math: "/maths.png",
    social: "/social.png",
    hindi: "/hindi.webp",
  };

  const withMeta = useMemo(() => {
    return studentAssignments.map((item) => {
      const normalized = item.subject.toLowerCase();
      const due = new Date(`${item.dueDate}T12:00:00`);
      const isComplete = completedIds.has(item.id);
      const daysLeft = Math.ceil((startOfDay(due).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...item,
        normalized,
        due,
        dueKey: keyOf(due),
        imageSrc: subjectImageMap[normalized] || "/logo.png",
        isComplete,
        marks: "10 marks",
        daysLeft,
      };
    });
  }, [completedIds, today]);

  const weekDays = useMemo(
    () => Array.from({ length: 6 }, (_, idx) => addDays(weekStart, idx)),
    [weekStart]
  );

  const pendingAssignments = withMeta.filter((hw) => !hw.isComplete);
  const completedAssignments = withMeta.filter((hw) => hw.isComplete);
  const selectedDateKey = keyOf(selectedDate);
  const tasksForSelectedDate = withMeta.filter((hw) => hw.dueKey === selectedDateKey);

  const assignmentCards =
    activeSegment === "homework"
      ? withMeta.sort((a, b) => a.due - b.due)
      : [...pendingAssignments, ...completedAssignments].sort((a, b) => a.subject.localeCompare(b.subject));
  const homeworkCards = useMemo(() => {
    const primary = [...assignmentCards];

    if (primary.length >= 3) return primary.slice(0, 3);

    const existing = new Set(primary.map((item) => item.id));
    const fallback = withMeta
      .sort((a, b) => a.due - b.due)
      .filter((item) => !existing.has(item.id));

    return [...primary, ...fallback].slice(0, 3);
  }, [assignmentCards, withMeta]);

  const groupedAssignments = useMemo(() => {
    const grouped = {};

    withMeta.forEach((item) => {
      if (!grouped[item.subject]) {
        grouped[item.subject] = {
          subject: item.subject,
          imageSrc: item.imageSrc,
          total: 0,
          completed: 0,
          pending: 0,
          latestDue: item.due,
        };
      }

      grouped[item.subject].total += 1;
      grouped[item.subject].completed += item.isComplete ? 1 : 0;
      grouped[item.subject].pending += item.isComplete ? 0 : 1;
      if (item.due > grouped[item.subject].latestDue) grouped[item.subject].latestDue = item.due;
    });

    return Object.values(grouped).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [withMeta]);

  function markAsCompleted(id) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function moveWeek(offsetDays) {
    setWeekStart((prev) => addDays(prev, offsetDays));
    setSelectedDate((prev) => addDays(prev, offsetDays));
  }

  function onWeekPointerDown(e) {
    if (!weekStripRef.current) return;
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      scrollLeft: weekStripRef.current.scrollLeft,
    };
    weekStripRef.current.setPointerCapture?.(e.pointerId);
  }

  function onWeekPointerMove(e) {
    if (!dragState.current.isDown || !weekStripRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    weekStripRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  }

  function onWeekPointerUp() {
    dragState.current.isDown = false;
  }

  const getCardTone = (isComplete) => {
    if (isComplete) {
      return "border-emerald-300 bg-emerald-50/70";
    }

    return "border-amber-300 bg-white";
  };

  return (
    <div className="space-y-6 py-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">THIS WEEK</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">
              {weekDays[0].toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - {weekDays[5].toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveWeek(-7)}
              className="rounded-full border border-slate-300 p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveWeek(7)}
              className="rounded-full border border-slate-300 p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Next week"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {weekDays.map((date) => {
            const isSelected = isSameDate(date, selectedDate);

            return (
              <button
                key={keyOf(date)}
                type="button"
                onClick={() => setSelectedDate(startOfDay(date))}
                className="flex flex-col items-center gap-1.5 text-center transition"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                    isSelected
                      ? "border-[#c79216] bg-[#fff4d6] text-[#8b6400] shadow-lg"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </section>

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

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-slate-600">
            {activeSegment === "homework" ? "ALL HOME WORK" : "ASSIGNMENTS BY SUBJECT"}
          </h3>
          <CalendarDays className="h-6 w-6 text-slate-500" />
        </div>

        <div className="space-y-4">
          {activeSegment === "homework" && homeworkCards.map((hw) => {
            return (
              <article key={`${activeSegment}-${hw.id}`} className={`rounded-3xl border p-4 ${getCardTone(hw.isComplete)}`}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
                      <Image src={hw.imageSrc} alt={`${hw.subject} image`} fill sizes="56px" className="object-contain p-1" />
                    </span>
                    <div>
                      <h4 className="text-2xl font-semibold text-slate-900">{hw.subject}</h4>
                      <p className={`text-sm ${hw.isComplete ? "text-slate-400 line-through" : "text-slate-600"}`}>{hw.title}</p>
                    </div>
                  </div>

                  {hw.isComplete ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                      <CircleAlert className="h-4 w-4" /> Pending
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
                      <CalendarDays className="h-4 w-4" />
                      {hw.due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">
                      <ClipboardList className="h-4 w-4" />
                      {hw.marks}
                    </span>
                  </div>

                  {!hw.isComplete && (
                    <button
                      type="button"
                      onClick={() => markAsCompleted(hw.id)}
                      className="rounded-xl bg-[#c79216] px-3 py-2 text-sm font-semibold text-white hover:bg-[#b68514]"
                    >
                      Mark as completed
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {activeSegment === "assignments" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {groupedAssignments.map((group) => {
                const completion = Math.round((group.completed / Math.max(group.total, 1)) * 100);

                return (
                  <article key={group.subject} className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
                        <Image src={group.imageSrc} alt={`${group.subject} image`} fill sizes="56px" className="object-contain p-1" />
                      </span>
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900">{group.subject}</h4>
                        <p className="text-xs text-slate-500">Latest due: {group.latestDue.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                      </div>
                    </div>

                    <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completion}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-slate-700">{completion}% completed</p>
                      <p className="text-slate-600">{group.completed}/{group.total}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">Open: {group.pending}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">Done: {group.completed}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {activeSegment === "homework" && homeworkCards.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No homework available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
