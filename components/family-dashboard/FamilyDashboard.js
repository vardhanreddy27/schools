import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { UserCircle2, X } from "lucide-react";
import Image from "next/image";
import HomeTab from "@/components/student-dashboard/HomeTab";
import AttendanceTab from "@/components/student-dashboard/AttendanceTab";
import TimetableTab from "@/components/student-dashboard/TimetableTab";
import AcademicsTab from "@/components/student-dashboard/AcademicsTab";
import MoreTab, { getInitialStudentProfile, StudentProfileBottomSheet } from "@/components/student-dashboard/MoreTab";
import { studentMenuItems } from "@/components/student-dashboard/data";
import ParentHomeTab from "@/components/parent-dashboard/ParentHomeTab";
import ParentHomeworkTab from "@/components/parent-dashboard/ParentHomeworkTab";
import ParentAttendanceTab from "@/components/parent-dashboard/ParentAttendanceTab";
import ParentTimetableTab from "@/components/parent-dashboard/ParentTimetableTab";
import ParentAcademicsTab from "@/components/parent-dashboard/ParentAcademicsTab";
import { parentMenuItems, parentProfileDefaults } from "@/components/parent-dashboard/data";

const familyRoleItems = [
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

const roleConfig = {
  student: {
    title: "Student Workspace",
    menuItems: studentMenuItems,
    defaultMenu: "home",
    loginRoute: "/Student_login",
  },
  parent: {
    title: "Parent Portal",
    menuItems: parentMenuItems,
    defaultMenu: "home",
    loginRoute: "/Student_login",
  },
};

function getInitialParentProfile() {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("parentProfile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return parentProfileDefaults;
      }
    }
  }

  return parentProfileDefaults;
}

function getInitialRole(initialRole) {
  if (typeof window !== "undefined") {
    const savedRole = window.localStorage.getItem("familyDashboardRole");
    if (savedRole === "student" || savedRole === "parent") {
      return savedRole;
    }
  }

  return initialRole;
}

function FamilySidebar({ activeRole, activeMenu, onRoleChange, onMenuChange, onLogout }) {
  const menuItems = roleConfig[activeRole].menuItems;

  return (
    <aside className="hidden w-72 shrink-0 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-4 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
            <Image src="/logo.png" alt="NMS Logo" width={42} height={42} className="object-contain" priority />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
            <p className="text-sm text-slate-400">Family App</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-900 p-1">
        {familyRoleItems.map((roleItem) => (
          <button
            key={roleItem.id}
            type="button"
            onClick={() => onRoleChange(roleItem.id)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              activeRole === roleItem.id
                ? "bg-(--app-accent) text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {roleItem.label}
          </button>
        ))}
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              activeMenu === id
                ? "bg-(--app-accent) text-white"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function FamilyBottomNav({ activeRole, activeMenu, onMenuChange }) {
  const menuItems = roleConfig[activeRole].menuItems;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_24px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden">
      <div className="grid gap-1 px-2" style={{ gridTemplateColumns: `repeat(${menuItems.length}, minmax(0, 1fr))` }}>
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-95 ${
              activeMenu === id ? "bg-(--app-accent-soft) text-[#8b6400]" : "text-slate-500"
            }`}
          >
            <span
              className={`mb-0.5 block h-0.75 w-5 rounded-full bg-(--app-accent) transition-all duration-250 ${
                activeMenu === id ? "opacity-100" : "opacity-0"
              }`}
            />
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FamilyDashboard({ initialRole = "student" }) {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState(() => getInitialRole(initialRole));
  const [activeMenu, setActiveMenu] = useState(() => roleConfig[getInitialRole(initialRole)]?.defaultMenu || "home");
  const [studentProfileSheetOpen, setStudentProfileSheetOpen] = useState(false);
  const [parentProfileSheetOpen, setParentProfileSheetOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [studentProfileForm, setStudentProfileForm] = useState(getInitialStudentProfile());
  const [parentProfileForm, setParentProfileForm] = useState(getInitialParentProfile());

  const isStudent = activeRole === "student";

  const showTopHeader = isStudent ? activeMenu === "home" || activeMenu === "more" : activeMenu === "home";

  const subtitle = useMemo(() => {
    if (isStudent) {
      return `Class ${studentProfileForm.className || "-"} • Section ${studentProfileForm.section || "-"}`;
    }

    return `${parentProfileForm.childClass || "-"} Std • Section ${parentProfileForm.childSection || "-"}`;
  }, [isStudent, studentProfileForm.className, studentProfileForm.section, parentProfileForm.childClass, parentProfileForm.childSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("familyDashboardRole", activeRole);
  }, [activeRole]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeRole, activeMenu]);

  function handleRoleChange(nextRole) {
    setActiveRole(nextRole);
    setActiveMenu(roleConfig[nextRole].defaultMenu);
    setStudentProfileSheetOpen(false);
    setParentProfileSheetOpen(false);
  }

  function handleMenuChange(nextMenu) {
    setActiveMenu(nextMenu);
  }

  function handleStudentProfileChange(event) {
    const { name, value } = event.target;
    setStudentProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleStudentProfileSave() {
    setProfileSaving(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("studentProfile", JSON.stringify(studentProfileForm));
    }

    setTimeout(() => {
      setProfileSaving(false);
    }, 500);
  }

  function handleParentProfileChange(event) {
    const { name, value } = event.target;
    setParentProfileForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleParentProfileSave() {
    setProfileSaving(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("parentProfile", JSON.stringify(parentProfileForm));
    }

    setTimeout(() => {
      setProfileSaving(false);
    }, 500);
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("familyDashboardRole");
    }

    router.push(roleConfig[activeRole].loginRoute);
  }

  return (
    <div className="min-h-dvh bg-[#eef3fb] text-slate-950 lg:flex">
      <FamilySidebar
        activeRole={activeRole}
        activeMenu={activeMenu}
        onRoleChange={handleRoleChange}
        onMenuChange={handleMenuChange}
        onLogout={handleLogout}
      />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
          {showTopHeader ? (
            <section className="rounded-4xl bg-white/80 p-4 shadow-sm ring-1 ring-white/60 backdrop-blur sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 lg:hidden">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
                      <Image src="/logo.png" alt="NMS Logo" width={34} height={34} className="object-contain" priority />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
                      <p className="text-sm text-slate-500">{roleConfig[activeRole].title}</p>
                    </div>
                  </div>

                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {isStudent
                      ? `Welcome, ${studentProfileForm.name || "Student"}`
                      : `Welcome, ${parentProfileForm.parentName || "Parent"}`}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isStudent ? (
                      <>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{subtitle}</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Roll: {studentProfileForm.rollNumber || "-"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {parentProfileForm.childName || "Child"}
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{subtitle}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden rounded-2xl bg-slate-100 p-1 sm:flex">
                    {familyRoleItems.map((roleItem) => (
                      <button
                        key={roleItem.id}
                        type="button"
                        onClick={() => handleRoleChange(roleItem.id)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                          activeRole === roleItem.id
                            ? "bg-(--app-accent) text-white"
                            : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        {roleItem.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isStudent) {
                        setStudentProfileSheetOpen(true);
                        return;
                      }

                      setParentProfileSheetOpen(true);
                    }}
                    className="p-1 text-slate-500 transition-all duration-150 hover:text-slate-800 active:scale-90 lg:hidden"
                    aria-label="Open profile"
                  >
                    <UserCircle2 className="h-7 w-7" />
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <div key={`${activeRole}-${activeMenu}`} className="page-enter">
            {isStudent ? (
              <>
                {activeMenu === "home" ? <HomeTab /> : null}
                {activeMenu === "attendance" ? <AttendanceTab /> : null}
                {activeMenu === "timetable" ? <TimetableTab /> : null}
                {activeMenu === "academics" ? <AcademicsTab /> : null}
                {activeMenu === "more" ? (
                  <MoreTab
                    profile={studentProfileForm}
                    onProfileChange={handleStudentProfileChange}
                    onProfileSave={handleStudentProfileSave}
                    profileSaving={profileSaving}
                  />
                ) : null}
              </>
            ) : (
              <>
                {activeMenu === "home" ? <ParentHomeTab /> : null}
                {activeMenu === "homework" ? <ParentHomeworkTab /> : null}
                {activeMenu === "attendance" ? <ParentAttendanceTab /> : null}
                {activeMenu === "timetable" ? <ParentTimetableTab /> : null}
                {activeMenu === "academics" ? <ParentAcademicsTab /> : null}
              </>
            )}
          </div>
        </div>

        <FamilyBottomNav activeRole={activeRole} activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      </main>

      <StudentProfileBottomSheet
        open={studentProfileSheetOpen}
        onClose={() => setStudentProfileSheetOpen(false)}
        profile={studentProfileForm}
        onProfileChange={handleStudentProfileChange}
        onProfileSave={handleStudentProfileSave}
        profileSaving={profileSaving}
        onLogout={handleLogout}
      />

      <ParentProfileBottomSheet
        open={parentProfileSheetOpen}
        onClose={() => setParentProfileSheetOpen(false)}
        profile={parentProfileForm}
        onProfileChange={handleParentProfileChange}
        onProfileSave={handleParentProfileSave}
        profileSaving={profileSaving}
        onLogout={handleLogout}
      />
    </div>
  );
}

function ParentProfileBottomSheet({
  open,
  onClose,
  profile,
  onProfileChange,
  onProfileSave,
  profileSaving,
  onLogout,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Parent profile details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close profile popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label htmlFor="parent-profile-name" className="text-sm font-medium text-slate-600">Parent name</label>
            <input
              id="parent-profile-name"
              name="parentName"
              value={profile.parentName}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="parent-profile-contact" className="text-sm font-medium text-slate-600">Contact</label>
            <input
              id="parent-profile-contact"
              name="contact"
              value={profile.contact}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="parent-profile-child" className="text-sm font-medium text-slate-600">Child name</label>
            <input
              id="parent-profile-child"
              name="childName"
              value={profile.childName}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="parent-profile-class" className="text-sm font-medium text-slate-600">Child class</label>
              <input
                id="parent-profile-class"
                name="childClass"
                value={profile.childClass}
                onChange={onProfileChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
              />
            </div>
            <div>
              <label htmlFor="parent-profile-section" className="text-sm font-medium text-slate-600">Child section</label>
              <input
                id="parent-profile-section"
                name="childSection"
                value={profile.childSection}
                onChange={onProfileChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="parent-profile-roll" className="text-sm font-medium text-slate-600">Child roll number</label>
            <input
              id="parent-profile-roll"
              name="childRollNumber"
              value={profile.childRollNumber}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[#c79216] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10] disabled:cursor-not-allowed disabled:bg-[#e6cc8a]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
