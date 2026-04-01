import { studentProfileDefaults } from "@/components/student-dashboard/data";
function getInitialStudentProfile() {
  return studentProfileDefaults;
}
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import Image from "next/image";
import HomeTab from "@/components/student-dashboard/HomeTab";
import HomeworkTab from "@/components/student-dashboard/HomeworkTab";
import AttendanceTab from "@/components/student-dashboard/AttendanceTab";
import TimetableTab from "@/components/student-dashboard/TimetableTab";
import AcademicsTab from "@/components/student-dashboard/AcademicsTab";
import MoreTab from "@/components/student-dashboard/MoreTab";
import { attendanceLog, studentMenuItems } from "@/components/student-dashboard/data";
import ParentHomeTab from "@/components/parent-dashboard/ParentHomeTab";
import ParentHomeworkTab from "@/components/parent-dashboard/ParentHomeworkTab";
import ParentAttendanceTab from "@/components/parent-dashboard/ParentAttendanceTab";
import ParentTimetableTab from "@/components/parent-dashboard/ParentTimetableTab";
import ParentAcademicsTab from "@/components/parent-dashboard/ParentAcademicsTab";
import ParentMoreTab from "@/components/parent-dashboard/ParentMoreTab";
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
  return parentProfileDefaults;
}

function getInitialRole(initialRole) {
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
              activeMenu === id ? "text-slate-900" : "text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" />
            <p>{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FamilyDashboard({ initialRole = "student" }) {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState(() => getInitialRole(initialRole));
  const [activeMenu, setActiveMenu] = useState(() => roleConfig[initialRole]?.defaultMenu || "home");
  const [studentProfileSheetOpen, setStudentProfileSheetOpen] = useState(false);
  const [parentProfileSheetOpen, setParentProfileSheetOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [studentProfileForm, setStudentProfileForm] = useState(getInitialStudentProfile());
  const [parentProfileForm, setParentProfileForm] = useState(getInitialParentProfile());

  const isStudent = activeRole === "student";

  const showTopHeader = isStudent ? activeMenu === "home" || activeMenu === "more" : activeMenu === "home" || activeMenu === "more";

  const subtitle = useMemo(() => {
    if (isStudent) {
      return `Class ${studentProfileForm.className || "-"} • Section ${studentProfileForm.section || "-"}`;
    }

    return `${parentProfileForm.childClass || "-"} Std • Section ${parentProfileForm.childSection || "-"}`;
  }, [isStudent, studentProfileForm.className, studentProfileForm.section, parentProfileForm.childClass, parentProfileForm.childSection]);

  const attendancePercentage = 75;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedRole = window.localStorage.getItem("familyDashboardRole");
    if (savedRole === "student" || savedRole === "parent") {
      setActiveRole(savedRole);
      setActiveMenu(roleConfig[savedRole].defaultMenu);
    }

    const savedStudentProfile = window.localStorage.getItem("studentProfile");
    if (savedStudentProfile) {
      try {
        setStudentProfileForm(JSON.parse(savedStudentProfile));
      } catch {
        setStudentProfileForm(studentProfileDefaults);
      }
    }

    const savedParentProfile = window.localStorage.getItem("parentProfile");
    if (savedParentProfile) {
      try {
        setParentProfileForm(JSON.parse(savedParentProfile));
      } catch {
        setParentProfileForm(parentProfileDefaults);
      }
    }
  }, []);

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
    <div className=" bg-[#eef3fb] text-slate-950 lg:flex">
      <FamilySidebar
        activeRole={activeRole}
        activeMenu={activeMenu}
        onRoleChange={handleRoleChange}
        onMenuChange={handleMenuChange}
        onLogout={handleLogout}
      />

      <main className="relative flex-1 pb-28 lg:pb-8">
        <div className="mx-auto flex max-w-6xl flex-col px-3 pb-8 pt-3 sm:px-5 lg:px-6 lg:pt-6">
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
                      ? `Welcome Shiva`
                      : `Welcome Prakesh`}
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
                          Krishna
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
                    <span className={`block overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm ${isStudent ? "h-12 w-12 p-0.5" : "h-16 w-16 p-0"}`}>
                      <Image
                        src={isStudent ? "/student3.png" : "/parent.jpg"}
                        alt={isStudent ? "Student profile" : "Parent profile"}
                        width={isStudent ? 48 : 64}
                        height={isStudent ? 48 : 64}
                        className={isStudent ? "h-full w-full object-cover" : "h-full w-full scale-[1.12] object-cover object-[center_18%]"}
                      />
                    </span>
                  </button>
                </div>
              </div>

              {isStudent ? (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <p className="font-semibold text-slate-800">Attendance</p>
                    <p className="font-bold text-emerald-700">{attendancePercentage}%</p>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-200/70">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${attendancePercentage}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          <div key={`${activeRole}-${activeMenu}`} className="page-enter">
            {isStudent ? (
              <>
                {activeMenu === "home" ? <HomeTab /> : null}
                {activeMenu === "homework" ? <HomeworkTab /> : null}
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
                {activeMenu === "academics" ? <ParentAcademicsTab /> : null}
                {activeMenu === "more" ? <ParentMoreTab /> : null}
              </>
            )}
          </div>
        </div>

        <FamilyBottomNav activeRole={activeRole} activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      </main>

      <ProfileBottomSheet
        open={studentProfileSheetOpen}
        onClose={() => setStudentProfileSheetOpen(false)}
        profile={studentProfileForm}
        onProfileChange={handleStudentProfileChange}
        onProfileSave={handleStudentProfileSave}
        profileSaving={profileSaving}
        onLogout={handleLogout}
        title="Student profile details"
        nameLabel="Student name"
        nameField="studentName"
        classLabel="Class"
        classField="className"
        sectionLabel="Section"
        sectionField="section"
        rollLabel="Roll number"
        rollField="rollNumber"
         showProfilePicUpload={true}
         profilePicField="profilePic"
      />

      <ProfileBottomSheet
        open={parentProfileSheetOpen}
        onClose={() => setParentProfileSheetOpen(false)}
        profile={parentProfileForm}
        onProfileChange={handleParentProfileChange}
        onProfileSave={handleParentProfileSave}
        profileSaving={profileSaving}
        onLogout={handleLogout}
        title="Parent profile details"
        nameLabel="Parent name"
        nameField="parentName"
        classLabel="Child class"
        classField="childClass"
        sectionLabel="Child section"
        sectionField="childSection"
        rollLabel="Child roll number"
        rollField="childRollNumber"
        childNameLabel="Child name"
        childNameField="childName"
      />
    </div>
  );
}


function ProfileBottomSheet({
  open,
  onClose,
  profile,
  onProfileChange,
  onProfileSave,
  profileSaving,
  onLogout,
  title = "Profile details",
  nameLabel = "Name",
  nameField = "name",
  classLabel = "Class",
  classField = "className",
  sectionLabel = "Section",
  sectionField = "section",
  rollLabel = "Roll number",
  rollField = "rollNumber",
  childNameLabel,
  childNameField,
  showProfilePicUpload,
  profilePicField
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
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
            <label htmlFor="profile-name" className="text-sm font-medium text-slate-600">{nameLabel}</label>
            <input
              id="profile-name"
              name={nameField}
              value={profile[nameField] || "Shiva"}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          <div>
            <label htmlFor="profile-contact" className="text-sm font-medium text-slate-600">Contact</label>
            <input
              id="profile-contact"
              name="contact"
              value="9866531011"
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>

          {/* Roll number separate, Class/Section combined for students */}
          {nameField === "studentName" && (
            <>
              <div>
                <label htmlFor="profile-roll" className="text-sm font-medium text-slate-600">Roll Number</label>
                <input
                  id="profile-roll"
                  name="rollNumber"
                  value={profile.rollNumber || ""}
                  onChange={onProfileChange}
                  placeholder="23"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
                />
              </div>
              <div>
                <label htmlFor="profile-classsection" className="text-sm font-medium text-slate-600">Class/Section</label>
                <input
                  id="profile-classsection"
                  name="classSection"
                  value={`${profile.className || ""}/${profile.section || ""}`}
                  onChange={e => {
                    const [cls, sec] = e.target.value.split("/");
                    onProfileChange({ target: { name: "className", value: cls || "" } });
                    onProfileChange({ target: { name: "section", value: sec || "" } });
                  }}
                  placeholder="10/A"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
                />
              </div>
            </>
          )}

          {childNameLabel && childNameField && (
            <div>
              <label htmlFor="profile-child" className="text-sm font-medium text-slate-600">{childNameLabel}</label>
              <input
                id="profile-child"
                name={childNameField}
                value={profile[childNameField] || ""}
                onChange={onProfileChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
              />
            </div>
          )}

          {showProfilePicUpload && (
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-slate-600 mb-1">Profile Picture</label>
              <div
                className="w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative cursor-pointer hover:border-[#16c7bd] transition-all"
                style={{ height: '150px' }}
                onClick={() => document.getElementById('profile-pic-upload')?.click()}
              >
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        onProfileChange({ target: { name: profilePicField, value: ev.target.result } });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {profile[profilePicField] ? (
                  <Image
                    src={profile[profilePicField]}
                    alt="Profile Preview"
                    fill
                    className="object-cover rounded-xl"
                    style={{ position: 'absolute', inset: 0 }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <button
                      type="button"
                      className="mb-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-100 flex items-center gap-2"
                      tabIndex={-1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#16c7bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4"/><rect width="20" height="12" x="2" y="8" stroke="#16c7bd" strokeWidth="2" rx="2"/></svg>
                      <span>Upload</span>
                    </button>
                    <span className="text-slate-500 text-sm">Choose a file or drag & drop it here</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[#16c7bd] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12a79f] disabled:cursor-not-allowed disabled:bg-[#8fded8]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
