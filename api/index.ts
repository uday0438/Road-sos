import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const app = express();
app.use(express.json());

// API endpoints
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("MY_GEMINI")) {
      return res.status(503).json({
        error: "NO_API_KEY",
        text: "⚠️ Gemini API key not configured. Please add a valid GEMINI_API_KEY (starting with AIzaSy...) to your .env file. Get one free at aistudio.google.com/app/apikey",
      });
    }

    const systemInstruction = `You are RoadSoS AI, a calm and authoritative emergency road accident response assistant built by IIT Madras CoERS lab.
Your primary goal: guide users through the critical Golden Hour after a road accident.
Rules:
- Be extremely concise and actionable — the user may be injured or panicked
- Always start with the most life-critical action
- Number every step clearly
- Mention calling 108 (India ambulance) whenever relevant
- If asked about first aid, give precise medical steps
- If asked for emotional support, be calm and reassuring
- Never give generic answers — be specific to road accidents
- Keep responses under 150 words unless a detailed first-aid procedure is needed
- You are aware of the user's exact current location. Ensure your answers help them specifically at this location if they ask about nearby services or coordinates.
User exact location context: ${JSON.stringify(context || {})}`;

    // Convert our message format to Gemini role-based format
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.15,
        maxOutputTokens: 400,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    const msg = typeof error?.message === "string" ? error.message : JSON.stringify(error || "");
    const msgLower = msg.toLowerCase();
    
    if (msgLower.includes("api_key") || msgLower.includes("401") || msgLower.includes("403") || msgLower.includes("invalid key") || msgLower.includes("unauthorized")) {
      res.status(401).json({
        error: "INVALID_API_KEY",
        text: "❌ Invalid API key. Make sure your GEMINI_API_KEY in your config starts with 'AIzaSy' and is obtained from aistudio.google.com/app/apikey",
      });
    } else if (msgLower.includes("429") || msgLower.includes("quota") || msgLower.includes("resource_exhausted") || msgLower.includes("limit: 0")) {
      res.status(429).json({
        error: "QUOTA_EXCEEDED",
        text: "⚠️ Gemini API key quota exceeded. The key you provided has a daily request limit of 0, or has reached its per-minute rate limits. Please generate a new key at aistudio.google.com/app/apikey or wait and try again.",
      });
    } else {
      res.status(500).json({ 
        error: "SERVER_ERROR", 
        text: `❌ AI connection failed: ${error?.message || "Internal server error"}. Please check your GEMINI_API_KEY config.` 
      });
    }
  }
});

app.post("/api/services/nearby", (req, res) => {
  // Mock nearby services based on coordinates (for hackathon demo)
  const { type, lat, lng } = req.body;
  
  // Slight jitter to lat/lng for realism
  const getMockCoords = () => ({
    lat: Number(lat) + (Math.random() - 0.5) * 0.02,
    lng: Number(lng) + (Math.random() - 0.5) * 0.02,
  });

  let results = [];
  if (type === "hospital") {
    results = [
      { id: 1, name: "City Trauma Center", distance: "1.2 km", readiness: "High", phone: "108", ...getMockCoords() },
      { id: 2, name: "General Hospital", distance: "3.5 km", readiness: "Medium", phone: "108", ...getMockCoords() }
    ];
  } else if (type === "police") {
    results = [
      { id: 3, name: "Central Highway Patrol", distance: "0.8 km", phone: "100", ...getMockCoords() },
      { id: 4, name: "Local Traffic Police", distance: "2.1 km", phone: "100", ...getMockCoords() }
    ];
  } else if (type === "ambulance") {
      results = [
          { id: 5, name: "Express Ambulance Service", distance: "0.5 km", eta: "3 mins", phone: "108", ...getMockCoords() },
          { id: 6, name: "City Hospital Ambulance", distance: "1.5 km", eta: "8 mins", phone: "108", ...getMockCoords() }
      ];
  }

  res.json(results);
});

// Setup dev server or static serve depending on environment (only active when run directly)
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupServer();

// Start server if executed directly (local dev)
if (process.env.NODE_ENV !== "production" || process.env.LOCAL_RUN === "true") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel Serverless
export default app;
