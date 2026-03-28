import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Swal from "sweetalert2";
import { signIn, useSession } from "next-auth/react";

const roleTabs = [
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

export default function FamilyLogin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeRole, setActiveRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.userType === "teacher") {
      router.push("/Teacherdashboard");
      return;
    }
    if (session?.user?.userType === "admin") {
      router.push("/Admindashboard");
      return;
    }
    if (session?.user?.userType === "parent") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("familyDashboardRole", "parent");
      }
      router.push("/Studentdashboard");
    }
  }, [session, router]);

  async function handleLogin(event) {
    event.preventDefault();

    if (!userId.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Enter details",
        text: `Please enter ${activeRole} ID and password.`,
        confirmButtonColor: "#c79216",
      });
      return;
    }

    setIsSubmitting(true);

    const studentProfile = {
      name: `Student ${userId.trim().slice(-2) || "01"}`,
      className: "8th",
      section: "A",
      rollNumber: userId.trim(),
      parentName: "Parent",
      contact: "+91 9XXXXXXXXX",
    };

    const parentProfile = {
      parentName: `Parent ${userId.trim().slice(-2) || "01"}`,
      contact: "+91 9XXXXXXXXX",
      childName: "Arjun Kumar",
      childClass: "8th",
      childSection: "A",
      childRollNumber: userId.trim(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem("familyDashboardRole", activeRole);

      if (activeRole === "student") {
        window.localStorage.setItem("studentProfile", JSON.stringify(studentProfile));
      } else {
        window.localStorage.setItem("parentProfile", JSON.stringify(parentProfile));
      }
    }

    setIsSubmitting(false);
    router.push("/Studentdashboard");
  }

  async function handleGoogleLogin() {
    setIsSubmitting(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("familyDashboardRole", activeRole);
    }

    const googleResult = await signIn("google", {
      redirect: false,
      callbackUrl: "/Studentdashboard",
    });

    setIsSubmitting(false);

    if (googleResult?.error) {
      Swal.fire({
        icon: "error",
        title: "Google sign in failed",
        text: "Unable to sign in with Google. Please try again.",
        confirmButtonColor: "#c79216",
      });
      return;
    }

    window.location.href = googleResult?.url || "/Studentdashboard";
  }

  return (
    <div className="min-h-dvh w-full bg-white md:min-h-screen md:bg-gray-100 md:flex md:items-center md:justify-center md:p-6">
      <div className="hidden w-full overflow-hidden bg-white shadow-none md:grid md:min-h-162.5 md:max-w-6xl md:grid-cols-2 md:rounded-3xl md:border md:border-slate-200 md:shadow-[0_24px_70px_-44px_rgba(15,23,42,0.22)]">
        <div className="relative overflow-hidden bg-white px-6 pb-14 pt-10 text-slate-900 sm:px-8 md:flex md:items-center md:px-10 md:py-14">
          <div className="relative z-10 mx-auto max-w-70 text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-4xl bg-white">
              <Image src="/logo.png" alt="School Logo" width={60} height={60} className="object-contain" priority />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Nagarjuna Model School</h1>
            <p className="mt-4 text-sm/6 text-slate-600">Single family access for both student and parent.</p>
          </div>
        </div>

        <div className="px-5 pb-8 pt-6 sm:px-7 md:flex md:items-center md:px-10 md:py-12">
          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="mb-1">
              <h2 className="text-2xl font-semibold text-slate-900">Family Sign In</h2>
              <p className="mt-1 text-sm text-slate-500">One login for student and parent.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              {roleTabs.map((roleItem) => (
                <button
                  key={roleItem.id}
                  type="button"
                  onClick={() => setActiveRole(roleItem.id)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    activeRole === roleItem.id ? "bg-[#c79216] text-white" : "text-slate-600"
                  }`}
                >
                  {roleItem.label}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="family-id" className="text-sm font-medium text-slate-600">
                {activeRole === "student" ? "Student ID" : "Parent ID"}
              </label>
              <input
                id="family-id"
                type="text"
                placeholder={activeRole === "student" ? "Enter student ID" : "Enter parent ID"}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="family-password" className="text-sm font-medium text-slate-600">Password</label>
              <input
                id="family-password"
                type="password"
                placeholder="Enter password"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#c79216] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.75)] hover:bg-[#b07e10] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#d6b56a]"
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
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.1 0 9.7-2 13.2-5.3l-6.1-5c-2 1.5-4.6 2.3-7.1 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.7 39.7 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.6 6.7l6.1 5C39.5 36.1 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="text-center text-xs text-slate-500 md:text-sm">Single secure family access.</p>
          </form>
        </div>
      </div>

      <div className="grid min-h-dvh w-full grid-rows-[0.92fr_1.08fr] bg-white px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+1.75rem)] md:hidden">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-4xl bg-white">
              <Image src="/logo.png" alt="School Logo" width={58} height={58} className="object-contain" priority />
            </div>
            <h1 className="mt-5 text-[2rem] font-semibold tracking-tight text-slate-950">NMS Family Login</h1>
            <p className="mt-2 text-sm text-slate-500">One login for student and parent</p>
          </div>
        </div>

        <div className="flex items-start justify-center">
          <form className="w-full max-w-sm rounded-4xl bg-white p-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                {roleTabs.map((roleItem) => (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => setActiveRole(roleItem.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      activeRole === roleItem.id ? "bg-[#c79216] text-white" : "text-slate-600"
                    }`}
                  >
                    {roleItem.label}
                  </button>
                ))}
              </div>

              <div>
                <label htmlFor="family-id-mobile" className="text-sm font-medium text-slate-600">
                  {activeRole === "student" ? "Student ID" : "Parent ID"}
                </label>
                <input
                  id="family-id-mobile"
                  type="text"
                  placeholder={activeRole === "student" ? "Enter student ID" : "Enter parent ID"}
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
                  autoComplete="username"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="family-password-mobile" className="text-sm font-medium text-slate-600">Password</label>
                <input
                  id="family-password-mobile"
                  type="password"
                  placeholder="Enter password"
                  className="mt-1.5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#c79216] focus:ring-4 focus:ring-[#fff4d6]"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#c79216] py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(242,183,5,0.8)] hover:bg-[#b07e10] focus:outline-none focus:ring-4 focus:ring-[#f7e2a3] disabled:cursor-not-allowed disabled:bg-[#d6b56a]"
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
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.5 6.1 29 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.1 0 9.7-2 13.2-5.3l-6.1-5c-2 1.5-4.6 2.3-7.1 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.7 39.7 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.6 6.7l6.1 5C39.5 36.1 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
