import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Clock, MapPin, Truck } from "lucide-react";
import L from "leaflet";
import { useLanguage } from "../context/LanguageContext";

const ambulanceIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180 brightness-75"
});

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function FamilyLiveTracking() {
  const { language } = useLanguage();
  const userLoc: [number, number] = [13.0827, 80.2707];
  const hospitalLoc: [number, number] = [13.0977, 80.2607];
  const [ambLoc, setAmbLoc] = useState<[number, number]>([13.0607, 80.2807]);
  const [eta, setEta] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbLoc(prev => {
        const newLat = prev[0] + (userLoc[0] - prev[0]) * 0.05;
        const newLng = prev[1] + (userLoc[1] - prev[1]) * 0.05;
        return [newLat, newLng];
      });
      setEta(prev => Math.max(1, prev - 0.5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getTranslation = (key: string) => {
    const maps: Record<string, Record<string, string>> = {
      incident_loc: {
        en: "Incident Location",
        te: "ప్రమాద స్థలం",
        hi: "दुर्घटना स्थल",
        ta: "விபத்து நடந்த இடம்",
      },
      dest_hosp: {
        en: "Destination Hospital",
        te: "గమ్యస్థాన ఆసుపత్రి",
        hi: "गंतव्य अस्पताल",
        ta: "செல்ல வேண்டிய மருத்துவமனை",
      },
      amb: {
        en: "Ambulance",
        te: "అంబులెన్స్",
        hi: "एम्बुलेंस",
        ta: "ஆம்புலன்ஸ்",
      },
      act_op: {
        en: "Active Operation",
        te: "సక్రియ చర్య",
        hi: "सक्रिय ऑपरेशन",
        ta: "செயலில் உள்ள செயல்பாடு",
      },
      eta_to_scene: {
        en: "ETA to Scene",
        te: "చేరుకునే సమయం",
        hi: "पहुंचने का समय",
        ta: "வருகை நேரம்",
      },
      unit_status: {
        en: "Unit Status",
        te: "స్థితి",
        hi: "स्थिति",
        ta: "நிலை",
      },
      dispatched: {
        en: "DISPATCHED",
        te: "బయలుదేరింది",
        hi: "भेजा गया",
        ta: "புறப்பட்டது",
      },
      assigned_dest: {
        en: "Assigned Destination",
        te: "నిర్దేశిత ఆసుపత్రి",
        hi: "निर्दिष्ट गंतव्य",
        ta: "நியமிக்கப்பட்ட இடம்",
      },
      hosp_name: {
        en: "City Hospital Emergency Room",
        te: "సిటీ హాస్పిటల్ అత్యవసర విభాగం",
        hi: "सिटी अस्पताल आपातकालीन कक्ष",
        ta: "நகர மருத்துவமனை அவசர அறை",
      },
      live: {
        en: "Live",
        te: "లైవ్",
        hi: "लाइव",
        ta: "நேரடி",
      }
    };
    return maps[key]?.[language] || maps[key]?.["en"] || key;
  };

  return (
    <div className="flex flex-col bg-slate-50" style={{ height: '100%' }}>
      {/* Map */}
      <div className="flex-1 w-full z-0 relative" style={{ minHeight: '220px' }}>
        <MapContainer center={userLoc} zoom={13} zoomControl={false} className="w-full h-full z-0">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLoc} icon={userIcon}>
            <Popup><strong>{getTranslation("incident_loc")}</strong></Popup>
          </Marker>
          <Circle center={userLoc} radius={200} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} />
          <Marker position={hospitalLoc} icon={userIcon}>
            <Popup><strong>{getTranslation("dest_hosp")}</strong></Popup>
          </Marker>
          <Marker position={ambLoc} icon={ambulanceIcon}>
            <Popup><strong>{getTranslation("amb")}</strong> (ETA: {Math.ceil(eta)} mins)</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Status panel */}
      <div className="bg-white border-t border-gray-200 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] rounded-t-2xl sm:rounded-t-3xl px-4 sm:px-5 md:px-6 pt-3 pb-4 z-10 flex-shrink-0">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div>
            <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight">{getTranslation("act_op")}</h2>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">ID: EMS-9482L</p>
          </div>
          <button className="bg-red-50 text-red-600 px-2.5 sm:px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-red-100 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div> {getTranslation("live")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          <div className="bg-slate-50 border border-gray-200 p-2.5 sm:p-3 rounded-xl shadow-sm">
            <h4 className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {getTranslation("eta_to_scene")}
            </h4>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tabular-nums">
              {Math.ceil(eta)} <span className="text-[10px] sm:text-xs text-slate-500">MINS</span>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-2.5 sm:p-3 rounded-xl shadow-sm">
            <h4 className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {getTranslation("unit_status")}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-blue-800">{getTranslation("dispatched")}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex items-start gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{getTranslation("assigned_dest")}</p>
            <p className="text-xs font-semibold text-slate-800">{getTranslation("hosp_name")}</p>
            <p className="text-[10px] text-slate-500">3.2 km from scene</p>
          </div>
        </div>
      </div>
    </div>
  );
}
