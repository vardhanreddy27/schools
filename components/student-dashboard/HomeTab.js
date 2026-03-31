import { studentAssignments, studentAnnouncements, subjectProgress } from "@/components/student-dashboard/data";
import Image from "next/image";
import { PiLightbulbFilamentBold } from "react-icons/pi";
import { useMemo, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Trophy, School, UserRound, Bus } from "lucide-react";

function HalfProgressGauge({ value }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="mx-auto mt-1 w-full max-w-36 sm:max-w-40">
      <svg viewBox="0 0 120 80" className="h-auto w-full" aria-hidden="true">
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${clamped} 100`}
        />
        <text
          x="60"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-950 text-[20px] font-semibold sm:text-[24px]"
        >
          {clamped}%
        </text>
      </svg>
    </div>
  );
}

export default function HomeTab() {
  const [scheduleWindow, setScheduleWindow] = useState("morning");
  const [announcementQuickFilter, setAnnouncementQuickFilter] = useState("all");
  const [announcementsPage, setAnnouncementsPage] = useState(1);
  const announcementsPageSize = 3;
  const pendingHomework = studentAssignments.filter((item) => item.status !== "Submitted");
  const homeworkPreviewItems = pendingHomework.slice(0, 3);
  const announcementsPreviewItems = [
    "Maths - Mr. Rakesh: Submit algebra worksheet by tomorrow.",
    "Science - Ms. Nisha: Bring lab record for correction.",
    "Principal - Mrs. Kavitha (Principal): Parents meeting this Friday at 10:00 AM.",
  ];
  const averageScore = Math.round(
    subjectProgress.reduce((sum, item) => sum + item.score, 0) / Math.max(subjectProgress.length, 1)
  );
  const orderedSubjects = ["Telugu", "Hindi", "English", "Maths", "Science", "Social"];
  const subjectScoreMap = subjectProgress.reduce((map, item) => {
    map[item.subject] = item.score;
    return map;
  }, {});
  const subjectBars = orderedSubjects.map((subject) => ({
    subject,
    score: subjectScoreMap[subject] ?? 0,
  }));
  const chartBarColors = [
    "bg-amber-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  const weakSubjectItems = [
    { subject: "Maths", score: 52, tip: "Revise formulas and solve 5 mixed problems daily." },
    { subject: "Science", score: 48, tip: "Read one concept summary and practice one diagram." },
  ];
  const announcementQuickFilters = [
    { id: "all", label: "All", icon: Bell },
    { id: "principal", label: "Principal", icon: School },
    { id: "teacher", label: "Teacher", icon: UserRound },
    { id: "pet", label: "PET", icon: Trophy },
    { id: "high", label: "High", icon: Bell },
  ];

  const filteredAnnouncements = useMemo(() => {
    return studentAnnouncements
      .filter((item) => {
        if (announcementQuickFilter === "all") return true;
        if (announcementQuickFilter === "principal") return item.sourceRole === "Principal";
        if (announcementQuickFilter === "teacher") return item.sourceRole === "Subject Teacher" || item.sourceRole === "Class Teacher";
        if (announcementQuickFilter === "pet") return item.sourceRole === "PET";
        if (announcementQuickFilter === "transport") return item.sourceRole === "Transport";
        if (announcementQuickFilter === "high") return item.priority === "high";
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [announcementQuickFilter]);
  const announcementTotalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / announcementsPageSize));
  const pagedAnnouncements = filteredAnnouncements.slice(
    (announcementsPage - 1) * announcementsPageSize,
    announcementsPage * announcementsPageSize
  );

  function getSourceRoleIcon(sourceRole) {
    if (sourceRole === "Principal") return <School className="h-4 w-4" />;
    if (sourceRole === "PET") return <Trophy className="h-4 w-4" />;
    if (sourceRole === "Transport") return <Bus className="h-4 w-4" />;
    return <UserRound className="h-4 w-4" />;
  }

  function getPriorityPill(priority) {
    if (priority === "high") return "border-rose-200 bg-rose-50 text-rose-700";
    if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  const scheduleTimeline = [
    {
      id: "p1",
      timeLabel: "09:00 AM",
      endTimeLabel: "10:00 AM",
      classLabel: "7th A",
      periodLabel: "Period 1",
      subject: "Hindi",
      chapter: "Ch.9 Force & Law",
      progress: 85,
      totalChapters: 15,
      completed: 8,
      window: "morning",
      cardTone: "bg-sky-50",
      iconTone: "bg-sky-100 text-sky-700",
      icon: null,
      imageSrc: "/hindi.webp",
    },
    {
      id: "p2",
      timeLabel: "10:00 AM",
      endTimeLabel: "11:00 AM",
      classLabel: "7th A",
      periodLabel: "Period 2",
      subject: "Social",
      chapter: "Ch.6 Poetry and meaning",
      progress: 76,
      totalChapters: 12,
      completed: 6,
      window: "morning",
      cardTone: "bg-emerald-50",
      iconTone: "bg-emerald-100 text-emerald-700",
      icon: null,
      imageSrc: "/social.png",
    },
    {
      id: "p3",
      timeLabel: "11:00 AM",
      endTimeLabel: "12:00 PM",
      classLabel: "7th A",
      periodLabel: "Period 3",
      subject: "Maths",
      chapter: "Ch.9 Force & Law",
      progress: 85,
      totalChapters: 15,
      completed: 8,
      window: "morning",
      cardTone: "bg-rose-50",
      iconTone: "bg-rose-100 text-rose-700",
      icon: null,
      imageSrc: "/maths.png",
    },
    {
      id: "p4",
      timeLabel: "12:00 PM",
      endTimeLabel: "01:00 PM",
      classLabel: "7th A",
      periodLabel: "Period 4",
      subject: "English",
      chapter: "Ch.9 Force & Law",
      progress: 85,
      totalChapters: 15,
      completed: 8,
      window: "afternoon",
      cardTone: "bg-amber-50",
      iconTone: "bg-amber-100 text-amber-700",
      icon: null,
      imageSrc: "/english.png",
    },
    {
      id: "p5",
      timeLabel: "01:00 PM",
      endTimeLabel: "02:00 PM",
      classLabel: "7th A",
      periodLabel: "Period 5",
      subject: "Science",
      chapter: "Ch.9 Force & Law",
      progress: 85,
      totalChapters: 15,
      completed: 8,
      window: "afternoon",
      cardTone: "bg-orange-50",
      iconTone: "bg-orange-100 text-orange-700",
      icon: null,
      imageSrc: "/science.png",
    },
    {
      id: "p6",
      timeLabel: "02:00 PM",
      endTimeLabel: "03:00 PM",
      classLabel: "7th A",
      periodLabel: "Period 6",
      subject: "Telugu",
      chapter: "Ch.9 Force & Law",
      progress: 85,
      totalChapters: 15,
      completed: 8,
      window: "afternoon",
      cardTone: "bg-teal-50",
      iconTone: "bg-teal-100 text-teal-700",
      icon: null,
      imageSrc: "/telugu.png",
    },
  ];
  const visibleSchedule = scheduleTimeline.filter((slot) => slot.window === scheduleWindow);

  return (
    <>
      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <h2 className="mt-1 text-2xl font-semibold">Subject Performance</h2>

        <div className="mt-4 rounded-3xl py-3 pe-3">
          <div className="grid grid-cols-[2.8rem_1fr]">
            <div className="flex h-52 items-center justify-center text-[11px] font-semibold text-slate-500">
              <span style={{ writingMode: "vertical-rl" }} className="-rotate-180 text-center">
                Percentage (%) of marks scored
              </span>
            </div>

            <div>
              <div className="relative h-52">
                <div className="relative z-10 grid h-full grid-cols-6 items-end gap-2">
                  {subjectBars.map((item, index) => (
                    <div key={item.subject} className="flex h-full flex-col items-center justify-end gap-1">
                      <span className="text-[11px] font-semibold text-slate-700">{item.score}%</span>
                      <div
                        className={`w-full rounded-t-lg border border-slate-300/70 transition-all duration-300 ${chartBarColors[index % chartBarColors.length]}`}
                        style={{ height: `${Math.max(item.score, 10)}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-slate-600">
                {subjectBars.map((item) => (
                  <span key={item.subject}>{item.subject.slice(0, 3)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold text-slate-900">Key Metrics</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Quiz Performance</p>
            <div className="flex items-center justify-center">
              <HalfProgressGauge value={averageScore} />
            </div>
            <p className="inline-flex self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Average quiz score
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Homework Due</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{homeworkPreviewItems.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-amber-50/90 p-2 ring-1 ring-amber-100">
                {homeworkPreviewItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={`${item.subject}: ${item.title}`}>
                      {item.subject}: {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#8b6400]">
              Pending Tasks 
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Announcements</p>
            <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3">
              <p className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">{announcementsPreviewItems.length}</p>
              <ul className="min-w-0 space-y-1 rounded-xl bg-rose-50/90 p-2 ring-1 ring-rose-100">
                {announcementsPreviewItems.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden="true" />
                    <span className="block min-w-0 truncate text-[11px] font-medium text-slate-700" title={item}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="inline-flex self-start rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
               School updates
            </p>
          </article>

          <article className="grid min-h-52 grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
            <p className="text-sm text-slate-500">Weak Subjects</p>
            <div className="min-w-0 space-y-3 self-center">
              {weakSubjectItems.map((item) => (
                <div key={item.subject} className="min-w-0 space-y-1.5">
                  <p className="text-base font-semibold text-slate-900">{item.subject}</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 flex-1 overflow-hidden rounded-full border border-slate-300/80 bg-slate-100"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg, rgba(148,163,184,0.3) 0, rgba(148,163,184,0.3) 4px, rgba(241,245,249,0.95) 4px, rgba(241,245,249,0.95) 8px)",
                      }}
                    >
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{item.score}%</span>
                  </div>
                  <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-600">
                    <PiLightbulbFilamentBold className="h-3.5 w-3.5 shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
                    <span className="block min-w-0 flex-1 truncate whitespace-nowrap" title={item.tip}>{item.tip}</span>
                  </p>
                </div>
              ))}
            </div>

          </article>
        </div>
      </section>

      <section className="mt-4">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Today schedule</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Classes</h2>
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setScheduleWindow("morning")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  scheduleWindow === "morning" ? "bg-[#c79216] text-white shadow-sm" : "text-slate-600"
                }`}
              >
                Morning
              </button>
              <button
                type="button"
                onClick={() => setScheduleWindow("afternoon")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  scheduleWindow === "afternoon" ? "bg-[#c79216] text-white shadow-sm" : "text-slate-600"
                }`}
              >
                Afternoon
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {visibleSchedule.map((slot) => {
              const Icon = slot.icon;

              return (
                <div key={slot.id} className={`grid min-w-0 grid-cols-[2fr_1fr_1fr] gap-3 rounded-3xl ${slot.cardTone}`}>
                  {/* Subject image and name (50%) - now on the left */}
                  <div className="flex min-h-20.5 items-center col-start-1 col-end-2">
                    <div className={`flex shrink-0 items-center justify-center bg-white/30 ${slot.imageSrc ? "px-1.5 sm:px-2" : "px-2"}`}>
                      {slot.imageSrc ? (
                        <Image
                          src={slot.imageSrc}
                          alt={`${slot.subject} icon`}
                          width={60}
                          height={60}
                          sizes="60px"
                          className="h-15 w-15 object-contain"
                        />
                      ) : (
                        <Icon className="h-7 w-7 text-slate-700" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:justify-start sm:px-2">
                      <p className="truncate text-center text-xl font-semibold leading-tight text-slate-900 sm:text-left sm:text-2xl">
                        {slot.subject}
                      </p>
                    </div>
                  </div>

                  {/* Period label (25%) - center */}
                  <div className="flex min-h-20.5 flex-col justify-center pt-1 col-start-2 col-end-3">
                    <p className="text-xs font-semibold text-slate-500">{slot.periodLabel}</p>
                  </div>

                  {/* Time (25%) - now on the right */}
                  <div className="flex min-h-20.5 flex-col justify-center pt-1 col-start-3 col-end-4">
                    <p className="text-xs font-semibold text-slate-500">{slot.timeLabel} - {slot.endTimeLabel}</p>
                  </div>
                </div>
              );
            })}

            {visibleSchedule.length === 0 && (
              <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">No classes in this time window.</p>
            )}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Announcements</p>
        <h2 className="mt-1 text-2xl font-semibold">Latest updates</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">Total: {studentAnnouncements.length}</span>
          <span className="rounded-full bg-[#fff4d6] px-3 py-1 font-semibold text-[#8b6400]">High priority: {studentAnnouncements.filter((item) => item.priority === "high").length}</span>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {announcementQuickFilters.map((filter) => {
            const Icon = filter.icon;
            const active = announcementQuickFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setAnnouncementQuickFilter(filter.id);
                  setAnnouncementsPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-[#c79216] bg-[#fff4d6] text-[#8b6400]"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-3">
          {pagedAnnouncements.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.id} className="rounded-2xl border border-[#efd5a0] bg-[#fffaf0] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                        {getSourceRoleIcon(item.sourceRole)}
                        {item.sourceRole}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase ${getPriorityPill(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      By {item.sourceName} • {new Date(item.date).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4d6] text-[#8b6400]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-[#c79216] px-2 py-1 text-xs font-semibold text-white hover:bg-[#b68514]"
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {pagedAnnouncements.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No announcements match your current filters.
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-slate-600">
            Showing {filteredAnnouncements.length === 0 ? 0 : (announcementsPage - 1) * announcementsPageSize + 1} to {Math.min(announcementsPage * announcementsPageSize, filteredAnnouncements.length)} of {filteredAnnouncements.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAnnouncementsPage((prev) => Math.max(1, prev - 1))}
              disabled={announcementsPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-slate-700 font-semibold">
              Page {announcementsPage} / {announcementTotalPages}
            </span>
            <button
              type="button"
              onClick={() => setAnnouncementsPage((prev) => Math.min(announcementTotalPages, prev + 1))}
              disabled={announcementsPage === announcementTotalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
