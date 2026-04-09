import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import Head from "next/head";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminInstallContext = router.pathname === "/Admin_login";
  const isTeacherInstallContext = router.pathname === "/Teacher_login" || router.pathname === "/Teacherdashboard";
  const isParentInstallContext = router.pathname === "/Parent_login" || router.pathname === "/Parentdashboard";
  const isStudentInstallContext =
    router.pathname === "/Student_login" ||
    router.pathname === "/Studentdashboard" ||
    router.pathname === "/Student_quiz";
  const appTitle = isAdminInstallContext
    ? "QH ADMIN"
    : isTeacherInstallContext
      ? "QH TEACHERS"
      : isParentInstallContext || isStudentInstallContext
        ? "QH Parents"
      : "Quantum Heights";
  const manifestPath = isAdminInstallContext
    ? "/manifest-admin.webmanifest"
    : isTeacherInstallContext
      ? "/manifest-teacher.webmanifest"
      : isParentInstallContext
        ? "/manifest-parent.webmanifest"
        : isStudentInstallContext
          ? "/manifest-student.webmanifest"
      : "/manifest.webmanifest";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    const registerServiceWorker = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore registration errors silently in production.
      });
    };

    window.addEventListener("load", registerServiceWorker);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>{appTitle}</title>
        <meta name="application-name" content={appTitle} />
        <meta
          name="description"
          content="Quantum Heights progressive web app"
        />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content={appTitle} />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href={manifestPath} />
        <link rel="icon" href="/logo.jpg" />
        <link rel="shortcut icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
