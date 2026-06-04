import React, { useState, useEffect } from "react";
import { ChevronDown, HeartPulse, Droplet, Bone, Activity, WifiOff, RefreshCw, Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";
import { useOffline } from "../OfflineContext";
import { useLanguage } from "../context/LanguageContext";
import { OFFLINE_FIRST_AID_GUIDES } from "../constants";

// ── Text-to-Speech helper ─────────────────────────────────────────────────────
function speakSteps(title: string, steps: string[], lang: string = "en-IN") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const fullText = `${title}. ${steps.map((s, i) => `Step ${i + 1}: ${s}`).join(". ")}`;
  const utter = new SpeechSynthesisUtterance(fullText);
  utter.lang = lang;
  utter.rate = 0.85;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

export default function FirstAid() {
  const [openCard, setOpenCard] = useState<number | null>(1);
  const { isOffline } = useOffline();
  const { t, language } = useLanguage();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Map language code → BCP-47 tag for TTS
  const langMap: Record<string, string> = {
    en: "en-IN",
    te: "te-IN",
    hi: "hi-IN",
    ta: "ta-IN",
  };

  useEffect(() => {
    if (isOffline) {
      setGuides(OFFLINE_FIRST_AID_GUIDES);
      setLoading(false);
      return;
    }
    setLoading(true);

    const getGuidesForLang = (lang: string) => {
      switch (lang) {
        case "te":
          return [
            {
              id: 1,
              title: "స్పృహ తప్పడం & ఊపిరి ఆడకపోవడం (CPR)",
              icon: HeartPulse, color: "text-red-500", bg: "bg-red-50",
              steps: [
                "వెంటనే 108 కి కాల్ చేయండి.",
                "బాధితుడిని గట్టి ఉపరితలంపై నిటారుగా పడుకోబెట్టండి.",
                "ఒక చేతి మడమను వారి ఛాతీ మధ్యలో ఉంచండి.",
                "వేళ్లను లాక్ చేసి, ఛాతీని బలంగా మరియు వేగంగా నొక్కండి - నిమిషానికి 100 నుండి 120 సార్లు.",
                "అత్యవసర సిబ్బంది వచ్చేవరకు ఇలా చేస్తూనే ఉండండి."
              ]
            },
            {
              id: 2,
              title: "తీవ్రమైన రక్తస్రావం",
              icon: Droplet, color: "text-rose-500", bg: "bg-rose-50",
              steps: [
                "రక్తస్రావం ఎక్కడ నుండి జరుగుతుందో కనుగొనండి.",
                "శుభ్రమైన బట్ట లేదా మీ చేతులతో స్థిరంగా గట్టిగా నొక్కి ఉంచండి.",
                "గాయం చేయి లేదా కాలు మీద ఉంటే, వీలైతే దానిని గుండె కంటే ఎత్తులో ఉంచండి.",
                "రక్తంతో బట్ట తడిసినా దానిని తీయకండి - దానిపై మరొక బట్టను ఉంచి నొక్కండి.",
                "సహాయం వచ్చేవరకు నొక్కి ఉంచండి."
              ]
            },
            {
              id: 3,
              title: "ఎముక పగుళ్లు / మెడ గాయం",
              icon: Bone, color: "text-amber-500", bg: "bg-amber-50",
              steps: [
                "తప్పనిసరి అయితే తప్ప బాధితుడిని కదపకండి.",
                "తల మరియు మెడను కదలకుండా స్థిరంగా ఉంచండి.",
                "రెండు వైపులా చేతులు ఉంచి తలను సపోర్ట్ చేయండి.",
                "అంబులెన్స్ (108) వచ్చేవరకు వేచి ఉండండి."
              ]
            },
            {
              id: 4,
              title: "రికవరీ పొజిషన్ (Recovery Position)",
              icon: Activity, color: "text-blue-500", bg: "bg-blue-50",
              steps: [
                "బాధితుడు స్పృహ లేకపోయినా, ఊపిరి సరిగ్గా ఆడుతుంటేనే దీనిని ఉపయోగించండి.",
                "వారి పక్కన మోకరిల్లి కాళ్లను నిటారుగా చేయండి.",
                "మీకు దగ్గరగా ఉన్న చేతిని కుడి కోణంలో (L shape) ఉంచండి.",
                "దూరంగా ఉన్న చేతిని ఛాతీపై నుండి ముఖానికి దగ్గరగా తీసుకురండి.",
                "దూరంగా ఉన్న మోకాలిని పైకి లాగి వారిని మీ వైపు పక్కకు తిప్పండి."
              ]
            }
          ];
        case "hi":
          return [
            {
              id: 1,
              title: "बेहोश और सांस न आना (सीपीआर)",
              icon: HeartPulse, color: "text-red-500", bg: "bg-red-50",
              steps: [
                "तुरंत 108 पर कॉल करें।",
                "व्यक्ति को समतल और कठोर सतह पर पीठ के बल लिटाएं।",
                "अपनी एक हथेली को उनकी छाती के केंद्र में रखें।",
                "उंगलियों को आपस में फंसाएं और तेजी से दबाएं - प्रति मिनट 100 से 120 बार।",
                "आपातकालीन सेवाओं के आने तक जारी रखें।"
              ]
            },
            {
              id: 2,
              title: "गंभीर रक्तस्राव",
              icon: Droplet, color: "text-rose-500", bg: "bg-rose-50",
              steps: [
                "बहते खून के स्रोत का पता लगाएं।",
                "साफ कपड़े या हाथों से लगातार सीधा दबाव डालें।",
                "यदि हाथ या पैर से खून बह रहा है, तो उसे हृदय के स्तर से ऊपर उठाएं।",
                "कपड़े को गीला होने पर भी न हटाएं - उसके ऊपर दूसरा कपड़ा रख दें।",
                "मदद आने तक दबाव बनाए रखें।"
              ]
            },
            {
              id: 3,
              title: "संदिग्ध फ्रैक्चर / गर्दन की चोट",
              icon: Bone, color: "text-amber-500", bg: "bg-amber-50",
              steps: [
                "जब तक तत्काल खतरा न हो, व्यक्ति को बिल्कुल न हिलाएं।",
                "सिर और गर्दन को हर समय बिल्कुल स्थिर रखें।",
                "दोनों तरफ हाथ रखकर सिर को सहारा दें।",
                "पेशेवर चिकित्सा सहायता (108) के आने की प्रतीक्षा करें।"
              ]
            },
            {
              id: 4,
              title: "रिकवरी पोजीशन",
              icon: Activity, color: "text-blue-500", bg: "bg-blue-50",
              steps: [
                "इसका उपयोग तब करें जब व्यक्ति बेहोश हो लेकिन सामान्य रूप से सांस ले रहा हो।",
                "उनके पास घुटने के बल बैठें और उनके पैरों को सीधा करें।",
                "अपने पास वाले हाथ को शरीर से समकोण पर रखें।",
                "दूर वाले हाथ को छाती के पार लाएं और हथेली को गाल के पास रखें।",
                "दूर वाले घुटने को ऊपर उठाएं और उन्हें अपनी ओर करवट दिलाएं।"
              ]
            }
          ];
        case "ta":
          return [
            {
              id: 1,
              title: "உணர்வற்ற நிலை மற்றும் மூச்சுவிடாமை (CPR)",
              icon: HeartPulse, color: "text-red-500", bg: "bg-red-50",
              steps: [
                "உடனடியாக 108 ஐ அழைக்கவும்.",
                "பாதிக்கப்பட்டவரை ஒரு தட்டையான கடினமான த地のல் படுக்கவைக்கவும்.",
                "உங்கள் ஒரு கையின் உள்ளங்கையை அவரது நெஞ்சின் மையப்பகுதியில் வைக்கவும்.",
                "விரல்களைக் கோர்த்துக்கொண்டு வேகமாக அழுத்தவும் - நிமிடத்திற்கு 100 முதல் 120 முறை.",
                "அவசரகால உதவி வரும் வரை இதைத் தொடரவும்."
              ]
            },
            {
              id: 2,
              title: "கடுமையான இரத்தப்போக்கு",
              icon: Droplet, color: "text-rose-500", bg: "bg-rose-50",
              steps: [
                "இரத்தப்போக்கின் மூலத்தைக் கண்டறியவும்.",
                "சுத்தமான துணி அல்லது உங்கள் கைகளால் தொடர்ந்து அழுத்தவும்.",
                "கை அல்லது காலில் காயம் இருந்தால், அதை இதய மட்டத்திற்கு மேலே உயர்த்தவும்.",
                "துணி நனைந்துவிட்டால் அதை அகற்ற வேண்டாம் - அதன் மேல் மற்றொரு துணியை வைக்கவும்.",
                "உதவி வரும் வரை தொடர்ந்து அழுத்தவும்."
              ]
            },
            {
              id: 3,
              title: "எலும்பு முறிவு / கழுத்து காயம்",
              icon: Bone, color: "text-amber-500", bg: "bg-amber-50",
              steps: [
                "அவசர ஆபத்து இல்லை என்றால் பாதிக்கப்பட்டவரை நகர்த்த வேண்டாம்.",
                "தலை மற்றும் கழுத்துப் பகுதியை எப்போதும் அசைக்காமல் வைக்கவும்.",
                "தலையின் இருபுறமும் கைகளை வைத்து ஆதரவு அளிக்கவும்.",
                "மருத்துவ உதவி (108) வரும் வரை காத்திருக்கவும்."
              ]
            },
            {
              id: 4,
              title: "மீட்பு நிலை (Recovery Position)",
              icon: Activity, color: "text-blue-500", bg: "bg-blue-50",
              steps: [
                "பாதிக்கப்பட்டவர் உணர்வில்லாமல் ஆனால் மூச்சுவிட்டுக்கொண்டிருந்தால் மட்டுமே இதைப் பயன்படுத்தவும்.",
                "அவர் அருகில் மண்டியிட்டு அவரது கால்களை நேராக்கவும்.",
                "உங்களுக்கு அருகிலுள்ள கையை உடலுக்கு நேர்கோணத்தில் வைக்கவும்.",
                "தொலைவிலுள்ள கையை மார்பின் குறுக்கே கொண்டு வந்து கன்னத்திற்கு அருகில் வைக்கவும்.",
                "தொலைவிலுள்ள முழங்காலை மேலே தூக்கி அவரை உங்கள் பக்கமாகத் திருப்பவும்."
              ]
            }
          ];
        default:
          return [
            {
              id: 1,
              title: "Unconscious & Not Breathing (CPR)",
              icon: HeartPulse, color: "text-red-500", bg: "bg-red-50",
              steps: [
                "Call 108 immediately.",
                "Place the person flat on their back on a firm surface.",
                "Place the heel of one hand on the center of their chest.",
                "Interlock your fingers and push hard and fast — at least 2 inches deep, 100 to 120 times per minute.",
                "Continue until emergency services arrive."
              ]
            },
            {
              id: 2,
              title: "Severe Bleeding",
              icon: Droplet, color: "text-rose-500", bg: "bg-rose-50",
              steps: [
                "Find the source of the bleeding.",
                "Apply direct continuous pressure using a clean cloth or your hands.",
                "If from an arm or leg, elevate it above the heart if possible.",
                "Do NOT remove the cloth if it soaks through — add another on top.",
                "Keep pressing until help arrives."
              ]
            },
            {
              id: 3,
              title: "Suspected Fractures / Neck Injury",
              icon: Bone, color: "text-amber-500", bg: "bg-amber-50",
              steps: [
                "Do NOT move the person unless they are in immediate danger.",
                "Keep the head and neck perfectly still at all times.",
                "Support the head by placing your hands on both sides.",
                "Wait for professional medical help — call 108 — to arrive."
              ]
            },
            {
              id: 4,
              title: "Recovery Position",
              icon: Activity, color: "text-blue-500", bg: "bg-blue-50",
              steps: [
                "Use this if the person is unconscious BUT breathing normally.",
                "Kneel beside them and straighten their legs.",
                "Place the arm nearest to you at a right angle to their body.",
                "Bring the far arm across their chest, hand to nearest cheek.",
                "Pull the far knee up and roll them towards you onto their side."
              ]
            }
          ];
      }
    };

    setGuides(getGuidesForLang(language));
    setLoading(false);
  }, [isOffline, language]);

  // Stop speech when component unmounts
  useEffect(() => () => stopSpeaking(), []);

  const handleReadAloud = (guide: any) => {
    if (speakingId === guide.id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      setSpeakingId(guide.id);
      speakSteps(guide.title, guide.steps, langMap[language] ?? "en-IN");
      // Detect when speech ends
      const check = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeakingId(null);
          clearInterval(check);
        }
      }, 500);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-slate-50 min-h-full pb-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 mt-1 text-center flex flex-col items-center">
        <h2 className="font-black text-xl sm:text-2xl text-slate-800">{t("fa_title")}</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 mx-4 max-w-sm">
          {t("fa_subtitle")}
        </p>
        <div className={clsx(
          "mt-2 sm:mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
          isOffline ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"
        )}>
          {isOffline ? <WifiOff className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
          {isOffline ? t("db_offline_cached") : "Live Protocols Sync"}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl border border-gray-200 h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {guides.map((guide) => {
            const isOpen = openCard === guide.id;
            const Icon = guide.icon;
            const isSpeaking = speakingId === guide.id;

            return (
              <div
                key={guide.id}
                className={clsx(
                  "rounded-xl sm:rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm",
                  isOpen ? "border-slate-300 shadow-md" : "border-gray-200",
                  isOffline ? "bg-amber-50/20 ring-1 ring-amber-500/20" : "bg-white"
                )}
              >
                {/* Header row */}
                <div className="flex items-center">
                  <button
                    onClick={() => setOpenCard(isOpen ? null : guide.id)}
                    className="flex-1 flex items-center gap-3 p-3 sm:p-4 hover:bg-slate-50 active:bg-slate-100 transition select-none text-left"
                  >
                    <div className={clsx("w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0", guide.bg, guide.color)}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm flex-1 line-clamp-2">{guide.title}</span>
                    <ChevronDown className={clsx("w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180")} />
                  </button>
                </div>

                {/* Expanded content */}
                <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                  <div className="px-3 sm:px-4 pb-4 bg-white">
                    {/* Read Aloud button */}
                    <button
                      onClick={() => handleReadAloud(guide)}
                      className={clsx(
                        "mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all active:scale-95",
                        isSpeaking
                          ? "bg-indigo-600 text-white border-indigo-700"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
                      )}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isSpeaking ? t("fa_stop") : `${t("fa_read_aloud")} (${language.toUpperCase()})`}
                      {isSpeaking && <span className="ml-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                    </button>

                    <ol className="space-y-2 sm:space-y-3 border-l-2 border-slate-100 ml-4 pl-4">
                      {guide.steps.map((step: string, idx: number) => (
                        <li key={idx} className="relative text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <span className="absolute -left-[25px] top-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs sm:text-sm text-amber-800 text-center flex flex-col items-center gap-2 shadow-sm">
        <HeartPulse className="w-6 h-6 text-amber-500" />
        <p><strong>Note:</strong> Protect yourself first. Do not attempt technical procedures unless properly trained. When in doubt, perform hands-on CPR and await paramedics.</p>
      </div>
    </div>
  );
}
