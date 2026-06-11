'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import dynamique simple - pas de préchargement pour éviter les conflits
const ClimateGlobe = dynamic(() => import('./ClimateGlobe'), {
  ssr: false,
  loading: () => <GlobeLoadingFallback />
});

// Composant de chargement pour le globe
function GlobeLoadingFallback() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--background-deep)',
      width: '100%',
      height: '100%'
    }} />
  );
}

// Composant wrapper avec lazy loading simple
export default function LazyClimateGlobe({ availableDates, timeline, controls, onControlsChange, locale = 'en' }) {
  return (
    <Suspense fallback={<GlobeLoadingFallback />}>
      <ClimateGlobe 
        locale={locale}
        availableDates={availableDates}
        timeline={timeline}
        controls={controls}
        onControlsChange={onControlsChange}
      />
    </Suspense>
  );
}
