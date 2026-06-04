import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Nearby from "./pages/Nearby";
import FirstAid from "./pages/FirstAid";
import GoldenHour from "./pages/GoldenHour";
import EvidenceVault from "./pages/EvidenceVault";
import Settings from "./pages/Settings";
import FamilyLiveTracking from "./pages/FamilyLiveTracking";
import BystanderMode from "./pages/BystanderMode";
import AboutUs from "./pages/AboutUs";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 }
};

const pageTransition = { type: "tween", ease: "easeOut", duration: 0.22 };

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} {...{ key: location.pathname }}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/golden-hour" element={<PageWrapper><GoldenHour /></PageWrapper>} />
        <Route path="/ai-assistant" element={<PageWrapper><AIAssistant /></PageWrapper>} />
        <Route path="/nearby" element={<PageWrapper><Nearby /></PageWrapper>} />
        <Route path="/first-aid" element={<PageWrapper><FirstAid /></PageWrapper>} />
        <Route path="/evidence" element={<PageWrapper><EvidenceVault /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/tracking" element={<PageWrapper><FamilyLiveTracking /></PageWrapper>} />
        <Route path="/bystander" element={<PageWrapper><BystanderMode /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
