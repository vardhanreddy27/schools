import { signOut } from "next-auth/react";
import { navItems } from "@/components/admin-dashboard/data";

export function SidebarNav({ activeMenu, onMenuChange }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">N</div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">NMS</p>
            <p className="text-sm text-slate-400">Principal Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeMenu === id ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
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
          onClick={() => signOut({ callbackUrl: "/Admin_login" })}
          className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export function MobileBottomNav({ activeMenu, onMenuChange }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onMenuChange(id)}
            className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium ${
              activeMenu === id ? "bg-blue-50 text-blue-700" : "text-slate-500"
            }`}
          >
            <Icon className="mb-1 h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
