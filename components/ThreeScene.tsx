import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows, Stars } from '@react-three/drei';
import { Asset } from '../types';
import { Coin3D } from './Coin3D';

// Fix for missing R3F types in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      group: any;
    }
  }
}

interface ThreeSceneProps {
  assets: Asset[];
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ assets }) => {
  const controlsRef = useRef<any>(null);
  
  // Circular arrangement for initial positions
  const getPos = (index: number) => {
    const angle = (index / assets.length) * Math.PI * 2;
    const radius = 3.5;
    // Spread them on X/Y plane for better visibility in split screen
    return [
      Math.cos(angle) * radius, 
      Math.sin(angle) * radius * 0.8, 
      0
    ] as [number, number, number];
  };

  return (
    <div className="w-full h-full relative bg-[#050505] overflow-hidden">
       {/* Instructional Overlay */}
      <div className="absolute bottom-8 left-0 right-0 z-10 text-center pointer-events-none opacity-40">
        <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-serif">
          Interactive Physics &bull; Drag Assets
        </p>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={35} />
          
          {/* Minimal Orbit Controls - mostly locked to face forward but allows slight perspective shift */}
          <OrbitControls 
            ref={controlsRef}
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2 - 0.2}
            maxPolarAngle={Math.PI / 2 + 0.2}
            minAzimuthAngle={-0.2}
            maxAzimuthAngle={0.2}
          />
          
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 20]} angle={0.25} penumbra={1} shadow-mapSize={2048} castShadow intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, 5]} intensity={0.5} color="#4444ff" />
          
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <group>
            {assets.map((asset, index) => (
                <Coin3D 
                  key={asset.id} 
                  asset={asset} 
                  position={getPos(index)} 
                  index={index}
                />
            ))}
          </group>

          {/* Floor shadow for depth perception */}
          <ContactShadows 
            resolution={1024} 
            scale={30} 
            blur={3} 
            opacity={0.4} 
            far={10} 
            color="#000000" 
            position={[0, 0, -2]}
            rotation={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};