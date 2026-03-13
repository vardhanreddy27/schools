import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Admin_login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCredentialsLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      userId,
      password,
      redirect: false,
      callbackUrl: "/Admindashboard",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }

    window.location.href = result?.url || "/Admindashboard";
  }

  function handleGooglePlaceholder() {
    setErrorMessage("Google sign-in will be enabled soon.");
  }

  return (
    <div className="min-h-dvh w-full bg-white md:min-h-screen md:bg-gray-100 md:flex md:items-center md:justify-center md:p-6">
<div className="w-full min-h-dvh overflow-hidden bg-white shadow-none md:min-h-[650px] md:grid md:max-w-6xl md:grid-cols-2 md:rounded-3xl md:shadow-[0_25px_80px_-28px_rgba(37,99,235,0.45)]">        <div className="relative overflow-hidden bg-gradient-to-b from-blue-700 to-blue-500 px-6 pb-14 pt-10 text-white sm:px-8 md:px-10 md:py-14">
          <div className="relative z-10 mx-auto max-w-[260px] text-center md:mt-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="School Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-4xl font-semibold tracking-tight">Nagarjuna Model School</h1>
            <p className="mt-4 text-sm/6 text-blue-100">
              Primary and Secondary Education Kadapa, Andhra Pradesh
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/90 to-transparent md:h-56" />
        </div>

        <div className="px-5 pb-8 pt-6 sm:px-7 md:flex md:items-center md:px-10 md:py-12">
          <form className="w-full space-y-4" onSubmit={handleCredentialsLogin}>
            <div className="mb-1">
              <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>
              <p className="mt-1 text-sm text-slate-500">Welcome back, admin.</p>
            </div>

            <div>
              <label htmlFor="userId" className="text-sm font-medium text-slate-600">
                User ID
              </label>
              <input
                id="userId"
                type="text"
                placeholder="Enter your user id"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {errorMessage ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-300" />
              <span className="text-xs font-semibold tracking-wider text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-300" />
            </div>

     <button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/Admindashboard" })}
  className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
>
 <svg width="20" height="20" viewBox="0 0 48 48">
  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
  <path fill="#4CAF50" d="M24 44c5.1 0 9.7-2 13.2-5.3l-6.1-5c-2 1.5-4.6 2.3-7.1 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.7 39.7 16.3 44 24 44z"/>
  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.6 6.7l6.1 5C39.5 36.1 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"/>
</svg>

  Sign in with Google
</button>

            <p className="text-center text-xs text-slate-500 md:text-sm">
              Secure access for authorized users only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/Admindashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}