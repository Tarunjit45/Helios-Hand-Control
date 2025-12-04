
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sparkles, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData, HandControlState } from '../types';
import { SOLAR_SYSTEM_DATA, SUN_TEXTURE_URL } from '../constants';

interface SceneProps {
  handState: React.MutableRefObject<HandControlState>;
  onPlanetSelect: (planet: PlanetData) => void;
}

interface PlanetProps {
  data: PlanetData;
  onSelect: (p: PlanetData) => void;
}

// Custom hook to load texture safely without throwing errors
const useSafeTexture = (url: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        setTexture(tex);
      },
      undefined,
      (err) => {
        // Silently fail - just don't set the texture, causing fallback to color
        // console.warn(`Failed to load texture: ${url}`); 
      }
    );
  }, [url]);

  return texture;
};

// --- PLANET COMPONENTS ---

const PlanetRing = ({ textureUrl, radius, color }: { textureUrl: string, radius: number, color: string }) => {
  const ringMap = useSafeTexture(textureUrl);
  
  return (
    <mesh rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
      <meshStandardMaterial 
        map={ringMap} 
        color={ringMap ? '#ffffff' : color}
        transparent 
        side={THREE.DoubleSide} 
        opacity={0.8} 
      />
    </mesh>
  );
};

const PlanetContent: React.FC<PlanetProps> = ({ data, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorMap = useSafeTexture(data.textureUrl);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Self rotation
    }
  });

  return (
    <group>
        <mesh 
          ref={meshRef} 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(data);
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          {colorMap ? (
             <meshStandardMaterial 
                map={colorMap} 
                metalness={0.1} 
                roughness={0.8} 
             />
          ) : (
             <meshStandardMaterial 
                color={data.color}
                metalness={0.1}
                roughness={0.8}
             />
          )}
          
          {/* Atmosphere Effect for Earth */}
          {data.name === 'Earth' && (
             <mesh scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[data.radius, 64, 64]} />
                <meshPhongMaterial 
                   color="#4488ff" 
                   transparent 
                   opacity={0.2} 
                   side={THREE.BackSide} 
                   blending={THREE.AdditiveBlending}
                />
             </mesh>
          )}
        </mesh>
        
        {data.hasRings && data.ringTextureUrl && (
            <PlanetRing textureUrl={data.ringTextureUrl} radius={data.radius} color={data.color} />
        )}
    </group>
  );
};

const PlanetContainer: React.FC<PlanetProps> = ({ data, onSelect }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = initialAngle + clock.getElapsedTime() * data.speed;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[data.distance, 0, 0]}>
        <PlanetContent data={data} onSelect={onSelect} />

        {/* Planet Label */}
        <Billboard
            position={[0, data.radius + (data.hasRings ? 4 : 2), 0]}
            follow={true}
        >
           <Text
            fontSize={Math.max(1.5, data.radius * 0.4)}
            color="white"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.9}
            outlineWidth={0.05}
            outlineColor="black"
          >
            {data.name}
          </Text>
        </Billboard>
      </group>
      
      {/* Orbit Path Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

const Sun = () => {
  const sunTexture = useSafeTexture(SUN_TEXTURE_URL);
  
  return (
    <group>
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        {sunTexture ? (
            <meshBasicMaterial map={sunTexture} color="#ffddaa" toneMapped={false} />
        ) : (
            <meshBasicMaterial color="#FDB813" toneMapped={false} />
        )}
      </mesh>
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
       <mesh scale={[1.6, 1.6, 1.6]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.15} side={THREE.BackSide} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight intensity={3.0} distance={1000} decay={0.5} color="#fff0d0" />
    </group>
  );
};

// --- REALISTIC STARS & COSMOS ---

const RealisticStars = () => {
    const points = useRef<THREE.Points>(null);
    const [positions, colors] = useMemo(() => {
        const count = 15000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();
        const starColors = ['#9bb0ff', '#aabfff', '#cad7ff', '#f8f7ff', '#fff4ea', '#ffd2a1', '#ffcc6f'];

        for(let i=0; i<count; i++) {
             const r = 400 + Math.random() * 2000; 
             const theta = 2 * Math.PI * Math.random();
             const phi = Math.acos(2 * Math.random() - 1);
             const x = r * Math.sin(phi) * Math.cos(theta);
             const y = r * Math.sin(phi) * Math.sin(theta);
             const z = r * Math.cos(phi);
             positions[i*3] = x;
             positions[i*3+1] = y;
             positions[i*3+2] = z;
             color.set(starColors[Math.floor(Math.random() * starColors.length)]);
             color.multiplyScalar(0.8 + Math.random() * 0.4);
             colors[i*3] = color.r;
             colors[i*3+1] = color.g;
             colors[i*3+2] = color.b;
        }
        return [positions, colors];
    }, []);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={2.5} vertexColors transparent opacity={0.9} sizeAttenuation={false} depthWrite={false} />
        </points>
    );
};

const DistantSystem = React.memo(({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color={"#ffddaa"} toneMapped={false} />
      </mesh>
      <mesh scale={[4,4,4]}>
         <planeGeometry args={[2, 2]} />
         <meshBasicMaterial color={"#ffaa55"} transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
});

const GalacticCore = () => {
  return (
    <group position={[0, -50, -1000]}>
       <mesh>
         <sphereGeometry args={[250, 64, 64]} />
         <meshBasicMaterial color="#fff0e0" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
       </mesh>
       <Sparkles count={3000} scale={[1400, 300, 800]} size={60} speed={0.2} opacity={0.5} color="#ffccaa" />
    </group>
  )
}

const CameraController = ({ handState }: { handState: React.MutableRefObject<HandControlState> }) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 50, 100));
  const spherical = useRef(new THREE.Spherical(100, Math.PI / 3, 0));

  useFrame((state, delta) => {
    const { x, y, isPinching, isActive } = handState.current;

    if (isActive) {
      if (isPinching) {
        // Logarithmic / Exponential Zoom for Cosmic Scale
        // Moving hand UP (positive Y) = Zoom IN (Decrease Radius)
        // Moving hand DOWN (negative Y) = Zoom OUT (Increase Radius)
        
        const zoomSensitivity = 1.5;
        // If Y is positive (Hand Up), we divide radius (Zoom In)
        // If Y is negative (Hand Down), we multiply radius (Zoom Out)
        
        let zoomFactor = 1.0;
        if (Math.abs(y) > 0.05) {
            zoomFactor = 1 - (y * zoomSensitivity * delta);
        }

        spherical.current.radius *= zoomFactor;
        
        // Clamp between close planet view (12) and galactic view (4000)
        spherical.current.radius = THREE.MathUtils.clamp(spherical.current.radius, 12, 4000);
      } else {
        const rotateSpeed = 1.2;
        spherical.current.theta += -x * rotateSpeed * delta;
        spherical.current.phi = THREE.MathUtils.clamp(
          spherical.current.phi + (-y * rotateSpeed * delta), 
          0.1, 
          Math.PI / 1.5 
        );
      }
    } else {
       spherical.current.theta += 0.05 * delta;
    }

    targetPosition.current.setFromSpherical(spherical.current);
    camera.position.lerp(targetPosition.current, 0.08); 
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Scene: React.FC<SceneProps> = ({ handState, onPlanetSelect }) => {
  const distantSystems = useMemo(() => {
    const systems = [];
    const count = 300; 
    const arms = 4;
    const armSpread = 0.4; 

    for(let i=0; i<count; i++) {
        const distance = 300 + Math.random() * 2000; 
        const angle = (distance * 0.003) + (Math.floor(Math.random() * arms) * (Math.PI * 2 / arms));
        const randomOffset = (Math.random() - 0.5) * 300;
        
        const x = Math.cos(angle + armSpread) * distance + randomOffset;
        const z = Math.sin(angle + armSpread) * distance + randomOffset;
        const y = (Math.random() - 0.5) * 150; 
        
        systems.push({
           pos: [x,y,z],
           scale: 2 + Math.random() * 4 
        });
    }
    return systems;
  }, []);

  return (
    <>
      <color attach="background" args={['#000005']} />
      <ambientLight intensity={0.05} color="#ccccff" /> 
      
      <RealisticStars />
      <GalacticCore />
      
      <group rotation={[0, 0, Math.PI / 8]}>
        <Sparkles count={5000} scale={[2500, 100, 2500]} size={15} speed={0} opacity={0.3} color="#6688ff" noise={100} />
        <Sparkles count={3000} scale={[2000, 100, 2000]} size={20} speed={0} opacity={0.2} color="#ff66aa" noise={100} />
      </group>

      {distantSystems.map((sys, i) => (
        <DistantSystem key={i} position={sys.pos as [number,number,number]} scale={sys.scale} />
      ))}

      <group>
        <Sun />
        {SOLAR_SYSTEM_DATA.map((planet) => (
            <PlanetContainer key={planet.name} data={planet} onSelect={onPlanetSelect} />
        ))}
      </group>

      <CameraController handState={handState} />
    </>
  );
};

export default Scene;
