import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { todayClasses, dashboardInsights } from "./data";
import { insightCardTone, dayKey } from "./utils";

export default function HomeTab({ weekDays, today }) {
  const todayKey = dayKey(today);

  // Per-section homework state: key = classId, value = { text, sent }
  const [homeworkState, setHomeworkState] = useState(() =>
    Object.fromEntries(
      todayClasses.map((cls) => [`${cls.className}-${cls.section}`, { text: "", sent: false }])
    )
  );

  function handleTextChange(key, value) {
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], text: value } }));
  }

  function handleSend(key) {
    if (!homeworkState[key]?.text.trim()) return;
    setHomeworkState((prev) => ({ ...prev, [key]: { ...prev[key], sent: true } }));
  }

  function handleReset(key) {
    setHomeworkState((prev) => ({ ...prev, [key]: { text: "", sent: false } }));
  }

  return (
    <section className="mt-4 space-y-4">
      <article className=" bg-[var(--app-surface)] p-4 sm:p-5">
        <p className="text-sm text-slate-500">This week</p>
        <h2 className="mt-1 text-xl font-semibold">Teacher calendar view</h2>

        <div className="mt-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date) => {
              const isToday = dayKey(date) === todayKey;

              return (
                <div key={date.toISOString()} className="text-center">
                  <p className="text-xs text-slate-500">
                    {date.toLocaleDateString("en-IN", { weekday: "short" })}
                  </p>
                  <div
                    className={`mx-auto mt-1 flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${
                      isToday
                        ? "border border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[#8b6400]"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      <div className="flex flex-col gap-4 xl:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <article className="bg-[var(--app-surface)] p-4 sm:p-5">
          <p className="text-sm text-slate-500">Today classes</p>
          <h2 className="mt-1 text-xl font-semibold">Class timings for today</h2>

          <div className="mt-4 space-y-3">
            {todayClasses.map((item) => (
              <div
                key={`${item.period}-${item.className}-${item.section}`}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">
                    {item.subject} — {item.period}
                  </p>
                  <span className="rounded-full bg-[var(--app-accent-soft)] px-2 py-1 text-xs font-semibold text-[#8b6400]">
                    {item.time}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="mt-1 text-sm text-slate-600">
                    Class {item.className} | Section {item.section} | Room {item.room}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className=" bg-[var(--app-surface)] p-4 sm:p-5">
          <p className="text-sm text-slate-500">Today&apos;s overview</p>
          <h2 className="mt-1 text-xl font-semibold">What needs your attention</h2>

          <div className="mt-4 space-y-3">
            {dashboardInsights.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl bg-linear-to-br p-3.5 ring-1 sm:p-4 ${insightCardTone(item.tone)}`}
              >
                <p className="text-[10px] uppercase tracking-[0.09em] text-slate-500 sm:text-xs">{item.title}</p>
                <p className="mt-1.5 text-xl font-semibold text-slate-900 sm:mt-2 sm:text-2xl">{item.value}</p>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className=" bg-[var(--app-surface)] p-4 sm:p-5 xl:flex-1">
        <p className="text-sm text-slate-500">Notify parents &amp; students</p>
        <h2 className="mt-1 text-xl font-semibold">Today&apos;s homework</h2>

        <div className="mt-4 space-y-4">
          {todayClasses.map((cls) => {
            const key = `${cls.className}-${cls.section}`;
            const state = homeworkState[key];

            return (
              <div
                key={key}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Class {cls.className} — Section {cls.section}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cls.subject} · {cls.period} · {cls.time}
                    </p>
                  </div>
                  {state.sent ? (
                    <span className="flex items-center gap-1 rounded-full bg-[var(--app-success-soft)] px-2 py-1 text-xs font-semibold text-[var(--app-success-text)] ring-1 ring-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sent
                    </span>
                  ) : null}
                </div>

                {state.sent ? (
                  <div className="mt-3 rounded-xl bg-[var(--app-success-soft)] px-3 py-2.5">
                    <p className="text-sm text-emerald-800">{state.text}</p>
                    <p className="mt-1 text-xs text-emerald-600">
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
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent-soft)] placeholder:text-slate-400"
                    />
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  {state.sent ? (
                    <button
                      type="button"
                      onClick={() => handleReset(key)}
                      className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.25)] hover:bg-slate-50"
                    >
                      Edit &amp; resend
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!state.text.trim()}
                      onClick={() => handleSend(key)}
                      className="flex items-center gap-2 rounded-xl bg-[var(--app-accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:opacity-50"
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
