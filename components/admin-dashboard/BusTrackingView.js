import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

const ParentBusTrackingMap = dynamic(() => import("@/components/parent-dashboard/ParentBusTrackingMap"), {
  ssr: false,
});

export default function BusTrackingView({ onBackToOverview }) {
  return (
    <section className="relative min-h-[calc(100dvh-7rem)] overflow-hidden bg-white">
      <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-1 shadow-sm r">
        <button
          type="button"
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1  px-3 py-1.5 font-bold "
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">Track Buses</h1>
        </div>
        <span aria-hidden className="h-8 w-14" />
      </div>

      <div className="overflow-hidden bg-white">
        <ParentBusTrackingMap />
      </div>
    </section>
  );
}
