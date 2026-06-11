'use client';

import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useResponsive';
import { getTranslations } from '@/lib/i18n';

/**
 * Modal pour afficher les détails d'une anomalie de température
 * 
 * @param {boolean} isOpen - État d'ouverture de la modal
 * @param {function} onClose - Callback de fermeture
 * @param {object} data - Données des températures (global, north, south, oni)
 * @param {string} type - Type de donnée à afficher ('global', 'north', 'south', 'oni')
 * @param {number} year - Année des données
 * @param {number} month - Mois des données
 */
export default function DetailModal({ isOpen, onClose, data, type, year, month, locale = 'en' }) {
  const isMobile = useIsMobile();
  const t = getTranslations(locale);
  
  if (!isOpen) return null;
  
  const getTypeInfo = () => {
    switch (type) {
      case 'global': return { title: 'Global', value: data?.global, color: 'var(--accent-soft)' };
      case 'north': return { title: t.modal.northernHemisphere, value: data?.north, color: '#D4A95F' };
      case 'south': return { title: t.modal.southernHemisphere, value: data?.south, color: '#C56F4B' };
      case 'oni': return { title: 'ONI', value: data?.oni, color: 'var(--accent)' };
      default: return { title: '', value: null, color: 'var(--foreground)' };
    }
  };
  
  const typeInfo = getTypeInfo();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(8, 12, 13, 0.84)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '20px' : '40px'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 17, 15, 0.96) 0%, rgba(8, 12, 13, 0.96) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          border: '1px solid var(--border-strong)',
          padding: isMobile ? '20px' : '30px',
          maxWidth: '400px',
          width: '100%',
          color: 'var(--foreground)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            color: 'var(--foreground)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(246, 241, 232, 0.08)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          ×
        </button>
        
        <h3 style={{ 
          color: typeInfo.color, 
          marginBottom: '10px',
          fontSize: isMobile ? '18px' : '20px',
          fontWeight: '700'
        }}>
          {typeInfo.title}
        </h3>
        
        <p style={{ 
          color: 'var(--foreground-soft)', 
          marginBottom: '20px',
          fontSize: isMobile ? '14px' : '16px'
        }}>
          {month}/{year}
        </p>
        
        <div style={{
          fontSize: isMobile ? '28px' : '32px',
          fontWeight: '700',
          color: typeInfo.color,
          marginBottom: '10px',
          textShadow: '0 0 20px rgba(47, 111, 115, 0.28)'
        }}>
          {typeInfo.value !== null ? `${typeInfo.value?.toFixed(2)}°C` : 'N/A'}
        </div>
        
        <p style={{ 
          color: 'var(--foreground-muted)', 
          fontSize: isMobile ? '12px' : '14px',
          lineHeight: '1.4'
        }}>
          {t.modal.anomalyDescription}
        </p>
      </motion.div>
    </motion.div>
  );
}
