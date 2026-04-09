import { signOut } from "next-auth/react";
import Image from "next/image";
import { navItems } from "@/components/admin-dashboard/data";

export function SidebarNav({ activeMenu, onMenuChange }) {
  return (
    <aside className="hidden w-72 shrink-0 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
      <div className="px-7 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-18 w-18  items-center justify-center overflow-hidden  p-1.5">
            <Image src="/logo.jpg" alt="QH Logo" width={60} height={60} className="object-contain" priority />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-[0.22em]">QH</p>
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
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              activeMenu === id ? "text-slate-950" : "text-slate-300 hover:bg-slate-900 hover:text-white"
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
          className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700 active:scale-[0.97]"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export function MobileBottomNav({ activeMenu, onMenuChange, items }) {
  const mobileItems = items || navItems;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white/98 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_24px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:hidden">
      <div className="grid gap-1 px-2" style={{ gridTemplateColumns: `repeat(${mobileItems.length}, minmax(0, 1fr))` }}>
        {mobileItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeMenu === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onMenuChange(id)}
              className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-200 active:scale-95 ${
                isActive ? "text-black" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
