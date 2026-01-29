"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { haversineMeters } from "@/lib/haversine";
import Modal from "@/components/Modal";
import { renderMarkdownToHtml } from "@/lib/markdown";

type Poi = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  shortFact: string;
  fullStory: string;
  curatorName: string;
  tags?: string | null;
  audioUrl?: string | null;
  isPublished: boolean;
};

type Geo = { lat: number; lng: number; acc?: number };

function formatMeters(m: number) {
  if (!Number.isFinite(m)) return "--";
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

export default function TouristAppPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);

  const [heading, setHeading] = useState<number | null>(null);
  const [headingErr, setHeadingErr] = useState<string | null>(null);

  const [pois, setPois] = useState<Poi[]>([]);
  const [loadingPois, setLoadingPois] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activePoi, setActivePoi] = useState<Poi | null>(null);

  const radiusMeters = 80;

  // Load POIs
  useEffect(() => {
    let alive = true;
    setLoadingPois(true);
    fetch("/api/pois?published=1")
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setPois(data.pois ?? []);
      })
      .catch(() => setPois([]))
      .finally(() => setLoadingPois(false));
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
          acc: pos.coords.accuracy
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
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (e) {
      setCameraOn(false);
      alert("Não foi possível acessar a câmera (verifique permissões/HTTPS).");
    }
  }

  function stopCamera() {
    const v = videoRef.current;
    if (!v) return;
    const stream = v.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    v.srcObject = null;
    setCameraOn(false);
  }

  // Compass / heading (MVP)
  async function enableCompass() {
    try {
      setHeadingErr(null);

      // iOS requires permission via requestPermission
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
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
        // iOS (Safari) often provides webkitCompassHeading
        const anyEv = ev as any;
        if (typeof anyEv.webkitCompassHeading === "number") {
          setHeading(anyEv.webkitCompassHeading);
          return;
        }

        // Android/others: alpha is rotation around z-axis
        // This is an approximation. Works OK for MVP.
        if (typeof ev.alpha === "number") {
          // Convert alpha to compass-like heading
          const h = (360 - ev.alpha) % 360;
          setHeading(h);
        }
      };

      window.addEventListener("deviceorientation", handler, true);

      // Cleanup when component unmounts
      return () => window.removeEventListener("deviceorientation", handler, true);
    } catch {
      setHeadingErr("Não foi possível habilitar a bússola.");
    }
  }

  const nearby = useMemo(() => {
    if (!geo) return [];
    return pois
      .map((p) => ({
        poi: p,
        d: haversineMeters(geo.lat, geo.lng, p.latitude, p.longitude)
      }))
      .sort((a, b) => a.d - b.d);
  }, [geo, pois]);

  const nearest = useMemo(() => {
    const first = nearby[0];
    if (!first) return null;
    if (first.d > radiusMeters) return null;
    return first;
  }, [nearby]);

  function openDetails(p: Poi) {
    setActivePoi(p);
    setModalOpen(true);
  }

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

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-3">
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
        <div className="absolute bottom-0 left-0 right-0 p-4">
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
                <div className="text-sm text-white/70">
                  {loadingPois ? "Carregando pontos…" : `${pois.length} pontos cadastrados`}
                </div>
                <div className="text-lg font-bold">
                  {nearest ? nearest.poi.title : "Aproxime-se de um ponto cultural"}
                </div>
                <div className="text-sm text-white/75 mt-1">
                  {nearest
                    ? `${formatMeters(nearest.d)} • ${nearest.poi.shortFact}`
                    : "Dica: caminhe e mantenha o GPS ativo. Ao chegar perto (≤ 80m), aparece o conteúdo."}
                </div>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activePoi?.title ?? ""}
      >
        {activePoi && (
          <div className="space-y-3">
            <div className="text-sm text-white/70">
              Curadoria: <span className="font-semibold text-white">{activePoi.curatorName}</span>
            </div>

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownToHtml(activePoi.fullStory)
              }}
            />

            {activePoi.audioUrl ? (
              <div className="pt-2">
                <div className="text-sm text-white/70 mb-2">Ouvir:</div>
                <audio controls className="w-full">
                  <source src={activePoi.audioUrl} />
                </audio>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </main>
  );
}
