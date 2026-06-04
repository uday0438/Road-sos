import React from "react";
import { Info, User, Award, BookOpen, Terminal, Shield, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function AboutUs() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const techKeys = [
    { name: "React 19 & TypeScript", desc: "Core frontend architecture and type safety" },
    { name: "Vite", desc: "High-performance dev server and build tool" },
    { name: "Tailwind CSS v4", desc: "Modern, responsive utility-first layout styling" },
    { name: "Google Gemini 2.0 Flash", desc: "Generates context-aware emergency golden hour advice" },
    { name: "React Leaflet & OpenStreetMap", desc: "Interactive mapping to locate nearby critical services" },
    { name: "Web Speech Synthesis API", desc: "Vernacular Text-to-Speech support for instant local language response" },
    { name: "Antigravity", desc: "Advanced Agentic AI Coding Assistant by Google DeepMind, used for rapid prototyping, debugging, and co-creation of code" }
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 flex flex-col gap-4 pb-6 overflow-y-auto bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-red-600" /> About RoadSoS
          </h2>
          <p className="text-xs text-slate-500">CoERS Lab · IIT Madras Project Details</p>
        </div>
      </div>

      {/* ── IIT MADRAS COERS SECTION ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 flex items-center gap-3 border-b border-slate-700">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">IIT Madras</h3>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">CoERS & RBG Labs</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong>CoERS (Center of Excellence for Road Safety)</strong> at IIT Madras is a premier interdisciplinary research center establishing safety standards, designing scientific crash investigation methodologies, and formulating data-driven road safety policies in India.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Collaborating with <strong>RBG Labs</strong> (Re-Design and Business Genesis), the center focuses on translating high-end academic research into actionable, human-centered safety technologies. This <strong>RoadSoS AI</strong> project is designed to bridge the crucial "Golden Hour" gap following a road crash—providing instantaneous guidance, automated alerts, and evidence safety.
          </p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Safety Research</span>
            <span className="text-[9px] bg-slate-50 text-slate-700 border border-slate-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Data-Driven Policy</span>
            <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Golden Hour Care</span>
          </div>
        </div>
      </div>

      {/* ── MY CONTRIBUTION SECTION ─────────────────────────────────────────── */}
      <div className="bg-white border-2 border-red-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Developer Profile</h3>
            <p className="text-red-200 text-[9px] font-bold uppercase tracking-wider">Role & Details</p>
          </div>
        </div>
        <div className="p-4 space-y-3.5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-700 font-black text-lg border border-gray-250">
              UB
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Uday Bhaskar</h4>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Embedded Engineer & Vibe Coder</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-650">
            <div>
              <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400 block mb-0.5">Role in the Project</span>
              <p className="leading-relaxed">
                As the <strong>Embedded Engineer & Vibe Coder</strong>, Uday designed the sensor integration logic, simulated physical impact crash-detection triggers using device motion APIs, configured real-time geolocalized telemetry hooks, and shaped the client application vibe and flow.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-gray-100">
              <div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400 block mb-0.5">Department</span>
                <span className="font-semibold text-slate-700">Electronics and Communication Engineering</span>
              </div>
              <div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400 block mb-0.5">College</span>
                <span className="font-semibold text-slate-700">Kuppam Engineering College</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400 block mb-0.5">Contact</span>
                <a href="mailto:udayvenkatkalle7@gmail.com" className="text-red-600 font-bold hover:underline">
                  udayvenkatkalle7@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TECHNICAL STACK KEYS ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3.5 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-500" /> Project Tech Keys
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techKeys.map((key) => (
            <div key={key.name} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <p className="text-xs font-bold text-slate-800">{key.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{key.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400 font-medium">RoadSoS AI • Developed by Uday Bhaskar</p>
        <p className="text-[9px] text-slate-300 mt-0.5">IIT Madras • CoERS • RBG Labs</p>
      </div>
    </div>
  );
}
