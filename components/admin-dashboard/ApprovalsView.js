import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";

function statusClass(status) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700";
  if (status === "Rejected") return "bg-red-50 text-red-700";
  return "bg-[#fff8dc] text-[#8b6400]";
}

export default function ApprovalsView({ leaveRequests, onDecision }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const summary = useMemo(() => {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };
    leaveRequests.forEach((item) => {
      counts[item.status] += 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: name === "Approved" ? "#fbbf24" : name === "Pending" ? "#8b6400" : "#ef4444",
    }));
  }, [leaveRequests]);

  const filteredRequests = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return leaveRequests;
    }

    return leaveRequests.filter((item) => {
      return [item.name, item.role, item.staffType, item.leaveType, item.status].join(" ").toLowerCase().includes(term);
    });
  }, [leaveRequests, query]);

  const totalPages = Math.max(Math.ceil(filteredRequests.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, safePage]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Leave approvals</p>
        <h2 className="mt-1 text-2xl font-semibold">Teachers and non-teaching staff</h2>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by staff name, role, leave type or status"
            className="min-w-[16rem] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-[#f7e2a3] focus:ring"
          />
          <span className="rounded-full bg-[#fff8dc] px-3 py-1 text-xs font-semibold text-[#8b6400]">{filteredRequests.length} requests</span>
        </div>

        <div className="mt-4 space-y-3">
          {pageRows.map((request) => (
            <div key={request.id} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{request.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {request.role} • {request.staffType} • {request.leaveType} • {request.days} day(s)
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{request.startDate} to {request.endDate}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
                    {request.status}
                  </span>
                  {request.status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onDecision(request.id, "Approved")}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onDecision(request.id, "Rejected")}
                        className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </article>

      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Approval summary</p>
        <h2 className="mt-1 text-xl font-semibold">Current status</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2 text-sm text-slate-600 sm:flex-1">
            {summary.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>
                    {item.name} {item.name === "Approved" ? "(Blue)" : item.name === "Pending" ? "(Amber)" : "(Red)"}
                  </span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="h-52 w-full shrink-0 sm:h-52 sm:w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary} dataKey="value" innerRadius={40} outerRadius={72} stroke="none">
                  {summary.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>
    </section>
  );
}
