import { useMemo, useState } from "react";
import {
  AlertTriangle,
  TrendingDown,
  BookOpen,
  Award,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  School,
  UserCircle2,
  Dumbbell,
  Bus,
} from "lucide-react";
import { parentSummary, childInfo, performanceAlerts, upcomingTests, parentNotifications } from "./data";

export default function ParentHomeTab() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(() => new Set());
  const pageSize = 4;

  const categories = useMemo(
    () => ["all", ...new Set(parentNotifications.map((notification) => notification.category))],
    []
  );

  const sources = useMemo(
    () => ["all", ...new Set(parentNotifications.map((notification) => notification.sourceRole))],
    []
  );

  const filteredNotifications = useMemo(() => {
    return parentNotifications
      .filter((notification) => (categoryFilter === "all" ? true : notification.category === categoryFilter))
      .filter((notification) => (sourceFilter === "all" ? true : notification.sourceRole === sourceFilter))
      .filter((notification) => (priorityFilter === "all" ? true : notification.priority === priorityFilter))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [categoryFilter, sourceFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = parentNotifications.filter((notification) => !readIds.has(notification.id)).length;

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function markAsRead(id) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function markVisibleAsRead() {
    setReadIds((prev) => {
      const next = new Set(prev);
      paginatedNotifications.forEach((notification) => next.add(notification.id));
      return next;
    });
  }

  function getSourceIcon(sourceRole) {
    if (sourceRole === "Principal") return <School className="h-4 w-4" />;
    if (sourceRole === "PET") return <Dumbbell className="h-4 w-4" />;
    if (sourceRole === "Transport") return <Bus className="h-4 w-4" />;
    return <UserCircle2 className="h-4 w-4" />;
  }

  function getPriorityTone(priority) {
    if (priority === "high") return "border-rose-200 bg-rose-50 text-rose-700";
    if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

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

      {/* Announcements & Notifications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#c79216]" />
              ANNOUNCEMENTS & NOTIFICATIONS
            </h3>
            <p className="mt-1 text-xs text-slate-500">Important updates from principal, teachers, PET, transport and school teams</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
              Total: {parentNotifications.length}
            </span>
            <span className="rounded-full bg-[#fff6e6] px-3 py-1 font-semibold text-[#9a6b12]">
              Unread: {unreadCount}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => updateFilter(setCategoryFilter, e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#c79216] focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All categories" : category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500">Source</span>
            <select
              value={sourceFilter}
              onChange={(e) => updateFilter(setSourceFilter, e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#c79216] focus:outline-none"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === "all" ? "All sources" : source}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => updateFilter(setPriorityFilter, e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#c79216] focus:outline-none"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <button
            type="button"
            onClick={markVisibleAsRead}
            className="mt-6 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mark current page as read
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {paginatedNotifications.map((notification) => {
            const isRead = readIds.has(notification.id);
            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isRead ? "border-slate-200 bg-slate-50" : "border-[#f0d9a2] bg-[#fffaf0]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                        {getSourceIcon(notification.sourceRole)}
                        {notification.sourceRole}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${getPriorityTone(notification.priority)}`}
                      >
                        {notification.priority}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                        {notification.category}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900">{notification.title}</h4>
                    <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      By {notification.sourceName} • {new Date(notification.date).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!isRead && <span className="h-2.5 w-2.5 rounded-full bg-[#c79216]" />}
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      disabled={isRead}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 enabled:hover:bg-slate-100 disabled:cursor-default disabled:opacity-60"
                    >
                      {isRead ? "Read" : "Mark read"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#c79216] px-2 py-1 text-xs font-semibold text-white hover:bg-[#b68514]"
                    >
                      {notification.actionLabel}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {paginatedNotifications.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No notifications match the selected filters.
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-slate-600">
            Showing {filteredNotifications.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredNotifications.length)} of {filteredNotifications.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-slate-700 font-semibold">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 enabled:hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
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
