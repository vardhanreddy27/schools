import { signOut } from "next-auth/react";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import AttendanceView from "@/components/admin-dashboard/AttendanceView";
import CommunicationView from "@/components/admin-dashboard/CommunicationView";
import { useRef } from "react";
import ApprovalsView from "@/components/admin-dashboard/ApprovalsView";
import OverviewView from "@/components/admin-dashboard/OverviewView";
import BusTrackingView from "@/components/admin-dashboard/BusTrackingView";
import ProfileView from "@/components/admin-dashboard/ProfileView";
import SearchResults from "@/components/admin-dashboard/SearchResults";
import TimetableView from "@/components/admin-dashboard/TimetableView";
import { MobileBottomNav, SidebarNav } from "@/components/admin-dashboard/Nav";
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


    // Show header only on main dashboard (overview)
    const showTopHeader = activeMenu === "overview";
    const index = [
      { tab: "overview", title: "Overview Metrics", text: "teaching staff non teaching students classes sections buses" },
      { tab: "buses", title: "Track Buses", text: "live map route bus tracking transport" },
      { tab: "overview", title: "Attendance Trend", text: "students teachers today weekly monthly" },
      { tab: "overview", title: "Events and Sports", text: "events sports calendar timetable substitute" },
      { tab: "attendance", title: "Daily Attendance Windows", text: "morning evening students teachers present total" },
      { tab: "attendance", title: "Section Attendance", text: "class 1 to 10 section a b c d boys girls" },
      { tab: "timetable", title: "Timetable and Substitution", text: "late absent teacher allocation substitute engine" },
      { tab: "approvals", title: "Leave Approvals", text: "start date end date approve reject" },
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
  const isBusView = activeMenu === "buses";
  // Only open profile sheet for profile menu, not payroll
  const profileSheetOpen = activeMenu === "profile";
  // Hide header for Payroll
  // Hide header for Payroll section inside CommunicationView
  const commSectionRef = useRef();
  const [commSection, setCommSection] = useState("menu");
  // Show header only on home (overview) and main More menu (communication with commSection 'menu'), hide for all More actions
  const showTopHeader =
    activeMenu === "overview" || (activeMenu === "communication" && commSection === "menu");

  // Defensive: If commSection is undefined/null, treat as menu (show header)
  // If commSection is any More action (Payroll, teachers, etc.), hide header
  // This logic is already correct, but ensure commSection is passed from CommunicationView

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeMenu]);

  function handleCloseProfileSheet() {
    if (activeMenu === "profile") {
      setActiveMenu("overview");
    }
  }

  return (
    <div className="min-h-dvh bg-[#eef3fb]  text-slate-950 lg:flex">
      <SidebarNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="relative flex-1 mb-12" >
        <div className={`mx-auto flex flex-col ${isBusView ? "max-w-none px-0 pb-0 pt-0" : "max-w-6xl pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6"} ${isProfileView ? "min-h-0" : "min-h-dvh"}`}>
          {showTopHeader ? (
            <section className="rounded-4xl bg-white/80 p-4 shadow-sm ring-1 mx-3 ring-white/60 backdrop-blur sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 lg:hidden">
                    <div>
                      <p className="text-2xl font-semibold ">GOLDEN SPRING </p>
                      <p className="text-sm text-slate-500">Principal Dashboard</p>
                    </div>
                  </div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome , Vardhan</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu("profile");
                    }}
                    className="rounded-full p-0.5 transition-all duration-150 hover:scale-95 active:scale-90"
                    aria-label="Open profile"
                  >
                    <span className="block h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm lg:h-14 lg:w-14">
                      <Image
                        src="/principal.jpeg"
                        alt="Principal profile"
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </span>
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
          ) : null}

          <div key={activeMenu} className="page-enter">
            {activeMenu === "overview" ? (
              <div className="px-3">
                <OverviewView
                  activeTrend={activeTrend}
                  onTrendChange={setActiveTrend}
                  leaveRequests={leaveRequests}
                  activeMetric={activeMetric}
                  onOpenMetric={handleOpenMetric}
                  onNavigate={setActiveMenu}
                />
              </div>
            ) : null}
            {activeMenu === "buses" ? <BusTrackingView onBackToOverview={() => setActiveMenu("overview")} /> : null}
            {activeMenu === "attendance" ? (
              <div className="px-3">
                <AttendanceView />
              </div>
            ) : null}
            {activeMenu === "timetable" ? <TimetableView assignments={timetableAssignments} onReassign={handleTimetableReassign} /> : null}
            {activeMenu === "approvals" ? <ApprovalsView leaveRequests={leaveRequests} onDecision={handleLeaveDecision} /> : null}
            {activeMenu === "communication" && commSection === "teachers" ? (
              <div className="px-3">
                <CommunicationView
                  broadcastMessages={broadcastMessages}
                  onBroadcastInputChange={handleBroadcastInputChange}
                  onBroadcastSend={handleBroadcastSend}
                  broadcastForm={broadcastForm}
                  commSection={commSection}
                  setCommSection={setCommSection}
                />
              </div>
            ) : null}
            {activeMenu === "communication" && commSection !== "teachers" ? (
              <CommunicationView
                broadcastMessages={broadcastMessages}
                onBroadcastInputChange={handleBroadcastInputChange}
                onBroadcastSend={handleBroadcastSend}
                broadcastForm={broadcastForm}
                commSection={commSection}
                setCommSection={setCommSection}
              />
            ) : null}
          </div>
        </div>

        <MobileBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} items={mobileNavItems} />
      </main>

      {profileSheetOpen && (
        <ProfileView
          open={profileSheetOpen}
          onClose={handleCloseProfileSheet}
          profileForm={profileForm}
          onProfileChange={handleProfileChange}
          onProfileSave={handleProfileSave}
          profileSaving={profileSaving}
          profileMessage={profileMessage}
          onLogout={() => signOut({ callbackUrl: "/Admin_login" })}
        />
      )}
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
