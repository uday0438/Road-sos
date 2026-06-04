import React, { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import Shell from "./components/layout/Shell";
import { OfflineProvider } from "./OfflineContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import AnimatedRoutes from "./AnimatedRoutes";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200); // splash displays for 2.2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineProvider>
          {showSplash && (
            <div className="fixed inset-0 z-[9999] bg-[#090d16] flex flex-col items-center justify-center text-center p-6 select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 animate-pulse-glow">
                  <img src="/logo.png" className="w-full h-full object-cover" alt="RoadSoS Logo" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-6 tracking-tight font-heading">
                  RoadSoS <span className="text-red-500">AI</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-widest font-bold font-heading">IIT Madras CoERS Lab</p>
              </div>
              <div className="pb-safe flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Securing the Golden Hour...</p>
              </div>
            </div>
          )}
          <HashRouter>
            <Shell>
              <AnimatedRoutes />
            </Shell>
          </HashRouter>
        </OfflineProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
