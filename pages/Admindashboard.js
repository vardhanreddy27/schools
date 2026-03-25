import { signOut } from "next-auth/react";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import AttendanceView from "@/components/admin-dashboard/AttendanceView";
import CommunicationView from "@/components/admin-dashboard/CommunicationView";
import ApprovalsView from "@/components/admin-dashboard/ApprovalsView";
import OverviewView from "@/components/admin-dashboard/OverviewView";
import ProfileView from "@/components/admin-dashboard/ProfileView";
import SearchResults from "@/components/admin-dashboard/SearchResults";
import TimetableView from "@/components/admin-dashboard/TimetableView";
import { MobileBottomNav, SidebarNav } from "@/components/admin-dashboard/Nav";
import { UserCircle2 } from "lucide-react";
import {
  alerts,
  initialBroadcastMessages,
  initialLeaveRequests,
  initialTimetableUpdates,
  navItems,
  teacherPerformance,
} from "@/components/admin-dashboard/data";

export default function AdminDashboard({ user = {} }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [activeTrend, setActiveTrend] = useState("Today");
  const [activeMetric, setActiveMetric] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [broadcastMessages, setBroadcastMessages] = useState(initialBroadcastMessages);
  const [broadcastForm, setBroadcastForm] = useState({ audience: "Everyone", message: "" });
  const [timetableAssignments, setTimetableAssignments] = useState(initialTimetableUpdates);
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    number: user.number || "",
    role: user.role || "principal",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];

    const index = [
      { tab: "overview", title: "Overview Metrics", text: "teaching staff non teaching students classes sections buses" },
      { tab: "overview", title: "Attendance Trend", text: "students teachers today weekly monthly" },
      { tab: "overview", title: "Events and Sports", text: "events sports calendar timetable substitute" },
      { tab: "attendance", title: "Daily Attendance Windows", text: "morning evening students teachers present total" },
      { tab: "attendance", title: "Section Attendance", text: "class 1 to 10 section a b c d boys girls" },
      { tab: "timetable", title: "Timetable and Substitution", text: "late absent teacher allocation substitute engine" },
      { tab: "approvals", title: "Leave Approvals", text: "start date end date approve reject" },
      { tab: "communication", title: "More", text: "alerts teachers performance class performance calendar events results sports competitions" },
      { tab: "communication", title: "Teachers Performance", text: "attendance syllabus activity participation" },
      { tab: "communication", title: "Class Performance", text: "telugu english hindi mathematics science social progress" },
      { tab: "communication", title: "Calendar", text: "month upcoming events dates" },
      { tab: "profile", title: "Profile", text: "name email number role" },
    ];

    return index.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(term)).slice(0, 8);
  }, [searchQuery]);

  function handleLeaveDecision(id, decision) {
    setLeaveRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: decision } : request)));

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: decision === "Approved" ? "success" : "warning",
      title: decision === "Approved" ? "Leave approved" : "Leave rejected",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBroadcastInputChange(event) {
    const { name, value } = event.target;
    setBroadcastForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBroadcastSend() {
    if (!broadcastForm.message.trim()) {
      Swal.fire({
        icon: "info",
        title: "Message required",
        text: "Please type a message before sending.",
        confirmButtonColor: "#f2b705",
      });
      return;
    }

    setBroadcastMessages((prev) => [
      {
        id: Date.now(),
        audience: broadcastForm.audience,
        message: broadcastForm.message.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
    setBroadcastForm((prev) => ({ ...prev, message: "" }));

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Broadcast sent",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMessage("");

    const response = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });

    const payload = await response.json();
    setProfileSaving(false);

    if (!response.ok) {
      setProfileMessage(payload.error || "Unable to update profile.");
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: payload.error || "Unable to update profile.",
        confirmButtonColor: "#f2b705",
      });
      return;
    }

    setProfileForm({
      name: payload.user.name || "",
      email: payload.user.email || "",
      number: payload.user.number || "",
      role: payload.user.role || "principal",
    });
    setProfileMessage("Profile updated successfully.");
    Swal.fire({
      icon: "success",
      title: "Profile updated",
      text: "Your profile has been saved successfully.",
      confirmButtonColor: "#f2b705",
    });
  }

  function handleOpenMetric(metricKey) {
    setActiveMetric((prev) => (prev === metricKey ? null : metricKey));
  }

  function handleTimetableReassign(id, teacherName) {
    setTimetableAssignments((prev) => prev.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const matchedTeacher = teacherPerformance.find((teacher) => teacher.name === teacherName);

      return {
        ...item,
        replacementTeacher: teacherName,
        replacementTeacherSubject: matchedTeacher?.subject || item.replacementTeacherSubject,
        status: "Reassigned by Principal",
      };
    }));
  }

  const mobileNavItems = navItems.filter((item) => item.id !== "profile");
  const isProfileView = activeMenu === "profile";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeMenu]);

  return (
    <div className="min-h-dvh bg-[#eef3fb] text-slate-950 lg:flex">
      <SidebarNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className={`relative flex-1 ${isProfileView ? "pb-24 lg:pb-8" : "pb-28 lg:pb-8"}`}>
        <div className={`mx-auto flex max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6 ${isProfileView ? "min-h-0" : "min-h-dvh"}`}>
          <section className="rounded-4xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2b705] text-base font-bold text-white">N</div>
                  <div>
                    <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                    <p className="text-sm text-slate-500">Principal Dashboard</p>
                  </div>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {profileForm.name || "Principal"}</h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMenu("profile")}
                  className="p-1 text-slate-500 transition-all duration-150 hover:text-slate-800 active:scale-90 lg:hidden"
                  aria-label="Profile"
                >
                  <UserCircle2 className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/Admin_login" })}
                  className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.97] lg:inline-flex"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Search className="mr-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search any dashboard module..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <SearchResults results={searchResults} onSelect={setActiveMenu} />
          </section>

          <div key={activeMenu} className="page-enter">
            {activeMenu === "overview" ? (
              <OverviewView
                activeTrend={activeTrend}
                onTrendChange={setActiveTrend}
                leaveRequests={leaveRequests}
                activeMetric={activeMetric}
                onOpenMetric={handleOpenMetric}
                onNavigate={setActiveMenu}
              />
            ) : null}
            {activeMenu === "attendance" ? <AttendanceView /> : null}
            {activeMenu === "timetable" ? <TimetableView assignments={timetableAssignments} onReassign={handleTimetableReassign} /> : null}
            {activeMenu === "approvals" ? <ApprovalsView leaveRequests={leaveRequests} onDecision={handleLeaveDecision} /> : null}
            {activeMenu === "communication" ? (
              <CommunicationView
                broadcastMessages={broadcastMessages}
                onBroadcastInputChange={handleBroadcastInputChange}
                onBroadcastSend={handleBroadcastSend}
                broadcastForm={broadcastForm}
              />
            ) : null}
            {activeMenu === "profile" ? (
              <ProfileView
                profileForm={profileForm}
                onProfileChange={handleProfileChange}
                onProfileSave={handleProfileSave}
                profileSaving={profileSaving}
                profileMessage={profileMessage}
                onLogout={() => signOut({ callbackUrl: "/Admin_login" })}
              />
            ) : null}
          </div>
        </div>

        <MobileBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} items={mobileNavItems} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/Admin_login",
        permanent: false,
      },
    };
  }

  if (session.user?.userType === "teacher") {
    return {
      redirect: {
        destination: "/Teacherdashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: session.user?.id || "admin",
        name: session.user?.name || "Principal",
        email: session.user?.email ?? null,
        number: session.user?.phone ?? null,
        role: session.user?.role || "principal",
      },
    },
  };
}
