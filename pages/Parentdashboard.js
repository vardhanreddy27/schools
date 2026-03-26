import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { UserCircle2 } from "lucide-react";
import ParentHomeTab from "@/components/parent-dashboard/ParentHomeTab";
import ParentHomeworkTab from "@/components/parent-dashboard/ParentHomeworkTab";
import ParentAttendanceTab from "@/components/parent-dashboard/ParentAttendanceTab";
import ParentTimetableTab from "@/components/parent-dashboard/ParentTimetableTab";
import ParentAcademicsTab from "@/components/parent-dashboard/ParentAcademicsTab";
import ParentReportsTab from "@/components/parent-dashboard/ParentReportsTab";
import { ParentBottomNav, ParentSidebar } from "@/components/parent-dashboard/ParentNav";
import { parentProfileDefaults } from "@/components/parent-dashboard/data";

export function getInitialParentProfile() {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("parentProfile");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return parentProfileDefaults;
}

export default function ParentDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("home");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState(getInitialParentProfile());

  const showTopHeader = activeMenu === "home";

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("parentProfile");
    }
    router.push("/Parent_login");
  }

  const subtitle = useMemo(() => {
    return `${profileForm.childClass} Std • Section ${profileForm.childSection || "-"}`;
  }, [profileForm.childClass, profileForm.childSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeMenu]);

  return (
    <div className="min-h-dvh bg-white text-slate-950 lg:flex">
      <ParentSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={handleLogout} />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          {showTopHeader ? (
            <section className="bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 lg:hidden">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c79216] text-base font-bold text-white">N</div>
                    <div>
                      <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                      <p className="text-sm text-slate-500">Parent Portal</p>
                    </div>
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome, {profileForm.parentName || "Parent"}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {profileForm.childName}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{subtitle}</span>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div key={activeMenu} className="page-enter">
            {activeMenu === "home" && <ParentHomeTab />}
            {activeMenu === "homework" && <ParentHomeworkTab />}
            {activeMenu === "attendance" && <ParentAttendanceTab />}
            {activeMenu === "timetable" && <ParentTimetableTab />}
            {activeMenu === "academics" && <ParentAcademicsTab />}
            {activeMenu === "reports" && <ParentReportsTab />}
          </div>
        </div>
      </main>

      <ParentBottomNav activeMenu={activeMenu} onMenuChange={setActiveMenu} />
    </div>
  );
}
