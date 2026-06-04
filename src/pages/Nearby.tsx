import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Hospital, Shield, Ambulance, Phone, WifiOff } from "lucide-react";
import clsx from "clsx";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ServiceLocation } from "../types";
import { useOffline } from "../OfflineContext";
import { useLanguage } from "../context/LanguageContext";
import { OFFLINE_EMERGENCY_CONTACTS } from "../constants";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Nearby() {
  const { isOffline } = useOffline();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"hospital" | "police" | "ambulance">("hospital");
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number]>([13.0827, 80.2707]);
  const [locLabel, setLocLabel] = useState(t("nb_getting_loc"));
  const [locReady, setLocReady] = useState(false);

  // Get real GPS location
  useEffect(() => {
    setLocLabel(t("nb_getting_loc"));
    if (!navigator.geolocation) {
      setLocLabel("Location unavailable");
      setLocReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLoc([lat, lng]);
        setLocReady(true);
        // Reverse geocode for city name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          setLocLabel(city ? `📍 ${city}` : `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setLocLabel(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      },
      () => {
        setLocLabel("📍 Chennai (default)");
        setLocReady(true);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [t]);

  const fetchServices = async (type: string) => {
    if (isOffline) {
      setLoading(true);
      setTimeout(() => {
        let offlineData: ServiceLocation[] = [];
        if (type === 'hospital') offlineData = OFFLINE_EMERGENCY_CONTACTS.hospitals as ServiceLocation[];
        else if (type === 'police') offlineData = OFFLINE_EMERGENCY_CONTACTS.police as ServiceLocation[];
        else offlineData = OFFLINE_EMERGENCY_CONTACTS.ambulance as ServiceLocation[];
        setLocations(offlineData);
        setLoading(false);
      }, 400);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/services/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, lat: userLoc[0], lng: userLoc[1] }),
      });
      const data = await res.json();
      setLocations(data);
    } catch (e) {
      setLocations([{ id: 99, name: "Offline - State Gen. Hospital", distance: "Unknown", phone: "108", lat: userLoc[0] + 0.01, lng: userLoc[1] - 0.01 }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(activeTab); }, [activeTab, isOffline]);

  return (
    <div className="flex flex-col bg-slate-50" style={{ height: '100%' }}>
      {/* Header */}
      <div className="bg-white px-3 sm:px-4 pt-3 pb-2 z-10 shadow-sm flex-shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base sm:text-lg text-slate-800">{t("nb_title")}</h2>
          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
            {locReady ? locLabel : "🔍 Detecting..."}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {[
            { key: 'hospital', icon: Hospital, label: t("nb_tab_hospital") },
            { key: 'police', icon: Shield, label: t("nb_tab_police") },
            { key: 'ambulance', icon: Ambulance, label: t("nb_tab_ambulance") },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={clsx(
                "flex-1 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                activeTab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
              )}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '200px' }}>
        {isOffline && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest border border-amber-600 w-max">
            <WifiOff className="w-3 h-3" /> {t("db_offline_cached")}
          </div>
        )}
        <MapContainer center={userLoc} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
          <ChangeView center={userLoc} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLoc}><Popup>You are here</Popup></Marker>
          {locations.map(loc => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="font-semibold">{loc.name}</div>
                <div className="text-xs text-slate-500 mb-2">{loc.distance}</div>
                <a href={`tel:${loc.phone}`} className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">Call {loc.phone}</a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Services list (bottom panel) */}
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.06)] z-10 flex-shrink-0 px-3 sm:px-4 pt-3 pb-3 max-h-[38vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex justify-between items-center mb-2.5 sticky top-0 bg-white pb-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("nb_readiness")}</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{locations.length} FOUND</span>
        </div>
        <div className="space-y-2">
          {locations.map((loc) => (
            <div key={loc.id} className={clsx("p-3 border rounded-xl flex items-center justify-between shadow-sm", isOffline ? "bg-amber-50/50 border-amber-200" : "bg-white border-gray-200")}>
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-xs font-bold text-slate-800 truncate">{loc.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{loc.distance} {loc.eta ? `• ${loc.eta} ETA` : ''}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {loc.readiness && (
                  <span className={clsx("text-[9px] font-bold px-1.5 py-0.5 rounded hidden sm:block", loc.readiness === 'High' ? 'text-green-600 bg-green-100' : 'text-amber-600 bg-amber-100')}>
                    {loc.readiness === 'High' ? '95% READY' : `${loc.readiness}`}
                  </span>
                )}
                <a href={`tel:${loc.phone}`} className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase whitespace-nowrap hover:text-blue-800 transition bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                  <Phone className="w-3 h-3" />
                  <span className="hidden sm:inline">Call</span> {loc.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
