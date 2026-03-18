export function statusStyles(status) {
  if (status === "submitted") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "quiz") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "exam") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (status === "homework") return "bg-sky-50 text-sky-700 ring-sky-200";
  if (status === "grading") return "bg-purple-50 text-purple-700 ring-purple-200";
  if (status === "meeting") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function insightCardTone(tone) {
  if (tone === "amber") return "from-amber-50 to-white ring-amber-100";
  if (tone === "blue") return "from-sky-50 to-white ring-sky-100";
  if (tone === "emerald") return "from-emerald-50 to-white ring-emerald-100";
  if (tone === "rose") return "from-rose-50 to-white ring-rose-100";
  return "from-slate-50 to-white ring-slate-200";
}

export function eventDotColor(type) {
  if (type === "quiz") return "bg-amber-400";
  if (type === "exam") return "bg-rose-400";
  if (type === "homework") return "bg-sky-400";
  if (type === "meeting") return "bg-emerald-400";
  return "bg-slate-300";
}

export function buildMonthCalendar(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const cells = Math.ceil((startOffset + last.getDate()) / 7) * 7;

  return Array.from({ length: cells }, (_, i) => {
    const day = i - startOffset + 1;
    if (day < 1 || day > last.getDate()) return null;
    return new Date(year, month, day);
  });
}

export function weekDaysFromDate(referenceDate) {
  const dayIndex = referenceDate.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() + mondayOffset + index);
    return date;
  });
}

export function dayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
