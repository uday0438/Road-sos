# Road-SOS 🚨
### **AI & IoT-Powered Post-Crash Emergency Response Ecosystem**

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Server-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-F15A24?logo=google&logoColor=white)](https://ai.google.dev/)

**Road-SOS** is an integrated software-hardware road safety system engineered to optimize the **Golden Hour** of post-crash response. By leveraging embedded accident sensors, interactive geographic mapping, and **Google Gemini AI**, Road-SOS automates collision detection, assesses crash severity in real-time, and coordinates instant dispatch of nearest emergency services.

---

## 🌟 Key Features

*   🚨 **Autonomous Accident Triage:** Real-time mock crash telemetry logging and analysis.
*   🧠 **AI-Powered Diagnostics:** Integration with **Gemini 2.0 Flash** to read sensor telemetry and generate action-oriented triage checklists and incident summaries.
*   🗺️ **Interactive Geographic Map:** Built on **Leaflet** and **React-Leaflet** for real-time visualization of accident sites, hospitals, police, and ambulances.
*   📱 **Responsive Product-Level UI:** Full responsive support with seamless transitions, customizable interactive checklist overlays, and mobile-friendly touch navigation.
*   🌓 **Smart Dark Mode:** Persistent state theme toggles supporting tailored CSS skinning (including inverted map tiles for dark night-monitoring).
*   🚀 **Production-Ready & Serverless:** Deploys instantly to Vercel with dedicated backend routing via Serverless Functions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet |
| **Backend** | Node.js, Express, TSX (TypeScript Execute) |
| **AI Integration** | Google Gemini API (`gemini-2.0-flash` model via `@google/genai`) |
| **Hosting & CI/CD** | Vercel Serverless Functions |
| **Assisted By** | **Antigravity AI** |

---

## 🚀 Getting Started

Follow these steps to run the Road-SOS application on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org) (v18 or higher recommended)
*   A Gemini API Key (Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/uday0438/Road-sos.git
cd Road-sos
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example` as a template):
```bash
cp .env.example .env
```
Open the `.env` file and replace the placeholder value with your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 4. Run the Development Server
```bash
npm run dev
```
The server will start locally:
*   Local App & Server: **`http://localhost:3000`**

The development server runs Express under the hood, injecting Vite middleware to hot-reload React components dynamically during local developer changes.

---

## 🌐 Deployment to Vercel

Road-SOS is designed to deploy seamlessly to **Vercel** with a zero-config setup using Serverless Functions inside the `api/` directory.

1.  Push the latest changes to your GitHub repository.
2.  Log in to your [Vercel Dashboard](https://vercel.com) and click **Add New > Project**.
3.  Import your `Road-sos` repository.
4.  Configure the **Environment Variables** in the Vercel project settings:
    *   Key: `GEMINI_API_KEY`
    *   Value: `your_actual_gemini_api_key_here`
5.  Click **Deploy**. Vercel will read `vercel.json` to handle client-side routing and route the backend serverless endpoints to `/api/index.ts`.

---

## 👥 Contributors & Collaboration

*   **Uday Bhaskar**  
    *Embedded Engineer & Vibe Coder*  
    *Electronics and Communication Engineering (ECE)*  
    *Kuppam Engineering College*  
    *Email:* [udayvenkatkalle7@gmail.com](mailto:udayvenkatkalle7@gmail.com)  

### In Partnership & Inspiration
Inspired by and aligned with the road safety research and outreach programs spearheaded by **IIT Madras CoERS** (Center for Outreach and Research in Road Safety) & **RBG Labs**.

### Project Development
Developed with technical guidance and layout optimizations from **Antigravity AI**.

---

## 📄 License
This project is licensed under the MIT License.
