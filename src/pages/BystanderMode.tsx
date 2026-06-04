import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Camera, AlertTriangle, CheckCircle2, Users, ArrowLeft, Shield, Car, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../context/LanguageContext";

export default function BystanderMode() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState(1);

  const STEPS = [
    {
      id: 1,
      title: t("gh_check2"), // Call Ambulance (108)
      subtitle: t("gh_checklist_title"),
      icon: Phone,
      color: "bg-red-600",
      light: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      actions: [
        { label: "Call 108 (Ambulance)", href: "tel:108", style: "bg-red-600 text-white hover:bg-red-700" },
        { label: "Call 100 (Police)", href: "tel:100", style: "bg-slate-800 text-white hover:bg-slate-900" },
      ],
      tips: language === "te" ? [
        "మీరున్న స్థలాన్ని ఖచ్చితంగా తెలియజేయండి",
        "ఎంతమంది గాయపడ్డారో చెప్పండి",
        "సహాయం వచ్చేవరకు ఫోన్ కాల్‌లోనే ఉండండి",
      ] : language === "hi" ? [
        "अपने सटीक स्थान को स्पष्ट रूप से बताएं",
        "बताएं कि कितने लोग घायल हैं",
        "मदद आने तक लाइन पर बने रहें",
      ] : language === "ta" ? [
        "உங்கள் இருப்பிடத்தை தெளிவாகக் கூறவும்",
        "விபத்தில் எத்தனை பேர் காயமடைந்துள்ளனர் என்று கூறவும்",
        "உதவி வரும் வரை அழைப்பிலேயே இருக்கவும்",
      ] : [
        "State your exact location clearly",
        "Say how many people are injured",
        "Stay on the line until help arrives",
      ]
    },
    {
      id: 2,
      title: t("bm_step1"), // Secure the Scene
      subtitle: t("bm_step1_desc"),
      icon: Car,
      color: "bg-amber-500",
      light: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600",
      actions: [],
      tips: language === "te" ? [
        "అన్ని వాహనాలపై హజార్డ్ లైట్లను ఆన్ చేయండి",
        "గాయపడిన వారిని ప్రమాదం నుండి రక్షించడానికి తప్ప వేరే విషయాలలో కదపకండి",
        "చుట్టుపక్కల వారిని సురక్షిత దూరంలో ఉంచండి",
      ] : language === "hi" ? [
        "सभी वाहनों की हैजर्ड लाइटें चालू करें",
        "घायल व्यक्तियों को तब तक न हिलाएं जब तक कि वे खतरे में न हों",
        "भीड़ को सुरक्षित दूरी पर रखें",
      ] : language === "ta" ? [
        "அனைத்து வாகனங்களிலும் ஹஸார்ட் விளக்குகளை ஒளிரச் செய்யவும்",
        "பாதிக்கப்பட்டவர்களை ஆபத்து இல்லாதவரை நகர்த்த வேண்டாம்",
        "பார்வையாளர்களை பாதுகாப்பான தூரத்தில் வைத்திருக்கவும்",
      ] : [
        "Switch on hazard lights on all vehicles",
        "Do NOT move injured persons unless in immediate danger",
        "Keep bystanders at a safe distance",
      ]
    },
    {
      id: 3,
      title: t("ev_choose_evidence"), // Document Evidence
      subtitle: t("ev_subtitle"),
      icon: Camera,
      color: "bg-indigo-600",
      light: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
      actions: [],
      tips: language === "te" ? [
        "ప్రమాద స్థలాన్ని వివిధ కోణాల నుండి ఫోటో తీయండి",
        "వాహనాల నంబర్ ప్లేట్లను క్యాప్చర్ చేయండి",
        "ఖచ్చితమైన సమయం మరియు రహదారి పేరును గమనించండి",
      ] : language === "hi" ? [
        "विभिन्न कोणों से दुर्घटना स्थल की तस्वीरें लें",
        "वाहनों की नंबर प्लेट कैप्चर करें",
        "सटीक समय और सड़क का नाम नोट करें",
      ] : language === "ta" ? [
        "விபத்து நடந்த இடத்தை பல்வேறு கோணங்களில் புகைப்படம் எடுக்கவும்",
        "வாகனங்களின் எண் பலகைகளை புகைப்படம் எடுக்கவும்",
        "துல்லியமான நேரம் மற்றும் சாலையின் பெயரை குறித்துக்கொள்ளவும்",
      ] : [
        "Photograph the accident scene from multiple angles",
        "Capture number plates of vehicles involved",
        "Note the exact time and road name",
      ]
    },
    {
      id: 4,
      title: t("nav_first_aid"), // First Aid
      subtitle: t("gh_check4"), // Apply Basic First Aid
      icon: Shield,
      color: "bg-green-600",
      light: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      actions: [],
      tips: language === "te" ? [
        "బాధితులతో ప్రశాంతంగా మాట్లాడండి - వారిని మేల్కొని ఉంచండి",
        "రక్తస్రావం జరుగుతున్న చోట శుభ్రమైన బట్టతో గట్టిగా నొక్కి ఉంచండి",
        "బాధితులకు ఆహారం లేదా నీరు ఇవ్వకండి",
      ] : language === "hi" ? [
        "पीड़ितों से शांति से बात करें - उन्हें जगाए रखें",
        "घाव पर साफ कपड़े से दबाव डालकर रक्तस्राव रोकें",
        "पीड़ितों को भोजन या पानी न दें",
      ] : language === "ta" ? [
        "பாதிக்கப்பட்டவர்களிடம் நிதானமாகப் பேசவும் - அவர்களை விழிப்புடன் வைத்திருக்கவும்",
        "இரத்தப்போக்கு ஏற்படும் இடத்தில் சுத்தமான துணியால் அழுத்தவும்",
        "பாதிக்கப்பட்டவர்களுக்கு உணவு அல்லது தண்ணீர் கொடுக்க வேண்டாம்",
      ] : [
        "Talk calmly to victims — keep them awake",
        "Apply pressure to bleeding wounds with clean cloth",
        "Do NOT give water or food to injured persons",
      ]
    },
  ];

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allDone = completedSteps.size === STEPS.length;

  const sendWhatsApp = () => {
    const msg = `🚨 I'm a bystander at a road accident. Emergency services have been called. Scene is secured. Please send help if not yet dispatched.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-full pb-4 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-slate-600 shadow-sm active:scale-95 transition-all flex-shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">{t("bm_title")}</h2>
          </div>
          <p className="text-xs text-slate-500">{t("bm_subtitle")}</p>
        </div>
      </div>

      {/* Good Samaritan Law Banner */}
      <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-3.5 shadow-sm">
        <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1.5 mb-1">
          {t("bm_law_title")}
        </h4>
        <p className="text-[10px] sm:text-xs text-purple-700 leading-relaxed">
          {t("bm_law_desc")}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Progress</span>
          <span className="text-[10px] font-bold text-slate-700">{completedSteps.size}/{STEPS.length} steps done</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }}
          />
        </div>
        {allDone && (
          <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Great job! You've done everything you can. Stay safe.
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isComplete = completedSteps.has(step.id);
          const isActive = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={clsx(
                "rounded-2xl border overflow-hidden shadow-sm transition-all duration-300",
                isComplete ? "bg-green-50 border-green-200" : isActive ? "bg-white border-slate-300 shadow-md" : "bg-white border-gray-200"
              )}
            >
              {/* Step header */}
              <button
                onClick={() => setActiveStep(isActive ? 0 : step.id)}
                className="w-full flex items-center gap-3 p-3 sm:p-4 text-left active:bg-slate-50 transition-colors"
              >
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  isComplete ? "bg-green-600 text-white" : step.color + " text-white"
                )}>
                  {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">STEP {step.id}</span>
                    {isComplete && <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 rounded-full">DONE</span>}
                  </div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{step.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.subtitle}</p>
                </div>
              </button>

              {/* Expanded content */}
              {isActive && (
                <div className="px-3 sm:px-4 pb-4 space-y-3">
                  {/* Action buttons */}
                  {step.actions.length > 0 && (
                    <div className="space-y-2">
                      {step.actions.map((action) => (
                        <a
                          key={action.label}
                          href={action.href}
                          className={clsx("flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all", action.style)}
                        >
                          <Phone className="w-4 h-4" /> {action.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Tips */}
                  <div className={clsx("rounded-xl border p-3 space-y-2", step.light)}>
                    {step.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={clsx("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black", step.color + " text-white")}>
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mark done */}
                  <button
                    onClick={() => { toggleStep(step.id); if (!isComplete && step.id < STEPS.length) setActiveStep(step.id + 1); }}
                    className={clsx(
                      "w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all active:scale-95 flex items-center justify-center gap-2",
                      isComplete
                        ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        : "bg-green-600 text-white border-green-700 hover:bg-green-700 shadow-md"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isComplete ? "Undo" : "Mark as Done"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={sendWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3 font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-all hover:bg-green-700"
        >
          <MessageCircle className="w-4 h-4" /> {t("db_whatsapp_sos")}
        </button>
        <button
          onClick={() => navigate("/first-aid")}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-slate-700 rounded-xl py-3 font-bold text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all hover:bg-slate-50"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" /> {t("nav_first_aid")}
        </button>
      </div>
    </div>
  );
}
