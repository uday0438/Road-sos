import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Globe, Shield, RefreshCw, Heart, Phone, AlertCircle, User, Pill, Info } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../context/LanguageContext";
import { LanguageCode } from "../i18n/translations";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export default function Settings() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [saved, setSaved] = useState(false);

  // Medical ID fields
  const [medId, setMedId] = useState({
    name: localStorage.getItem("medid_name") || "",
    bloodGroup: localStorage.getItem("medid_blood") || "",
    allergies: localStorage.getItem("medid_allergies") || "",
    medications: localStorage.getItem("medid_medications") || "",
    conditions: localStorage.getItem("medid_conditions") || "",
    
    // Primary Emergency Contact
    emergencyName: localStorage.getItem("medid_emergency_name") || "",
    emergencyPhone: localStorage.getItem("medid_emergency_phone") || "",
    emergencyRelation: localStorage.getItem("medid_emergency_relation") || "",
    
    // Backup Emergency Contact
    emergency2Name: localStorage.getItem("medid_emergency2_name") || "",
    emergency2Phone: localStorage.getItem("medid_emergency2_phone") || "",
    emergency2Relation: localStorage.getItem("medid_emergency2_relation") || "",
  });

  const saveMedId = () => {
    // Save each field
    localStorage.setItem("medid_name", medId.name);
    localStorage.setItem("medid_blood", medId.bloodGroup);
    localStorage.setItem("medid_allergies", medId.allergies);
    localStorage.setItem("medid_medications", medId.medications);
    localStorage.setItem("medid_conditions", medId.conditions);

    // Primary
    localStorage.setItem("medid_emergency_name", medId.emergencyName);
    localStorage.setItem("medid_emergency_phone", medId.emergencyPhone);
    localStorage.setItem("medid_emergency_relation", medId.emergencyRelation);

    // Backup
    localStorage.setItem("medid_emergency2_name", medId.emergency2Name);
    localStorage.setItem("medid_emergency2_phone", medId.emergency2Phone);
    localStorage.setItem("medid_emergency2_relation", medId.emergency2Relation);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
  ];

  const inputClass = "w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-200 placeholder-slate-400 transition";

  return (
    <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-4 pb-4 overflow-y-auto bg-slate-50 min-h-full">
      <div className="flex flex-col gap-1 mb-1">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" /> {t("se_title")}
        </h2>
        <p className="text-xs text-slate-500">{t("se_subtitle")}</p>
      </div>

      {/* ── MEDICAL ID CARD ─────────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-red-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">{t("se_medid_title")}</h3>
            <p className="text-red-200 text-[10px] font-medium">{t("se_medid_sub")}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[9px] bg-white/20 text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-white/20">
              🏥 CRITICAL INFO
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Name */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1.5">
              <User className="w-3 h-3" /> {t("se_fullname")}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Your full name"
              value={medId.name}
              onChange={e => setMedId(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1.5">
              <Pill className="w-3 h-3 text-red-500" /> {t("se_bloodgroup")}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setMedId(p => ({ ...p, bloodGroup: bg }))}
                  className={clsx(
                    "py-2 rounded-xl text-[10px] font-black border transition-all active:scale-95",
                    medId.bloodGroup === bg
                      ? "bg-red-600 text-white border-red-700 shadow-md"
                      : "bg-slate-50 text-slate-600 border-gray-200 hover:bg-red-50 hover:border-red-200"
                  )}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-3 h-3 text-amber-500" /> {t("se_allergies")}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Penicillin, Peanuts, Aspirin"
              value={medId.allergies}
              onChange={e => setMedId(p => ({ ...p, allergies: e.target.value }))}
            />
          </div>

          {/* Medications */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1.5">
              <Pill className="w-3 h-3" /> {t("se_medications")}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Metformin 500mg, Lisinopril"
              value={medId.medications}
              onChange={e => setMedId(p => ({ ...p, medications: e.target.value }))}
            />
          </div>

          {/* Medical conditions */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mb-1.5">
              <Heart className="w-3 h-3 text-rose-500" /> {t("se_conditions")}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Diabetic, Hypertension, Epilepsy"
              value={medId.conditions}
              onChange={e => setMedId(p => ({ ...p, conditions: e.target.value }))}
            />
          </div>

          {/* Emergency contact (Primary) */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-green-600" /> {t("se_emergency_contact")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className={inputClass}
                placeholder={t("se_contact_name")}
                value={medId.emergencyName}
                onChange={e => setMedId(p => ({ ...p, emergencyName: e.target.value }))}
              />
              <input
                type="text"
                className={inputClass}
                placeholder="Relation (e.g. Spouse)"
                value={medId.emergencyRelation}
                onChange={e => setMedId(p => ({ ...p, emergencyRelation: e.target.value }))}
              />
            </div>
            <input
              type="tel"
              className={inputClass}
              placeholder={t("se_phone")}
              value={medId.emergencyPhone}
              onChange={e => setMedId(p => ({ ...p, emergencyPhone: e.target.value }))}
            />
          </div>

          {/* Emergency contact 2 (Backup) */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-orange-500" /> {t("se_emergency_contact2")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className={inputClass}
                placeholder={t("se_contact_name")}
                value={medId.emergency2Name}
                onChange={e => setMedId(p => ({ ...p, emergency2Name: e.target.value }))}
              />
              <input
                type="text"
                className={inputClass}
                placeholder="Relation (e.g. Brother)"
                value={medId.emergency2Relation}
                onChange={e => setMedId(p => ({ ...p, emergency2Relation: e.target.value }))}
              />
            </div>
            <input
              type="tel"
              className={inputClass}
              placeholder={t("se_phone")}
              value={medId.emergency2Phone}
              onChange={e => setMedId(p => ({ ...p, emergency2Phone: e.target.value }))}
            />
          </div>

          {/* Save */}
          <button
            onClick={saveMedId}
            className={clsx(
              "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md",
              saved ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {saved ? t("se_saved_success") : t("se_save")}
          </button>
        </div>
      </div>

      {/* ── LANGUAGE ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> {t("se_lang_pref")}
        </h3>
        <p className="text-[10px] text-slate-400 mb-3">{t("se_lang_sub")}</p>
        <div className="space-y-2">
          {languages.map(lang => (
            <label
              key={lang.code}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-800">{lang.name}</span>
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={language === lang.code}
                onChange={() => changeLanguage(lang.code as LanguageCode)}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* ── PRIVACY ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" /> {t("se_privacy")}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{t("se_privacy_desc")}</p>
        <button
          onClick={() => { localStorage.clear(); alert(t("se_reset_success")); window.location.reload(); }}
          className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2 w-full active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> {t("se_reset")}
        </button>
      </div>

      {/* ── ABOUT & DEVELOPERS ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-red-600" /> About & Developers
        </h3>
        <p className="text-xs text-slate-500 mb-3">Learn more about IIT Madras CoERS, developer contributions, and technical stack details.</p>
        <button
          onClick={() => navigate("/about")}
          className="px-4 py-2.5 bg-red-50 text-red-700 font-bold text-[10px] uppercase tracking-widest rounded-xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2 w-full active:scale-95 cursor-pointer"
        >
          View Project Details & Contributions
        </button>
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 font-medium">RoadSoS AI • v2.0.0</p>
        <p className="text-[9px] text-slate-300 mt-0.5">IIT Madras • CoERS • RBG Labs</p>
      </div>
    </div>
  );
}
