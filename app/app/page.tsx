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
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
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
    .replace(/!\[.*?\]\(.*?\)/g, "") // imagens
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(s: string, max = 160) {
  const t = (s || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export default function TouristAppPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // Compass listener control
  const compassEnabledRef = useRef(false);
  const compassHandlerRef = useRef<((ev: DeviceOrientationEvent) => void) | null>(null);

  const radiusMeters = 80;

  // Load POIs
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
        if (!alive) return;
        setPois([]);
      } finally {
        if (!alive) return;
        setLoadingPois(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // Geolocation watch
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoErr("Geolocalização não suportada neste navegador.");
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
      (err) => {
        setGeoErr(
          err.code === 1
            ? "Permissão de localização negada."
            : "Não foi possível obter localização."
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // Camera
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
      alert("Não foi possível acessar a câmera (verifique permissões/HTTPS).");
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

  // Compass / heading
  async function enableCompass() {
    try {
      setHeadingErr(null);

      // Already enabled? Don't stack listeners.
      if (compassEnabledRef.current) {
        alert("Bússola já está ativa.");
        return;
      }

      // iOS permission
      // @ts-ignore
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        // @ts-ignore
        const resp = await DeviceOrientationEvent.requestPermission();
        if (resp !== "granted") {
          setHeadingErr("Permissão da bússola negada.");
          return;
        }
      }

      if (typeof window.DeviceOrientationEvent === "undefined") {
        setHeadingErr("Bússola (DeviceOrientation) não suportada.");
        return;
      }

      const handler = (ev: DeviceOrientationEvent) => {
        const anyEv = ev as any;

        // iOS
        if (typeof anyEv.webkitCompassHeading === "number") {
          setHeading(anyEv.webkitCompassHeading);
          return;
        }

        // Android/others
        if (typeof ev.alpha === "number") {
          const h = (360 - ev.alpha) % 360;
          setHeading(h);
        }
      };

      compassHandlerRef.current = handler;
      compassEnabledRef.current = true;

      // Some browsers fire one or the other
      window.addEventListener("deviceorientationabsolute", handler as any, true);
      window.addEventListener("deviceorientation", handler as any, true);

      alert("Bússola ativada! Se estiver imprecisa, calibre movendo o celular em '8'.");
    } catch {
      setHeadingErr("Não foi possível habilitar a bússola.");
    }
  }

  // Cleanup compass listeners on unmount
  useEffect(() => {
    return () => {
      const handler = compassHandlerRef.current;
      if (handler) {
        window.removeEventListener("deviceorientationabsolute", handler as any, true);
        window.removeEventListener("deviceorientation", handler as any, true);
      }
      compassEnabledRef.current = false;
      compassHandlerRef.current = null;
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

  const nearest = useMemo(() => {
    const first = nearby[0];
    if (!first) return null;
    if (first.d > radiusMeters) return null;
    return first;
  }, [nearby]);

  // Up to 3 POIs within radius
  const inRange = useMemo(() => {
    return nearby.filter((x) => x.d <= radiusMeters).slice(0, 3);
  }, [nearby]);

  // If no explicit target, default to the nearest POI in range (if any)
  const effectiveTarget = useMemo(() => {
    if (targetPoi) return targetPoi;
    return inRange[0]?.poi ?? null;
  }, [targetPoi, inRange]);

  // Bearing to effective target (absolute bearing)
  const bearingToTarget = useMemo(() => {
    if (!geo || !effectiveTarget) return null;
    return bearingDegrees(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng);
  }, [geo, effectiveTarget]);

  // Relative angle to draw arrow: where should the arrow point on screen
  const relativeAngle = useMemo(() => {
    if (heading === null || bearingToTarget === null) return null;
    // difference in degrees [-180..180] but for rotation, 0..360 is fine
    return (bearingToTarget - heading + 360) % 360;
  }, [heading, bearingToTarget]);

  function openDetails(p: PoiApi) {
    setActivePoi(p);
    setModalOpen(true);
  }

  const modalHtml =
    activePoi?.description && activePoi.description.trim().length
      ? renderMarkdownToHtml(activePoi.description)
      : "";

  return (
    <main className="min-h-screen bg-[#0b1220]">
      <div className="fixed inset-0">
        {/* Camera */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted
        />

        {/* Floating tooltip(s) on camera: show up to 3 POIs in range */}
        {cameraOn && geo && inRange.length > 0 ? (
          <div className="absolute left-4 right-4 top-[84px] z-20 space-y-2">
            {inRange.map(({ poi, d }, idx) => {
              const raw = poi.description ?? poi.category ?? "";
              const text = clampText(stripMarkdown(String(raw || "")) || "Toque em “Ver mais” para detalhes.", 160);

              const isPrimary = effectiveTarget && String(effectiveTarget.id) === String(poi.id);
              const badge = idx === 0 ? "Mais próximo" : `Perto #${idx + 1}`;

              return (
                <div
                  key={String(poi.id)}
                  className={`rounded-2xl bg-black/70 border backdrop-blur px-4 py-3 shadow-lg ${
                    isPrimary ? "border-white/30" : "border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-white/60">
                        📍 {badge} • <span className="text-white/80">{formatMeters(d)}</span>
                        {poi.category ? <span className="text-white/50"> • {poi.category}</span> : null}
                      </div>

                      <div className="text-lg font-black truncate">{poi.name}</div>

                      <div className="mt-1 text-sm text-white/80">
                        {text}
                      </div>

                      {poi.address ? (
                        <div className="mt-1 text-xs text-white/50 line-clamp-2">
                          {poi.address}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => openDetails(poi)}
                        className="rounded-xl bg-white text-black font-semibold px-3 py-2 text-sm"
                      >
                        Ver mais
                      </button>

                      <button
                        onClick={() => setTargetPoi(poi)}
                        className={`rounded-xl font-semibold px-3 py-2 text-sm ${
                          isPrimary
                            ? "bg-black/45 border border-white/30"
                            : "bg-black/45 border border-white/20"
                        }`}
                      >
                        {isPrimary ? "Destino" : "Ir até"}
                      </button>
                    </div>
                  </div>

                  {/* Mini compass arrow (only for the selected/effective target card) */}
                  {isPrimary ? (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-white/60">
                        {heading !== null ? (
                          <>
                            🧭 Seu rumo: <b className="text-white">{Math.round(heading)}°</b>
                            {bearingToTarget !== null ? (
                              <>
                                {" "}• Destino: <b className="text-white">{Math.round(bearingToTarget)}°</b>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>Ative a bússola para ver a direção.</>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-white/60">Guia</div>
                        <div
                          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 grid place-items-center"
                          aria-label="Bússola"
                        >
                          <div
                            className="w-0 h-0"
                            style={{
                              borderLeft: "10px solid transparent",
                              borderRight: "10px solid transparent",
                              borderBottom: "16px solid rgba(255,255,255,0.95)",
                              transform: `rotate(${relativeAngle ?? 0}deg)`,
                              transition: "transform 120ms linear",
                              filter: "drop-shadow(0 2px 6px rgba(0,0,0,.45))",
                              opacity: heading !== null && relativeAngle !== null ? 1 : 0.35,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-3 z-30">
          <div className="rounded-xl bg-black/45 border border-white/15 px-3 py-2">
            <div className="text-sm font-semibold">AR leve • Turismo Cultural</div>
            <div className="text-xs text-white/70">
              {geo ? (
                <>
                  GPS ok {geo.acc ? `• ±${Math.round(geo.acc)}m` : ""}{" "}
                  {heading !== null ? `• 🧭 ${Math.round(heading)}°` : ""}
                </>
              ) : (
                "Aguardando localização…"
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!cameraOn ? (
              <button
                onClick={startCamera}
                className="rounded-xl bg-white text-black font-semibold px-4 py-3"
              >
                Ativar câmera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="rounded-xl bg-black/45 border border-white/20 font-semibold px-4 py-3"
              >
                Desligar
              </button>
            )}
          </div>
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          <div className="rounded-2xl bg-black/55 border border-white/15 p-4 backdrop-blur">
            {/* Errors */}
            {(geoErr || headingErr) && (
              <div className="mb-3 text-sm text-red-200">
                {geoErr ? <div>📍 {geoErr}</div> : null}
                {headingErr ? <div>🧭 {headingErr}</div> : null}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setListOpen(true)}
                  className="text-left text-sm text-white/70 underline underline-offset-2"
                >
                  {loadingPois ? "Carregando pontos…" : `${pois.length} pontos cadastrados`}
                </button>

                <div className="text-lg font-bold">
                  {nearest ? nearest.poi.name : "Aproxime-se de um ponto cultural"}
                </div>

                <div className="text-sm text-white/75 mt-1">
                  {nearest
                    ? `${formatMeters(nearest.d)} • ${nearest.poi.category ?? "Sem categoria"}`
                    : "Dica: caminhe e mantenha o GPS ativo. Ao chegar perto (≤ 80m), aparece o conteúdo."}
                </div>

                {/* Target guidance (destination + map link) */}
                {effectiveTarget && geo ? (
                  <div className="mt-3 text-sm text-white/80">
                    <div>
                      🎯 Destino: <b>{effectiveTarget.name}</b>
                      {!targetPoi ? <span className="text-white/50"> (auto)</span> : null}
                    </div>

                    <div className="mt-1">
                      Distância:{" "}
                      <b>
                        {formatMeters(
                          haversineMeters(geo.lat, geo.lng, effectiveTarget.lat, effectiveTarget.lng)
                        )}
                      </b>
                    </div>

                    {heading !== null && bearingToTarget !== null ? (
                      <div className="mt-1">
                        🧭 Direção: <b>{Math.round(bearingToTarget)}°</b>{" "}
                        <span className="text-white/60">
                          (seu rumo: {Math.round(heading)}°)
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-white/60">
                        Ative a bússola para ver a direção.
                      </div>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setTargetPoi(null)}
                        className="rounded-xl bg-black/45 border border-white/20 font-semibold px-3 py-2 text-sm"
                      >
                        Limpar destino
                      </button>

                      <a
                        className="rounded-xl bg-white text-black font-semibold px-3 py-2 text-sm"
                        href={
                          `https://www.google.com/maps/dir/?api=1` +
                          `&origin=${geo.lat},${geo.lng}` +
                          `&destination=${effectiveTarget.lat},${effectiveTarget.lng}` +
                          `&travelmode=walking`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir no Maps
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 min-w-[140px]">
                <button
                  onClick={() => enableCompass()}
                  className="rounded-xl bg-black/45 border border-white/20 font-semibold px-4 py-2 text-sm"
                >
                  Ativar bússola
                </button>

                <button
                  disabled={!nearest}
                  onClick={() => nearest && openDetails(nearest.poi)}
                  className={`rounded-xl font-semibold px-4 py-2 text-sm ${
                    nearest
                      ? "bg-white text-black"
                      : "bg-white/20 text-white/60 cursor-not-allowed"
                  }`}
                >
                  Ver mais
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-xs text-white/50">
            MVP: overlay na câmera + proximidade (sem reconhecimento de imagem).
          </div>
        </div>
      </div>

      {/* Details modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activePoi?.name ?? ""}
      >
        {activePoi && (
          <div className="space-y-3">
            <div className="text-sm text-white/70">
              Categoria:{" "}
              <span className="font-semibold text-white">
                {activePoi.category ?? "Sem categoria"}
              </span>
            </div>

            <div className="text-sm text-white/70">
              Endereço:{" "}
              <span className="font-semibold text-white">
                {activePoi.address ?? "Não informado"}
              </span>
            </div>

            {modalHtml ? (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: modalHtml }}
              />
            ) : (
              <div className="text-sm text-white/70">Sem descrição.</div>
            )}

            {activePoi.arUrl ? (
              <a
                href={activePoi.arUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-xl bg-white text-black font-semibold px-4 py-2"
              >
                Abrir experiência AR
              </a>
            ) : null}
          </div>
        )}
      </Modal>

      {/* List modal */}
      <Modal
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="Pontos turísticos"
      >
        <div className="space-y-2">
          {nearby.length === 0 ? (
            <div className="text-sm text-white/70">
              {geo ? "Sem pontos para listar." : "Ative o GPS para listar pontos por proximidade."}
            </div>
          ) : (
            nearby.map(({ poi, d }) => (
              <button
                key={String(poi.id)}
                onClick={() => {
                  setTargetPoi(poi);
                  setListOpen(false);
                }}
                className="w-full text-left rounded-xl bg-black/40 border border-white/15 p-3"
              >
                <div className="font-semibold text-white">{poi.name}</div>
                <div className="text-xs text-white/70">
                  {poi.category ?? "Sem categoria"} • {formatMeters(d)}
                </div>
                {poi.address ? (
                  <div className="text-xs text-white/50 mt-1">{poi.address}</div>
                ) : null}
              </button>
            ))
          )}
        </div>
      </Modal>
    </main>
  );
}
