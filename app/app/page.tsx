"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { haversineMeters } from "@/lib/haversine";
import Modal from "@/components/Modal";
import { renderMarkdownToHtml } from "@/lib/markdown";

// --- TIPOS ---
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

// --- HELPERS (Lógica mantida) ---
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

function stripMarkdown(md: string) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(s: string, max = 100) {
  const t = (s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

// --- ÍCONES SVG (Para manter o código portátil) ---
const Icons = {
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  CameraOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2.5-3h4.14"></path><path d="M14.5 4h-5L7 7H4"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path></svg>,
  Compass: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  ArrowUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
};

export default function TouristAppPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // States
  const [cameraOn, setCameraOn] = useState(false);
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

  // --- LOGIC: Load POIs ---
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
    return () => { alive = false; };
  }, []);

  // --- LOGIC: Geolocation ---
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoErr("GPS não suportado.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy });
        setGeoErr(null);
      },
      (err) => setGeoErr(err.code === 1 ? "GPS negado." : "Erro no GPS."),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // --- LOGIC: Camera ---
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setCameraOn(false);
      alert("Erro ao acessar câmera.");
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

  // --- LOGIC: Compass ---
  async function enableCompass() {
    if (compassEnabledRef.current) return;
    try {
      setHeadingErr(null);
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        // @ts-ignore
        const resp = await DeviceOrientationEvent.requestPermission();
        if (resp !== "granted") return setHeadingErr("Bússola negada.");
      }

      const handler = (ev: DeviceOrientationEvent) => {
        const anyEv = ev as any;
        if (typeof anyEv.webkitCompassHeading === "number") {
          setHeading(anyEv.webkitCompassHeading);
        } else if (typeof ev.alpha === "number") {
          setHeading((360 - ev.alpha) % 360);
        }
      };

      compassHandlerRef.current = handler;
      compassEnabledRef.current = true;
      window.addEventListener("deviceorientationabsolute", handler as any, true);
      window.addEventListener("deviceorientation", handler as any, true);
    } catch {
      setHeadingErr("Erro na bússola.");
    }
  }

  useEffect(() => {
    return () => {
      const handler = compassHandlerRef.current;
      if (handler) {
        window.removeEventListener("deviceorientationabsolute", handler as any, true);
        window.removeEventListener("deviceorientation", handler as any, true);
      }
    };
  }, []);

  // --- LOGIC: Calculations ---
  const nearby = useMemo(() => {
    if (!geo) return [];
    return pois
      .map((p) => ({ poi: p, d: haversineMeters(geo.lat, geo.lng, p.lat, p.lng) }))
      .sort((a, b) => a.d - b.d);
  }, [geo, pois]);

  const nearest = useMemo(() => nearby[0]?.d <= radiusMeters ? nearby[0] : null, [nearby]);
  const inRange = useMemo(() => nearby.filter((x) => x.d <= radiusMeters).slice(0, 3), [nearby]);
  
  const effectiveTarget = useMemo(() => targetPoi ?? inRange[0]?.poi ?? null, [targetPoi, inRange]);
  
  const bearingToTarget = useMemo(() => {
    if (!geo || !effectiveTarget) return null;
    return bearingDegrees(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng);
  }, [geo, effectiveTarget]);

  const relativeAngle = useMemo(() => {
    if (heading === null || bearingToTarget === null) return null;
    return (bearingToTarget - heading + 360) % 360;
  }, [heading, bearingToTarget]);

  function openDetails(p: PoiApi) {
    setActivePoi(p);
    setModalOpen(true);
  }

  const modalHtml = activePoi?.description ? renderMarkdownToHtml(activePoi.description) : "";

  return (
    <main className="relative h-[100dvh] w-full bg-neutral-900 overflow-hidden text-white font-sans selection:bg-white/20">
      
      {/* --- LAYER 1: Câmera / Fundo --- */}
      <div className="absolute inset-0 z-0">
        {!cameraOn && (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-neutral-400">
            <div className="mb-4 h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center animate-pulse">
              <Icons.CameraOff />
            </div>
            <p>Toque na câmera abaixo para iniciar o modo AR</p>
          </div>
        )}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-700 ${cameraOn ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
        />
        {/* Gradientes para legibilidade */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* --- LAYER 2: Header (Status) --- */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4 safe-area-top">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight drop-shadow-md">Turismo AR</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-white/70">
            {geo ? (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                GPS Ativo
              </span>
            ) : (
              <span className="flex items-center gap-1 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Buscando sinal...
              </span>
            )}
            {geoErr && <span className="text-red-400">• {geoErr}</span>}
          </div>
        </div>

        <button 
          onClick={() => setListOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-95 transition-all hover:bg-white/20"
          aria-label="Listar Pontos"
        >
          <Icons.List />
        </button>
      </div>

      {/* --- LAYER 3: AR Cards (Floating) --- */}
      {cameraOn && geo && inRange.length > 0 && (
        <div className="absolute top-24 left-4 right-4 z-10 flex flex-col gap-3">
          {inRange.map(({ poi, d }, idx) => {
            const isTarget = effectiveTarget?.id === poi.id;
            
            return (
              <div
                key={String(poi.id)}
                className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                  isTarget 
                    ? "bg-white/10 border-white/40 shadow-lg shadow-black/20" 
                    : "bg-black/40 border-white/5 opacity-80 scale-95"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Distância Badge */}
                  <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 px-2 rounded-xl bg-white/10">
                    <span className="text-xs font-bold">{formatMeters(d).replace('m', '')}</span>
                    <span className="text-[10px] text-white/60">metros</span>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-tight truncate drop-shadow-sm">{poi.name}</h3>
                    <p className="text-xs text-white/70 truncate mt-0.5">{poi.category ?? "Ponto Turístico"}</p>
                    
                    {/* Bússola Integrada no Card Principal */}
                    {isTarget && heading !== null && relativeAngle !== null && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                         <div 
                           style={{ transform: `rotate(${relativeAngle}deg)` }}
                           className="transition-transform duration-300"
                         >
                           <Icons.ArrowUp /> 
                         </div>
                         <span>Siga a seta</span>
                      </div>
                    )}
                  </div>

                  {/* Ação */}
                  <button
                    onClick={() => openDetails(poi)}
                    className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  >
                     <span className="text-lg font-light leading-none mb-0.5">+</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- LAYER 4: Bottom Controls (Dock) --- */}
      <div className="absolute bottom-8 left-0 right-0 z-30 px-6 flex items-end justify-between pointer-events-none">
        {/* Esquerda: Bússola Toggle */}
        <div className="pointer-events-auto">
          <button
            onClick={enableCompass}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
               heading !== null ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-neutral-800/80 text-white/50"
            } backdrop-blur-md`}
          >
            <div style={{ transform: heading ? `rotate(${-heading}deg)` : 'none', transition: 'transform 0.5s ease-out' }}>
              <Icons.Compass />
            </div>
          </button>
          {headingErr && <div className="absolute -top-8 left-0 w-max text-xs text-red-400 bg-black/50 px-2 py-1 rounded">{headingErr}</div>}
        </div>

        {/* Centro: Câmera Toggle (Main Action) */}
        <div className="pointer-events-auto transform translate-y-2">
          <button
            onClick={cameraOn ? stopCamera : startCamera}
            className={`h-20 w-20 rounded-full flex items-center justify-center border-4 transition-all shadow-2xl ${
              cameraOn 
                ? "bg-red-500 border-red-900/50 hover:bg-red-600" 
                : "bg-white border-white/20 hover:scale-105"
            }`}
          >
             {cameraOn ? <Icons.X /> : <Icons.Camera />}
          </button>
        </div>

        {/* Direita: Info/Target ou Placeholder */}
        <div className="pointer-events-auto flex justify-end w-12">
            {effectiveTarget && (
                <button 
                  onClick={() => setTargetPoi(null)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/80 backdrop-blur-md text-white/50 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-colors"
                >
                    <Icons.X />
                </button>
            )}
        </div>
      </div>

      {/* --- MODAIS --- */}
      {/* Detalhes */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="">
        {activePoi && (
          <div className="p-1">
             <div className="mb-4">
                <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-[10px] uppercase tracking-wider text-white/70 font-semibold mb-2">
                    {activePoi.category ?? "Geral"}
                </span>
                <h2 className="text-2xl font-bold">{activePoi.name}</h2>
                <p className="text-sm text-white/60 mt-1 flex items-center gap-1">
                    <Icons.MapPin /> {activePoi.address || "Endereço não informado"}
                </p>
             </div>

             <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                {activePoi.description ? (
                     <div dangerouslySetInnerHTML={{ __html: modalHtml }} />
                ) : (
                    <p className="italic text-white/40">Sem descrição disponível.</p>
                )}
             </div>

             <div className="mt-6 flex gap-3">
                 <button 
                    onClick={() => { setTargetPoi(activePoi); setModalOpen(false); }}
                    className="flex-1 py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
                 >
                    Ir até aqui
                 </button>
                 {activePoi.arUrl && (
                     <a href={activePoi.arUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-center active:scale-95 transition-transform">
                        AR Experience
                     </a>
                 )}
             </div>
          </div>
        )}
      </Modal>

      {/* Lista */}
      <Modal open={listOpen} onClose={() => setListOpen(false)} title="Explorar Pontos">
         <div className="space-y-2 mt-2">
            {!nearby.length && <div className="p-4 text-center text-white/40 text-sm">Nenhum ponto encontrado nas proximidades.</div>}
            {nearby.map(({ poi, d }) => (
                <button
                    key={poi.id}
                    onClick={() => { setTargetPoi(poi); setListOpen(false); }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors text-left border border-transparent hover:border-white/10"
                >
                    <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                        {formatMeters(d).replace('m','')}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{poi.name}</div>
                        <div className="text-xs text-white/50">{poi.category}</div>
                    </div>
                    <div className="ml-auto text-white/30">
                        <Icons.ArrowUp />
                    </div>
                </button>
            ))}
         </div>
      </Modal>

    </main>
  );
}