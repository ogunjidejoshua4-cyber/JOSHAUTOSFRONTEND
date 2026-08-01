import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial, Sphere } from '@react-three/drei';

// Rotating 3D Core Model Component
const Animated3DCarModel = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        {/* Futuristic geometric vehicle/gem structure */}
        <icosahedronGeometry args={[2.2, 1]} />
        <MeshWobbleMaterial 
          color="#3b82f6" 
          wireframe={true} 
          factor={0.3} 
          speed={1.5} 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Inner Glowing Core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial 
          color="#38bdf8" 
          emissive="#1d4ed8" 
          emissiveIntensity={2} 
          roughness={0.2}
        />
      </Sphere>
    </Float>
  );
};

const ThreeCanvas = () => {
  return (
    <div style={{ width: '100%', height: '420px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#38bdf8" />
        <pointLight position={[-10, -10, -5]} intensity={1.5} color="#3b82f6" />
        
        <Animated3DCarModel />
        
        {/* Allows customer to drag and spin the 3D model */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;