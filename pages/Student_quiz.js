import { useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function StudentQuizPage() {
  const router = useRouter();
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const subject = typeof router.query.subject === "string" && router.query.subject ? router.query.subject : "General";

  const gameUrl = useMemo(() => {
    const url = new URL("https://rizzrunner.vercel.app/");
    url.searchParams.set("subject", subject);
    url.searchParams.set("source", "nms-student-pwa");
    return url.toString();
  }, [subject]);

  return (
    <main className="fixed inset-0 h-dvh w-full overflow-hidden bg-black">
      {!isFrameLoaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-sm text-slate-300">
          Loading {subject} quiz...
        </div>
      ) : null}

      <iframe
        title="RizzRunner Quiz"
        src={gameUrl}
        onLoad={() => setIsFrameLoaded(true)}
        className={`absolute inset-0 h-dvh w-screen border-0 ${isFrameLoaded ? "block" : "hidden"}`}
        allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </main>
  );
}
