import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";

function statusClass(status) {
  if (status === "Approved") return "bg-emerald-50 text-emerald-700";
  if (status === "Rejected") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function ApprovalsView({ leaveRequests, onDecision }) {
  const summary = useMemo(() => {
    const counts = { Approved: 0, Pending: 0, Rejected: 0 };
    leaveRequests.forEach((item) => {
      counts[item.status] += 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: name === "Approved" ? "#2563eb" : name === "Pending" ? "#f59e0b" : "#ef4444",
    }));
  }, [leaveRequests]);

  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Leave approvals</p>
        <h2 className="mt-1 text-2xl font-semibold">Teachers and non-teaching staff</h2>

        <div className="mt-4 space-y-3">
          {leaveRequests.map((request) => (
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
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Approval summary</p>
        <h2 className="mt-1 text-xl font-semibold">Current status</h2>
        <div className="mt-4 min-w-0 min-h-[14rem] h-56">
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
        <div className="mt-4 space-y-2 text-sm text-slate-600">
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
      </article>
    </section>
  );
}
