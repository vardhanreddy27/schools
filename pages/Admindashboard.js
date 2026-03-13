import { signOut } from "next-auth/react";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AttendanceView from "@/components/admin-dashboard/AttendanceView";
import CommunicationView from "@/components/admin-dashboard/CommunicationView";
import ApprovalsView from "@/components/admin-dashboard/ApprovalsView";
import OverviewView from "@/components/admin-dashboard/OverviewView";
import ProfileView from "@/components/admin-dashboard/ProfileView";
import SearchResults from "@/components/admin-dashboard/SearchResults";
import { MobileBottomNav, SidebarNav } from "@/components/admin-dashboard/Nav";
import {
  alerts,
  initialBroadcastMessages,
  initialLeaveRequests,
} from "@/components/admin-dashboard/data";

export default function AdminDashboard({ user = {} }) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [activeTrend, setActiveTrend] = useState("Today");
  const [activeMetric, setActiveMetric] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [broadcastMessages, setBroadcastMessages] = useState(initialBroadcastMessages);
  const [broadcastForm, setBroadcastForm] = useState({ audience: "Teachers", message: "" });
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
      { tab: "attendance", title: "Section Attendance", text: "9th class section a b c 10th" },
      { tab: "approvals", title: "Leave Approvals", text: "start date end date approve reject" },
      { tab: "communication", title: "Communication", text: "teachers students parents messages" },
      { tab: "communication", title: "Teacher Performance", text: "performance rating attendance syllabus" },
      { tab: "profile", title: "Profile", text: "name email number role" },
    ];

    return index.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(term)).slice(0, 8);
  }, [searchQuery]);

  function handleLeaveDecision(id, decision) {
    setLeaveRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: decision } : request)));
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
      return;
    }

    setProfileForm({
      name: payload.user.name || "",
      email: payload.user.email || "",
      number: payload.user.number || "",
      role: payload.user.role || "principal",
    });
    setProfileMessage("Profile updated successfully.");
  }

  function handleOpenMetric(metricKey) {
    setActiveMetric((prev) => (prev === metricKey ? null : metricKey));
  }

  return (
    <div className="min-h-dvh bg-[#eef3fb] text-slate-950 lg:flex">
      <SidebarNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          <section className="rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-base font-bold text-white">N</div>
                  <div>
                    <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                    <p className="text-sm text-slate-500">Principal Dashboard</p>
                  </div>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {profileForm.name || "Principal"}</h1>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/Admin_login" })}
                className="hidden rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 lg:inline-flex"
              >
                Logout
              </button>
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

          {activeMenu === "overview" ? (
            <OverviewView
              activeTrend={activeTrend}
              onTrendChange={setActiveTrend}
              leaveRequests={leaveRequests}
              activeMetric={activeMetric}
              onOpenMetric={handleOpenMetric}
            />
          ) : null}
          {activeMenu === "attendance" ? <AttendanceView /> : null}
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
            />
          ) : null}
        </div>

        <MobileBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
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
