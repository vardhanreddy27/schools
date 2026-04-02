import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { teacherSelfAttendance } from "./data";
import { dayKey, statusStyles } from "./utils";

const DUMMY_STUDENTS = {
  "class-8a": [
    { rollNo: "01", name: "Aarav", photo: "/student1.png" },
    { rollNo: "02", name: "Diya", photo: "/student2.png" },
    { rollNo: "03", name: "Karthik", photo: "/student3.png" },
    { rollNo: "04", name: "Saanvi", photo: "/student4.png" },
    { rollNo: "05", name: "Vikram", photo: "/student1.png" },
  ],
  "class-5a": [
    { rollNo: "11", name: "Moksha", photo: "/student2.png" },
    { rollNo: "12", name: "Aditya", photo: "/student3.png" },
    { rollNo: "13", name: "Nithya", photo: "/student4.png" },
    { rollNo: "14", name: "Rahul", photo: "/student1.png" },
    { rollNo: "15", name: "Tara", photo: "/student2.png" },
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
    students: classStudents.map((student) => ({ ...student, status: "Present" })),
  };
}

export function AttendanceTab({ classes, attendanceRecords, onSubmitAttendance }) {
  const [attendanceDraft, setAttendanceDraft] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  const morningClass = classes[0] || null;
  const eveningClass = classes[1] || classes[0] || null;

  const todayKey = dayKey(new Date());
  const todaysRecords = useMemo(
    () => attendanceRecords.filter((entry) => entry.dateKey === todayKey),
    [attendanceRecords, todayKey]
  );

  const morningSubmitted = todaysRecords.some((entry) => entry.session === "Morning");
  const eveningSubmitted = todaysRecords.some((entry) => entry.session === "Evening");

  const totalPages = attendanceDraft ? Math.max(1, Math.ceil(attendanceDraft.students.length / studentsPerPage)) : 1;
  const paginatedStudents = attendanceDraft
    ? attendanceDraft.students.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage)
    : [];
  const absentCount = attendanceDraft ? attendanceDraft.students.filter((student) => student.status === "Absent").length : 0;
  const presentCount = attendanceDraft ? attendanceDraft.students.filter((student) => student.status === "Present").length : 0;

  function startAttendance(session) {
    const targetClass = session === "Morning" ? morningClass : eveningClass;
    if (!targetClass) return;

    const alreadySubmitted = session === "Morning" ? morningSubmitted : eveningSubmitted;
    if (alreadySubmitted) return;

    setAttendanceDraft(buildDraft(targetClass, session));
    setCurrentPage(1);
    setTimeout(() => setSheetOpen(true), 10);
  }

  function closeAttendanceSheet() {
    setSheetOpen(false);
    setTimeout(() => setAttendanceDraft(null), 220);
  }

  function toggleStudent(index) {
    if (!attendanceDraft) return;

    setAttendanceDraft((prev) => {
      if (!prev) return prev;
      const nextStudents = [...prev.students];
      nextStudents[index] = {
        ...nextStudents[index],
        status: nextStudents[index].status === "Present" ? "Absent" : "Present",
      };

      return {
        ...prev,
        students: nextStudents,
      };
    });
  }

  function submitAttendance() {
    if (!attendanceDraft) return;

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

  function goToPage(page) {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }

  return (
    <section className="mt-4 space-y-4">
      <article className="bg-(--app-surface) p-4 sm:p-5">
        <p className="text-sm text-slate-500">School attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Mark attendance for assigned classes</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned morning class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {morningClass ? `Class ${morningClass.className} - Section ${morningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => startAttendance("Morning")}
              disabled={morningSubmitted || !morningClass}
              className="mt-2.5 w-full rounded-xl bg-[#16c7bd] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#13b4ab] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {morningSubmitted ? "Morning attendance submitted" : "Start Morning Roll Call"}
            </button>
          </div>

          <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned evening class</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {eveningClass ? `Class ${eveningClass.className} - Section ${eveningClass.section}` : "Not set"}
            </p>
            <button
              type="button"
              onClick={() => startAttendance("Evening")}
              disabled={eveningSubmitted || !eveningClass}
              className="mt-2.5 w-full rounded-xl bg-[#16c7bd] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#13b4ab] disabled:cursor-not-allowed disabled:opacity-50"
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
                <p className="mt-1 wrap-break-word text-xs text-slate-600">
                  Present: {entry.present}/{entry.total} | By: {entry.submittedBy} | {entry.time}
                </p>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="bg-(--app-surface) p-4 sm:p-5">
        <p className="text-sm text-slate-500">My attendance</p>
        <h2 className="mt-1 text-xl font-semibold">Check in for today</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-muted) p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Morning</p>
                  <span className="rounded-full bg-(--app-success-soft) px-2 py-1 text-xs font-semibold text-(--app-success-text) ring-1 ring-emerald-200">
                    {teacherSelfAttendance.morning.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">Check in: {teacherSelfAttendance.morning.checkIn}</p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Afternoon</p>
                  <span className="rounded-full bg-(--app-accent-soft) px-2 py-1 text-xs font-semibold text-[#8b6400] ring-1 ring-amber-200">
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
            className="w-full rounded-2xl bg-[#16c7bd] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#13b4ab]"
          >
            Check In
          </button>
        </div>
      </article>

      {attendanceDraft ? (
        <div
          className={`fixed inset-0 z-50 flex items-end bg-slate-950/35 transition-opacity duration-200 ${sheetOpen ? "opacity-100" : "opacity-0"}`}
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
              Present {presentCount} • Absent {absentCount}
            </span>

            <div className="mt-3 flex-1 space-y-3">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Roll call table</p>
                    <p className="text-xs text-slate-500">
                      Page {currentPage} of {totalPages} • {attendanceDraft.students.length} students
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <table className="w-full table-fixed border-collapse text-left">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="w-16 px-2.5 py-2">Roll</th>
                      <th className="w-12 px-2.5 py-2">Img</th>
                      <th className="px-2.5 py-2">Name</th>
                      <th className="w-28 px-2.5 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student, pageIndex) => {
                      const studentIndex = (currentPage - 1) * studentsPerPage + pageIndex;
                      const isPresent = student.status === "Present";

                      return (
                        <tr key={student.rollNo} className="border-t border-slate-100">
                          <td className="px-2.5 py-2 text-xs font-semibold text-slate-900">{student.rollNo}</td>
                          <td className="px-2.5 py-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                              <Image
                                src={student.photo || "/student2.png"}
                                alt={student.name}
                                width={32}
                                height={32}
                                className="h-8 w-8 object-cover object-top"
                              />
                            </div>
                          </td>
                          <td className="px-2.5 py-2 text-xs text-slate-800">{student.name}</td>
                          <td className="px-2.5 py-2">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isPresent}
                              aria-label={`${student.name} attendance`}
                              onClick={() => toggleStudent(studentIndex)}
                              className={`mx-auto flex h-8 w-16 items-center rounded-full p-1 transition-colors ${
                                isPresent ? "bg-[#16c7bd]" : "bg-rose-400"
                              }`}
                            >
                              <span
                                className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                                  isPresent ? "translate-x-8" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <p className={`mt-1 text-center text-[10px] font-semibold ${isPresent ? "text-[#0d8f86]" : "text-rose-600"}`}>
                              {isPresent ? "Present" : "Absent"}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                <span>
                  Absent: {absentCount} of {attendanceDraft.students.length}
                </span>
                <span className="text-slate-500">Tap the switch to mark a student absent</span>
              </div>

              <button
                type="button"
                onClick={submitAttendance}
                className="w-full rounded-xl bg-[#16c7bd] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13b4ab]"
              >
                Submit attendance
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
