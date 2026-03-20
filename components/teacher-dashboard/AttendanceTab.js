import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { teacherSelfAttendance } from "./data";
import { dayKey, statusStyles } from "./utils";

const DUMMY_STUDENTS = {
  "class-8a": [
    { rollNo: "01", name: "Aarav", photo: "/student1.webp" },
    { rollNo: "02", name: "Diya", photo: "/student2.png" },
    { rollNo: "03", name: "Karthik", photo: "/student4.jpg" },
    { rollNo: "04", name: "Saanvi", photo: "/student5.webp" },
    { rollNo: "05", name: "Vikram", photo: "/student1.webp" },
  ],
  "class-5a": [
    { rollNo: "11", name: "Moksha", photo: "/student1.webp" },
    { rollNo: "12", name: "Aditya", photo: "/student2.png" },
    { rollNo: "13", name: "Nithya", photo: "/student4.jpg" },
    { rollNo: "14", name: "Rahul", photo: "/student5.webp" },
    { rollNo: "15", name: "Tara", photo: "/student1.webp" },
  ],
};

function buildDraft(targetClass, session) {
  const classStudents = DUMMY_STUDENTS[targetClass.id] || DUMMY_STUDENTS["class-8a"];
  return {
    classId: targetClass.id,
    className: targetClass.className,
    section: targetClass.section,
    session,
    currentIndex: 0,
    students: classStudents.map((student) => ({ ...student, status: null })),
  };
}

export function AttendanceTab({ classes, attendanceRecords, onSubmitAttendance }) {
  const [attendanceDraft, setAttendanceDraft] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const morningClass = classes[0] || null;
  const eveningClass = classes[1] || classes[0] || null;

  const todayKey = dayKey(new Date());
  const todaysRecords = useMemo(
    () => attendanceRecords.filter((entry) => entry.dateKey === todayKey),
    [attendanceRecords, todayKey]
  );

  const morningSubmitted = todaysRecords.some((entry) => entry.session === "Morning");
  const eveningSubmitted = todaysRecords.some((entry) => entry.session === "Evening");

  const activeStudent = attendanceDraft ? attendanceDraft.students[attendanceDraft.currentIndex] : null;
  const allMarked = attendanceDraft
    ? attendanceDraft.students.every((student) => student.status === "Present" || student.status === "Absent")
    : false;

  function startAttendance(session) {
    const targetClass = session === "Morning" ? morningClass : eveningClass;
    if (!targetClass) return;

    const alreadySubmitted = session === "Morning" ? morningSubmitted : eveningSubmitted;
    if (alreadySubmitted) return;

    setAttendanceDraft(buildDraft(targetClass, session));
    setTimeout(() => setSheetOpen(true), 10);
  }

  function closeAttendanceSheet() {
    setSheetOpen(false);
    setTimeout(() => setAttendanceDraft(null), 220);
  }

  function markCurrentStudent(status) {
    if (!attendanceDraft || allMarked) return;

    setAttendanceDraft((prev) => {
      if (!prev) return prev;
      const nextStudents = [...prev.students];
      nextStudents[prev.currentIndex] = {
        ...nextStudents[prev.currentIndex],
        status,
      };

      const nextIndex = Math.min(prev.currentIndex + 1, nextStudents.length - 1);

      return {
        ...prev,
        students: nextStudents,
        currentIndex: nextIndex,
      };
    });
  }

  function resolveSwipe(deltaX) {
    if (deltaX > 70) {
      markCurrentStudent("Present");
    } else if (deltaX < -70) {
      markCurrentStudent("Absent");
    }
  }

  function submitAttendance() {
    if (!attendanceDraft || !allMarked) return;

    const presentCount = attendanceDraft.students.filter((student) => student.status === "Present").length;

    onSubmitAttendance({
      classId: attendanceDraft.classId,
      className: attendanceDraft.className,
      section: attendanceDraft.section,
      session: attendanceDraft.session,
      present: presentCount,
      total: attendanceDraft.students.length,
      submittedBy: "You",
      isSubstitute: false,
      studentStatuses: attendanceDraft.students,
    });

    closeAttendanceSheet();
  }

  function handleTouchStart(event) {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event) {
    if (touchStartX === null || !attendanceDraft || allMarked) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;

    resolveSwipe(deltaX);

    setTouchStartX(null);
    setDragOffsetX(0);
  }

  function handlePointerDown(event) {
    if (!attendanceDraft || allMarked) return;
    setIsDragging(true);
    setDragStartX(event.clientX);
  }

  function handlePointerMove(event) {
    if (!isDragging || dragStartX === null) return;
    setDragOffsetX(event.clientX - dragStartX);
  }

  function handlePointerUp() {
    if (!isDragging) return;
    resolveSwipe(dragOffsetX);
    setIsDragging(false);
    setDragStartX(null);
    setDragOffsetX(0);
  }

  return (
    <section className="mt-4 space-y-4">
      <article className="bg-white p-4 sm:p-5">
        <p className="text-sm text-slate-500">School attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Swipe attendance for assigned classes</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned morning class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {morningClass ? `Class ${morningClass.className} - Section ${morningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => startAttendance("Morning")}
              disabled={morningSubmitted || !morningClass}
              className="mt-2.5 w-full rounded-xl bg-[#f2b705] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {morningSubmitted ? "Morning attendance submitted" : "Start Morning Roll Call"}
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned evening class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {eveningClass ? `Class ${eveningClass.className} - Section ${eveningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => startAttendance("Evening")}
              disabled={eveningSubmitted || !eveningClass}
              className="mt-2.5 w-full rounded-xl bg-[#f2b705] px-3 py-2 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {eveningSubmitted ? "Evening attendance submitted" : "Start Evening Roll Call"}
            </button>
          </div>
        </div>

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

      <article className="bg-white p-4 sm:p-5">
        <p className="text-sm text-slate-500">My attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Check in for today</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Morning</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    {teacherSelfAttendance.morning.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">Check in: {teacherSelfAttendance.morning.checkIn}</p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
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

      {attendanceDraft ? (
        <div
          className={`fixed inset-0 z-50 flex items-end bg-slate-950/40 transition-opacity duration-200 ${sheetOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeAttendanceSheet}
        >
          <div
            className={`flex w-full min-h-[55vh] max-h-[90vh] flex-col rounded-t-3xl bg-white p-4 transition-transform duration-200 sm:p-5 ${sheetOpen ? "translate-y-0" : "translate-y-8"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                {attendanceDraft.session} attendance - Class {attendanceDraft.className} {attendanceDraft.section}
              </p>
              <button
                type="button"
                onClick={closeAttendanceSheet}
                className="rounded-full border border-slate-300 p-2 text-slate-600"
                aria-label="Close roll call"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {attendanceDraft.students.filter((student) => student.status).length}/{attendanceDraft.students.length}
            </span>

            {!allMarked && activeStudent ? (
              <div className="mt-3 flex-1 space-y-3">
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{ transform: `translateX(${dragOffsetX}px)`, transition: isDragging ? "none" : "transform 160ms ease", touchAction: "pan-y" }}
                  className="rounded-3xl bg-[linear-gradient(140deg,#ffffff_0%,#f8fafc_100%)] px-5 py-7 text-center ring-1 ring-slate-200"
                >
                  <div className="mx-auto w-full overflow-hidden rounded-xl bg-transparent">
                    <Image
                      src={activeStudent.photo || "/student2.png"}
                      alt={activeStudent.name}
                      width={560}
                      height={360}
                      className="h-56 w-full bg-transparent object-contain object-top sm:h-64"
                    />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Roll No {activeStudent.rollNo}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{activeStudent.name}</p>
                </div>

                <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 bg-white/95 pt-2 backdrop-blur">
                  <button
                    type="button"
                    onClick={() => markCurrentStudent("Absent")}
                    className="rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-700"
                  >
                    ← Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => markCurrentStudent("Present")}
                    className="rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700"
                  >
                    Present →
                  </button>
                </div>
              </div>
            ) : null}

            {allMarked ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">Attendance overview</p>
                <div className="mt-2 space-y-2">
                  {attendanceDraft.students.map((student) => (
                    <div key={student.rollNo} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                      <p className="text-sm text-slate-700">
                        {student.rollNo} - {student.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${
                          student.status === "Present"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-rose-50 text-rose-700 ring-rose-200"
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
                    Present: {attendanceDraft.students.filter((student) => student.status === "Present").length}
                  </p>
                  <p className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-700">
                    Total strength: {attendanceDraft.students.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={submitAttendance}
                  className="mt-3 w-full rounded-xl bg-[#f2b705] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d9a300]"
                >
                  Submit attendance
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
