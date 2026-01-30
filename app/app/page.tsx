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

// --- HELPERS ---
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

// --- ÍCONES ---
const Icons = {
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  CameraOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2.5-3h4.14"></path><path d="M14.5 4h-5L7 7H4"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path></svg>,
  Compass: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  // Seta grande para o HUD
  NavArrow: () => <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2L4.5 20.29C4.24 20.89 4.87 21.5 5.48 21.2L12 18L18.52 21.2C19.13 21.5 19.76 20.89 19.5 20.29L12 2Z"/></svg>
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

  // --- LOGIC (Load, Geo, Cam, Compass) ---
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoadingPois(true);
        const r = await fetch("/api/pois", { cache: "no-store" });
        const data = await r.json().catch(() => null);
        if (!alive) return;
        if (!r.ok || !data?.ok) { setPois([]); return; }
        setPois(Array.isArray(data.pois) ? data.pois : []);
      } catch { if (alive) setPois([]); } finally { if (alive) setLoadingPois(false); }
    }
    load();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) { setGeoErr("GPS Off"); return; }
    const id = navigator.geolocation.watchPosition(
      (pos) => { setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }); setGeoErr(null); },
      (err) => setGeoErr("Erro GPS"),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraOn(true);
    } catch { setCameraOn(false); alert("Erro Câmera"); }
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
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        // @ts-ignore
        const resp = await DeviceOrientationEvent.requestPermission();
        if (resp !== "granted") return setHeadingErr("Bússola negada");
      }
      const handler = (ev: DeviceOrientationEvent) => {
        const anyEv = ev as any;
        if (typeof anyEv.webkitCompassHeading === "number") setHeading(anyEv.webkitCompassHeading);
        else if (typeof ev.alpha === "number") setHeading((360 - ev.alpha) % 360);
      };
      compassHandlerRef.current = handler;
      compassEnabledRef.current = true;
      window.addEventListener("deviceorientationabsolute", handler as any, true);
      window.addEventListener("deviceorientation", handler as any, true);
    } catch { setHeadingErr("Erro Bússola"); }
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

  // --- CALCS ---
  const nearby = useMemo(() => {
    if (!geo) return [];
    return pois.map((p) => ({ poi: p, d: haversineMeters(geo.lat, geo.lng, p.lat, p.lng) })).sort((a, b) => a.d - b.d);
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

  const modalHtml = activePoi?.description ? renderMarkdownToHtml(activePoi.description) : "";

  // Distância do target para o Google Maps link
  const distanceToTarget = effectiveTarget && geo 
    ? haversineMeters(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng)
    : 0;

  return (
    <main className="relative h-[100dvh] w-full bg-neutral-900 overflow-hidden text-white font-sans selection:bg-white/20">
      
      {/* --- LAYER 1: Câmera --- */}
      <div className="absolute inset-0 z-0">
        {!cameraOn && (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-neutral-400">
            <div className="mb-4 h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center animate-pulse">
              <Icons.CameraOff />
            </div>
            <p>Toque na câmera abaixo para iniciar</p>
          </div>
        )}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-700 ${cameraOn ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
        />
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* --- LAYER 1.5: HUD AR (Seta Centralizada) --- */}
      {/* Esta camada fica sobre o vídeo, mas sob a UI. A seta gira baseada na bússola */}
      {cameraOn && heading !== null && relativeAngle !== null && effectiveTarget && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            {/* Wrapper da seta com rotação */}
            <div 
               style={{ 
                 transform: `rotate(${relativeAngle}deg)`,
                 filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.5))"
               }}
               className="text-white/90 transition-transform duration-200 ease-linear origin-center pb-20" 
            >
               <Icons.NavArrow />
            </div>
            
            {/* Texto fixo abaixo da seta (não gira) para dar contexto */}
            <div className="mt-[-4rem] flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 drop-shadow-md">
                   Destino
                </span>
                <span className="text-xl font-black drop-shadow-md">
                    {formatMeters(distanceToTarget)}
                </span>
            </div>
        </div>
      )}


      {/* --- LAYER 2: UI Header --- */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between p-4 safe-area-top">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight drop-shadow-md">Turismo AR</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-white/70">
            {geo ? (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                GPS ON {geo.acc ? `(±${Math.round(geo.acc)}m)` : ""}
              </span>
            ) : (
              <span className="flex items-center gap-1 animate-pulse"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />...</span>
            )}
            {geoErr && <span className="text-red-400">• {geoErr}</span>}
          </div>
        </div>

        <button 
          onClick={() => setListOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 active:scale-95 transition-all hover:bg-white/20"
        >
          <Icons.List />
        </button>
      </div>

      {/* --- LAYER 3: Cards Flutuantes (Informação) --- */}
      {cameraOn && geo && inRange.length > 0 && (
        <div className="absolute top-24 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
          {inRange.map(({ poi, d }) => {
            const isTarget = effectiveTarget?.id === poi.id;
            
            return (
              <div
                key={String(poi.id)}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                  isTarget 
                    ? "bg-white/10 border-white/40 shadow-lg shadow-black/20" 
                    : "bg-black/40 border-white/5 opacity-60 scale-95"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-1 px-2 rounded-xl bg-white/10">
                    <span className="text-xs font-bold">{formatMeters(d).replace('m', '')}</span>
                    <span className="text-[10px] text-white/60">m</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold leading-tight truncate drop-shadow-sm">{poi.name}</h3>
                    <p className="text-xs text-white/70 truncate mt-0.5">{poi.category ?? "Ponto Turístico"}</p>
                    {/* Nota: A seta saiu daqui e foi para o Layer 1.5 HUD */}
                  </div>

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

      {/* --- LAYER 4: Bottom Dock --- */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-8 pt-20 px-6 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between pointer-events-none">
        
        {/* Esquerda: Bússola */}
        <div className="pointer-events-auto flex flex-col items-center gap-1">
            <button
                onClick={enableCompass}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                heading !== null ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-neutral-800/60 text-white/50 border border-white/5"
                } backdrop-blur-md`}
            >
                <div style={{ transform: heading ? `rotate(${-heading}deg)` : 'none', transition: 'transform 0.5s ease-out' }}>
                <Icons.Compass />
                </div>
            </button>
            {headingErr && <span className="text-[10px] text-red-300 bg-black/50 px-1 rounded">{headingErr}</span>}
        </div>

        {/* Centro: Ações Principais (Camera + Maps Link) */}
        <div className="pointer-events-auto flex flex-col items-center gap-4 transform translate-y-2">
            
            {/* Botão Sutil do Maps (Só aparece se tiver target e GPS) */}
            {effectiveTarget && geo && (
                <a 
                   href={`https://www.google.com/maps/dir/?api=1&origin=${geo.lat},${geo.lng}&destination=${effectiveTarget.lat},${effectiveTarget.lng}&travelmode=walking`}
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-semibold text-white/90 hover:bg-white/10 hover:border-white/30 transition-all animate-in fade-in slide-in-from-bottom-2"
                >
                    <Icons.Map />
                    <span>Abrir no Maps</span>
                </a>
            )}

            <button
                onClick={cameraOn ? stopCamera : startCamera}
                className={`h-20 w-20 rounded-full flex items-center justify-center border-4 transition-all shadow-2xl ${
                cameraOn 
                    ? "bg-transparent border-white/30 text-white hover:bg-white/10" 
                    : "bg-white border-white/20 text-black hover:scale-105"
                }`}
            >
                {cameraOn ? <div className="h-8 w-8 rounded bg-red-500" /> : <Icons.Camera />}
            </button>
        </div>

        {/* Direita: Limpar Target */}
        <div className="pointer-events-auto flex justify-end w-12">
            {targetPoi && (
                <button 
                  onClick={() => setTargetPoi(null)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/60 backdrop-blur-md text-white/50 hover:text-white border border-white/5 transition-colors"
                >
                    <Icons.X />
                </button>
            )}
        </div>
      </div>

      {/* --- MODAIS (Sem alterações visuais profundas, apenas lógica) --- */}
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
                {modalHtml ? <div dangerouslySetInnerHTML={{ __html: modalHtml }} /> : "Sem descrição."}
             </div>
             <div className="mt-6 flex gap-3">
                 {/* Ao clicar aqui, o target muda, o Maps button aparece e a seta HUD ativa */}
                 <button 
                    onClick={() => { setTargetPoi(activePoi); setModalOpen(false); }}
                    className="flex-1 py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
                 >
                    Ir até aqui
                 </button>
             </div>
          </div>
        )}
      </Modal>

      <Modal open={listOpen} onClose={() => setListOpen(false)} title="Explorar Pontos">
         <div className="space-y-2 mt-2">
            {!nearby.length && <div className="p-4 text-center text-white/40 text-sm">Nenhum ponto perto.</div>}
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
                </button>
            ))}
         </div>
      </Modal>
    </main>
  );
}