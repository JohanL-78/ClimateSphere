'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

extend({
  SphereGeometry: THREE.SphereGeometry,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
});

THREE.Cache.enabled = true;

const Globe = () => {
  const groupRef = useRef();
  const baseMeshRef = useRef();
  const [texture, setTexture] = useState(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0012;
  });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.flipY = true;
      tex.needsUpdate = true;
      setTexture(tex);

      if (baseMeshRef.current) {
        const mat = baseMeshRef.current.material;
        if (mat.map) mat.map.dispose();
        mat.map = tex;
        mat.needsUpdate = true;
      }
    });

    return () => {
      texture?.dispose();
    };
  }, []);

  return (
    <group ref={groupRef} rotation-x={0.2}>
      <mesh ref={baseMeshRef} rotation-x={0.2}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

const Stars = ({ count = 1500 }) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#f6f1e8" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
};

export default function ShowcaseGlobe() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      background: 'transparent'
    }}>
      <Canvas
        camera={{
          position: [0, 0, 2.8],
          fov: 55
        }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Stars />
          <hemisphereLight skyColor={0xffffff} groundColor={0x888888} intensity={1.5} />
          <directionalLight position={[0, -3, 0]} intensity={0.5} color={0xffffff} />
          <Globe />
        </Suspense>
      </Canvas>
    </div>
  );
}
