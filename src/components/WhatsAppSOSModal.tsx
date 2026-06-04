import React, { useState, useEffect } from "react";
import {
  MessageCircle, Phone, MapPin, AlertTriangle,
  CheckCircle2, X, ChevronRight, Settings, ExternalLink
} from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../context/LanguageContext";

interface Contact {
  name: string;
  phone: string;
  relation: string;
}

interface WhatsAppSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  locationLabel?: string;
}

function buildMessage(lat: number, lng: number, senderName: string, bloodGroup: string, conditions: string, lang: string) {
  const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (lang === "te") {
    return [
      `🚨 *అత్యవసర సహాయం (SOS) — RoadSoS AI*`,
      ``,
      `${senderName ? `*${senderName}*` : "ఒక వ్యక్తి"} రోడ్డు ప్రమాదానికి గురయ్యారు. వెంటనే సహాయం కావాలి!`,
      ``,
      `📍 *స్థానం:* ${mapLink}`,
      `🕐 *సమయం:* ${timeStr}, ${dateStr}`,
      bloodGroup ? `🩸 *రక్త రకం:* ${bloodGroup}` : "",
      conditions ? `🏥 *ఆరోగ్య సమస్యలు:* ${conditions}` : "",
      ``,
      `⚡ *దయచేసి ఇవి చేయండి:*`,
      `1. వెంటనే *108* (అంబులెన్స్) కి కాల్ చేయండి`,
      `2. పారామెడిక్స్‌తో ఈ స్థానాన్ని పంచుకోండి`,
      `3. మీరు సమీపంలో ఉంటే వెంటనే ఈ స్థానానికి రండి`,
      ``,
      `_RoadSoS AI ద్వారా పంపబడింది — IIT మద్రాస్ CoERS_`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (lang === "hi") {
    return [
      `🚨 *आपातकालीन सहायता (SOS) — RoadSoS AI*`,
      ``,
      `${senderName ? `*${senderName}*` : "कोई व्यक्ति"} सड़क दुर्घटना का शिकार हो गए हैं। तत्काल सहायता की आवश्यकता है!`,
      ``,
      `📍 *स्थान:* ${mapLink}`,
      `🕐 *समय:* ${timeStr}, ${dateStr}`,
      bloodGroup ? `🩸 *रक्त समूह:* ${bloodGroup}` : "",
      conditions ? `🏥 *चिकित्सीय स्थितियां:* ${conditions}` : "",
      ``,
      `⚡ *कृपया ये कदम उठाएं:*`,
      `1. तुरंत *108* (एम्बुलेंस) पर कॉल करें`,
      `2. पैरामेडिक्स के साथ इस स्थान को साझा करें`,
      `3. यदि आप पास में हैं तो तुरंत दुर्घटना स्थल पर आएं`,
      ``,
      `_RoadSoS AI के माध्यम से भेजा गया — IIT मद्रास CoERS_`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (lang === "ta") {
    return [
      `🚨 *அவசரகால உதவி (SOS) — RoadSoS AI*`,
      ``,
      `${senderName ? `*${senderName}*` : "ஒரு நபர்"} சாலை விபத்தில் சிக்கியுள்ளார். உடனடி உதவி தேவைப்படுகிறது!`,
      ``,
      `📍 *இருப்பிடம்:* ${mapLink}`,
      `🕐 *நேரம்:* ${timeStr}, ${dateStr}`,
      bloodGroup ? `🩸 *இரத்த பிரிவு:* ${bloodGroup}` : "",
      conditions ? `🏥 *மருத்துவ நிலைமைகள்:* ${conditions}` : "",
      ``,
      `⚡ *தயவுசெய்து பின்வருவனவற்றைச் செய்யவும்:*`,
      `1. உடனடியாக *108* (ஆம்புலன்ஸ்) ஐ அழைக்கவும்`,
      `2. மருத்துவ பணியாளர்களுடன் இந்த இருப்பிடத்தைப் பகிரவும்`,
      `3. அருகில் இருந்தால் சம்பவ இடத்திற்கு வரவும்`,
      ``,
      `_RoadSoS AI வழியாக அனுப்பப்பட்டது — IIT மெட்ராஸ் CoERS_`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Default English
  return [
    `🚨 *EMERGENCY SOS — RoadSoS AI*`,
    ``,
    `${senderName ? `*${senderName}* has` : "Someone has"} been in a road accident and needs immediate help!`,
    ``,
    `📍 *Location:* ${mapLink}`,
    `🕐 *Time:* ${timeStr}, ${dateStr}`,
    bloodGroup ? `🩸 *Blood Group:* ${bloodGroup}` : "",
    conditions ? `🏥 *Medical Conditions:* ${conditions}` : "",
    ``,
    `⚡ *PLEASE:*`,
    `1. Call *108* (Ambulance) immediately`,
    `2. Share this location with paramedics`,
    `3. Come to the location if close by`,
    ``,
    `_Sent via RoadSoS AI — IIT Madras CoERS_`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function WhatsAppSOSModal({ isOpen, onClose, lat, lng, locationLabel }: WhatsAppSOSModalProps) {
  const { t, language } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [senderName, setSenderName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState("");
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  // Load contacts from localStorage (Medical ID saved in Settings)
  useEffect(() => {
    if (!isOpen) return;
    setSentTo(new Set());
    setShowPreview(false);

    const name = localStorage.getItem("medid_name") || "";
    const blood = localStorage.getItem("medid_blood") || "";
    const cond = localStorage.getItem("medid_conditions") || "";
    setSenderName(name);
    setBloodGroup(blood);
    setConditions(cond);

    const contactList: Contact[] = [];

    // Primary contact
    const p1Phone = localStorage.getItem("medid_emergency_phone") || "";
    const p1Name = localStorage.getItem("medid_emergency_name") || "";
    const p1Rel = localStorage.getItem("medid_emergency_relation") || "";
    if (p1Phone) contactList.push({ name: p1Name || "Primary Contact", phone: p1Phone, relation: p1Rel || "Emergency" });

    // Secondary contact
    const p2Phone = localStorage.getItem("medid_emergency2_phone") || "";
    const p2Name = localStorage.getItem("medid_emergency2_name") || "";
    const p2Rel = localStorage.getItem("medid_emergency2_relation") || "";
    if (p2Phone) contactList.push({ name: p2Name || "Backup Contact", phone: p2Phone, relation: p2Rel || "Backup" });

    setContacts(contactList);
  }, [isOpen]);

  if (!isOpen) return null;

  const message = buildMessage(lat, lng, senderName, bloodGroup, conditions, language);
  const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

  const sendToContact = (contact: Contact) => {
    const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
    setSentTo(prev => new Set([...prev, contact.phone]));
  };

  const sendAll = () => {
    contacts.forEach((c, i) => {
      setTimeout(() => {
        const cleanPhone = c.phone.replace(/[^0-9]/g, "");
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
        setSentTo(prev => new Set([...prev, c.phone]));
      }, i * 1000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-green-600 px-4 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-base uppercase tracking-tight">{t("wa_title")}</h2>
                <p className="text-green-100 text-[10px] font-medium mt-0.5">{t("wa_subtitle")}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location row */}
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-green-200 flex-shrink-0" />
            <p className="text-[10px] text-green-100 font-medium flex-1 truncate">
              {locationLabel || `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`}
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="text-[9px] text-green-200 font-bold flex items-center gap-0.5 flex-shrink-0"
            >
              View <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* No contacts saved */}
          {contacts.length === 0 ? (
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t("wa_no_contacts")}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {t("wa_no_contacts_desc")}
                </p>
              </div>
              <a
                href="#/settings"
                onClick={onClose}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all"
              >
                <Settings className="w-4 h-4" /> {t("nav_settings")}
              </a>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Message preview toggle */}
              <button
                onClick={() => setShowPreview(p => !p)}
                className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 active:scale-95 transition-all"
              >
                <span className="text-xs font-bold text-green-800">{t("wa_preview")}</span>
                <ChevronRight className={clsx("w-4 h-4 text-green-600 transition-transform", showPreview && "rotate-90")} />
              </button>

              {showPreview && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-[10px] text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                  {message}
                </div>
              )}

              {/* Contacts */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("wa_priority_contacts")}</p>
                {contacts.map((contact, idx) => {
                  const isSent = sentTo.has(contact.phone);
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all",
                        isSent ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
                      )}
                    >
                      {/* Priority badge */}
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black",
                        idx === 0 ? "bg-red-600 text-white" : "bg-orange-500 text-white"
                      )}>
                        P{idx + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{contact.name}</p>
                        <p className="text-[10px] text-slate-500">{contact.relation} · {contact.phone}</p>
                      </div>

                      {/* Send button */}
                      <button
                        onClick={() => sendToContact(contact)}
                        className={clsx(
                          "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest flex-shrink-0 active:scale-95 transition-all shadow-sm",
                          isSent
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-green-600 text-white hover:bg-green-700"
                        )}
                      >
                        {isSent ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> {t("wa_sent")}</>
                        ) : (
                          <><MessageCircle className="w-3.5 h-3.5" /> {t("wa_send")}</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Send All button */}
              {contacts.length > 1 && (
                <button
                  onClick={sendAll}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t("wa_send_all", { count: contacts.length })}
                </button>
              )}

              {/* Also call */}
              <a
                href="tel:108"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {t("wa_also_call")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
