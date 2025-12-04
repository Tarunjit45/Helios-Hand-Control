import React, { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hand, Globe, Zap, Loader as LoaderIcon } from 'lucide-react';
import HandTracker from './components/HandTracker';
import Scene from './components/Scene';
import { HandControlState, PlanetData } from './types';
import { getPlanetFact } from './services/geminiService';

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full text-cyan-400">
    <LoaderIcon className="w-12 h-12 animate-spin mb-4" />
    <div className="text-xl font-mono tracking-widest">INITIALIZING UNIVERSE...</div>
  </div>
);

const App: React.FC = () => {
  const handControlRef = useRef<HandControlState>({
    x: 0,
    y: 0,
    isPinching: false,
    isActive: false,
  });

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [geminiInfo, setGeminiInfo] = useState<string | null>(null);
  const [loadingGemini, setLoadingGemini] = useState(false);

  const handleHandUpdate = useCallback((newState: HandControlState) => {
    handControlRef.current = newState;
  }, []);

  const handlePlanetSelect = async (planet: PlanetData) => {
    setSelectedPlanet(planet);
    setGeminiInfo(null);
    setLoadingGemini(true);
    
    const info = await getPlanetFact(planet.name);
    setGeminiInfo(info);
    setLoadingGemini(false);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 50, 100], fov: 45, far: 8000 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <Scene handState={handControlRef} onPlanetSelect={handlePlanetSelect} />
            </Suspense>
          </Canvas>
      </div>
      
      {/* Fallback Loader for Scene if Canvas Suspends */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
         <Suspense fallback={<LoadingScreen />}>
            <div />
         </Suspense>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 drop-shadow-[0_0_15px_rgba(200,100,255,0.5)]">
            COSMOS
          </h1>
          <div className="flex items-center gap-2 text-cyan-200/80 font-mono text-sm tracking-widest uppercase">
            <Globe className="w-4 h-4" />
            <span>Real-Time Simulation</span>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl max-w-xs text-xs text-gray-300 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold border-b border-white/10 pb-2">
             <Hand className="w-4 h-4" /> 
             <span>HAND COMMAND</span>
          </div>
          <div className="space-y-3 opacity-90">
             <div className="flex items-start gap-2">
                <div className="bg-white/10 p-1 rounded">✋</div>
                <div>
                   <strong className="block text-white">Orbit / Pan</strong>
                   Open hand + Move
                </div>
             </div>
             <div className="flex items-start gap-2">
                <div className="bg-cyan-500/20 p-1 rounded text-cyan-300">👌</div>
                <div>
                   <strong className="block text-cyan-300">Warp Zoom</strong>
                   Pinch + Move Up/Down
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Planet Detail Card */}
      {selectedPlanet && (
        <div className="absolute top-1/2 left-8 -translate-y-1/2 z-30 w-80 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all duration-500 animate-in fade-in slide-in-from-left-10">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-transparent to-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{selectedPlanet.name}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Dist: {selectedPlanet.distance} AU
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Rad: {selectedPlanet.radius}x Earth
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlanet(null)}
                  className="text-white/40 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-all text-xl"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* AI Content */}
            <div className="p-6 relative min-h-[140px]">
               <div className="flex items-center gap-2 mb-3 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 uppercase tracking-wider">
                  <Zap className="w-3 h-3" />
                  Gemini Intelligence
               </div>
               
               {loadingGemini ? (
                 <div className="space-y-2 animate-pulse">
                   <div className="h-2 bg-white/10 rounded w-full"></div>
                   <div className="h-2 bg-white/10 rounded w-5/6"></div>
                   <div className="h-2 bg-white/10 rounded w-4/6"></div>
                 </div>
               ) : (
                 <p className="text-sm leading-relaxed text-gray-300 border-l-2 border-orange-500/50 pl-3">
                   {geminiInfo}
                 </p>
               )}
            </div>
          </div>
        </div>
      )}

      <HandTracker onUpdate={handleHandUpdate} />

    </div>
  );
};

export default App;