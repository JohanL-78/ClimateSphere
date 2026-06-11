'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BarChart3, TrendingUp } from 'lucide-react';

// Import dynamique de TemperatureChart avec Recharts
const TemperatureChart = dynamic(() => import('./TemperatureChart'), {
  ssr: false,
  loading: () => <ChartLoadingFallback />
});

// Composant de chargement pour les graphiques
function ChartLoadingFallback({ locale = 'en' }) {
  const messages = locale === 'fr'
    ? {
        loadingCharts: 'Chargement des graphiques...',
        preparing: 'Preparation de la visualisation Recharts'
      }
    : {
        loadingCharts: 'Loading charts...',
        preparing: 'Preparing the Recharts visualization'
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '40px'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(27, 26, 23, 0.95) 0%, rgba(8, 12, 13, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '60px',
          color: 'var(--foreground)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-heavy)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(47, 111, 115, 0.6), rgba(47, 111, 115, 0.4))',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            animate={{
              boxShadow: [
                '0 0 0px rgba(47, 111, 115, 0)',
                '0 0 20px rgba(47, 111, 115, 0.6)',
                '0 0 0px rgba(47, 111, 115, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarChart3 size={24} color="var(--accent)" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingUp size={24} color="#b87b6b" />
          </motion.div>
        </div>

        <h2 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {messages.loadingCharts}
        </h2>
        
        <p style={{ 
          margin: '0 0 20px 0', 
          fontSize: '16px', 
          color: 'var(--foreground-muted)' 
        }}>
          {messages.preparing}
        </p>

        <motion.div
          style={{
            width: '200px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
            margin: '0 auto'
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
              borderRadius: '2px'
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Composant wrapper avec lazy loading
export default function LazyTemperatureChart({ isOpen, onClose, tableData, currentMonth, locale = 'en' }) {
  // Si la modale n'est pas ouverte, ne pas charger le composant
  if (!isOpen) {
    return null;
  }

  // Une fois ouverte, charger le vrai composant TemperatureChart
  return (
    <Suspense fallback={<ChartLoadingFallback locale={locale} />}>
      <TemperatureChart 
        locale={locale}
        isOpen={isOpen}
        onClose={onClose}
        tableData={tableData}
        currentMonth={currentMonth}
      />
    </Suspense>
  );
}
