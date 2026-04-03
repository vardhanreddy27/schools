import { useState, useRef } from "react";
import { CheckCircle2, Send, Camera, Paperclip, Eye, Edit2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { todayClasses, dashboardInsights, teacherSections } from "./data";
import { insightCardTone } from "./utils";
import TeacherHeroCard from "./TeacherHeroCard";

const uniqueHomeworkClasses = Array.from(
  new Map(todayClasses.map((cls) => [`${cls.className}-${cls.section}`, cls])).values()
);

const homeworkClassesForBottom = uniqueHomeworkClasses.filter(
  (cls) => !((cls.className === "8th" && cls.section === "A") || (cls.className === "10th" && cls.section === "A"))
);

export default function HomeTab({ displayName = "Harika", subject = "English", classesToday = 4, avatarSrc = "/teacher.avif", onAvatarClick }) {
  const fileInputRef = useRef({});
  const cameraInputRef = useRef({});

  // Per-section homework state: key = classId, value = { text, sent, attachments, images }
  const [homeworkState, setHomeworkState] = useState(() =>
    Object.fromEntries(
      homeworkClassesForBottom.map((cls) => [`${cls.className}-${cls.section}`, { text: "", sent: false, attachments: [], images: [] }])
    )
  );

  function handleTextChange(key, value) {
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], text: value } }));
  }

  function handleFileUpload(key, event) {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHomeworkState((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            attachments: [
              ...prev[key].attachments,
              {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                size: file.size,
              },
            ],
          },
        }));
      };
      reader.readAsArrayBuffer(file);
    });
    event.target.value = "";
  }

  function handleCameraCapture(key, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setHomeworkState((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          images: [
            ...prev[key].images,
            {
              id: Date.now() + Math.random(),
              src: e.target.result,
              name: `Photo-${new Date().toLocaleTimeString()}`,
            },
          ],
        },
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeAttachment(key, id) {
    setHomeworkState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        attachments: prev[key].attachments.filter((att) => att.id !== id),
      },
    }));
  }

  function removeImage(key, id) {
    setHomeworkState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        images: prev[key].images.filter((img) => img.id !== id),
      },
    }));
  }

  function handleSend(key) {
    if (!homeworkState[key]?.text.trim()) return;
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], sent: true } }));
  }

  function handleReset(key) {
    setHomeworkState((prev) => ({ ...prev, [key]: { text: "", sent: false, attachments: [], images: [] } }));
  }

  function handleEdit(key) {
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], sent: false } }));
  }

  function getPeriodNote(period) {
    const periodNotes = {
      P1: "Continue Force chapter",
      P2: "Recap previous class",
      P3: "Continue Motion chapter",
      P4: "Numericals practice",
      P5: "Continue Light chapter",
      P6: "Concept check",
      P7: "Continue Electricity chapter",
      P8: "Quick revision",
    };

    return periodNotes[period] || "Continue chapter";
  }

  function getTimingTone(index) {
    const tones = [
      {
        card: "border-sky-200 bg-sky-50/80",
        period: "bg-white text-sky-700 ring-1 ring-sky-200",
        note: "text-sky-700",
        dot: "bg-sky-500",
        time: "bg-sky-100 text-sky-800",
        room: "text-sky-900/80",
      },
      {
        card: "border-emerald-200 bg-emerald-50/80",
        period: "bg-white text-emerald-700 ring-1 ring-emerald-200",
        note: "text-emerald-700",
        dot: "bg-emerald-500",
        time: "bg-emerald-100 text-emerald-800",
        room: "text-emerald-900/80",
      },
      {
        card: "border-amber-200 bg-amber-50/80",
        period: "bg-white text-amber-700 ring-1 ring-amber-200",
        note: "text-amber-700",
        dot: "bg-amber-500",
        time: "bg-amber-100 text-amber-800",
        room: "text-amber-900/80",
      },
      {
        card: "border-violet-200 bg-violet-50/80",
        period: "bg-white text-violet-700 ring-1 ring-violet-200",
        note: "text-violet-700",
        dot: "bg-violet-500",
        time: "bg-violet-100 text-violet-800",
        room: "text-violet-900/80",
      },
    ];

    return tones[index % tones.length];
  }

  return (
    <section className="page-enter space-y-4 pb-24">
      <TeacherHeroCard
        displayName={displayName}
        subject={subject}
        classesToday={classesToday}
        avatarSrc={avatarSrc}
        onAvatarClick={onAvatarClick}
      />

      <article className="stagger-item rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] sm:p-5" style={{ "--stagger-delay": "40ms" }}>
        <p className="text-sm text-slate-500">My classes</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">Class overview</h2>

        <div className="-mx-1 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
          {teacherSections.map((section) => {
            return (
              <Link
                key={section.id}
                href={`/teacher-section/${section.id}`}
                className="relative min-w-60 snap-start rounded-3xl border border-slate-200 bg-slate-50 p-3 pb-11 text-left transition hover:border-[#16c7bd] hover:bg-white active:scale-[0.99] md:min-w-0"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Class {section.className} - {section.section}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      Students: {section.totalStudents}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 rounded-2xl bg-white/70 p-3 ring-1 ring-slate-200/80">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.09em] text-amber-700">
                      <span>Attendance</span>
                      <span className="text-sm font-semibold normal-case tracking-normal text-amber-800">
                        {section.attendancePercent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-amber-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-500"
                        style={{ width: `${section.attendancePercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.09em] text-emerald-700">
                      <span>Performance</span>
                      <span className="text-sm font-semibold normal-case tracking-normal text-emerald-800">
                        {section.performancePercent}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500"
                        style={{ width: `${section.performancePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                {section.isClassTeacher ? (
                  <span className="absolute bottom-3 right-3 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                    Class Teacher
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </article>

      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <article className="stagger-item rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] sm:p-5" style={{ "--stagger-delay": "90ms" }}>
            <p className="text-sm text-slate-500">Today classes</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Class timings for today</h2>

            <div className="mt-4 space-y-3">
              {todayClasses.map((item, index) => {
                const tone = getTimingTone(index);
                return (
                  <div
                    key={`${item.period}-${item.className}-${item.section}`}
                    className={`rounded-3xl border p-4 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.22)] ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-tight text-slate-900">
                          Class {item.className} - Section {item.section}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ${tone.period}`}>
                            {item.period}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone.note}`}>
                            <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                            {getPeriodNote(item.period)}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-slate-900 sm:text-base">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="stagger-item rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] sm:p-5" style={{ "--stagger-delay": "130ms" }}>
            <p className="text-sm text-slate-500">Today&apos;s overview</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">What needs your attention</h2>

            <div className="mt-4 space-y-3">
              {dashboardInsights.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-3xl bg-linear-to-br p-3.5 ring-1 sm:p-4 ${insightCardTone(item.tone)}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.09em] text-slate-500 sm:text-xs">{item.title}</p>
                  <p className="mt-1.5 text-xl font-semibold text-slate-900 sm:mt-2 sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">{item.note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="stagger-item flex-1 rounded-3xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] sm:p-5 xl:flex-1" style={{ "--stagger-delay": "170ms" }}>
          <p className="text-sm text-slate-500">Notify parents &amp; students</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Today&apos;s homework</h2>

          <div className="mt-4 space-y-4">
            {homeworkClassesForBottom.map((cls) => {
              const key = `${cls.className}-${cls.section}`;
              const state = homeworkState[key];

              return (
                <div
                  key={key}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Class {cls.className} — Section {cls.section}
                      </p>
                      <p className="text-xs text-slate-500">
                        {cls.period} · {cls.time}
                      </p>
                    </div>
                    {state.sent ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sent
                      </span>
                    ) : null}
                  </div>

                  {state.sent ? (
                    <div className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2.5">
                      <p className="text-sm text-emerald-800">{state.text}</p>
                      {(state.attachments.length > 0 || state.images.length > 0) && (
                        <div className="mt-2 space-y-1">
                          {state.images.map((img) => (
                            <div key={img.id} className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.src}
                                alt={img.name}
                                className="h-12 w-12 rounded-lg object-cover ring-1 ring-emerald-300"
                              />
                              <span className="text-xs text-emerald-700">{img.name}</span>
                            </div>
                          ))}
                          {state.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-2 text-xs text-emerald-700">
                              <Paperclip className="h-3.5 w-3.5" />
                              {att.name}
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-emerald-600">
                        Parents and students have been notified.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <textarea
                        rows={3}
                        placeholder={`e.g. Read Ch. 5 and write a 10-line summary`}
                        value={state.text}
                        onChange={(e) => handleTextChange(key, e.target.value)}
                        className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-(--app-accent) focus:ring-2 focus:ring-(--app-accent-soft) placeholder:text-slate-400"
                      />
                      <div className="mt-2 space-y-2">
                        {state.images.map((img) => (
                          <div key={img.id} className="flex items-center justify-between gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.src}
                              alt={img.name}
                              className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                            <span className="flex-1 text-xs text-slate-700">{img.name}</span>
                            <button
                              type="button"
                              onClick={() => removeImage(key, img.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {state.attachments.map((att) => (
                          <div key={att.id} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs text-slate-700">
                              <Paperclip className="h-3.5 w-3.5" />
                              {att.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(key, att.id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current[key]?.click()}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          Attachment
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current[key]?.click()}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Camera
                        </button>
                      </div>

                      <input
                        ref={(el) => {
                          if (el) fileInputRef.current[key] = el;
                        }}
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(key, e)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                      />
                      <input
                        ref={(el) => {
                          if (el) cameraInputRef.current[key] = el;
                        }}
                        type="file"
                        accept="image/*"
                        capture
                        onChange={(e) => handleCameraCapture(key, e)}
                        className="hidden"
                      />
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    {state.sent ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(key)}
                          className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled
                          className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-400 opacity-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Submitted
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={!state.text.trim()}
                        onClick={() => handleSend(key)}
                        className="flex items-center gap-2 rounded-xl bg-[#16c7bd] px-4 py-2 text-sm font-semibold text-white hover:bg-[#13b4ab] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send to Parents &amp; Students
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
