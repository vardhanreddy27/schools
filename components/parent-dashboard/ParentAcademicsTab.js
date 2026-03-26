import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { subjectPerformance, getSubjectStatus, monthlyProgressTrend } from "./data";

export default function ParentAcademicsTab() {
  const weakSubjects = subjectPerformance.filter((s) => s.status === "weak");
  const strongSubjects = subjectPerformance.filter((s) => s.status === "good");

  return (
    <div className="space-y-6 py-6">
      {/* Performance Chart */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">SUBJECT PERFORMANCE</h3>
        <div className="h-80 w-full rounded-2xl border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#c79216" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Progress Trend */}
      <section>
        <h3 className="text-sm font-semibold text-slate-600 mb-3">MONTHLY PROGRESS</h3>
        <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyProgressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="avg" stroke="#c79216" dot={{ fill: "#c79216", r: 6 }} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Subjects Needing Improvement */}
      {weakSubjects.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            AREAS NEEDING IMPROVEMENT
          </h3>
          <div className="space-y-3">
            {weakSubjects.map((subject) => (
              <div key={subject.subject} className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-950">{subject.subject}</h4>
                    <p className="mt-1 text-sm text-slate-700">
                      Current Score: <span className="font-bold text-rose-700">{subject.score}%</span> | Target: {subject.target}%
                    </p>
                    <div className="mt-3 w-full bg-rose-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full"
                        style={{ width: `${(subject.score / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-rose-700 font-semibold">
                      Gap: {subject.target - subject.score} points to reach target
                    </p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strong Subjects */}
      {strongSubjects.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            STRONG SUBJECTS
          </h3>
          <div className="space-y-3">
            {strongSubjects.map((subject) => (
              <div key={subject.subject} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-950">{subject.subject}</h4>
                    <p className="mt-1 text-sm text-slate-700">
                      Score: <span className="font-bold text-emerald-700">{subject.score}%</span> • Completion: {subject.completion}%
                    </p>
                    <div className="mt-3 w-full bg-emerald-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${(subject.score / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-emerald-700 font-semibold">Trend: {subject.trend}</p>
                  </div>
                  <div className="text-3xl">✓</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
        <h3 className="font-semibold text-slate-950 mb-3">Recommendations for Improvement</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            Focus more on weak subjects - allocate 40% study time to them
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            Practice problem-solving daily for Math & Science
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            Maintain study consistency across all subjects
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            Review teacher feedback and track improvements
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">5.</span>
            Schedule revision sessions weekly for all subjects
          </li>
        </ul>
      </section>
    </div>
  );
}
