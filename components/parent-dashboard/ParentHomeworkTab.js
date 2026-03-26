import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { pendingHomework } from "./data";

export default function ParentHomeworkTab() {
  const urgentHomework = pendingHomework.filter((hw) => hw.priority === "high");
  const otherHomework = pendingHomework.filter((hw) => hw.priority !== "high");

  return (
    <div className="space-y-6 py-6">
      {/* Urgent Homework */}
      {urgentHomework.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            URGENT - DUE SOON
          </h3>
          <div className="space-y-3">
            {urgentHomework.map((hw) => (
              <div
                key={hw.id}
                className="flex gap-4 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-950">{hw.subject}</h4>
                  <p className="mt-1 text-sm text-slate-600">{hw.title}</p>
                  <p className="mt-2 text-xs text-slate-500">{hw.description}</p>
                  <p className="mt-2 text-xs font-semibold text-rose-700">
                    📅 Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Homework */}
      {otherHomework.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 mb-3">OTHER ASSIGNMENTS</h3>
          <div className="space-y-3">
            {otherHomework.map((hw) => (
              <div
                key={hw.id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-all"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  ◇
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-950">{hw.subject}</h4>
                  <p className="mt-1 text-sm text-slate-600">{hw.title}</p>
                  <p className="mt-2 text-xs text-slate-500">{hw.description}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    📅 Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips for Parents */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Tips for Parents</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Ensure your child completes homework on time
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Check if materials & resources are available at home
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Plan study schedule around tough assignments
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">→</span>
            Ask about concepts they struggle with
          </li>
        </ul>
      </section>

      {/* Subject-wise Summary */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">HOMEWORK BY SUBJECT</h3>
        <div className="space-y-2">
          {Array.from(new Set(pendingHomework.map((hw) => hw.subject))).map((subject) => {
            const count = pendingHomework.filter((hw) => hw.subject === subject).length;
            return (
              <div key={subject} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="font-medium text-slate-900">{subject}</span>
                <span className="rounded-full bg-[#c79216] px-3 py-1 text-xs font-semibold text-white">
                  {count} {count === 1 ? "task" : "tasks"}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
