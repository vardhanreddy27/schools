import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { TeacherSidebar, TeacherBottomNav } from "@/components/teacher-dashboard/TeacherNav";
import HomeTab from "@/components/teacher-dashboard/HomeTab";
import { AttendanceTab } from "@/components/teacher-dashboard/AttendanceTab";
import TimetableTab from "@/components/teacher-dashboard/TimetableTab";
import QuizTab from "@/components/teacher-dashboard/QuizTab";
import { MoreTab, ProfileBottomSheet, ToolModal } from "@/components/teacher-dashboard/MoreTab";
import { buildMonthCalendar, dayKey, weekDaysFromDate } from "@/components/teacher-dashboard/utils";
import { attendanceClasses, monthlyCalendarEvents } from "@/components/teacher-dashboard/data";







export default function TeacherDashboard({ user }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("home");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [activeToolModal, setActiveToolModal] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState(monthlyCalendarEvents);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [profileForm, setProfileForm] = useState({
    id: user?.id || "",
    name: user?.name || "",
    subject: user?.subject || "",
    number: user?.number || "",
    doj: user?.doj || "",
    gender: user?.gender || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const showTopHeader = activeMenu === "home" || activeMenu === "more" || activeMenu === "quiz";

  const today = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => weekDaysFromDate(today), [today]);
  const monthGrid = useMemo(() => buildMonthCalendar(calendarDate), [calendarDate]);

  const monthEventsByDate = useMemo(() => {
    return calendarEvents.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {});
  }, [calendarEvents]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const response = await fetch("/api/teacher/profile");
      if (!response.ok) {
        return;
      }

      const payload = await response.json();

      if (active && payload?.profile) {
        setProfileForm({
          id: payload.profile.id || "",
          name: payload.profile.name || "",
          subject: payload.profile.subject || "",
          number: payload.profile.number || "",
          doj: payload.profile.doj || "",
          gender: payload.profile.gender || "",
        });
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileMessage("");
  }

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMessage("");

    const response = await fetch("/api/teacher/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profileForm.name,
        subject: profileForm.subject,
        number: profileForm.number,
      }),
    });

    const payload = await response.json();
    setProfileSaving(false);

    if (!response.ok) {
      setProfileMessage(payload.error || "Unable to update profile.");
      return;
    }

    setProfileForm((prev) => ({
      ...prev,
      id: payload.profile.id || prev.id,
      name: payload.profile.name || "",
      subject: payload.profile.subject || "",
      number: payload.profile.number || "",
      doj: payload.profile.doj || "",
      gender: payload.profile.gender || "",
    }));
    setProfileMessage("Profile updated successfully.");
    setProfileModalOpen(false);
  }

  function handleSubmitAttendance(record) {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateKey = dayKey(new Date());
    setAttendanceRecords((prev) => [
      ...prev,
      {
        id: `${record.classId}-${record.session}-${Date.now()}`,
        ...record,
        dateKey,
        time: nowTime,
      },
    ]);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeMenu, activeToolModal]);

  useEffect(() => {
    if (!router.isReady) return;
    const requestedTab = router.query.tab;
    const allowedTabs = ["home", "attendance", "quiz", "timetable", "more"];

    
  }, [router.isReady, router.query.tab]);

  const displayName = "Harika";

  return (
    <div className={`min-h-dvh text-slate-950 lg:flex ${activeMenu === "timetable" ? "bg-[#eef1f6]" : "bg-white"}`}>
      <TeacherSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className={`relative flex-1 ${activeMenu === "timetable" ? "bg-[#eef1f6]" : ""}`}>
        <div className="mx-auto flex   max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          {showTopHeader ? (
            <section className="bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 lg:hidden">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                      <Image src="/logo.png" alt="NMS Logo" width={28} height={28} className="object-contain" priority />
                    </div>
                    <div>
                      <p className="text-base font-bold tracking-[0.18em] text-slate-900">NMS</p>
                      <p className="text-[11px] text-slate-500">Teacher Workspace</p>
                    </div>
                  </div>

                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Welcome, {displayName}
                  </h1>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      Subject: {profileForm.subject || "Not set"}
                    </span>
                    <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      4 classes today
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="shrink-0 rounded-full p-0.5 transition-transform duration-150 active:scale-95"
                  aria-label="Open profile"
                >
                  <Image
                    src="/student2.png"
                    alt="Teacher profile"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
                  />
                </button>
              </div>

              <div className="hidden lg:block">
                <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome, {displayName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Subject: {profileForm.subject || "Not set"}
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    4 classes today
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          {activeMenu === "home" ? <HomeTab /> : null}
          {activeMenu === "attendance" ? (
            <AttendanceTab
              classes={attendanceClasses}
              attendanceRecords={attendanceRecords}
              onSubmitAttendance={handleSubmitAttendance}
            />
          ) : null}
          {activeMenu === "quiz" ? <QuizTab /> : null}
          {activeMenu === "timetable" ? (
            <TimetableTab
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              monthGrid={monthGrid}
              monthEventsByDate={monthEventsByDate}
              events={calendarEvents}
              setEvents={setCalendarEvents}
            />
          ) : null}
          {activeMenu === "more" ? <MoreTab onOpenToolModal={setActiveToolModal} /> : null}
        </div>

        <TeacherBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      </main>

      <ProfileBottomSheet
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profileForm={profileForm}
        onProfileChange={handleProfileChange}
        onProfileSave={handleProfileSave}
        profileSaving={profileSaving}
        profileMessage={profileMessage}
        onLogout={() => signOut({ callbackUrl: "/Teacher_login" })}
      />
      <ToolModal activeTool={activeToolModal} onClose={() => setActiveToolModal(null)} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/Teacher_login",
        permanent: false,
      },
    };
  }

  if (session.user?.userType !== "teacher") {
    return {
      redirect: {
        destination: "/Admindashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: session.user?.id || "teacher",
        name: session.user?.name || "Teacher",
        email: session.user?.email || "",
        subject: "",
        number: "",
        doj: "",
        gender: "",
        role: session.user?.role || "teacher",
      },
    },
  };
}
