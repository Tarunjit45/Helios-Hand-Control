# COSMOS: Interactive 3D Solar System 🌌

A futuristic, hand-controlled 3D space simulation that runs entirely in your browser. This project combines **WebGL** graphics, **Computer Vision**, and **Generative AI** to create an immersive educational experience.

![Project Preview](https://via.placeholder.com/800x450?text=Cosmos+Simulation+Preview)

## 🚀 Overview

**COSMOS** places the solar system in the palm of your hand. Using your webcam, the application tracks your hand movements in real-time, allowing you to navigate space without touching a mouse or keyboard. 

Clicking on a planet triggers a request to Google's **Gemini AI**, which acts as your intelligent planetary guide, serving up fascinating scientific facts on demand.

## ✨ Key Features

- **👋 Natural User Interface (NUI)**
  - **Orbit & Pan**: Move your open hand to rotate the camera around the solar system.
  - **Warp Zoom**: Pinch your thumb and index finger, then move up or down to warp from a single planet view to a full galaxy view.
  
- **🪐 Realistic 3D Rendering**
  - High-resolution planetary textures.
  - Atmospheric scattering shaders (Earth).
  - Dynamic lighting and self-shadowing.
  - Procedurally generated spiral galaxy with thousands of instanced stars.
  - Animated solar surface and Saturn's rings.

- **🤖 AI-Powered Insights**
  - Integrated **Google Gemini 2.5 Flash** model.
  - Generates dynamic, concise, and engaging scientific facts about selected celestial bodies.

- **⚡ Performance**
  - Built on **React 19** and **Three.js**.
  - Optimized asset loading with graceful error handling and fallbacks.
  - Smooth 60FPS rendering loop alongside heavy CV processing.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Computer Vision**: [MediaPipe](https://developers.google.com/mediapipe) (Hand Landmarker)
- **AI**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎮 Controls

The application uses your webcam to detect hand landmarks. Ensure you are in a well-lit room for the best experience.

| Gesture | Action | Description |
| :--- | :--- | :--- |
| **Open Hand** | **Navigate** | Move your hand left/right/up/down to rotate the camera around the focus point. |
| **Pinch (Index+Thumb)** | **Engage Engines** | Hold a pinch gesture to activate Zoom Mode. |
| **Pinch + Move Up** | **Zoom In** | Fly closer to the sun/planets. |
| **Pinch + Move Down** | **Zoom Out** | Warp out to view the entire galaxy arm. |

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cosmos-hand-control.git
   cd cosmos-hand-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   You need a Google Gemini API key to enable the AI features.
   - Create a `.env` file in the root directory.
   - Add your key:
     ```env
     API_KEY=your_google_gemini_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🧩 Architecture

- **`App.tsx`**: Main entry point, handles UI overlay and global state.
- **`components/Scene.tsx`**: The R3F Canvas. Contains the lighting, stars, procedural galaxy logic, and renders all planets.
- **`components/HandTracker.tsx`**: Wraps MediaPipe logic. Runs a loop to detect hands from the webcam video feed and broadcasts coordinates to the 3D scene.
- **`services/geminiService.ts`**: Handles communication with Google's Generative AI.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using React & Three.js*
