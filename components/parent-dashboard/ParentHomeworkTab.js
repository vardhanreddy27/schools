import React, { useMemo, useState } from "react";
import Image from "next/image";
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
} from "lucide-react";
import { studentAssignments, pendingHomework } from "./data";

const SUBJECT_IMAGE_MAP = {
  science: "/science.png",
  telugu: "/telugu.png",
  english: "/english.png",
  maths: "/maths.png",
  math: "/maths.png",
  social: "/social.png",
  hindi: "/hindi.webp",
  biology: "/biology.png",
};

export default function ParentHomeworkTab() {
  const [activeSegment, setActiveSegment] = useState("homework");
  const [expandedHomeworkId, setExpandedHomeworkId] = useState(null);
  const [expandedAssignmentSubject, setExpandedAssignmentSubject] = useState(null);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today);
    const day = d.getDay();
    const mondayOffset = (day + 6) % 7;
    d.setDate(d.getDate() - mondayOffset);
    return d;
  });

  const weekDays = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    }), [weekStart]);

  const groupedAssignments = useMemo(() => {
    const grouped = {};
    studentAssignments.forEach((item) => {
      if (!grouped[item.subject]) {
        grouped[item.subject] = { 
          subject: item.subject, 
          imageSrc: SUBJECT_IMAGE_MAP[item.subject.toLowerCase()] || "/logo.png", 
          tasks: [] 
        };
      }
      grouped[item.subject].tasks.push({
        title: item.title,
        desc: item.description || "Research and compile a 2-page report including diagrams and references.",
        requirements: ["A4 Sheet", "Colored Pens", "Diagrams"]
      });
    });
    return Object.values(grouped);
  }, []);

  return (
    <div className="space-y-6 pb-24 pt-4 font-sans">
      {/* 1. CALENDAR STRIP */}
      <section className="rounded-[32px] border border-slate-100 bg-white p-4 shadow-sm mx-1">
        <div className="mb-4 flex items-center justify-between px-2">
          <h3 className="text-lg font-extrabold text-slate-900">
            {weekStart.toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })} - 
            {weekDays[5].toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <button onClick={() => setWeekStart(d => new Date(d.setDate(d.getDate() - 7)))} className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <button onClick={() => setWeekStart(d => new Date(d.setDate(d.getDate() + 7)))} className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 transition-colors">
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {weekDays.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <button key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`flex flex-col items-center gap-1 rounded-[20px] py-3 transition-all ${isSelected ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}>
                <span className="text-[10px] font-bold uppercase opacity-60">{date.toLocaleDateString("en-IN", { weekday: 'short' })}</span>
                <span className="text-sm font-black">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TABS */}
      <div className="flex rounded-3xl bg-slate-100 p-1.5 mx-1">
        <button onClick={() => setActiveSegment("homework")} className={`flex-1 rounded-2xl py-3 text-sm font-black transition-all ${activeSegment === "homework" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Homework</button>
        <button onClick={() => setActiveSegment("assignments")} className={`flex-1 rounded-2xl py-3 text-sm font-black transition-all ${activeSegment === "assignments" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Assignments</button>
      </div>

      {/* 3. CONTENT LIST */}
      <div className="space-y-4 px-1">
        {activeSegment === "homework" ? (
          pendingHomework.map((hw) => {
            const isExpanded = expandedHomeworkId === hw.id;
            return (
              <article key={hw.id} className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all" onClick={() => setExpandedHomeworkId(isExpanded ? null : hw.id)}>
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-18 w-18 shrink-0 ">
                      <Image src={SUBJECT_IMAGE_MAP[hw.subject.toLowerCase()] || "/logo.png"} alt={hw.subject} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black text-slate-900 leading-tight">{hw.subject}</h4>
                      <p className="truncate text-sm font-semibold text-slate-500">{hw.title}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-900" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Instructions</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{hw.description}</p>
                      <ul className="mt-3 space-y-2">
                        {/* Rendering single instruction as a list item to match student UI style */}
                        <li className="flex gap-3 text-sm font-medium text-slate-600 leading-snug">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">1</span>
                          Complete the work by {new Date(hw.dueDate).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          /* ASSIGNMENTS TAB */
          groupedAssignments.map((group) => {
            const isExpanded = expandedAssignmentSubject === group.subject;
            return (
              <article key={group.subject} className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all" onClick={() => setExpandedAssignmentSubject(isExpanded ? null : group.subject)}>
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-18 w-18 shrink-0 ">
                      <Image src={group.imageSrc} alt={group.subject} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black text-slate-900 leading-tight">{group.subject}</h4>
                      <p className="text-sm font-semibold text-slate-500">{group.tasks.length} Assignments Available</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-900" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
                      <div className="space-y-4">
                        {group.tasks.map((task, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-2 w-2 rounded-full bg-slate-900" />
                              <span className="text-sm font-black text-slate-900">{task.title}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mb-3 ml-4">{task.desc}</p>
                            <div className="flex flex-wrap gap-2 ml-4">
                              {task.requirements.map((req, rIdx) => (
                                <span key={rIdx} className="text-[10px] font-bold bg-white text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  );
}