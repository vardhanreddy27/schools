import { LogOut, Menu, X } from "lucide-react";
import { parentMenuItems } from "./data";
import { useEffect, useState } from "react";

export function ParentSidebar({ activeMenu, onMenuChange, onLogout }) {
  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:flex sticky top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#c79216]">NMS</h1>
        <p className="text-xs text-slate-500 mt-1">Parent Portal</p>
      </div>

      <nav className="flex-1 space-y-1">
        {parentMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#fff4d6] text-[#c79216]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}

export function ParentBottomNav({ activeMenu, onMenuChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-1 py-2 flex justify-around lg:hidden z-40">
      {parentMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 ${
              isActive
                ? "text-[#c79216]"
                : "text-slate-600"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden xs:inline">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
