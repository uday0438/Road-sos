import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, PhoneCall, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import WhatsAppSOSModal from "../components/WhatsAppSOSModal";

// ── SVG Countdown Ring ──────────────────────────────────────────────────────
function CountdownRing({ timeLeft, total, remainingLabel, titleLabel }: { timeLeft: number; total: number; remainingLabel: string; titleLabel: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // ≈ 326.7
  const elapsed = total - timeLeft;
  const progress = elapsed / total;
  const dashOffset = circumference * (1 - progress);

  // Color transitions: green → yellow → orange → red
  const pct = progress * 100;
  const ringColor = pct < 25 ? "#22c55e" : pct < 50 ? "#eab308" : pct < 75 ? "#f97316" : "#ef4444";

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 sm:w-52 sm:h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 1s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-black text-white text-2xl sm:text-3xl tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{remainingLabel}</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 italic font-mono uppercase tracking-wider mt-2">
        {titleLabel}
      </p>
    </div>
  );
}

export default function GoldenHour() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const TOTAL = 3600;
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  
  // WhatsApp modal state
  const [showWAModal, setShowWAModal] = useState(false);

  const checklistItems = [
    { id: 1, key: "gh_check1", completed: true },
    { id: 2, key: "gh_check2", completed: false },
    { id: 3, key: "gh_check3", completed: false },
    { id: 4, key: "gh_check4", completed: false },
    { id: 5, key: "gh_check5", completed: false },
  ];

  const [checklist, setChecklist] = useState(checklistItems);

  // Get location
  const [loc, setLoc] = useState({ lat: 13.0827, lng: 80.2707 });
  const [locLabel, setLocLabel] = useState("Detecting location...");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (p) => {
        const lat = p.coords.latitude;
        const lng = p.coords.longitude;
        setLoc({ lat, lng });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          setLocLabel(city ? `${city} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)` : `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
        } catch {
          setLocLabel(`${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
        }
      },
      () => {
        setLocLabel("Chennai (Default)");
      }
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCheck = (id: number) =>
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));

  const completedCount = checklist.filter(i => i.completed).length;

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-3 pb-4 overflow-y-auto bg-slate-50 min-h-full">
      {/* WhatsApp Modal */}
      <WhatsAppSOSModal
        isOpen={showWAModal}
        onClose={() => setShowWAModal(false)}
        lat={loc.lat}
        lng={loc.lng}
        locationLabel={locLabel}
      />

      {/* ── Timer Card with SVG Ring ── */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t("gh_title")}</span>
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20">
            {t("gh_critical")}
          </span>
        </div>

        <CountdownRing timeLeft={timeLeft} total={TOTAL} remainingLabel={t("gh_remaining")} titleLabel={t("gh_timer_label")} />

        {/* Progress summary */}
        <div className="mt-4 w-full flex items-center justify-between px-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t("gh_checklist_title")}</span>
          <span className="text-[10px] font-bold text-slate-400">
            {t("gh_checklist_done", { done: completedCount, total: checklist.length })}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Emergency actions row ── */}
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <a
          href="tel:108"
          className="bg-red-600 text-white rounded-xl p-3 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-red-700"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-black uppercase tracking-widest">{t("db_call_108")}</span>
        </a>
        <button
          onClick={() => setShowWAModal(true)}
          className="bg-green-600 text-white rounded-xl p-3 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-green-700"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-black uppercase tracking-widest">{t("db_whatsapp_sos")}</span>
        </button>
      </div>

      {/* ── Live Ambulance Tracking Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Ambulance Dispatched?</h4>
            <p className="text-[10px] text-blue-200">Track response team in real-time</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/tracking")}
          className="bg-white text-blue-700 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-md hover:bg-blue-50 cursor-pointer"
        >
          Live Track
        </button>
      </div>

      {/* ── Checklist ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">{t("gh_checklist_title")}</h3>
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors border border-slate-100"
            >
              <div className="flex-shrink-0">
                {item.completed
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 stroke-[2px]" />
                  : <Circle className="w-5 h-5 text-slate-300 stroke-[2px]" />
                }
              </div>
              <span className={`text-xs sm:text-sm font-bold flex-1 ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {t(item.key as any)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Secondary actions ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/nearby")}
          className="bg-white border border-gray-200 text-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center">{t("nb_title")}</span>
        </button>
        <button
          onClick={() => navigate("/ai-assistant")}
          className="bg-white border border-gray-200 text-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center">{t("gh_ai_support")}</span>
        </button>
      </div>
    </div>
  );
}
