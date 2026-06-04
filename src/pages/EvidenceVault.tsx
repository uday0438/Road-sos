import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera, MapPin, Clock, FileText, Upload, Save,
  CheckCircle2, X, Video, Image as ImageIcon, Trash2,
  ZoomIn, ChevronLeft, ChevronRight, AlertTriangle
} from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../context/LanguageContext";

interface CapturedMedia {
  id: string;
  type: "photo" | "video";
  url: string; // Base64 data or blob URL
  timestamp: string;
  size?: string;
}

// Helper to compress image using canvas before storing (ensures base64 is small and doesn't hit quota)
function compressAndConvertToBase64(fileOrBlob: File | Blob, callback: (base64: string, sizeStr: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 640;
      const MAX_HEIGHT = 480;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const base64 = canvas.toDataURL("image/jpeg", 0.75);
      // Calculate size
      const kb = Math.round((base64.length * 3) / 4 / 1024);
      callback(base64, `${kb} KB`);
    };
  };
  reader.readAsDataURL(fileOrBlob);
}

// ── Camera Modal Component ────────────────────────────────────────────────────
function CameraModal({ onClose, onCapture, labelClose, labelCapture, labelFlip }: {
  onClose: () => void;
  onCapture: (base64: string, sizeStr: string) => void;
  labelClose: string;
  labelCapture: string;
  labelFlip: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);
  const [facing, setFacing] = useState<"user" | "environment">("environment");

  const startCamera = useCallback(async (facingMode: "user" | "environment") => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch (err: any) {
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access."
          : "Could not access browser camera APIs (this occurs on HTTP sites due to browser security). Try 'Use System Camera' fallback instead."
      );
    }
  }, []);

  useEffect(() => {
    startCamera(facing);
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [facing, startCamera]);

  const flipCamera = () => {
    setFacing(prev => (prev === "environment" ? "user" : "environment"));
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current || !ready) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;

    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        compressAndConvertToBase64(blob, (base64, sizeStr) => {
          onCapture(base64, sizeStr);
          onClose();
        });
      }
    }, "image/jpeg", 0.85);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 flex-shrink-0">
        <button onClick={onClose} className="text-white active:scale-95">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white text-xs font-bold uppercase tracking-widest">{labelCapture}</span>
        <button onClick={flipCamera} className="text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full active:scale-95 border border-white/20">
          {labelFlip}
        </button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white p-8 text-center bg-slate-950">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
            <p className="text-xs font-semibold leading-relaxed max-w-xs">{error}</p>
            <button onClick={onClose} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 shadow-md">
              {labelClose}
            </button>
          </div>
        ) : (
          <>
            {/* Flash effect */}
            {flash && <div className="absolute inset-0 bg-white z-10 opacity-80 pointer-events-none" />}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: facing === "user" ? "scaleX(-1)" : "none" }}
            />

            {/* Viewfinder overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border border-white/20 rounded-2xl" />
              {["top-4 left-4 border-l-2 border-t-2", "top-4 right-4 border-r-2 border-t-2",
                "bottom-4 left-4 border-l-2 border-b-2", "bottom-4 right-4 border-r-2 border-b-2"].map((cls, i) => (
                <div key={i} className={clsx("absolute w-8 h-8 border-white rounded-sm", cls)} />
              ))}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-16 bg-red-500/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-red-500/40" />
            </div>

            {/* Loading */}
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Capture button */}
      {!error && (
        <div className="bg-black/80 py-8 flex items-center justify-center flex-shrink-0">
          <button
            onClick={capturePhoto}
            disabled={!ready}
            className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
            style={{ width: 72, height: 72 }}
          >
            <div className="w-14 h-14 bg-white rounded-full" />
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ── Lightbox Component ────────────────────────────────────────────────────────
function Lightbox({ media, index, onClose, onDelete }: {
  media: CapturedMedia[]; index: number; onClose: () => void; onDelete: (id: string) => void;
}) {
  const [current, setCurrent] = useState(index);
  const item = media[current];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <button onClick={onClose} className="text-white"><X className="w-6 h-6" /></button>
        <span className="text-white text-xs font-bold">{current + 1} / {media.length}</span>
        <button onClick={() => { onDelete(item.id); onClose(); }} className="text-red-400 active:scale-95">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <img src={item.url} className="max-w-full max-h-full object-contain" alt="evidence" />
        {current > 0 && (
          <button onClick={() => setCurrent(p => p - 1)} className="absolute left-3 text-white bg-black/50 p-2 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {current < media.length - 1 && (
          <button onClick={() => setCurrent(p => p + 1)} className="absolute right-3 text-white bg-black/50 p-2 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="px-4 py-3 text-white text-xs text-center opacity-60 flex-shrink-0">{item.timestamp}</div>
    </div>
  );
}

// ── Main EvidenceVault Page ───────────────────────────────────────────────────
export default function EvidenceVault() {
  const { t } = useLanguage();
  const [timestamp] = useState(new Date().toLocaleString());
  const [location, setLocation] = useState("Getting location...");
  const [notes, setNotes] = useState(() => localStorage.getItem("evidence_vault_notes") || "");
  const [isSaved, setIsSaved] = useState(false);
  const [media, setMedia] = useState<CapturedMedia[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  
  // Hidden inputs references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sysCameraInputRef = useRef<HTMLInputElement>(null);

  // Load saved media from local storage on mount
  useEffect(() => {
    const savedMedia = localStorage.getItem("evidence_vault_media");
    if (savedMedia) {
      try {
        setMedia(JSON.parse(savedMedia));
      } catch (e) {
        console.error("Failed to parse evidence media", e);
      }
    }
  }, []);

  // Real GPS location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
            headers: { "Accept-Language": "en" }
          });
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Unknown";
          const road = data.address?.road || data.address?.suburb || "";
          setLocation(`${road ? road + ", " : ""}${city} (${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E)`);
        } catch {
          setLocation(`${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
        }
      },
      () => setLocation("Location access denied"),
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const addMediaBase64 = (base64: string, sizeStr: string) => {
    const newItem: CapturedMedia = {
      id: Date.now().toString() + Math.random(),
      type: "photo",
      url: base64,
      timestamp: new Date().toLocaleTimeString(),
      size: sizeStr,
    };
    setMedia(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem("evidence_vault_media", JSON.stringify(updated));
      return updated;
    });
  };

  // Handles native file upload & fallbacks
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      compressAndConvertToBase64(file, (base64, sizeStr) => {
        const newItem: CapturedMedia = {
          id: Date.now().toString() + Math.random(),
          type: file.type.startsWith("video") ? "video" : "photo",
          url: base64,
          timestamp: new Date().toLocaleTimeString(),
          size: sizeStr,
        };
        setMedia(prev => {
          const updated = [newItem, ...prev];
          localStorage.setItem("evidence_vault_media", JSON.stringify(updated));
          return updated;
        });
      });
    });
    e.target.value = "";
  };

  const deleteMedia = (id: string) => {
    setMedia(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem("evidence_vault_media", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem("evidence_vault_notes", notes);
    localStorage.setItem("evidence_vault_media", JSON.stringify(media));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDiscardAll = () => {
    if (window.confirm("Are you sure you want to discard all evidence records?")) {
      setNotes("");
      setMedia([]);
      localStorage.removeItem("evidence_vault_notes");
      localStorage.removeItem("evidence_vault_media");
    }
  };

  return (
    <>
      {/* Camera modal */}
      {showCamera && (
        <CameraModal
          onClose={() => setShowCamera(false)}
          onCapture={(base64, sizeStr) => addMediaBase64(base64, sizeStr)}
          labelClose={t("db_im_okay")}
          labelCapture={t("ev_camera_view")}
          labelFlip={t("ev_flip_camera")}
        />
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          media={media}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onDelete={deleteMedia}
        />
      )}

      <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 pb-4 overflow-y-auto bg-slate-50 min-h-full">
        <div className="flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">{t("ev_title")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t("ev_subtitle")}</p>
        </div>

        {/* Metadata cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-shrink-0">
          <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex items-start gap-3">
            <div className="bg-blue-50 text-blue-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Time Logged</p>
              <p className="text-xs font-semibold text-slate-800">{timestamp}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex items-start gap-3">
            <div className="bg-amber-50 text-amber-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">GPS Location</p>
              <p className="text-xs font-semibold text-slate-800 break-words leading-tight">{location}</p>
            </div>
          </div>
        </div>

        {/* ── CAPTURE & UPLOAD OPTIONS ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-2 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("ev_choose_evidence")}</p>
          <div className="grid grid-cols-3 gap-2">
            
            {/* Custom Camera (In-app viewfinder) */}
            <button
              onClick={() => setShowCamera(true)}
              className="bg-red-600 text-white p-2 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center text-center gap-1.5 hover:bg-red-700 shadow-sm"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-tight leading-none">Capture Evidence</span>
            </button>

            {/* System Camera Input Fallback (Works on mobile HTTP insecure connections) */}
            <button
              onClick={() => sysCameraInputRef.current?.click()}
              className="bg-orange-500 text-white p-2 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center text-center gap-1.5 hover:bg-orange-600 shadow-sm"
            >
              <Camera className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-tight leading-none">System Camera</span>
            </button>

            {/* Upload from gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-800 text-white p-2 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center text-center gap-1.5 hover:bg-slate-900 shadow-sm"
            >
              <Upload className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-tight leading-none">Choose Gallery</span>
            </button>
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <input
          ref={sysCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* ── CAPTURED EVIDENCE GRID ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex-shrink-0 min-h-[140px] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> {t("ev_evidence_list", { count: media.length })}
            </h3>
          </div>

          {media.length === 0 ? (
            <p className="text-center text-slate-400 text-xs italic my-auto">{t("ev_no_evidence")}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {media.map((item, idx) => (
                <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shadow-sm">
                  {item.type === "photo" ? (
                    <img src={item.url} className="w-full h-full object-cover" alt={`evidence-${idx}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Video className="w-8 h-8 text-slate-500" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setLightboxIdx(idx)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95"
                    >
                      <ZoomIn className="w-4 h-4 text-slate-800" />
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-md active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  {/* Info banner */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] px-1.5 py-0.5 font-mono truncate leading-none">
                    {item.size || "Photo"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── INCIDENT NOTES ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex-shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> {t("ev_evidence_details")}
          </h3>
          <textarea
            className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none placeholder-slate-400"
            rows={4}
            placeholder={t("ev_placeholder_note")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDiscardAll}
            className="flex-1 sm:flex-none px-4 py-3 bg-white border border-gray-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            Discard All
          </button>
          <button
            onClick={handleSave}
            className={clsx(
              "flex-1 px-4 py-3 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2",
              isSaved ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {isSaved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved Securely!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Record</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
