import { useMemo, useState } from "react";
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
  alerts,
  attendanceTrend,
  highlights,
  metricDrilldown,
  topMetrics,
  trendTabs,
  upcomingModules,
  timetableModules,
} from "@/components/admin-dashboard/data";

const EMPTY_ROWS = [];

function MetricCard({ item, isActive, onOpen }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(item.key)}
      className={`h-28 w-full rounded-3xl bg-white p-4 text-left shadow-[0_12px_28px_-22px_rgba(15,23,42,0.32)] transition-all duration-300 ${
        isActive ? "-translate-y-0.5 ring-2 ring-[#f7e2a3]" : "hover:-translate-y-0.5"
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
  const detail = metricDrilldown[activeMetric];
  const rows = detail ? detail.rows : EMPTY_ROWS;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return rows;
    }

    return rows.filter((row) => row.join(" ").toLowerCase().includes(term));
  }, [rows, query]);

  const totalPages = Math.max(Math.ceil(filteredRows.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage]);

  if (!detail) {
    return null;
  }

  return (
    <div className="mt-3 overflow-hidden rounded-3xl border border-[#f7e2a3] bg-[#fff8dc]/60 p-4 transition-all duration-300">
      <p className="text-sm font-medium text-[#8b6400]">{detail.title}</p>
      <p className="mt-1 text-sm text-slate-600">{detail.subtitle}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search in this table"
          className="min-w-56 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
        />
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
          {filteredRows.length} rows
        </span>
      </div>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {detail.columns.map((col) => (
                <th key={col} className="px-3 py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.join("-")} className="border-t border-slate-100 hover:bg-[#fff8dc]/40">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-2 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <p>
          Page {safePage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={safePage === totalPages}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OverviewView({ activeTrend, onTrendChange, leaveRequests, activeMetric, onOpenMetric, onNavigate }) {
  const trend = attendanceTrend[activeTrend];
  const [activeHighlight, setActiveHighlight] = useState("alerts");
  const [activeModule, setActiveModule] = useState(null);

  const dynamicHighlightValue = (item) => {
    if (item.title === "Pending Leaves") {
      return leaveRequests.filter((x) => x.status === "Pending").length;
    }
    if (item.title === "Approved") {
      return leaveRequests.filter((x) => x.status === "Approved").length;
    }
    return item.value;
  };

  const activeModuleItem = [...upcomingModules, ...timetableModules].find((item) => item.key === activeModule);

  return (
    <>
      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {topMetrics.map((item, index) => (
          <div key={item.key} className="stagger-item" style={{ "--stagger-delay": `${80 + index * 45}ms` }}>
            <MetricCard item={item} isActive={activeMetric === item.key} onOpen={onOpenMetric} />
          </div>
        ))}
      </section>

      <DrilldownPanel activeMetric={activeMetric} />

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
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

        <div className="mt-5 min-w-0 min-h-64 h-64 rounded-3xl bg-slate-50 p-4 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f2b705" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f2b705" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#dbe3f0" strokeDasharray="4 4" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <AreaShape type="monotone" dataKey="students" stroke="#f2b705" fill="url(#studentsFill)" strokeWidth={3} />
              <AreaShape type="monotone" dataKey="teachers" stroke="#0f172a" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff8dc] px-3 py-1 text-[#8b6400]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f2b705]" />
            Students line
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Teachers line
          </span>
        </div>
      </section>

      <section className="mt-4 rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
        <p className="text-sm text-slate-500">Operational highlights</p>
        <h2 className="mt-1 text-2xl font-semibold">Action cards</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {highlights.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                setActiveHighlight(item.key);
                if (item.key === "pendingLeaves" || item.key === "approved") {
                  onNavigate("approvals");
                }
              }}
              className="rounded-3xl p-5 text-left transition hover:-translate-y-0.5"
              style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}40` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: item.color }}>{item.title}</p>
              <p className="mt-2 text-5xl font-bold leading-none" style={{ color: item.color }}>{dynamicHighlightValue(item)}</p>
              <p className="mt-2 text-sm" style={{ color: item.color }}>{item.subtitle}</p>
              <p className="mt-2 text-xs font-semibold" style={{ color: item.color }}>{item.actionLabel}</p>
            </button>
          ))}
        </div>
        {activeHighlight === "alerts" ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-600">{alert.detail}</p>
                <p className="mt-2 text-xs font-semibold text-rose-600">{alert.priority} priority</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Upcoming modules</p>
          <h2 className="mt-1 text-xl font-semibold">Events, sports and calendar</h2>
          <div className="mt-4 space-y-3">
            {upcomingModules.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setActiveModule(item.key);
                  onNavigate(item.linkTo);
                }}
                className="w-full rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-[#fff8dc]"
              >
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-4xl bg-white p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.25)] sm:p-5">
          <p className="text-sm text-slate-500">Timetable and substitution</p>
          <h2 className="mt-1 text-xl font-semibold">Automation status</h2>
          <div className="mt-4 space-y-3">
            {timetableModules.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setActiveModule(item.key);
                  onNavigate(item.linkTo);
                }}
                className="w-full rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-[#fff8dc]"
              >
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </button>
            ))}
          </div>
          {activeModuleItem ? (
            <div className="mt-4 rounded-2xl bg-[#fff8dc] p-4 ring-1 ring-[#f7e2a3]">
              <p className="text-sm font-semibold text-[#8b6400]">Selected module</p>
              <p className="mt-1 font-semibold text-slate-900">{activeModuleItem.title}</p>
              <p className="mt-1 text-sm text-slate-600">{activeModuleItem.detail}</p>
            </div>
          ) : null}
        </article>
      </section>
    </>
  );
}
