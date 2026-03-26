import { TrendingDown, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";
import { performanceInsights, childInfo } from "./data";

export default function ParentReportsTab() {
  return (
    <div className="space-y-6 py-6">
      {/* Report Header */}
      <section className="bg-linear-to-r from-[#fff4d6] to-yellow-50 rounded-2xl p-6 border border-yellow-100">
        <h3 className="text-sm font-semibold text-slate-600">ACADEMIC PERFORMANCE REPORT</h3>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{childInfo.name}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Class {childInfo.className} | Section {childInfo.section} | Roll {childInfo.rollNumber}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Report Generated: {new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>

      {/* Performance Insights */}
      <div className="space-y-4">
        {performanceInsights.map((insight, idx) => (
          <section key={idx}>
            <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              {insight.severity === "high" && (
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              )}
              {insight.severity === "low" && (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              )}
              {insight.severity === "info" && (
                <BookOpen className="h-4 w-4 text-blue-600" />
              )}
              {insight.title}
            </h3>
            <div
              className={`rounded-2xl border p-6 ${
                insight.severity === "high"
                  ? "border-rose-200 bg-rose-50"
                  : insight.severity === "low"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-blue-200 bg-blue-50"
              }`}
            >
              <ul className="space-y-2">
                {insight.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-3 text-sm">
                    <span
                      className={`font-bold shrink-0 ${
                        insight.severity === "high"
                          ? "text-rose-600"
                          : insight.severity === "low"
                            ? "text-emerald-600"
                            : "text-blue-600"
                      }`}
                    >
                      {insight.severity === "high" && "!"}
                      {insight.severity === "low" && "✓"}
                      {insight.severity === "info" && "•"}
                    </span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* Overall Summary */}
      <section className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Overall Assessment</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Current Status:</span> Your child&apos;s academic performance shows mixed results with strengths in some areas and room for improvement in others.
          </p>
          <p>
            <span className="font-semibold text-slate-900">Key Observation:</span> Performance in Math and Social Studies needs focused attention. Consistent practice and teacher support can help improve scores within 4-6 weeks.
          </p>
          <p>
            <span className="font-semibold text-slate-900\">Positive Note:</span> Strong foundation in Telugu and Science shows the child has capability to excel. Similar dedication to weak subjects will yield results.
          </p>
        </div>
      </section>

      {/* Action Plan */}
      <section className="rounded-2xl border-2 border-[#c79216] bg-[#fff4d6] p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Action Plan for Parents</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c79216] text-sm font-bold text-white shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">Schedule Study Time</p>
              <p className="text-sm text-slate-600">30 mins for weak subjects, 20 mins for strong subjects daily</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c79216] text-sm font-bold text-white shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">Monitor Homework</p>
              <p className="text-sm text-slate-600">Check daily homework completion and quality</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c79216] text-sm font-bold text-white shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">Connect with Teachers</p>
              <p className="text-sm text-slate-600">Meet teachers to understand weak areas specifically</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c79216] text-sm font-bold text-white shrink-0">
              4
            </div>
            <div>
              <p className="font-semibold text-slate-900">Weekly Review</p>
              <p className="text-sm text-slate-600">Track progress weekly and adjust study approach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Resources */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Resources & Support</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-[#c79216] font-bold">→</span>
            School will provide extra practice materials on request
          </li>
          <li className="flex gap-2">
            <span className="text-[#c79216] font-bold">→</span>
            Attend parent-teacher meetings to discuss progress
          </li>
          <li className="flex gap-2">
            <span className="text-[#c79216] font-bold">→</span>
            Access to school library for additional study resources
          </li>
          <li className="flex gap-2">
            <span className="text-[#c79216] font-bold">→</span>
            Teachers available for doubt clearing sessions
          </li>
        </ul>
      </section>

      {/* Download Report */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-full bg-[#c79216] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b07e10] transition-all">
          📥 Download PDF Report
        </button>
        <button className="flex-1 rounded-full border-2 border-[#c79216] px-4 py-3 text-sm font-semibold text-[#c79216] hover:bg-[#fff4d6] transition-all">
          📧 Email to Parent
        </button>
      </div>
    </div>
  );
}
