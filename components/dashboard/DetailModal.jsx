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
export default function DetailModal({ isOpen, onClose, data, type, year, month, displayMode = 'monthly', locale = 'en' }) {
  const isMobile = useIsMobile();
  const t = getTranslations(locale);
  
  if (!isOpen) return null;

  const formatRank = (rank) => {
    if (!rank?.rank || !rank?.total) return null;
    return `#${rank.rank}/${rank.total}`;
  };
  
  const getTypeInfo = () => {
    switch (type) {
      case 'global': return { title: 'Global', value: data?.global, preindustrialValue: data?.preindustrial?.global, ranks: data?.ranks?.global, color: 'var(--accent-soft)' };
      case 'north': return { title: t.modal.northernHemisphere, value: data?.north, preindustrialValue: data?.preindustrial?.north, ranks: data?.ranks?.north, color: '#D4A95F' };
      case 'south': return { title: t.modal.southernHemisphere, value: data?.south, preindustrialValue: data?.preindustrial?.south, ranks: data?.ranks?.south, color: '#C56F4B' };
      case 'oni': return { title: 'ONI', value: data?.oni, color: 'var(--accent)' };
      default: return { title: '', value: null, color: 'var(--foreground)' };
    }
  };
  
  const typeInfo = getTypeInfo();
  const sameMonthRank = formatRank(typeInfo.ranks?.sameMonth);
  const absoluteRank = formatRank(typeInfo.ranks?.absolute);
  const annualRank = formatRank(typeInfo.ranks?.annual);
  const hasRanks = sameMonthRank || absoluteRank || annualRank;
  const dateLabel = displayMode === 'annual' ? year : `${month}/${year}`;
  
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
          {dateLabel}
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

        {typeInfo.value !== null && typeInfo.value !== undefined && (
          <div style={{
            color: 'var(--foreground-muted)',
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: '600',
            marginBottom: typeInfo.preindustrialValue !== null && typeInfo.preindustrialValue !== undefined ? '12px' : '18px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {t.globeControls.nasaReference}
          </div>
        )}

        {typeInfo.preindustrialValue !== null && typeInfo.preindustrialValue !== undefined && (
          <div style={{
            margin: '0 0 18px',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(246, 241, 232, 0.12)',
            background: 'rgba(246, 241, 232, 0.035)'
          }}>
            <div style={{
              color: 'var(--foreground-muted)',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              {t.globeControls.preindustrialReference}
            </div>
            <div style={{
              color: typeInfo.color,
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '700',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {typeInfo.preindustrialValue.toFixed(2)}°C
            </div>
          </div>
        )}

        {hasRanks && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '8px' : '10px',
            margin: '0 0 18px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(246, 241, 232, 0.12)',
            background: 'rgba(246, 241, 232, 0.035)'
          }}>
            {annualRank && (
              <div>
                <div style={{
                  color: 'var(--foreground-muted)',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {t.globeControls.rankAnnual}
                </div>
                <div style={{
                  color: typeInfo.color,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {annualRank}
                </div>
              </div>
            )}

            {sameMonthRank && (
              <div>
                <div style={{
                  color: 'var(--foreground-muted)',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {t.globeControls.rankSameMonth}
                </div>
                <div style={{
                  color: typeInfo.color,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {sameMonthRank}
                </div>
              </div>
            )}

            {absoluteRank && (
              <div>
                <div style={{
                  color: 'var(--foreground-muted)',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {t.globeControls.rankAbsolute}
                </div>
                <div style={{
                  color: typeInfo.color,
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {absoluteRank}
                </div>
              </div>
            )}
          </div>
        )}
        
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
