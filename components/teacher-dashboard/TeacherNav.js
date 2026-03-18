import { signOut } from "next-auth/react";
import { CalendarDays, ClipboardCheck, Home, LayoutGrid } from "lucide-react";

export const menuItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "more", label: "More", icon: LayoutGrid },
];

export function TeacherSidebar({ activeMenu, onMenuChange }) {
  return (
    <aside className="hidden w-72 shrink-0 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2b705] text-lg font-bold text-white">
            N
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
            <p className="text-sm text-slate-400">Teacher Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              activeMenu === id
                ? "bg-[#f2b705] text-white"
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
          onClick={() => signOut({ callbackUrl: "/Teacher_login" })}
          className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export function TeacherBottomNav({ activeMenu, onMenuChange }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_24px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${menuItems.length}, minmax(0, 1fr))` }}
      >
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-90 ${
              activeMenu === id ? "text-[#b88600]" : "text-slate-400"
            }`}
          >
            <span
              className={`mb-0.5 block h-0.75 w-5 rounded-full bg-[#f2b705] transition-all duration-250 ${
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
