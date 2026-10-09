# 🪐 Helios Hand Control — 3D Solar System with Gesture Interaction & Gemini AI

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe%20Hands-0097A7?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Three.js](https://img.shields.io/badge/3D-Three.js%20WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> *"Control the cosmos with the palm of your hand."*

**Helios Hand Control** is an interactive 3D WebGL solar system simulation controlled entirely through **hand gestures detected by your webcam via Google MediaPipe**. Coupled with the **Google Gemini API**, you can pinch, rotate, and zoom between celestial bodies, locking onto planets to receive real-time, AI-generated scientific insights and astrophysical analysis.

---

## ✨ Features

* 🖐️ **Touchless Celestial Navigation:** Move, rotate orbits, and zoom the camera into planetary surfaces using 21 3D hand keypoints tracked by MediaPipe.
* 🌌 **Interactive 3D WebGL Orbits:** Procedural shaders, sun flares, planetary rings, and textured orbital paths for all planets from Mercury to Neptune.
* 🧠 **Gemini Planetary Intel:** Point or select any planet to generate deep scientific breakdowns of atmospheric composition, gravity, orbital periods, and exploration history.
* 🎙️ **Voice Exploration:** Ask spoken questions about celestial phenomena using integrated microphone input.

---

## 🛠️ Architecture

```
[ Webcam Feed ]
       |
       v
+-------------------------------------------------------------+
|               MediaPipe Hand Landmark Tracking              |
|        Detects pinch (zoom), swipe (rotate), point (select) |
+-------------------------------------------------------------+
       |
       v
+-------------------------------------------------------------+
|              Three.js 3D Solar System Simulation           |
|        Dynamic camera lerp, orbital math & lighting         |
+-------------------------------------------------------------+
       | (Planet Selected)
       v
+-------------------------------------------------------------+
|                   Google Gemini AI Service                  |
|     `services/geminiService.ts` — Astrophysical Insights    |
+-------------------------------------------------------------+
```

---

## 📁 Repository Structure

```text
Helios-Hand-Control/
├── App.tsx             # 3D canvas viewport, gesture HUD & planet drawer
├── index.tsx           # React bootstrap entry point
├── components/         # GestureGuide, PlanetDetailCard, SolarControls
├── constants.ts        # Astronomical orbital data, planet textures & radii
├── services/           # Gemini API client for astronomical inquiries
├── metadata.json       # Project manifest
├── package.json        # Dependencies & scripts
├── LICENSE             # MIT License
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/Tarunjit45/Helios-Hand-Control.git
cd Helios-Hand-Control

npm install
```

### 2. Configure Gemini Key
Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and allow webcam permissions to explore the solar system!

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
