import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, MessageCircle, Map, HeartPulse, Home, Activity, WifiOff, FolderLock, Settings, X, Menu, Users, Info, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useOffline } from "../../OfflineContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isOffline, toggleOffline } = useOffline();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: t("nav_home"), path: "/", icon: Home },
    { name: t("nav_golden_hour"), path: "/golden-hour", icon: Activity },
    { name: t("nav_ai_help"), path: "/ai-assistant", icon: MessageCircle },
    { name: t("nav_nearby"), path: "/nearby", icon: Map },
    { name: t("nav_vault"), path: "/evidence", icon: FolderLock },
    { name: t("nav_first_aid"), path: "/first-aid", icon: HeartPulse },
    { name: t("nav_bystander"), path: "/bystander", icon: Users },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* ── TOP HEADER ── */}
      <header className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm z-20 flex-shrink-0 pt-safe transition-all duration-300">
        <div className="flex items-center space-x-2.5 md:space-x-4">
          <img
            src="/logo.png"
            alt="RoadSoS Logo"
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl object-cover shadow-md shadow-red-500/5 flex-shrink-0 border border-slate-100 dark:border-slate-800"
          />
          <div>
            <h1 className="text-base md:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none font-heading">
              RoadSoS <span className="text-red-600 font-black">AI</span>
            </h1>
            <p className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              IIT Madras • CoERS • RBG Labs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-700/50 active:scale-95 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-slate-550" />}
          </button>

          {/* Online/Offline pill */}
          <button
            onClick={toggleOffline}
            className={clsx(
              "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border transition-all shadow-sm active:scale-95 cursor-pointer",
              isOffline
                ? "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/30"
                : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/20"
            )}
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></div>
            )}
            <span
              className={clsx(
                "hidden min-[400px]:inline text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap",
                isOffline ? "text-amber-700 dark:text-amber-400" : "text-green-700 dark:text-green-400"
              )}
            >
              {isOffline ? t("offline") : t("gps_lock")}
            </span>
          </button>

          {/* Desktop buttons */}
          <div className="hidden md:flex space-x-2">
            <Link
              to="/settings"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold tracking-widest border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center uppercase"
            >
              {t("nav_settings")}
            </Link>
            <button
              onClick={toggleOffline}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition shadow-sm hover:shadow-md active:scale-95",
                isOffline
                  ? "bg-amber-500 text-white hover:bg-amber-600 border border-amber-600"
                  : "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 border border-slate-900 dark:border-slate-600"
              )}
            >
              {isOffline ? t("go_online") : t("test_offline")}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE SLIDE-DOWN MENU ── */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-md z-20 flex-shrink-0 px-4 py-3 space-y-2">
          <Link
            to="/settings"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold tracking-widest border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 uppercase"
          >
            <Settings className="w-4 h-4" /> {t("nav_settings")}
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold tracking-widest border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 uppercase"
          >
            <Info className="w-4 h-4 text-red-655" /> About RoadSoS
          </Link>
          <button
            onClick={() => { toggleOffline(); setMenuOpen(false); }}
            className={clsx(
              "flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest transition active:scale-95 cursor-pointer",
              isOffline
                ? "bg-amber-500 text-white border border-amber-600"
                : "bg-slate-800 dark:bg-slate-700 text-white border border-slate-900 dark:border-slate-600"
            )}
          >
            <WifiOff className="w-4 h-4" />
            {isOffline ? t("go_online") : t("test_offline")}
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto w-full mx-auto scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </main>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <nav className="md:hidden flex-shrink-0 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-xl text-white border-t border-slate-800/60 dark:border-slate-900 flex justify-around items-stretch z-20 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.12)]" style={{ minHeight: '64px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex flex-col items-center justify-center flex-1 py-2.5 transition-all duration-300 relative active:scale-95 cursor-pointer",
                isActive
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.75 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-[0_2px_6px_rgba(239,68,68,0.4)]" />
              )}
              <Icon className={clsx("w-5 h-5 mb-1 transition-transform duration-300", isActive ? "stroke-[2.5px] scale-110" : "stroke-[1.8px]")} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-none scale-90">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── DESKTOP FOOTER NAV ── */}
      <footer className="hidden md:flex flex-shrink-0 bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 items-center justify-between border-t border-slate-800/80 dark:border-slate-900 z-20">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors",
                location.pathname === item.path ? "text-red-400" : "text-slate-400"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/about"
            className={clsx(
              "text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors",
              location.pathname === "/about" ? "text-red-400" : "text-slate-400"
            )}
          >
            About
          </Link>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t("safety_level")}</span>
          <span className="text-xs font-bold text-orange-400 uppercase">{t("high_risk_zone")}</span>
        </div>
      </footer>
    </div>
  );
}
