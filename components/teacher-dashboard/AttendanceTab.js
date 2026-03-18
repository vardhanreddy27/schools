import { useMemo, useState } from "react";
import { teacherSelfAttendance } from "./data";
import { dayKey } from "./utils";
import { statusStyles } from "./utils";

export function AttendanceTab({ classes, attendanceRecords, onSubmitAttendance }) {
  const [substituteClassId, setSubstituteClassId] = useState(classes[0]?.id || "");
  const [isSubstitute, setIsSubstitute] = useState(false);

  const morningClass = classes[0] || null;
  const eveningClass = classes[1] || classes[0] || null;

  const selectedSubstituteClass = useMemo(
    () => classes.find((item) => item.id === substituteClassId) || classes[0],
    [classes, substituteClassId]
  );

  const todayKey = dayKey(new Date());
  const todaysRecords = useMemo(
    () => attendanceRecords.filter((entry) => entry.dateKey === todayKey),
    [attendanceRecords, todayKey]
  );

  const morningSubmitted = todaysRecords.some((entry) => entry.session === "Morning" && !entry.isSubstitute);
  const eveningSubmitted = todaysRecords.some((entry) => entry.session === "Evening" && !entry.isSubstitute);
  const canSubmit = todaysRecords.length < 2;
  const nextAvailableSession = !morningSubmitted ? "Morning" : "Evening";

  function handleSubstituteClassChange(nextClassId) {
    setSubstituteClassId(nextClassId);
  }

  function submitPrimaryAttendance(session) {
    if (!canSubmit) return;

    const targetClass = session === "Morning" ? morningClass : eveningClass;
    if (!targetClass) return;

    onSubmitAttendance({
      classId: targetClass.id,
      className: targetClass.className,
      section: targetClass.section,
      session,
      present: targetClass.strength,
      total: targetClass.strength,
      submittedBy: "You",
      isSubstitute: false,
    });
  }

  function submitSubstituteAttendance() {
    if (!canSubmit || !selectedSubstituteClass) return;

    onSubmitAttendance({
      classId: selectedSubstituteClass.id,
      className: selectedSubstituteClass.className,
      section: selectedSubstituteClass.section,
      session: nextAvailableSession,
      present: selectedSubstituteClass.strength,
      total: selectedSubstituteClass.strength,
      submittedBy: "Substitute",
      isSubstitute: true,
    });

    setIsSubstitute(false);
  }

  return (
    <section className="mt-4 space-y-4">
      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">School attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Submit attendance twice a day</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned morning class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {morningClass ? `Class ${morningClass.className} - Section ${morningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => submitPrimaryAttendance("Morning")}
              disabled={!canSubmit || morningSubmitted || !morningClass}
              className="mt-2.5 w-full rounded-xl bg-[#f2b705] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {morningSubmitted ? "Morning submitted" : "Submit Morning Attendance"}
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned evening class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {eveningClass ? `Class ${eveningClass.className} - Section ${eveningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => submitPrimaryAttendance("Evening")}
              disabled={!canSubmit || eveningSubmitted || !eveningClass}
              className="mt-2.5 w-full rounded-xl bg-[#f2b705] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {eveningSubmitted ? "Evening submitted" : "Submit Evening Attendance"}
            </button>
          </div>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isSubstitute}
            onChange={(event) => setIsSubstitute(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#f2b705] focus:ring-[#f2b705]"
          />
          Mark as substitute class attendance
        </label>

          {isSubstitute ? (
            <div className="mt-3 grid gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-2">
              <div>
                <label htmlFor="substitute-class" className="text-sm font-medium text-slate-600">Class & Section</label>
                <select
                  id="substitute-class"
                  value={substituteClassId}
                  onChange={(event) => handleSubstituteClassChange(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                >
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      Class {item.className} - Section {item.section}
                    </option>
                  ))}
                </select>
              </div>

              <p className="self-end text-xs text-slate-500">Session auto-select: {nextAvailableSession}</p>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={submitSubstituteAttendance}
                  disabled={!canSubmit}
                  className="w-full rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Substitute Attendance
                </button>
              </div>
            </div>
          ) : null}

        <div className="mt-4 space-y-2">
          {todaysRecords.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              No attendance submitted yet today.
            </p>
          ) : (
            todaysRecords.map((entry) => (
              <div key={entry.id} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {entry.session} - Class {entry.className} {entry.section}
                  </p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusStyles("submitted")}`}>
                    submitted
                  </span>
                </div>
                <p className="mt-1 break-words text-xs text-slate-600">
                  Present: {entry.present}/{entry.total} | By: {entry.submittedBy} | {entry.time}
                </p>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">My attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Check in for today</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3 py-3 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Morning</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    {teacherSelfAttendance.morning.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">Check in: {teacherSelfAttendance.morning.checkIn}</p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Afternoon</p>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                    {teacherSelfAttendance.afternoon.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">Check in: {teacherSelfAttendance.afternoon.checkIn}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">This month: {teacherSelfAttendance.monthSummary}</p>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300]"
          >
            Check In
          </button>
        </div>
      </article>
    </section>
  );
}
