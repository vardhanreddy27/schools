import Image from "next/image";

export default function TeacherHeroCard({
  displayName = "Harika",
  subject = "English",
  classesToday = 4,
  avatarSrc = "/teacher.avif",
}) {
  return (
    <article className="rounded-[28px] bg-[#eef4fb] p-4 mx-3 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.28)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
              <Image src="/logo.png" alt="NMS Logo" width={38} height={38} className="object-contain" priority />
            </div>
            <div>
              <p className="text-2xl font-black tracking-[0.18em] text-slate-900">NMS</p>
              <p className="text-sm text-slate-500">Teacher Workspace</p>
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome, {displayName}</h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Subject: {subject || "English"}
            </span>
            <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {classesToday} classes today
            </span>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-full p-0.5 transition-transform duration-150 active:scale-95"
          aria-label="Open profile"
        >
          <Image
            src={avatarSrc}
            alt="Teacher profile"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200"
          />
        </button>
      </div>
    </article>
  );
}