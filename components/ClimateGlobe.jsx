'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Thermometer } from 'lucide-react';
import * as THREE from 'three';
import { getTemperatureDataAction } from '@/lib/actions';
import { useIsMobile } from '@/hooks/useResponsive';
import { getTranslations } from '@/lib/i18n';



extend({
  SphereGeometry: THREE.SphereGeometry,
  MeshLambertMaterial: THREE.MeshLambertMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
});

THREE.Cache.enabled = true;



const TemperatureScale = ({ locale = 'en' }) => {
  const isMobile = useIsMobile();
  const t = getTranslations(locale);
  
  if (isMobile) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'rgba(8, 12, 13, 0.82)',
        backdropFilter: 'blur(15px)',
        padding: '12px 20px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
        fontSize: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0px rgba(47, 111, 115, 0)',
              '0 0 15px rgba(47, 111, 115, 0.6)',
              '0 0 0px rgba(47, 111, 115, 0)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Thermometer size={16} color="var(--foreground)" />
        </motion.div>
        
        <span style={{ fontWeight: '600', marginRight: '8px' }}>
          {t.globe.temperatureAnomalies}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--foreground-muted)', fontSize: '11px' }}>-5°C</span>
          
          <div style={{
            width: '120px',
            height: '12px',
            background: 'linear-gradient(to right, #264c6f 0%, #4d7895 20%, #8fb0bd 40%, #f6f1e8 50%, #c5a46a 60%, #b87b6b 80%, #7f3d32 100%)',
            borderRadius: '6px',
            border: '1px solid rgba(246, 241, 232, 0.18)',
            position: 'relative',
            boxShadow: '0 0 10px var(--border)'
          }}>
            {/* Marqueur pour 0°C */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '2px',
              height: '16px',
              background: 'var(--foreground)',
              borderRadius: '1px',
              boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)'
            }} />
          </div>
          
          <span style={{ color: 'var(--foreground-muted)', fontSize: '11px' }}>+5°C</span>
        </div>
      </div>
    </div>
  );
};


const Globe = ({ year, month, isVisible, autoRotate, onLoad, globeRef, isMobile }) => {
  const groupRef = useRef();
  const baseMeshRef = useRef();
  const [temperatureTexture, setTemperatureTexture] = useState(null);
  const [overlayTexture, setOverlayTexture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoadedKey, setLastLoadedKey] = useState('');
  const instanceId = useRef(Math.random().toString(36).slice(2, 11)).current;

  useFrame(() => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += 0.0016;
  });

  useEffect(() => {
  const normalizedMonth = String(month).padStart(2, '0');
  const key = `${year}_${normalizedMonth}`;
  // On ne skip plus parce que baseMeshRef n'est pas encore monté
  if (isLoading || lastLoadedKey === key) return;
  setIsLoading(true);

  const loader = new THREE.TextureLoader();
  const url = `/textures/gistemp_${key}.png`;

  // success
  loader.load(
    url,
    (tex) => {
      // initialisation générique du texture
      tex.colorSpace   = THREE.SRGBColorSpace;
      tex.magFilter    = THREE.LinearFilter;
      tex.minFilter    = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS        = THREE.ClampToEdgeWrapping;
      tex.wrapT        = THREE.ClampToEdgeWrapping;
      tex.flipY        = true;
      tex.needsUpdate  = true;
      tex.uuid         = THREE.MathUtils.generateUUID();

      setTemperatureTexture(tex);

      // on ne touche au material que si le mesh existe
      if (baseMeshRef.current) {
        const mat = baseMeshRef.current.material;
        if (mat.map) mat.map.dispose();
        mat.map       = tex;
        mat.needsUpdate = true;
        mat.uuid      = THREE.MathUtils.generateUUID();
      }

      setLastLoadedKey(key);
      setIsLoading(false);
    },
    undefined,
    // error → fallback
    () => {
      loader.load(
        `/textures/default_earth.jpg`,
        (tex) => {
          tex.colorSpace   = THREE.SRGBColorSpace;
          tex.magFilter    = THREE.LinearFilter;
          tex.minFilter    = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.wrapS        = THREE.ClampToEdgeWrapping;
          tex.wrapT        = THREE.ClampToEdgeWrapping;
          tex.flipY        = true;
          tex.needsUpdate  = true;
          tex.uuid         = THREE.MathUtils.generateUUID();

          setTemperatureTexture(tex);

          if (baseMeshRef.current) {
            const mat = baseMeshRef.current.material;
            if (mat.map) mat.map.dispose();
            mat.map       = tex;
            mat.needsUpdate = true;
            mat.uuid      = THREE.MathUtils.generateUUID();
          }

          setLastLoadedKey(key);
          setIsLoading(false);
        }
      );
    }
  );

  if (onLoad && lastLoadedKey !== key) {
    getTemperatureDataAction(year, normalizedMonth)
      .then(res => onLoad(res ?? {}))
      .catch(() => setIsLoading(false));
  }
}, [year, month, onLoad, lastLoadedKey, isLoading, instanceId]);


  useEffect(() => {
    if (overlayTexture) return;
    const loader = new THREE.TextureLoader();
    const timestamp = Date.now();
    loader.load(`/textures/overlay.png?i=${instanceId}&time=${timestamp}`, (tex) => {
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearMipMapLinearFilter;
      tex.anisotropy = 8;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.uuid = THREE.MathUtils.generateUUID();
      setOverlayTexture(tex);
    });
  }, [overlayTexture, instanceId]);

  useEffect(() => {
    if (globeRef) globeRef.current = { group: groupRef.current, base: baseMeshRef.current, instanceId };
  }, [globeRef, instanceId]);

  useEffect(() => () => {
    temperatureTexture?.dispose();
    overlayTexture?.dispose();
  }, [temperatureTexture, overlayTexture]);

  return (
    <group ref={groupRef} rotation-x={0.2} position={[0, isMobile ? -0.18 : 0, 0]} visible={isVisible}>
      <mesh ref={baseMeshRef} rotation-x={0.2}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial map={temperatureTexture} toneMapped={false} />
      </mesh>
      {overlayTexture && (
        <mesh rotation-x={0.2}>
          <sphereGeometry args={[1.001, 64, 32]} />
          <meshBasicMaterial map={overlayTexture} transparent opacity={0.43} depthWrite={false} blending={THREE.MultiplyBlending} alphaTest={0.1} />
        </mesh>
      )}
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

const Scene = ({ children }) => (
  <>
    <Stars />
    <hemisphereLight skyColor={0xffffff} groundColor={0x888888} intensity={1.5} />
    <directionalLight
      position={[0, -3, 0]}
      intensity={0.5}
      color={0xffffff}
    />
    {children}
  </>
);

export default function CanvasGlobe({ availableDates, timeline = [], controls, onControlsChange, locale = 'en' }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  const globeRef = useRef(null);
  const isMobile = useIsMobile();
  const t = getTranslations(locale);

  // Utiliser les contrôles externes ou les valeurs par défaut
  const year = controls?.year || availableDates.current_year;
  const month = controls?.month || availableDates.current_month;
  const currentFrameIndex = timeline.findIndex(frame =>
    String(frame.year) === String(year) && frame.month === String(month).padStart(2, '0')
  );
  const timelineProgress = timeline.length > 1 && currentFrameIndex >= 0
    ? (currentFrameIndex / (timeline.length - 1)) * 100
    : 0;
  const firstTimelineFrame = timeline[0];
  const showTimelineHud = controls?.isPlayingTimeline || currentFrameIndex >= 0;

  useEffect(() => {
    if (currentFrameIndex < 0 || timeline.length === 0) return;

    timeline
      .slice(currentFrameIndex + 1, currentFrameIndex + 7)
      .forEach(frame => {
        const img = new window.Image();
        img.src = `/textures/gistemp_${frame.year}_${frame.month}.png`;
      });
  }, [currentFrameIndex, timeline]);

  const handleTempsLoad = (newTemps) => {
    if (onControlsChange) {
      onControlsChange({
        temps: newTemps || {},
        isLoadingTemps: false
      });
    }
  };

  const overlayVariants = {
    hidden: { x: 400, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: '#0b0f10'
    }}>
      {/* Bouton de contrôles auto-rotation seulement */}
      <AnimatePresence>
        {controlsOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'absolute',
              top: '2.3rem',
              right: '4.5rem',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(8, 12, 13, 0.82)',
              backdropFilter: 'blur(20px)',
              padding: '16px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              maxWidth: '280px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <label 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <input 
                type="checkbox" 
                checked={autoRotate} 
                onChange={(e) => setAutoRotate(e.target.checked)} 
                style={{ 
                  accentColor: 'var(--foreground)',
                  width: '18px',
                  height: '18px'
                }} 
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {t.globe.autoRotation}
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton de contrôles */}
      <motion.button 
        onClick={() => setControlsOpen((o) => !o)} 
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          right: '20px',
          top: '20px',
          zIndex: 20,
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(8, 12, 13, 0.82)',
          backdropFilter: 'blur(20px)',
          color: 'var(--foreground)',
          borderRadius: '50%',
          border: '1px solid rgba(47, 111, 115, 0.4)',
          cursor: 'pointer'
        }}
      >
        <Settings size={20} />
      </motion.button>

      {/* Barre d'anomalies de température */}
      <TemperatureScale locale={locale} />

      {showTimelineHud && (
        <div
          style={{
            position: 'absolute',
            left: isMobile ? '14px' : '24px',
            top: isMobile ? '14px' : '24px',
            zIndex: 12,
            width: isMobile ? '180px' : '260px',
            padding: isMobile ? '10px' : '14px',
            borderRadius: '12px',
            background: 'rgba(8, 12, 13, 0.82)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(47, 111, 115, 0.35)',
            color: 'var(--foreground)',
            boxShadow: '0 16px 35px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '8px'
          }}>
            <div style={{
              fontSize: isMobile ? '18px' : '26px',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {String(month).padStart(2, '0')}/{year}
            </div>
            {controls?.isPlayingTimeline && (
              <motion.div
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 14px rgba(47, 111, 115, 0.75)'
                }}
              />
            )}
          </div>
          <div style={{
            height: '6px',
            borderRadius: '999px',
            background: 'var(--border)',
            overflow: 'hidden'
          }}>
            <motion.div
              animate={{ width: `${timelineProgress}%` }}
              transition={{ duration: 0.2 }}
              style={{
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, var(--foreground), var(--accent))'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '6px',
            color: 'rgba(246, 241, 232, 0.55)',
            fontSize: isMobile ? '9px' : '10px'
          }}>
            <span>{firstTimelineFrame ? `${firstTimelineFrame.month}/${firstTimelineFrame.year}` : '--'}</span>
            <span>{currentFrameIndex >= 0 ? `${currentFrameIndex + 1}/${timeline.length}` : timeline.length}</span>
          </div>
        </div>
      )}

      <Canvas
        camera={{
          position: [0, 0, isMobile ? 2.65 : 2.5],
          fov: isMobile ? 64 : 75
        }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene>
            <Globe 
              year={year} 
              month={month} 
              isVisible={true} 
              autoRotate={autoRotate} 
              onLoad={handleTempsLoad} 
              globeRef={globeRef} 
              isMobile={isMobile}
            />
          </Scene>
          <OrbitControls 
            enableDamping 
            dampingFactor={0.1} 
            zoomSpeed={0.3} 
            minDistance={2} 
            maxDistance={5} 
            enablePan={false} 
          />
        </Suspense>
      </Canvas>

    </div>
  );
}
