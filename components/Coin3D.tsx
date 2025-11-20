import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Cylinder, MeshTransmissionMaterial, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { Asset } from '../types';

// Fix for missing R3F types in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
    }
  }
}

interface Coin3DProps {
  asset: Asset;
  position: [number, number, number];
  index: number;
}

export const Coin3D: React.FC<Coin3DProps> = ({ asset, position, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Physics state
  const [isDragging, setIsDragging] = useState(false);
  const targetPosition = useRef(new THREE.Vector3(...position));
  const currentPosition = useRef(new THREE.Vector3(...position));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  
  const { camera, raycaster, size } = useThree();
  
  // Invisible plane for raycasting dragging (z = 0)
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  // Calculate scale based on value
  const value = asset.amount * asset.price;
  const scaleFactor = Math.max(1, Math.log10(value + 10) * 0.35); 

  useFrame((state, delta) => {
    if (groupRef.current && meshRef.current) {
      // 1. Update Target Position (Mouse Follow)
      if (isDragging) {
        raycaster.setFromCamera(state.pointer, camera);
        raycaster.ray.intersectPlane(dragPlane, intersectPoint);
        // Add a slight Z offset when dragging to float above others
        targetPosition.current.set(intersectPoint.x, intersectPoint.y, 2);
      } else {
        // Return to Z=0 plane when released, but keep X/Y
        targetPosition.current.z = 0;
        
        // Gentle floating idle animation applied to the target base
        const t = state.clock.elapsedTime + index * 100;
        targetPosition.current.y += Math.sin(t) * 0.002; 
      }

      // 2. Physics Simulation (Spring/Hooke's Law)
      // F = -k * (x - x_target) - c * v
      const stiffness = 120; // Spring tension
      const damping = 8;     // Friction
      
      const diff = new THREE.Vector3().subVectors(targetPosition.current, currentPosition.current);
      const force = diff.multiplyScalar(stiffness);
      
      // Apply damping
      const dampingForce = velocity.current.clone().multiplyScalar(damping);
      force.sub(dampingForce);
      
      // Update velocity and position (Mass = 1)
      velocity.current.add(force.multiplyScalar(delta));
      currentPosition.current.add(velocity.current.clone().multiplyScalar(delta));

      // Apply to group
      groupRef.current.position.copy(currentPosition.current);

      // 3. Dynamic Tilt based on Velocity
      // Rotate the inner mesh based on how fast the group is moving
      const tiltX = velocity.current.y * 0.15;
      const tiltY = velocity.current.x * 0.15;
      
      // Smoothly lerp rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.PI / 2 - tiltX, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -tiltY, 0.1);
      
      // Idle spin
      if (!isDragging) {
        meshRef.current.rotation.z += delta * 0.2;
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    document.body.style.cursor = 'grab';
  };

  return (
    <group ref={groupRef} position={position}>
      <Cylinder
        ref={meshRef as any}
        args={[1 * scaleFactor, 1 * scaleFactor, 0.15, 64]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => { document.body.style.cursor = 'grab'; }}
        onPointerOut={() => { if (!isDragging) document.body.style.cursor = 'auto'; }}
      >
        {/* Premium Glassy/Metallic Look */}
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color={asset.color}
          toneMapped={true}
          metalness={0.6}
          roughness={0.2}
        />
        <Edges threshold={15} color="white" opacity={0.3} />
      </Cylinder>

      {/* Floating Label - Attached to the physics group so it moves with it */}
      <group position={[0, 1.2 * scaleFactor, 0]}>
        <Text
          fontSize={0.4}
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={10}
        >
          {asset.symbol}
        </Text>
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.15}
          color="rgba(255,255,255,0.6)"
          anchorX="center"
          anchorY="middle"
          renderOrder={10}
        >
          ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
      </group>
    </group>
  );
};