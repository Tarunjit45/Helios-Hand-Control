import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandControlState } from '../types';

interface HandTrackerProps {
  onUpdate: (state: HandControlState) => void;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    let active = true;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        if (!active) return;

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        handLandmarkerRef.current = handLandmarker;
        startWebcam();
      } catch (error) {
        console.error("Failed to load MediaPipe:", error);
        setLoading(false);
      }
    };

    setupMediaPipe();

    return () => {
      active = false;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener('loadeddata', predictWebcam);
      setLoading(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
    }
  };

  const predictWebcam = () => {
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && landmarker && video.currentTime !== 0) {
      let startTimeMs = performance.now();
      const results = landmarker.detectForVideo(video, startTimeMs);

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        // Use Index Finger Tip (8) for position
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        // Normalize coordinates to -1 to 1 range (MediaPipe is 0 to 1)
        // Invert X because webcam is mirrored usually
        const x = (1 - indexTip.x) * 2 - 1; 
        const y = (1 - indexTip.y) * 2 - 1;

        // Calculate pinch distance (simple euclidean in 2D)
        const dx = indexTip.x - thumbTip.x;
        const dy = indexTip.y - thumbTip.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isPinching = distance < 0.05; // Threshold

        onUpdate({ x, y, isPinching, isActive: true });
      } else {
        onUpdate({ x: 0, y: 0, isPinching: false, isActive: false });
      }
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="absolute bottom-4 right-4 z-50 pointer-events-none">
      <div className="relative overflow-hidden rounded-xl border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-black/80">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 object-cover -scale-x-100" // Mirror the video for natural feel
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-400 font-mono bg-black/90">
            INIT_VISION...
          </div>
        )}
        <div className="absolute bottom-1 left-2 text-[10px] font-mono text-cyan-400">
          STATUS: {loading ? 'LOADING' : 'ACTIVE'}
        </div>
      </div>
      <div className="mt-2 text-center text-xs font-mono text-cyan-400/80 bg-black/50 p-1 rounded">
        Index finger: Navigate<br/>
        Pinch: Zoom / Grip
      </div>
    </div>
  );
};

export default HandTracker;
