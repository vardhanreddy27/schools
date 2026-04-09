import { studentMenuItems } from "@/components/student-dashboard/data";
import Image from "next/image";

export function StudentSidebar({ activeMenu, onMenuChange, onLogout }) {
  return (
    <aside className="hidden w-72 shrink-0 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
            <Image src="/logo.jpg" alt="QH Logo" width={50} height={50} className="object-contain" priority />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">QH</p>
            <p className="text-sm text-slate-400">Student Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {studentMenuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              activeMenu === id
                ? "text-white"
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

export function StudentBottomNav({ activeMenu, onMenuChange }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_24px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden">
      <div
        className="grid gap-1 px-2"
        style={{ gridTemplateColumns: `repeat(${studentMenuItems.length}, minmax(0, 1fr))` }}
      >
        {studentMenuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-95 ${
              activeMenu === id ? "text-[#8b6400]" : "text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
