import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area as AreaShape,
} from "recharts";
import {
  attendanceTrend,
  highlights,
  metricDrilldown,
  topMetrics,
  trendTabs,
  upcomingModules,
  timetableModules,
} from "@/components/admin-dashboard/data";

function MetricCard({ item, isActive, onOpen }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(item.key)}
      className={`h-28 rounded-3xl bg-white p-4 text-left shadow-sm transition-all duration-300 ${
        isActive ? "-translate-y-0.5 ring-2 ring-blue-200" : "hover:-translate-y-0.5"
      }`}
    >
      <p className="truncate text-sm font-medium text-slate-500">{item.title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-3xl font-semibold text-slate-950">{item.value}</p>
        <div className="flex items-center justify-center text-slate-500">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}

function DrilldownPanel({ activeMetric }) {
  if (!activeMetric || !metricDrilldown[activeMetric]) {
    return null;
  }

  const detail = metricDrilldown[activeMetric];

  return (
    <div className="mt-3 overflow-hidden rounded-3xl border border-blue-200 bg-blue-50/60 p-4 transition-all duration-300">
      <p className="text-sm font-medium text-blue-700">{detail.title}</p>
      <p className="mt-1 text-sm text-slate-600">{detail.subtitle}</p>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-white p-2 ring-1 ring-slate-200">
        <table className="min-w-full border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              {detail.columns.map((col) => (
                <th key={col} className="px-3 py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.rows.map((row) => (
              <tr key={row.join("-")} className="rounded-xl bg-slate-50 ring-1 ring-slate-200">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-2 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OverviewView({ activeTrend, onTrendChange, leaveRequests, activeMetric, onOpenMetric }) {
  const trend = attendanceTrend[activeTrend];

  return (
    <>
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {topMetrics.map((item) => (
          <MetricCard key={item.key} item={item} isActive={activeMetric === item.key} onOpen={onOpenMetric} />
        ))}
      </section>

      <DrilldownPanel activeMetric={activeMetric} />

      <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Attendance trend</p>
            <h2 className="mt-1 text-2xl font-semibold">Students and teachers</h2>
          </div>

          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {trendTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTrendChange(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeTrend === tab ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 min-w-0 min-h-[16rem] h-64 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#dbe3f0" strokeDasharray="4 4" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <AreaShape type="monotone" dataKey="students" stroke="#2563eb" fill="url(#studentsFill)" strokeWidth={3} />
              <AreaShape type="monotone" dataKey="teachers" stroke="#0f172a" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Students line
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Teachers line
          </span>
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Operational highlights</p>
        <h2 className="mt-1 text-2xl font-semibold">Action cards</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] p-5"
              style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: item.color }}>{item.title}</p>
              <p className="mt-2 text-5xl font-bold leading-none" style={{ color: item.color }}>{item.title === "Pending Leaves" ? leaveRequests.filter((x) => x.status === "Pending").length : item.title === "Approved" ? leaveRequests.filter((x) => x.status === "Approved").length : item.value}</p>
              <p className="mt-2 text-sm" style={{ color: item.color }}>{item.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm text-slate-500">Upcoming modules</p>
          <h2 className="mt-1 text-xl font-semibold">Events, sports and calendar</h2>
          <div className="mt-4 space-y-3">
            {upcomingModules.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm text-slate-500">Timetable and substitution</p>
          <h2 className="mt-1 text-xl font-semibold">Automation status</h2>
          <div className="mt-4 space-y-3">
            {timetableModules.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
