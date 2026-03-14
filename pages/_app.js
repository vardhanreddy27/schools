import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminInstallContext = router.pathname === "/Admin_login";
  const appTitle = isAdminInstallContext
    ? "NMS ADMIN"
    : "Nagarjuna Model School";
  const manifestPath = isAdminInstallContext
    ? "/manifest-admin.webmanifest"
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
          content="Nagarjuna Model School progressive web app"
        />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={appTitle} />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href={manifestPath} />
        <link rel="icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
