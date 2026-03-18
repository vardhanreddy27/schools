import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { weekPlan } from "./data";
import { statusStyles, eventDotColor, dayKey } from "./utils";

export default function TimetableTab({ calendarDate, setCalendarDate, monthGrid, monthEventsByDate, events, setEvents }) {
  const today = new Date();
  const todayKey = dayKey(today);
  const [activeDate, setActiveDate] = useState(null);
  const [eventType, setEventType] = useState("quiz");
  const [eventTitle, setEventTitle] = useState("");

  const orderedMonthEvents = useMemo(() => {
    const start = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const end = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [calendarDate, events]);

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
    setEvents((prev) => [
      ...prev,
      { date: activeDate, type: eventType, title: eventTitle.trim() },
    ]);
    setEventTitle("");
  }

  function removeEventFromDate(eventToRemove) {
    setEvents((prev) => prev.filter((item) => !(item.date === eventToRemove.date && item.title === eventToRemove.title && item.type === eventToRemove.type)));
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
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      {/* Left — Monthly calendar with event markers */}
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mt-1 text-xl font-semibold">Quiz and exam markers</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              onClick={() =>
                setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
              }
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              onClick={() =>
                setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
              }
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
                className={`flex h-12 flex-col items-center justify-center rounded-xl ${
                  isToday
                    ? "bg-[#fff8dc] border border-[#f2b705]"
                    : "bg-slate-50"
                }`}
              >
                <span className={`text-sm font-semibold ${isToday ? "text-[#8b6400]" : "text-slate-800"}`}>
                  {date.getDate()}
                </span>
                <div className="mt-1 flex items-center gap-0.5">
                  {events.slice(0, 2).map((event) => (
                    <span
                      key={`${key}-${event.type}-${event.title}`}
                      className={`h-1.5 w-1.5 rounded-full ${eventDotColor(event.type)}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Quiz day
          </span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Exam day
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Homework review
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Meeting
          </span>
        </div>

        {/* Events list for selected month */}
        {orderedMonthEvents.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Upcoming this month
            </p>
            {orderedMonthEvents.map((event) => (
              <div
                key={`${event.date}-${event.title}`}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${eventDotColor(event.type)}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Right — Calendar timings and weekly plan */}
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Calendar timings</p>
        <h2 className="mt-1 text-xl font-semibold">Upcoming academic flow</h2>

        <div className="mt-4 space-y-3">
          {weekPlan.map((item) => (
            <div
              key={`${item.label}-${item.focus}`}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${statusStyles(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
            </div>
          ))}
        </div>
      </article>

      {activeDate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={closeDatePopup}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Manage date events</p>
                <h3 className="text-lg font-semibold text-slate-900">{getDateLabel(activeDate)}</h3>
              </div>
              <button
                type="button"
                onClick={closeDatePopup}
                className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Close date event popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-[0.34fr_1fr_auto]">
              <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="homework">Homework</option>
                <option value="meeting">General</option>
              </select>
              <input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="e.g. 9th B - Quiz on Tenses"
                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
              <button type="button" onClick={addEventToDate} className="rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white">
                Add
              </button>
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
                    <button type="button" onClick={() => removeEventFromDate(eventItem)} className="text-xs font-semibold text-rose-600">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
