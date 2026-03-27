"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { haversineMeters } from "@/lib/haversine";
import Modal from "@/components/Modal";
import { renderMarkdownToHtml } from "@/lib/markdown";

type PoiApi = {
  id: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  arUrl?: string | null;
  lat: number;
  lng: number;
  createdAt?: string;
};

type Geo = { lat: number; lng: number; acc?: number };

function formatMeters(m: number) {
  if (!Number.isFinite(m)) return "--";
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function bearingDegrees(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

function getGoogleMapsUrl(poi: PoiApi, geo: Geo | null) {
  if (geo) {
    return `https://www.google.com/maps/dir/?api=1&origin=${geo.lat},${geo.lng}&destination=${poi.lat},${poi.lng}&travelmode=walking`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`;
}

const Icons = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  CameraOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2.5-3h4.14" />
      <path d="M14.5 4h-5L7 7H4" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  ),
  Compass: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  List: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Map: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  NavArrow: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2L4.5 20.29C4.24 20.89 4.87 21.5 5.48 21.2L12 18L18.52 21.2C19.13 21.5 19.76 20.89 19.5 20.29L12 2Z" />
    </svg>
  ),
};

export default function TouristAppPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraErr, setCameraErr] = useState<string | null>(null);

  const [geo, setGeo] = useState<Geo | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [headingErr, setHeadingErr] = useState<string | null>(null);

  const [pois, setPois] = useState<PoiApi[]>([]);
  const [loadingPois, setLoadingPois] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activePoi, setActivePoi] = useState<PoiApi | null>(null);

  const [listOpen, setListOpen] = useState(false);
  const [targetPoi, setTargetPoi] = useState<PoiApi | null>(null);

  const compassEnabledRef = useRef(false);
  const compassHandlerRef = useRef<((ev: DeviceOrientationEvent) => void) | null>(null);

  const radiusMeters = 80;

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoadingPois(true);
        const r = await fetch("/api/pois", { cache: "no-store" });
        const data = await r.json().catch(() => null);

        if (!alive) return;

        if (!r.ok || !data?.ok) {
          setPois([]);
          return;
        }

        setPois(Array.isArray(data.pois) ? data.pois : []);
      } catch {
        if (alive) setPois([]);
      } finally {
        if (alive) setLoadingPois(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoErr("GPS indisponível");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy,
        });
        setGeoErr(null);
      },
      () => setGeoErr("Erro ao obter GPS"),
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  async function startCamera() {
    try {
      setCameraErr(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraErr("Câmera não suportada neste navegador");
        return;
      }

      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      }

      if (!stream) {
        setCameraErr("Não foi possível iniciar a câmera");
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      setCameraOn(true);
    } catch (error) {
      console.error("Erro ao iniciar câmera:", error);
      setCameraOn(false);
      setCameraErr("Permissão da câmera negada ou indisponível");
    }
  }

  function stopCamera() {
    const v = videoRef.current;
    if (!v) return;

    const stream = v.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach((t) => t.stop());

    v.srcObject = null;
    setCameraOn(false);
  }

  async function enableCompass() {
    if (compassEnabledRef.current) return;

    try {
      setHeadingErr(null);

      const DeviceOrientationEventIOS = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEventIOS.requestPermission === "function"
      ) {
        const resp = await DeviceOrientationEventIOS.requestPermission();
        if (resp !== "granted") {
          setHeadingErr("Bússola negada");
          return;
        }
      }

      const handler = (ev: DeviceOrientationEvent) => {
        const anyEv = ev as DeviceOrientationEvent & {
          webkitCompassHeading?: number;
        };

        if (typeof anyEv.webkitCompassHeading === "number") {
          setHeading(anyEv.webkitCompassHeading);
        } else if (typeof ev.alpha === "number") {
          setHeading((360 - ev.alpha) % 360);
        }
      };

      compassHandlerRef.current = handler;
      compassEnabledRef.current = true;

      window.addEventListener("deviceorientationabsolute", handler as EventListener, true);
      window.addEventListener("deviceorientation", handler as EventListener, true);
    } catch {
      setHeadingErr("Erro Bússola");
    }
  }

  useEffect(() => {
    return () => {
      const handler = compassHandlerRef.current;
      if (handler) {
        window.removeEventListener("deviceorientationabsolute", handler as EventListener, true);
        window.removeEventListener("deviceorientation", handler as EventListener, true);
      }
    };
  }, []);

  const nearby = useMemo(() => {
    if (!geo) return [];
    return pois
      .map((p) => ({
        poi: p,
        d: haversineMeters(geo.lat, geo.lng, p.lat, p.lng),
      }))
      .sort((a, b) => a.d - b.d);
  }, [geo, pois]);

  const inRange = useMemo(() => {
    return nearby.filter((x) => x.d <= radiusMeters).slice(0, 3);
  }, [nearby]);

  const cityPois = useMemo(() => {
    if (!geo) {
      return pois.map((poi) => ({ poi, d: null as number | null }));
    }

    return pois
      .map((poi) => ({
        poi,
        d: haversineMeters(geo.lat, geo.lng, poi.lat, poi.lng),
      }))
      .sort((a, b) => {
        if (a.d === null && b.d === null) return 0;
        if (a.d === null) return 1;
        if (b.d === null) return -1;
        return a.d - b.d;
      });
  }, [pois, geo]);

  const effectiveTarget = useMemo(() => {
    return targetPoi ?? inRange[0]?.poi ?? cityPois[0]?.poi ?? null;
  }, [targetPoi, inRange, cityPois]);

  const bearingToTarget = useMemo(() => {
    if (!geo || !effectiveTarget) return null;
    return bearingDegrees(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng);
  }, [geo, effectiveTarget]);

  const relativeAngle = useMemo(() => {
    if (heading === null || bearingToTarget === null) return null;
    return (bearingToTarget - heading + 360) % 360;
  }, [heading, bearingToTarget]);

  const modalHtml = activePoi?.description
    ? renderMarkdownToHtml(activePoi.description)
    : "";

  const distanceToTarget =
    effectiveTarget && geo
      ? haversineMeters(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng)
      : 0;

  function openDetails(p: PoiApi) {
    setActivePoi(p);
    setModalOpen(true);
  }

  function openListPoiDetails(p: PoiApi) {
    setActivePoi(p);
    setListOpen(false);
    setModalOpen(true);
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-slate-950 text-white selection:bg-cyan-300/20">
      <div className="absolute inset-0 z-0">
        {!cameraOn && (
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),linear-gradient(180deg,#07111f_0%,#0b1e2d_100%)] p-6 text-center">
            <div className="absolute inset-0 opacity-30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <Icons.CameraOff />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight">Go Alagoas AR</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
              Ative a câmera para explorar os pontos ao seu redor com uma experiência limpa e imersiva.
            </p>
            {cameraErr && <p className="mt-4 text-sm text-red-300">{cameraErr}</p>}
          </div>
        )}

        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-700 ${cameraOn ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
          autoPlay
        />

        <div className="absolute top-0 h-36 w-full bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 h-52 w-full bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none" />
      </div>

      {cameraOn && heading !== null && relativeAngle !== null && effectiveTarget && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div
            className="pb-24 text-cyan-100 transition-transform duration-200 ease-linear"
            style={{
              transform: `rotate(${relativeAngle}deg)`,
              filter: "drop-shadow(0 0 18px rgba(0,0,0,0.45))",
            }}
          >
            <Icons.NavArrow />
          </div>

          <div className="-mt-16 flex flex-col items-center text-center">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300 backdrop-blur-md">
              destino
            </span>
            <span className="mt-3 text-2xl font-black drop-shadow-md">
              {geo ? formatMeters(distanceToTarget) : "Sem GPS"}
            </span>
          </div>
        </div>
      )}

      <div className="absolute left-0 right-0 top-0 z-30 p-4 sm:p-5">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 shadow-sm">
                <span className="text-xs font-black">GA</span>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wide text-white sm:text-base">
                  Go Alagoas AR
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                  {geo ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      GPS {geo.acc ? `±${Math.round(geo.acc)}m` : "ativo"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Buscando GPS
                    </span>
                  )}
                  {geoErr && <span className="text-red-300">• {geoErr}</span>}
                </div>
              </div>
            </div>

            {!loadingPois && (
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/55">
                <span className="rounded-full bg-white/6 px-2.5 py-1">{pois.length} pontos</span>
                {geo && (
                  <span className="rounded-full bg-white/6 px-2.5 py-1">
                    {inRange.length} em até {radiusMeters}m
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setListOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/90 backdrop-blur-xl shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition hover:bg-white/15 active:scale-95"
          >
            <Icons.List />
          </button>
        </div>
      </div>

      {cameraOn && geo && inRange.length > 0 && (
        <div className="absolute left-4 right-4 top-28 z-20 flex flex-col gap-3 sm:left-5 sm:right-5 sm:top-32">
          <div className="mx-auto w-full max-w-3xl space-y-3">
            {inRange.map(({ poi, d }) => {
              const isTarget = effectiveTarget?.id === poi.id;

              return (
                <div
                  key={String(poi.id)}
                  className={`overflow-hidden rounded-[1.5rem] border backdrop-blur-xl transition-all duration-300 ${
                    isTarget
                      ? "border-cyan-300/25 bg-slate-950/38 shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
                      : "border-white/8 bg-slate-950/28 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex min-w-[3.8rem] flex-col items-center justify-center rounded-[1rem] border border-white/8 bg-white/8 px-2 py-2.5">
                      <span className="text-sm font-black">{Math.round(d)}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                        m
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-bold leading-tight text-white">
                        {poi.name}
                      </h3>
                      <p className="mt-1 truncate text-xs text-cyan-100/75">
                        {poi.category ?? "Ponto turístico"}
                      </p>
                    </div>

                    <button
                      onClick={() => openDetails(poi)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-md transition active:scale-90"
                    >
                      <span className="text-lg font-light leading-none">+</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-20">
        <div className="mx-auto flex max-w-6xl items-end justify-between">
          <div className="pointer-events-auto flex flex-col items-center gap-1">
            <button
              onClick={enableCompass}
              className={`flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 ${
                heading !== null
                  ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-300"
                  : "border-white/8 bg-white/8 text-white/60"
              }`}
            >
              <div
                style={{
                  transform: heading ? `rotate(${-heading}deg)` : "none",
                  transition: "transform 0.5s ease-out",
                }}
              >
                <Icons.Compass />
              </div>
            </button>
            {headingErr && (
              <span className="rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-red-300">
                {headingErr}
              </span>
            )}
          </div>

          <div className="pointer-events-auto flex flex-col items-center gap-4">
            {effectiveTarget && (
              <a
                href={getGoogleMapsUrl(effectiveTarget, geo)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/15"
              >
                <Icons.Map />
                <span>Abrir no Maps</span>
              </a>
            )}

            <button
              onClick={cameraOn ? stopCamera : startCamera}
              className={`flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-all ${
                cameraOn
                  ? "border-white/30 bg-white/8 text-white hover:bg-white/12"
                  : "border-white/25 bg-white text-slate-950 hover:scale-105"
              }`}
            >
              {cameraOn ? <div className="h-8 w-8 rounded bg-red-500" /> : <Icons.Camera />}
            </button>
          </div>

          <div className="pointer-events-auto flex w-12 justify-end">
            {targetPoi ? (
              <button
                onClick={() => setTargetPoi(null)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/8 bg-white/8 text-white/70 backdrop-blur-xl transition hover:text-white"
              >
                <Icons.X />
              </button>
            ) : (
              <div className="h-12 w-12" />
            )}
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="">
        {activePoi && (
          <div className="p-1">
            <div className="mb-4">
              <span className="mb-2 inline-block rounded-full bg-cyan-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                {activePoi.category ?? "Geral"}
              </span>

              <h2 className="text-2xl font-black text-white">{activePoi.name}</h2>

              <p className="mt-2 flex items-center gap-1 text-sm text-white/60">
                <Icons.MapPin /> {activePoi.address || "Endereço não informado"}
              </p>

              {geo && (
                <p className="mt-2 text-xs text-white/45">
                  Distância: {formatMeters(haversineMeters(geo.lat, geo.lng, activePoi.lat, activePoi.lng))}
                </p>
              )}
            </div>

            <div className="rounded-[1.25rem] border border-white/6 bg-white/5 p-4 prose prose-invert prose-sm max-w-none text-white/80">
              {modalHtml ? <div dangerouslySetInnerHTML={{ __html: modalHtml }} /> : "Sem descrição."}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setTargetPoi(activePoi);
                  setModalOpen(false);
                }}
                className="w-full rounded-xl bg-white py-3 font-bold text-slate-950 transition active:scale-95"
              >
                Ir até aqui
              </button>

              <a
                href={getGoogleMapsUrl(activePoi, geo)}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-xl border border-white/12 bg-black/25 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={listOpen} onClose={() => setListOpen(false)} title="Explorar pontos">
        <div className="mt-2 space-y-2">
          {loadingPois && (
            <div className="p-4 text-center text-sm text-white/40">
              Carregando pontos...
            </div>
          )}

          {!loadingPois && !cityPois.length && (
            <div className="p-4 text-center text-sm text-white/40">
              Nenhum ponto cadastrado.
            </div>
          )}

          {cityPois.map(({ poi, d }) => (
            <button
              key={poi.id}
              onClick={() => openListPoiDetails(poi)}
              className="flex w-full items-center gap-4 rounded-[1rem] border border-transparent p-3 text-left transition hover:border-white/10 hover:bg-white/8 active:bg-white/15"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white/65">
                {d !== null ? (d < 1000 ? Math.round(d) : `${(d / 1000).toFixed(1)}k`) : "—"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white">{poi.name}</div>
                <div className="truncate text-xs text-white/50">
                  {poi.category ?? "Ponto turístico"}
                  {d !== null ? ` • ${formatMeters(d)}` : ""}
                </div>
              </div>

              <a
                href={getGoogleMapsUrl(poi, geo)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                Maps
              </a>
            </button>
          ))}
        </div>
      </Modal>
    </main>
  );
}