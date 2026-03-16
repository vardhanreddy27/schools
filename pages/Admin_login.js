import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Swal from "sweetalert2";

export default function Admin_login() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unauthorizedMessage = router.query.error === "UnauthorizedEmail"
    ? "This email is not authorized for admin access."
    : "";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query.error === "UnauthorizedEmail") {
      Swal.fire({
        icon: "error",
        title: "Access denied",
        text: unauthorizedMessage,
        confirmButtonColor: "#f2b705",
      });
    }
  }, [router.isReady, router.query.error, unauthorizedMessage]);

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
      Swal.fire({
        icon: "error",
        title: "Sign in failed",
        text: result.error,
        confirmButtonColor: "#f2b705",
      });
      return;
    }

    window.location.href = result?.url || "/Admindashboard";
  }

  function handleGooglePlaceholder() {
    setErrorMessage("Google sign-in will be enabled soon.");
  }

  return (
    <div className="min-h-dvh w-full bg-white md:min-h-screen md:bg-gray-100 md:flex md:items-center md:justify-center md:p-6">
      <div className="grid min-h-dvh w-full grid-rows-[0.92fr_1.08fr] bg-white px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+1.75rem)] md:hidden">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.16)] ring-1 ring-slate-200 overflow-hidden">
              <Image
                src="/logo.png"
                alt="School Logo"
                width={58}
                height={58}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="mt-5 text-[2rem] font-semibold tracking-tight text-slate-950">NMS Admin Login</h1>
            <p className="mt-2 text-sm text-slate-500">Secure sign in for authorized staff</p>
          </div>
        </div>

        <div className="flex items-start justify-center">
          <form
            className="w-full max-w-sm rounded-[2rem]  bg-white p-5 "
            onSubmit={handleCredentialsLogin}
          >
           

            <div className="space-y-4">
              <div>
                <label htmlFor="userId" className="text-sm font-medium text-slate-600">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  placeholder="Enter your user id"
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
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
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {errorMessage ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-[#f2b705] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.8)] hover:bg-[#d9a300] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#f3da84]"
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

              <p className="text-center text-xs text-slate-500">Secure access for authorized users only.</p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden w-full overflow-hidden bg-white shadow-none md:min-h-[650px] md:grid md:max-w-6xl md:grid-cols-2 md:rounded-3xl md:border md:border-slate-200 md:shadow-[0_24px_70px_-44px_rgba(15,23,42,0.22)]">
        <div className="relative overflow-hidden bg-white px-6 pb-14 pt-10 text-slate-900 sm:px-8 md:flex md:items-center md:px-10 md:py-14">
          <div className="relative z-10 mx-auto max-w-[280px] text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.16)] ring-1 ring-slate-200 overflow-hidden">
              <Image
                src="/logo.png"
                alt="School Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Nagarjuna Model School</h1>
            <p className="mt-4 text-sm/6 text-slate-600">
              Primary and Secondary Education Kadapa, Andhra Pradesh
            </p>
          </div>
        </div>

        <div className="px-5 pb-8 pt-6 sm:px-7 md:flex md:items-center md:px-10 md:py-12">
          <form className="w-full space-y-4" onSubmit={handleCredentialsLogin}>
            <div className="mb-1">
              <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>
              <p className="mt-1 text-sm text-slate-500">Welcome back, admin.</p>
            </div>

            <div>
              <label htmlFor="userId-desktop" className="text-sm font-medium text-slate-600">
                User ID
              </label>
              <input
                id="userId-desktop"
                type="text"
                placeholder="Enter your user id"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password-desktop" className="text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                id="password-desktop"
                type="password"
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#f2b705] focus:ring-4 focus:ring-[#fff2c7]"
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
              className="w-full rounded-full bg-[#f2b705] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.75)] hover:bg-[#d9a300] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#f3da84]"
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
              className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
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