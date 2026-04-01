import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { subjectPerformance } from "./data";

const progressOptions = [
  { id: "monthly", label: "Monthly" },
  { id: "halfYearly", label: "Half-Yearly" },
  { id: "annual", label: "Annual" },
];

const academicsChartData = {
  monthly: [
    { label: "Telugu", score: 83 },
    { label: "Hindi", score: 80 },
    { label: "English", score: 78 },
    { label: "Maths", score: 62 },
    { label: "Science", score: 81 },
    { label: "Social", score: 68 },
  ],
  halfYearly: [
    { label: "Telugu", score: 85 },
    { label: "Hindi", score: 82 },
    { label: "English", score: 80 },
    { label: "Maths", score: 66 },
    { label: "Science", score: 83 },
    { label: "Social", score: 71 },
  ],
  annual: [
    { label: "Telugu", score: 88 },
    { label: "Hindi", score: 84 },
    { label: "English", score: 82 },
    { label: "Maths", score: 72 },
    { label: "Science", score: 86 },
    { label: "Social", score: 76 },
  ],
};

const IMPROVEMENT_TIPS = {
  maths: "Focus on algebra and equation-solving steps; practice 8-10 problems daily.",
  math: "Focus on algebra and equation-solving steps; practice 8-10 problems daily.",
  science: "Revise key concepts and diagrams; improve answer structure with keywords.",
  social: "Improve long-answer writing with dates, headings, and map-based practice.",
  english: "Strengthen grammar and comprehension; practice paragraph writing and vocabulary.",
  hindi: "Work on grammar rules and writing accuracy; read passages for comprehension.",
  telugu: "Improve reading fluency and written expression with short daily practice.",
  biology: "Revise definitions and labeled diagrams; practice concise explanation answers.",
};

function getImprovementTip(subjectName) {
  return IMPROVEMENT_TIPS[subjectName.toLowerCase()] || "Focus on daily revision and practice with teacher feedback.";
}

const SUBJECT_IMAGE_MAP = {
  science: "/science.png",
  telugu: "/telugu.png",
  english: "/english.png",
  maths: "/maths.png",
  math: "/maths.png",
  social: "/social.png",
  hindi: "/hindi.webp",
  biology: "/biology.png",
};

export default function ParentAcademicsTab() {
  const [activePeriod, setActivePeriod] = useState("monthly");
  const weakSubjects = subjectPerformance.filter((s) => s.status === "weak");
  const strongSubjects = subjectPerformance.filter((s) => s.status === "good");
  const ringColors = ["#16c7bd", "#1e90ff", "#43a047", "#e53935", "#8e24aa", "#ff9800"];
  const activeChartData = academicsChartData[activePeriod] || academicsChartData.monthly;

  return (
    <div className="space-y-6 py-6 mb-9">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm text-slate-500 font-medium">Academics</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Performance overview</h2>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <div className="grid grid-cols-3 gap-1">
            {progressOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActivePeriod(option.id)}
                className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
                  activePeriod === option.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeChartData} barGap={10}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                }}
              />
              <Bar dataKey="score" fill="#fb923c" radius={[12, 12, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm text-slate-500 font-medium">Quiz</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Performance</h2>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {subjectPerformance.slice(0, 6).map((item, idx) => {
            const color = ringColors[idx % ringColors.length];
            const radius = 38;
            const stroke = 7;
            const normalizedRadius = radius - stroke / 2;
            const circumference = 2 * Math.PI * normalizedRadius;
            const offset = circumference - (item.completion / 100) * circumference;

            return (
              <div key={item.subject} className="flex flex-col items-center">
                <div className="relative mb-2 h-20 w-20">
                  <svg width={radius * 2} height={radius * 2}>
                    <circle
                      stroke="#f1f5f9"
                      fill="none"
                      strokeWidth={stroke}
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                    />
                    <circle
                      stroke={color}
                      fill="none"
                      strokeWidth={stroke}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      cx={radius}
                      cy={radius}
                      r={normalizedRadius}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-700">{item.subject}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900">{item.score}% Score</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects Needing Improvement */}
      {weakSubjects.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            AREAS NEEDING IMPROVEMENT
          </h3>
          <div className="space-y-3">
            {weakSubjects.map((subject) => (
              <div key={subject.subject} className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ">
                    <Image
                      src={SUBJECT_IMAGE_MAP[subject.subject.toLowerCase()] || "/logo.png"}
                      alt={subject.subject}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-950">{subject.subject}</h4>
                    <p className="mt-1 text-sm text-slate-700">
                      Current Score: <span className="font-bold text-amber-700">{subject.score}%</span> | Target: {subject.target}%
                    </p>
                    <div className="mt-3 w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${(subject.score / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs font-semibold inline text-slate-800">
                      Focus area: </p><p className="inline text-sm text-slate-700">{getImprovementTip(subject.subject)}</p>
                    
                  </div>
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
            STRONG SUBJECTS
          </h3>
          <div className="space-y-3">
            {strongSubjects.map((subject) => (
              <div key={subject.subject} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl  ring-emerald-200">
                    <Image
                      src={SUBJECT_IMAGE_MAP[subject.subject.toLowerCase()] || "/logo.png"}
                      alt={subject.subject}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
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
