import React, { useState, useRef, useEffect } from "react";
import { Send, WifiOff, AlertTriangle, MapPin, Key, ExternalLink } from "lucide-react";
import clsx from "clsx";
import type { Message } from "../types";
import { useOffline } from "../OfflineContext";
import { useLanguage } from "../context/LanguageContext";

export default function AIAssistant() {
  const { isOffline } = useOffline();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);
  const [locLoading, setLocLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize and translate greeting on language change (only if chat hasn't started)
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: "1",
          text: language === "te" 
            ? "హలో! నేను RoadSoS AI. ప్రథమ చికిత్స, అత్యవసర అంబులెన్స్, మరియు సహాయం గురించి నేను మీకు సలహాలు ఇవ్వగలను. నేను మీకు ప్రస్తుతం ఎలా సహాయపడగలను?"
            : language === "hi"
            ? "नमस्ते! मैं RoadSoS AI हूँ। मैं आपको आपातकालीन प्राथमिक चिकित्सा, एम्बुलेंस और परिवार के संपर्कों के बारे में मार्गदर्शन कर सकता हूँ। मैं अभी आपकी क्या सहायता कर सकता हूँ?"
            : language === "ta"
            ? "வணக்கம்! நான் RoadSoS AI. அவசரகால முதலுதவி, ஆம்புலன்ஸ் மற்றும் குடும்ப தொடர்புகளுக்கு நான் உங்களுக்கு உதவ முடியும். நான் இப்போது உங்களுக்கு எவ்வாறு உதவ வேண்டும்?"
            : "Hello! I'm RoadSoS AI. I can guide you through emergency first aid, help coordinate ambulance, police, and family — and keep you calm during the Golden Hour. How can I help you right now?",
          sender: "ai",
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [language]);

  // ── Get real GPS location ─────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Try reverse geocode with nominatim (free, no API key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          setLocation({ lat, lng, city });
        } catch {
          setLocation({ lat, lng });
        }
        setLocLoading(false);
      },
      () => {
        setLocation({ lat: 13.0827, lng: 80.2707, city: "Chennai (default)" });
        setLocLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!messageText) {
      setInput("");
    }
    setIsTyping(true);

    if (isOffline) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: t("ai_offline_alert"),
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            hasLocation: !!location,
            lat: location?.lat,
            lng: location?.lng,
            city: location?.city,
            mapsLink: location
              ? `https://maps.google.com/?q=${location.lat},${location.lng}`
              : null,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      // Handle API key / server errors returned as text
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: data.text,
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: `❌ ${data.error}`,
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "⚠️ Could not reach server. Check your connection. For emergencies, call 108 immediately.",
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    t("ai_chip_cpr"),
    t("ai_chip_bleeding"),
    t("ai_chip_shock"),
    t("ai_chip_fracture"),
  ];

  return (
    <div className="flex flex-col bg-slate-50" style={{ height: "100%" }}>
      {/* ── Status banner ── */}
      {isOffline ? (
        <div className="bg-amber-600 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b border-amber-700 flex-shrink-0">
          <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
          {t("ai_status_offline")}
        </div>
      ) : (
        <div className="bg-amber-50 text-amber-800 px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b border-amber-100 flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {t("ai_subtitle")}
        </div>
      )}

      {/* ── Location bar ── */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-2 flex-shrink-0">
        <MapPin className={clsx("w-3.5 h-3.5 flex-shrink-0", location ? "text-green-600" : "text-slate-400")} />
        <span className="text-[10px] font-bold text-slate-600 flex-1 truncate">
          {locLoading
            ? t("nb_getting_loc")
            : location?.city
              ? `📍 ${location.city} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
              : `📍 ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}`}
        </span>
        {location && (
          <a
            href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-[9px] font-bold text-blue-600 flex items-center gap-0.5 flex-shrink-0"
          >
            {t("nb_directions")} <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
        ref={scrollRef}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-3">
          {t("ai_title")} · IIT Madras
        </h3>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx("flex gap-2 sm:gap-3", msg.sender === "user" ? "flex-row-reverse" : "")}
          >
            <div
              className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 self-end text-white",
                msg.sender === "ai" ? "bg-slate-800" : "bg-red-600"
              )}
            >
              <span className="text-[9px] font-bold">{msg.sender === "ai" ? "AI" : "ME"}</span>
            </div>
            <div
              className={clsx(
                "p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[80%] shadow-sm",
                msg.sender === "user"
                  ? "bg-red-600 text-white rounded-tr-none"
                  : "bg-white text-slate-700 rounded-tl-none border border-gray-200"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 self-end">
              <span className="text-[9px] font-bold">AI</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Quick prompts ── */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ WebkitOverflowScrolling: "touch" }}>
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => { handleSend(p); }}
              className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 text-[10px] font-bold rounded-full shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all active:scale-95 whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── API key warning ── */}
      {!isOffline && (
        <div className="px-3 pb-1 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
            <Key className="w-3 h-3 text-blue-500 flex-shrink-0" />
            <span className="text-[9px] text-blue-700 font-medium">
              Needs valid API key (AIzaSy...) in .env file.{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="font-bold underline">
                Get free key →
              </a>
            </span>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="px-3 py-3 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("ai_placeholder")}
            className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-200 shadow-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all flex-shrink-0 shadow-sm self-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
