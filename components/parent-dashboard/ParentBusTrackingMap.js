import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { Bus } from "lucide-react";

const SCHOOL_LOCATION = {
  name: "Quantum Heights School, Kadapa",
  position: [14.4728, 78.8236],
};

const BUS_ROUTES = [
  {
    id: "AP032244",
    name: "Bus 1 - YV Street",
    color: "#0ea5e9",
    speed: 0.00045,
    path: [
      [14.4481, 78.8515],
      [14.4569, 78.8442],
      [14.4637, 78.8369],
      [14.4682, 78.8309],
      [14.4728, 78.8236],
    ],
  },
  {
    id: "AP032245",
    name: "Bus 2 - NGO Colony",
    color: "#f97316",
    speed: 0.00042,
    path: [
      [14.4896, 78.8155],
      [14.4839, 78.8178],
      [14.4781, 78.8198],
      [14.4749, 78.8216],
      [14.4728, 78.8236],
    ],
  },
  {
    id: "AP032246",
    name: "Bus 3 - Mariyapuram",
    color: "#16a34a",
    speed: 0.0005,
    path: [
      [14.4631, 78.7908],
      [14.4665, 78.8016],
      [14.4691, 78.8108],
      [14.4709, 78.8179],
      [14.4728, 78.8236],
    ],
  },
  {
    id: "AP032247",
    name: "Bus 4 - Chinna Chowk",
    color: "#a855f7",
    speed: 0.00044,
    path: [
      [14.4779, 78.8486],
      [14.4766, 78.8404],
      [14.4752, 78.8342],
      [14.4739, 78.8284],
      [14.4728, 78.8236],
    ],
  },
];

const TOTAL_BUSES = BUS_ROUTES.length;
const AVG_BUS_SPEED_MPS = 7.5;
const ROUTE_CACHE_KEY = "qh-bus-road-routes-v1";

function segmentDistance(a, b) {
  const latDiff = b[0] - a[0];
  const lonDiff = b[1] - a[1];
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function interpolateOnPath(path, progress) {
  if (!path || path.length < 2) return path?.[0] || SCHOOL_LOCATION.position;

  const distances = [];
  let total = 0;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const len = segmentDistance(path[idx], path[idx + 1]);
    distances.push(len);
    total += len;
  }

  if (total === 0) return path[0];

  const target = progress * total;
  let walked = 0;

  for (let idx = 0; idx < distances.length; idx += 1) {
    const seg = distances[idx];
    if (walked + seg >= target) {
      const ratio = (target - walked) / seg;
      const start = path[idx];
      const end = path[idx + 1];
      return [
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio,
      ];
    }
    walked += seg;
  }

  return path[path.length - 1];
}

function getRemainingPath(path, progress, currentPosition) {
  if (!path || path.length < 2) return currentPosition ? [currentPosition] : [];

  const distances = [];
  let total = 0;

  for (let idx = 0; idx < path.length - 1; idx += 1) {
    const len = segmentDistance(path[idx], path[idx + 1]);
    distances.push(len);
    total += len;
  }

  if (total === 0) return currentPosition ? [currentPosition] : [path[0]];

  const target = progress * total;
  let walked = 0;

  for (let idx = 0; idx < distances.length; idx += 1) {
    const seg = distances[idx];
    if (walked + seg >= target) {
      return currentPosition ? [currentPosition, ...path.slice(idx + 1)] : path.slice(idx);
    }
    walked += seg;
  }

  return currentPosition ? [currentPosition] : [path[path.length - 1]];
}

function degreesToMeters(deg) {
  return deg * 111000;
}

function formatEta(distanceMeters, speedDegPerTick) {
  const metersPerSecond = Math.max(1, AVG_BUS_SPEED_MPS);
  const seconds = Math.max(1, Math.round(distanceMeters / metersPerSecond));

  if (seconds < 60) return `${seconds}s`;
  return `${Math.ceil(seconds / 60)}m`;
}

async function fetchRoadRoute(path, signal) {
  if (!Array.isArray(path) || path.length < 2) {
    throw new Error("Invalid base path");
  }
  const coordList = path.map(([lat, lon]) => `${lon},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordList}?overview=full&geometries=geojson&continue_straight=false`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Unable to fetch routed path");
  }

  const payload = await response.json();
  const coordinates = payload?.routes?.[0]?.geometry?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("Invalid routed path response");
  }

  return coordinates.map(([lon, lat]) => [lat, lon]);
}

async function fetchRoadRouteWithRetry(path, signal, retries = 2) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fetchRoadRoute(path, signal);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Road route unavailable");
}

function createBusIcon(color) {
  return divIcon({
    className: "bus-marker-wrap",
    html: `<span class="bus-marker" style="--bus-accent:${color}"><img src="/schoolbus.png" alt="Bus" class="bus-marker-image" /></span>`,
    iconSize: [44, 34],
    iconAnchor: [22, 17],
  });
}

function createSchoolIcon() {
  return divIcon({
    className: "school-marker-wrap",
    html: '<span class="school-marker">🏫</span>',
    iconSize: [36, 36],
    iconAnchor: [18, 34],
  });
}

export default function ParentBusTrackingMap() {
  const [routedPaths, setRoutedPaths] = useState(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const cached = window.localStorage.getItem(ROUTE_CACHE_KEY);
      if (!cached) {
        return {};
      }

      const parsed = JSON.parse(cached);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const [progress, setProgress] = useState(() =>
    Object.fromEntries(BUS_ROUTES.map((route, idx) => [route.id, (idx * 0.22) % 0.9]))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = { ...prev };
        BUS_ROUTES.forEach((route) => {
          const current = prev[route.id] ?? 0;
          next[route.id] = current >= 1 ? 1 : Math.min(1, current + route.speed);
        });
        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoutes() {
      const routeEntries = await Promise.all(
        BUS_ROUTES.map(async (route) => {
          try {
            const roadPath = await fetchRoadRouteWithRetry(route.path, controller.signal);
            return [route.id, roadPath];
          } catch {
            return [route.id, null];
          }
        })
      );

      if (!controller.signal.aborted) {
        setRoutedPaths((prev) => {
          const merged = { ...prev };

          routeEntries.forEach(([routeId, roadPath]) => {
            if (Array.isArray(roadPath) && roadPath.length > 1) {
              merged[routeId] = roadPath;
            }
          });

          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(ROUTE_CACHE_KEY, JSON.stringify(merged));
            } catch {
              // ignore cache errors silently
            }
          }

          return merged;
        });
      }
    }

    loadRoutes();

    return () => controller.abort();
  }, []);

  const liveBuses = useMemo(() => {
    return BUS_ROUTES.map((route) => {
      const roadPath = routedPaths[route.id] || null;
      const effectivePath = roadPath || route.path;
      const p = progress[route.id] ?? 0;
      const position = interpolateOnPath(effectivePath, p);
      const destination = SCHOOL_LOCATION.position;
      const distance = segmentDistance(position, destination) * 111000;

      return {
        ...route,
        effectivePath,
        roadPath,
        progress: p,
        position,
        distance,
        eta: formatEta(distance, route.speed),
        remainingPath: getRemainingPath(effectivePath, p, position),
      };
    });
  }, [progress, routedPaths]);

  const schoolIcon = useMemo(() => createSchoolIcon(), []);

  return (
    <div className="flex h-[90vh] min-h-0 flex-col overflow-hidden border border-slate-200 bg-white">
      <section className="relative min-h-0 basis-[54%] overflow-hidden bg-slate-100">
        <div className="pointer-events-none absolute left-2 right-2 top-2 z-10 flex items-start justify-between gap-3 rounded-3xl bg-white/90 px-4 py-3 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live Bus Network</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">Quantum Heights School, Kadapa</h4>
            <p className="mt-1 text-[11px] font-medium text-slate-500">{TOTAL_BUSES} active buses</p>
          </div>
        
        </div>

        <MapContainer
          center={SCHOOL_LOCATION.position}
          zoom={13}
          minZoom={11}
          maxZoom={18}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <Marker position={SCHOOL_LOCATION.position} icon={schoolIcon}>
            <Popup>
              <div className="min-w-44">
                <p className="font-semibold">{SCHOOL_LOCATION.name}</p>
                <p className="text-xs text-slate-600">Main destination for all active buses</p>
              </div>
            </Popup>
          </Marker>

          {liveBuses.map((bus) => {
            if (!bus?.remainingPath || bus.remainingPath.length < 2) {
              return null;
            }

            return (
              <>
                <Polyline
                  key={`remaining-${bus.id}`}
                  positions={bus.remainingPath}
                  pathOptions={{
                    color: bus.color,
                    weight: 4,
                    opacity: 0.82,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              </>
            );
          })}

          {liveBuses.map((bus) => (
            <Marker key={bus.id} position={bus.position} icon={createBusIcon(bus.color)}>
              <Popup>
                <div className="min-w-48">
                  <p className="font-semibold">{bus.name}</p>
                  <p className="text-xs text-slate-600">ETA to school: {bus.eta}</p>
                  <p className="text-xs text-slate-500">Distance left: {(bus.distance / 1000).toFixed(1)} km</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <section className="flex min-h-0 basis-[46%] flex-col gap-4 overflow-y-auto bg-white px-4 pb-8 pt-4 sm:px-5 sm:pb-10 no-scrollbar">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" />

        <div className="rounded-[28px] to-white  py-4 text-slate-950 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.22)] sm:px-5 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">All Buses</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Heading to Quantum Heights School</h3>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {liveBuses.map((bus) => {
              const etaNumber = Number.parseInt(bus.eta, 10);
              const etaUnit = bus.eta.includes("s") ? "sec" : "min";
              return (
                <button
                  key={`summary-${bus.id}`}
                  type="button"
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Bus Number</p>
                      <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">{bus.id}</p>
                      <p className="mt-1 text-sm text-slate-600">{bus.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="mt-1 inline-flex min-w-16 flex-col items-center rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700">
                        <span className="text-2xl font-black leading-none tracking-tight">{Number.isNaN(etaNumber) ? bus.eta : etaNumber}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">{Number.isNaN(etaNumber) ? "" : etaUnit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Next Stop</span>
                      <span className="mt-1 block text-sm font-semibold text-slate-900">Maruthi Nagar</span>
                    </div>
                      </div>

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Bus className="h-3.5 w-3.5" />
                      Live tracking
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">{Math.min(100, Math.round(bus.progress * 100))}% on route</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">School Bound</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">All buses heading to school</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Visible Routes</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Road paths only</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Next Stop</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Maruthi Nagar</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .bus-marker {
          width: 44px;
          height: 34px;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 16px -14px rgba(15, 23, 42, 0.45);
          animation: bus-bob 1s ease-in-out infinite;
          filter: drop-shadow(0 1px 1px rgba(15, 23, 42, 0.35));
        }

        .bus-marker-image {
          width: 44px;
          height: 28px;
          object-fit: contain;
          display: block;
          transform: translateY(-1px);
        }

        .school-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          line-height: 1;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #dbeafe;
        }

        .leaflet-control-attribution {
          font-size: 9px;
          opacity: 0.72;
          background: rgba(255, 255, 255, 0.72) !important;
          border-radius: 8px;
          margin: 0 6px 6px 0 !important;
          padding: 2px 6px !important;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes bus-bob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
