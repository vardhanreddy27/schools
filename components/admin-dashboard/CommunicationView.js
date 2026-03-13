import { notices, syllabusBySection, teacherPerformance } from "@/components/admin-dashboard/data";

export default function CommunicationView({ broadcastMessages, onBroadcastInputChange, onBroadcastSend, broadcastForm }) {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Communication</p>
        <h2 className="mt-1 text-2xl font-semibold">Send message to apps</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onBroadcastSend();
          }}
        >
          <select
            name="audience"
            value={broadcastForm.audience}
            onChange={onBroadcastInputChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="Teachers">Teachers</option>
            <option value="Students">Students</option>
            <option value="Parents">Parents</option>
          </select>
          <textarea
            name="message"
            value={broadcastForm.message}
            onChange={onBroadcastInputChange}
            placeholder="Type principal message..."
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Send message</button>
        </form>

        <div className="mt-5 space-y-3">
          {broadcastMessages.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.audience}</p>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {notices.map(({ audience, icon: Icon, sentToday }) => (
            <div key={audience} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-800">{audience}</span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{sentToday}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">Teacher performance</p>
        <h2 className="mt-1 text-2xl font-semibold">Daily teaching effectiveness</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Teacher</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Attendance</th>
                <th className="px-3 py-2 font-medium">Syllabus</th>
                <th className="px-3 py-2 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {teacherPerformance.map((row) => (
                <tr key={row.name} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-3 py-3 text-slate-700">{row.subject}</td>
                  <td className="px-3 py-3 text-slate-700">{row.attendance}</td>
                  <td className="px-3 py-3 text-slate-700">{row.syllabus}</td>
                  <td className="px-3 py-3 text-slate-700">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-sm text-slate-500">Syllabus completion</p>
        <h2 className="mt-1 text-xl font-semibold">Subject wise per section</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Section</th>
                <th className="px-3 py-2 font-medium">Math</th>
                <th className="px-3 py-2 font-medium">Science</th>
                <th className="px-3 py-2 font-medium">English</th>
                <th className="px-3 py-2 font-medium">Social</th>
              </tr>
            </thead>
            <tbody>
              {syllabusBySection.map((row) => (
                <tr key={row.section} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.section}</td>
                  <td className="px-3 py-3 text-slate-700">{row.Mathematics}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.Science}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.English}%</td>
                  <td className="px-3 py-3 text-slate-700">{row.Social}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
