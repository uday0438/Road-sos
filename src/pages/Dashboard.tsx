import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone, Search, WifiOff, PhoneCall, Car, Activity,
  ShieldAlert, X, FolderLock, Mic, MicOff, MessageCircle, Users, MapPin
} from "lucide-react";
import clsx from "clsx";
import { useOffline } from "../OfflineContext";
import { useLanguage } from "../context/LanguageContext";
import { OFFLINE_EMERGENCY_CONTACTS } from "../constants";
import WhatsAppSOSModal from "../components/WhatsAppSOSModal";

// ── Morse SOS haptic pattern ──────────────────────────────────────────────────
const SOS_VIBRATION = [
  200, 100, 200, 100, 200,
  400,
  500, 100, 500, 100, 500,
  400,
  200, 100, 200, 100, 200
];
function triggerHaptic() {
  if ("vibrate" in navigator) navigator.vibrate(SOS_VIBRATION);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const { t } = useLanguage();

  const [isPressing, setIsPressing] = useState(false);

  // WhatsApp modal
  const [showWAModal, setShowWAModal] = useState(false);

  // Crash detection
  const [isCrashDetectionOn, setIsCrashDetectionOn] = useState(false);
  const [gForce, setGForce] = useState("1.0");
  const [crashCountdown, setCrashCountdown] = useState<number | null>(null);
  const [usingRealSensor, setUsingRealSensor] = useState(false);

  // Voice SOS
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const recognitionRef = useRef<any>(null);

  // Location — real GPS + city label
  const [userLoc, setUserLoc] = useState({ lat: 13.0827, lng: 80.2707 });
  const [locLabel, setLocLabel] = useState(t("db_loc_detecting"));
  const [locReady, setLocReady] = useState(false);

  useEffect(() => {
    setLocLabel(t("db_loc_detecting"));
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLoc({ lat, lng });
        setLocReady(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const road = data.address?.road || data.address?.suburb || "";
          setLocLabel(
            city
              ? `${road ? road + ", " : ""}${city} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`
              : `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`
          );
        } catch {
          setLocLabel(`${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
        }
      },
      () => {
        setLocLabel(t("db_loc_default"));
        setLocReady(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [t]);

  // ── Real DeviceMotion crash detection ──────────────────────────────────────
  useEffect(() => {
    if (!isCrashDetectionOn) return;
    if (typeof DeviceMotionEvent !== "undefined") {
      setUsingRealSensor(true);
      const handler = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc) return;
        const g = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2) / 9.81;
        setGForce(g.toFixed(1));
        if (g > 4.0 && crashCountdown === null) {
          setCrashCountdown(10);
          triggerHaptic();
        }
      };
      window.addEventListener("devicemotion", handler);
      return () => window.removeEventListener("devicemotion", handler);
    } else {
      setUsingRealSensor(false);
      const interval = setInterval(() => {
        setGForce((0.8 + Math.random() * 0.4).toFixed(1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isCrashDetectionOn, crashCountdown]);

  // Crash countdown
  useEffect(() => {
    if (crashCountdown === null) return;
    if (crashCountdown > 0) {
      const timerId = setTimeout(() => setCrashCountdown(p => p! - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCrashCountdown(null);
      setIsCrashDetectionOn(false);
      navigate("/golden-hour");
    }
  }, [crashCountdown, navigate]);

  // ── Voice SOS ─────────────────────────────────────────────────────────────
  const startVoiceListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceStatus("Not supported in this browser"); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ").toLowerCase();
      if (["help", "sos", "accident", "emergency", "108"].some(kw => transcript.includes(kw))) {
        recognition.stop();
        setVoiceActive(false);
        setVoiceStatus("🚨 Keyword detected!");
        triggerHaptic();
        navigate("/golden-hour");
      }
    };
    recognition.onerror = () => { setVoiceActive(false); setVoiceStatus("Mic error"); };
    recognition.onend = () => { if (voiceActive) recognition.start(); };
    recognitionRef.current = recognition;
    recognition.start();
    setVoiceStatus(t("db_voice_listening"));
  }, [navigate, voiceActive, t]);

  const toggleVoice = () => {
    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      setVoiceStatus("");
    } else {
      setVoiceActive(true);
      startVoiceListening();
    }
  };

  const handleSOSClick = () => {
    triggerHaptic();
    navigate("/golden-hour");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 pb-4 overflow-y-auto" style={{ minHeight: "100%" }}>

      {/* ── WhatsApp SOS Modal ── */}
      <WhatsAppSOSModal
        isOpen={showWAModal}
        onClose={() => setShowWAModal(false)}
        lat={userLoc.lat}
        lng={userLoc.lng}
        locationLabel={locLabel}
      />

      {/* ── Voice SOS Banner ── */}
      {voiceActive && (
        <div className="flex-shrink-0 bg-indigo-900 text-white rounded-xl px-4 py-2.5 flex items-center gap-3 animate-pulse">
          <Mic className="w-4 h-4 text-indigo-300 flex-shrink-0" />
          <span className="text-xs font-bold flex-1">{voiceStatus}</span>
          <button onClick={toggleVoice} className="text-indigo-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Location pill ── */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-shrink-0">
        <MapPin className={clsx("w-3.5 h-3.5 flex-shrink-0", locReady ? "text-green-600" : "text-slate-300")} />
        <span className="text-[10px] font-bold text-slate-600 flex-1 truncate">
          {locLabel}
        </span>
        {locReady && (
          <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100 flex-shrink-0">GPS ✓</span>
        )}
      </div>

      {/* ── SOS BUTTON CARD ── */}
      <div
        className="flex-shrink-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
        style={{ minHeight: "300px" }}
      >
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-slate-50 dark:bg-slate-850 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-50/30 dark:bg-red-950/10 rounded-full blur-2xl pointer-events-none" />

        {/* SOS Button */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-8 border-red-50 dark:border-red-950/30 flex items-center justify-center mb-4 shadow-inner bg-white dark:bg-slate-900 z-10">
          <div className="absolute w-36 h-36 sm:w-40 sm:h-40 bg-red-500/20 rounded-full animate-ping-slow" />
          <div className="absolute w-36 h-36 sm:w-40 sm:h-40 bg-red-500/10 rounded-full animate-ping-slow" style={{ animationDelay: "1s" }} />
          <button
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onMouseLeave={() => setIsPressing(false)}
            onTouchStart={() => setIsPressing(true)}
            onTouchEnd={() => setIsPressing(false)}
            onClick={handleSOSClick}
            className={clsx(
              "relative z-10 w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 rounded-full text-white font-black shadow-xl shadow-red-500/30 dark:shadow-red-900/50 flex flex-col items-center justify-center transform transition-all duration-200 cursor-pointer",
              isPressing ? "scale-95 brightness-90 shadow-red-650" : "hover:scale-103 active:scale-95"
            )}
          >
            <span className="text-4xl sm:text-5xl tracking-widest font-heading">SOS</span>
            <span className="text-[9px] sm:text-[10px] font-normal opacity-80 mt-1 uppercase tracking-wider">{t("db_sos_tap")}</span>
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-800">{t("db_sos_title")}</h2>
        <p className="text-xs text-slate-500 px-4 mt-1 max-w-xs">{t("db_sos_desc")}</p>

        {/* WhatsApp SOS + Voice row */}
        <div className="flex gap-2 mt-4 w-full max-w-xs">
          <button
            onClick={() => setShowWAModal(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl py-3 shadow-md active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {t("db_whatsapp_sos")}
          </button>
          <button
            onClick={toggleVoice}
            className={clsx(
              "flex items-center justify-center gap-1.5 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all border",
              voiceActive
                ? "bg-indigo-600 text-white border-indigo-700 animate-pulse"
                : "bg-white text-slate-700 border-gray-200 hover:bg-slate-50"
            )}
          >
            {voiceActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            {voiceActive ? t("db_voice_active") : t("db_voice_inactive")}
          </button>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {[
          { label: t("db_find_services"), icon: Search, color: "bg-slate-100 text-slate-600 border-gray-200", path: "/nearby" },
          { label: t("nav_vault"), icon: FolderLock, color: "bg-blue-50 text-blue-600 border-blue-100", path: "/evidence" },
          { label: t("nav_bystander"), icon: Users, color: "bg-purple-50 text-purple-600 border-purple-100", path: "/bystander" },
          { label: t("db_call_108"), icon: Phone, color: "bg-green-100 text-green-600 border-green-200", path: null },
        ].map(({ label, icon: Icon, color, path }) => (
          <button
            key={label}
            onClick={() => path ? navigate(path) : window.open("tel:108")}
            className="bg-white border border-gray-200 p-2 sm:p-3 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
          >
            <div className={clsx("w-9 h-9 flex items-center justify-center rounded-xl shadow-sm border", color)}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[8px] sm:text-[9px] text-center font-bold uppercase tracking-tight text-slate-700 leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* ── CRASH DETECTION ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            {t("db_crash_title")}
            {usingRealSensor && isCrashDetectionOn && (
              <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">{t("db_crash_real_sensor")}</span>
            )}
          </h3>
          <button
            onClick={() => setIsCrashDetectionOn(p => !p)}
            className={clsx(
              "text-[10px] font-bold px-3 py-1 rounded-full transition-all",
              isCrashDetectionOn ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            )}
          >
            {isCrashDetectionOn ? t("db_crash_active") : t("db_crash_off")}
          </button>
        </div>

        {isCrashDetectionOn ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className={clsx("w-4 h-4", parseFloat(gForce) > 3 ? "text-red-500 animate-pulse" : "text-slate-400")} />
                <span className="text-xs text-slate-600 font-medium">
                  {usingRealSensor ? t("db_crash_live_acc") : t("db_crash_gforce_sensor")}
                </span>
              </div>
              <span className={clsx("font-mono text-sm font-black", parseFloat(gForce) > 3 ? "text-red-600" : "text-slate-700")}>
                {gForce}G
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={clsx("h-full rounded-full transition-all duration-300", parseFloat(gForce) > 3 ? "bg-red-500" : "bg-green-400")}
                style={{ width: `${Math.min(100, (parseFloat(gForce) / 6) * 100)}%` }}
              />
            </div>
            <button
              onClick={() => { setGForce("6.2"); setCrashCountdown(10); triggerHaptic(); }}
              className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all"
            >
              {t("db_crash_simulate")}
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500">{t("db_crash_desc")}</p>
        )}
      </div>

      {/* ── OFFLINE DIRECTORY ── */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 shadow-sm flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2">
              <WifiOff className="w-4 h-4" /> {t("db_offline_dir")}
            </h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded-full">{t("db_offline_cached")}</span>
          </div>
          <div className="space-y-2">
            {[...OFFLINE_EMERGENCY_CONTACTS.hospitals, ...OFFLINE_EMERGENCY_CONTACTS.police].slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white border border-amber-200 p-2.5 rounded-xl shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.distance}</p>
                </div>
                <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-amber-100 hover:text-amber-700 transition-colors flex-shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CRASH MODAL ── */}
      {crashCountdown !== null && (
        <div className="fixed inset-0 bg-red-900/96 z-50 flex items-center justify-center p-6 flex-col text-center backdrop-blur-md">
          <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-red-100 mb-4 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{t("db_impact_detected")}</h2>
          <p className="text-red-200 mb-6 max-w-sm text-xs sm:text-sm">
            {t("db_impact_desc")}
          </p>
          <div className="text-7xl sm:text-8xl font-black text-white mb-4 tabular-nums">{crashCountdown}</div>
          <p className="text-red-300 text-xs mb-8">{t("db_impact_sub")}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button
              onClick={() => setShowWAModal(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 border border-green-600 text-white rounded-xl py-3 px-4 font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:scale-95 text-xs"
            >
              <MessageCircle className="w-4 h-4" /> {t("db_whatsapp_sos")}
            </button>
            <button
              onClick={() => { setCrashCountdown(null); setIsCrashDetectionOn(false); }}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl py-3 px-4 font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:scale-95 text-xs"
            >
              <X className="w-4 h-4" /> {t("db_im_okay")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
