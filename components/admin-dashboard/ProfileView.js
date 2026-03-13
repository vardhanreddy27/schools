export default function ProfileView({ profileForm, onProfileChange, onProfileSave, profileSaving, profileMessage }) {
  return (
    <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Profile</p>
        <h2 className="mt-1 text-2xl font-semibold">Editable details</h2>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-name">Name</label>
            <input id="profile-name" name="name" value={profileForm.name} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-email">Email</label>
            <input id="profile-email" name="email" type="email" value={profileForm.email} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-number">Number</label>
            <input id="profile-number" name="number" value={profileForm.number} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-role">Role</label>
            <input id="profile-role" name="role" readOnly value={profileForm.role} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900" />
          </div>

          {profileMessage ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p>
          ) : null}

          <button type="submit" disabled={profileSaving} className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
            {profileSaving ? "Saving..." : "Update profile"}
          </button>
        </form>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Principal usage shortcuts</p>
        <h2 className="mt-1 text-2xl font-semibold">Quick actions</h2>
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Attendance checks: morning and evening windows</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Leave approvals with start and end date</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Send broadcast to teachers, students and parents</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Track syllabus and teacher performance</div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">Review events, calendar, timetable and auto-substitute status</div>
        </div>
      </article>
    </section>
  );
}
