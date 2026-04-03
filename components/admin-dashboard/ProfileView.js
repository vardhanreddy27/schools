export default function ProfileView({
  open,
  onClose,
  profileForm,
  onProfileChange,
  onProfileSave,
  profileSaving,
  profileMessage,
  onLogout,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Profile</p>
            <h2 className="text-2xl font-semibold text-slate-900">Editable details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close profile popup"
          >
            ×
          </button>
        </div>

        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onProfileSave();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-name">
              Name
            </label>
            <input
              id="profile-name"
              name="name"
              value={profileForm.name}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-email">
              Email
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-number">
              Number
            </label>
            <input
              id="profile-number"
              name="number"
              value={profileForm.number}
              onChange={onProfileChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#16c7bd] focus:ring-4 focus:ring-[#fff4d6]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600" htmlFor="profile-role">
              Role
            </label>
            <input
              id="profile-role"
              name="role"
              readOnly
              value={profileForm.role}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900"
            />
          </div>

          {profileMessage ? (
            <p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {profileMessage}
            </p>
          ) : null}

          <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-2xl bg-[#16c7bd] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12a79f] disabled:cursor-not-allowed disabled:bg-[#8fded8]"
            >
              {profileSaving ? "Saving..." : "Update profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
