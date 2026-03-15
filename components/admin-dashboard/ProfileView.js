export default function ProfileView({ profileForm, onProfileChange, onProfileSave, profileSaving, profileMessage, onLogout }) {
  return (
    <section className="mt-4">
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
            <input id="profile-name" name="name" value={profileForm.name} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-email">Email</label>
            <input id="profile-email" name="email" type="email" value={profileForm.email} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-number">Number</label>
            <input id="profile-number" name="number" value={profileForm.number} onChange={onProfileChange} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-role">Role</label>
            <input id="profile-role" name="role" readOnly value={profileForm.role} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900" />
          </div>

          {profileMessage ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="submit" disabled={profileSaving} className="w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300] disabled:cursor-not-allowed disabled:bg-[#f3da84]">
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </form>
      </article>


    </section>
  );
}
