import { AlertTriangle, TrendingDown, BookOpen, Award } from "lucide-react";
import { parentSummary, childInfo, performanceAlerts, upcomingTests } from "./data";

export default function ParentHomeTab() {
  return (
    <div className="space-y-6 py-6">
      {/* Child Overview */}
      <section className="bg-gradient-to-r from-[#fff4d6] to-yellow-50 rounded-2xl p-6 border border-yellow-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-600">CHILD INFO</h3>
            <p className="mt-2 text-2xl font-bold text-slate-950">{childInfo.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              Class {childInfo.className} • Section {childInfo.section} • Roll {childInfo.rollNumber}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c79216] text-2xl font-bold text-white">
            {childInfo.name.charAt(0)}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">KEY METRICS</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {parentSummary.map((metric) => (
            <div
              key={metric.title}
              className={`rounded-2xl border p-4 ${
                metric.tone === "emerald"
                  ? "border-emerald-200 bg-emerald-50"
                  : metric.tone === "amber"
                    ? "border-amber-200 bg-amber-50"
                    : metric.tone === "blue"
                      ? "border-blue-200 bg-blue-50"
                      : "border-rose-200 bg-rose-50"
              }`}
            >
              <p className={`text-xs font-semibold ${
                metric.tone === "emerald"
                  ? "text-emerald-700"
                  : metric.tone === "amber"
                    ? "text-amber-700"
                    : metric.tone === "blue"
                      ? "text-blue-700"
                      : "text-rose-700"
              }`}>
                {metric.title}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-600">{metric.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts & Concerns */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          ALERTS & CONCERNS
        </h3>
        <div className="space-y-3">
          {performanceAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex gap-3 rounded-xl border p-4 ${
                alert.severity === "high"
                  ? "border-rose-200 bg-rose-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0 ${
                  alert.severity === "high" ? "bg-rose-600" : "bg-amber-600"
                }`}
              >
                !
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    alert.severity === "high" ? "text-rose-900" : "text-amber-900"
                  }`}
                >
                  {alert.message}
                </p>
                {alert.subject && (
                  <p className="mt-1 text-xs text-slate-600">Subject: {alert.subject}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Tests - High Priority */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-600" />
          UPCOMING TESTS
        </h3>
        <div className="space-y-2">
          {upcomingTests.map((test) => (
            <div key={test.id} className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0 ${
                  test.needsAttention ? "bg-rose-600" : "bg-blue-600"
                }`}
              >
                {test.difficulty === "High" ? "!" : "✓"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-950">{test.subject}</p>
                <p className="text-sm text-slate-600">{test.chapter}</p>
                <p className="mt-1 text-xs text-slate-500">
                  📅 {new Date(test.date).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })} • Difficulty: {test.difficulty}
                </p>
                {test.needsAttention && (
                  <p className="mt-2 text-xs font-semibold text-rose-700">
                    ⚠️ Needs special attention & practice
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">QUICK ACTIONS</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition-all">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-[#c79216]" />
            <p className="text-xs font-semibold text-slate-900">View Homework</p>
          </button>
          <button className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition-all">
            <TrendingDown className="h-6 w-6 mx-auto mb-2 text-[#c79216]" />
            <p className="text-xs font-semibold text-slate-900">View Reports</p>
          </button>
          <button className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition-all">
            <Award className="h-6 w-6 mx-auto mb-2 text-[#c79216]" />
            <p className="text-xs font-semibold text-slate-900">Academics</p>
          </button>
          <button className="rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition-all">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-[#c79216]" />
            <p className="text-xs font-semibold text-slate-900">Attendance</p>
          </button>
        </div>
      </section>
    </div>
  );
}
