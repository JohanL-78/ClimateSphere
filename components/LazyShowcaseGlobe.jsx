'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ShowcaseGlobe = dynamic(() => import('./ShowcaseGlobe'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%' }} />
});

export default function LazyShowcaseGlobe({ year, month }) {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
      <ShowcaseGlobe year={year} month={month} />
    </Suspense>
  );
}
