import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#eef3fb] px-4 py-8 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white ring-1 ring-slate-200">
          <Image src="/logo.png" alt="NMS" width={56} height={56} className="object-contain" priority />
        </div>
        <h1 className="mt-5 text-center text-3xl font-semibold text-slate-950 sm:text-4xl">Nagarjuna Model School</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Choose your portal to continue.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/Admin_login" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-[#fff4d6]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Admin</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Admin login</p>
            <p className="mt-1 text-sm text-slate-600">Principal and administration access.</p>
          </Link>

          <Link href="/Teacher_login" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-[#fff4d6]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Teacher</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Teacher login</p>
            <p className="mt-1 text-sm text-slate-600">Classes, attendance and academic tools.</p>
          </Link>

          <Link href="/Student_login" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-[#fff4d6]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Student</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Student login</p>
            <p className="mt-1 text-sm text-slate-600">Schedule, attendance and academic progress.</p>
          </Link>

          <Link href="/Parent_login" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-[#fff4d6]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Parent</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Parent login</p>
            <p className="mt-1 text-sm text-slate-600">Monitor child's progress and performance.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
