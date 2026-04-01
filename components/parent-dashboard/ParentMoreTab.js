import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ParentTimetableTab from "./ParentTimetableTab";

const moreCards = [
  {
    id: "calendar",
    title: "Academic Calendar",
    subtitle: "Important dates and holidays",
    imageSrc: "/calendericon.webp",
    tone: "from-sky-100 to-cyan-100",
  },
  {
    id: "leave",
    title: "Leave Request",
    subtitle: "Request student leave quickly",
    imageSrc: "/leaveicon.webp",
    tone: "from-amber-100 to-orange-100",
  },
  {
    id: "exams",
    title: "View Exams",
    subtitle: "Upcoming and past exams",
    imageSrc: "/examicon.webp",
    tone: "from-indigo-100 to-violet-100",
  },
  {
    id: "syllabus",
    title: "Syllabus",
    subtitle: "Track curriculum progress",
    imageSrc: "/syllbusicon.webp",
    tone: "from-emerald-100 to-teal-100",
  },
  {
    id: "announcements",
    title: "Announcements",
    subtitle: "School notices and updates",
    imageSrc: "/announcementsicon.png",
    tone: "from-amber-100 to-yellow-100",
  },
  {
    id: "bus",
    title: "Bus Tracking",
    subtitle: "Live route and arrival status",
    imageSrc: "/bustracking.webp",
    tone: "from-rose-100 to-pink-100",
  },
  {
    id: "timetable",
    title: "Timetable",
    subtitle: "Tap to open full schedule",
    imageSrc: "/timetable.png",
    tone: "from-blue-100 to-indigo-100",
  },
];

const teacherContactCards = [
  {
    id: "contact",
    title: "Call",
    teacherName: "Prakesh Sir",
    section: "8th A",
    imageSrc: "/call.png",
    tone: "from-sky-50 to-cyan-50",
  },
  {
    id: "text",
    title: "Text ",
    teacherName: "Kavya Ma'am",
    section: "9th B",
    imageSrc: "/message.png",
    tone: "from-rose-50 to-pink-50",
  },
];

export default function ParentMoreTab() {
  const [timetableOpen, setTimetableOpen] = useState(false);

  function handleCardClick(cardId) {
    if (cardId === "timetable") {
      setTimetableOpen(true);
    }
  }

  return (
    <>
      <section className="-mx-3 space-y-5 pt-2 sm:mx-0">
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Teacher connect</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Contact teacher</h2>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            {teacherContactCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`rounded-2xl bg-linear-to-br ${card.tone} p-3 text-left text-slate-900 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] sm:p-4`}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-tight sm:text-base">{card.title}</p>
                    <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">{card.teacherName}, {card.section}</p>
                  </div>

                  <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl sm:h-14 sm:w-16">
                    <Image
                      src={card.imageSrc}
                      alt={`${card.title} icon`}
                      width={76}
                      height={76}
                      className="h-14 w-14 object-contain sm:h-12 sm:w-12"
                    />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Parent control</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Quick actions</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {moreCards.map((card) => {
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card.id)}
                  className={`group rounded-2xl bg-linear-to-br ${card.tone} p-4 text-left text-slate-900 shadow-sm ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{card.title}</p>
                      <p className="mt-1 text-xs text-slate-600">{card.subtitle}</p>
                      {card.id !== "timetable" ? <p className="mt-3 text-[11px] font-medium text-slate-500">Coming soon</p> : null}
                    </div>
                    <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl">
                      <Image
                        src={card.imageSrc}
                        alt={`${card.title} icon`}
                        width={72}
                        height={72}
                        className="h-14 w-14 object-contain"
                      />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </article>
      </section>

      {timetableOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="h-[90vh] w-full overflow-hidden rounded-t-3xl bg-[#eef3fb] shadow-2xl sm:h-auto sm:max-h-[88vh] sm:max-w-4xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">More</p>
                <h3 className="text-lg font-semibold text-slate-900">Timetable</h3>
              </div>
              <button
                type="button"
                onClick={() => setTimetableOpen(false)}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close timetable"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-64px)] overflow-y-auto px-3 pb-4 sm:max-h-[calc(88vh-64px)] sm:px-5 sm:pb-5">
              <ParentTimetableTab />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}