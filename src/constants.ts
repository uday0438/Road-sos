import { HeartPulse, Droplet, Bone, Activity } from "lucide-react";

export const OFFLINE_FIRST_AID_GUIDES = [
  {
    id: 1,
    title: "Unconscious & Not Breathing (CPR)",
    icon: HeartPulse,
    color: "text-red-500",
    bg: "bg-red-50",
    steps: [
      "Call 108 immediately.",
      "Place the person flat on their back on a firm surface.",
      "Kneel beside them and place the heel of one hand on the center of their chest.",
      "Place your other hand on top and interlock your fingers.",
      "Push hard and fast (at least 2 inches deep, 100-120 pushes a minute)."
    ]
  },
  {
    id: 2,
    title: "Severe Bleeding",
    icon: Droplet,
    color: "text-rose-500",
    bg: "bg-rose-50",
    steps: [
      "Find the source of the bleeding.",
      "Apply direct continuous pressure to the wound using a clean cloth or your hands.",
      "If bleeding is from an arm or leg, elevate it above the heart if possible.",
      "Do NOT remove the cloth if it soaks through; add another on top."
    ]
  },
  {
    id: 3,
    title: "Suspected Fractures / Neck Injury",
    icon: Bone,
    color: "text-amber-500",
    bg: "bg-amber-50",
    steps: [
      "Do NOT move the person unless they are in immediate danger.",
      "Keep the head and neck perfectly still.",
      "Support the head by placing hands on both sides of the head.",
      "Wait for professional medical help (108) to arrive."
    ]
  },
  {
    id: 4,
    title: "Recovery Position",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-50",
    steps: [
      "Use this if the person is unconscious BUT breathing normally.",
      "Kneel beside them and straighten their legs.",
      "Place the arm nearest to you at a right angle to their body.",
      "Bring the far arm across their chest, holding the back of their hand against their nearest cheek.",
      "With your other hand, pull the far knee up and roll them towards you onto their side."
    ]
  }
];

export const OFFLINE_EMERGENCY_CONTACTS = {
  hospitals: [
    { id: 91, name: "City Hospital (Cached)", distance: "1.2 km", phone: "108", lat: 13.0977, lng: 80.2607, readiness: "High" },
    { id: 92, name: "St. John's Clinic (Local)", distance: "3.5 km", phone: "108", lat: 13.0727, lng: 80.2907, readiness: "Medium" }
  ],
  police: [
    { id: 93, name: "Central Station (Cached)", distance: "0.8 km", phone: "100", lat: 13.0877, lng: 80.2807 }
  ],
  ambulance: [
    { id: 94, name: "108 Dispatch (Cached)", distance: "0.5 km", phone: "108", lat: 13.0727, lng: 80.2607, eta: "3 mins" },
    { id: 95, name: "City Hospital Ambulance", distance: "1.5 km", phone: "108", lat: 13.0827, lng: 80.2507, eta: "8 mins" }
  ]
};
