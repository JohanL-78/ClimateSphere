'use client';

import { motion } from 'framer-motion';
import { Globe, Calendar, Snowflake, Mountain, Waves, Pause, Play, RotateCcw, SkipBack } from 'lucide-react';
import { useResponsive, useIsMobile } from '@/hooks/useResponsive';
import { getTranslations } from '@/lib/i18n';

/**
 * Composant pour les contrôles du globe dans la sidebar
 * Gère la sélection de période et affiche les données climatiques
 * 
 * @param {object} controls - État des contrôles du globe
 * @param {object} availableDates - Dates disposant d'une texture
 * @param {array} timeline - Frames chronologiques disposant d'une texture
 * @param {function} onChange - Callback pour les changements
 * @param {boolean} isMobile - Indicateur mobile (pour compatibilité)
 */
export default function GlobeControls({ controls, availableDates, timeline = [], onChange, isMobile, locale = 'en' }) {
  const { isTablet } = useResponsive();
  const t = getTranslations(locale);
  const isMobileHook = useIsMobile(); // Utilise le hook centralisé
  const mobile = isMobile || isMobileHook; // Compatibilité avec l'ancien prop
  const yearOptions = availableDates?.years?.length
    ? availableDates.years
    : Array.from({ length: new Date().getFullYear() - 1879 }, (_, i) => new Date().getFullYear() - i);
  const monthOptions = (() => {
    const texturedMonths = availableDates?.textureMonthsByYear?.[String(controls.year)];
    if (!texturedMonths?.length) return availableDates?.months || [];

    return (availableDates?.months || []).filter(month => texturedMonths.includes(month.value));
  })();
  const currentFrameIndex = timeline.findIndex(frame =>
    String(frame.year) === String(controls.year) && frame.month === String(controls.month).padStart(2, '0')
  );
  const timelineProgress = timeline.length > 1 && currentFrameIndex >= 0
    ? (currentFrameIndex / (timeline.length - 1)) * 100
    : 0;
  const firstFrame = timeline[0];
  const lastFrame = timeline[timeline.length - 1];
  const framesPerSecond = controls.timelineSpeed
    ? (1000 / controls.timelineSpeed).toFixed(1)
    : '1.5';
  
  const handleCardClick = (type) => {
    if (controls.isLoadingTemps || !controls.temps || Object.keys(controls.temps).length === 0) {
      return;
    }
    onChange({ type: 'openModal', payload: type });
  };

  const DataCard = ({ icon: Icon, label, value, color, onClick, isLoading }) => (
    <motion.div
      whileHover={{ 
        scale: isLoading ? 1 : 1.05, 
        y: isLoading ? 0 : -2,
        boxShadow: isLoading ? 'none' : `0 10px 25px ${color}20, 0 0 20px ${color}10`
      }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      onClick={isLoading ? undefined : onClick}
      style={{
        background: `linear-gradient(135deg, rgba(246, 241, 232, 0.09) 0%, rgba(246, 241, 232, 0.035) 100%)`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${color}50`,
        borderRadius: mobile ? '10px' : '12px',
        padding: mobile ? '6px' : '20px',
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        alignItems: 'center',
        gap: mobile ? '4px' : '12px',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.4s ease',
        opacity: isLoading ? 0.82 : 1,
        minHeight: mobile ? '45px' : isTablet ? '60px' : '70px',
        position: 'relative',
        boxShadow: `0 4px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${color}10`,
        // Optimisations pour les animations
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Petit indicateur pour montrer que c'est cliquable */}
      {!isLoading && (
        <div
          style={{
            position: 'absolute',
            top: mobile ? '6px' : '8px',
            right: mobile ? '6px' : '8px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: color,
            opacity: 0.8,
            boxShadow: `0 0 6px ${color}60`
          }}
        />
      )}
      
      {!mobile && (
        <motion.div 
          style={{
            background: `linear-gradient(135deg, ${color}70, ${color}50)`,
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 10px ${color}30`
          }}
          whileHover={isLoading ? {} : {
            boxShadow: `0 0 25px ${color}60, 0 4px 15px ${color}30`,
            scale: 1.1
          }}
          animate={isLoading ? {} : {
            boxShadow: `0 0 15px ${color}40, 0 4px 12px ${color}25`
          }}
        >
          <Icon size={18} color={color} />
        </motion.div>
      )}
      
      <div style={{ 
        flex: 1, 
        textAlign: mobile ? 'center' : 'left',
        minWidth: 0
      }}>
        <div style={{ 
          fontSize: mobile ? '9px' : '12px', 
          color: 'var(--foreground-muted)', 
          marginBottom: '4px',
          fontWeight: '600',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: mobile ? 'nowrap' : 'normal'
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: mobile ? '12px' : '16px', 
          fontWeight: '700', 
          color: color,
          textShadow: `0 0 10px ${color}50`,
          whiteSpace: 'nowrap',
          minHeight: mobile ? '16px' : '20px',
          minWidth: mobile ? '54px' : '68px',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: mobile ? '16px' : '20px'
        }}>
          {value !== null && value !== undefined ? `${value?.toFixed(2)}°C` : isLoading ? '...' : 'N/A'}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: mobile ? '6px' : '8px'
    }}>
      {/* Section de sélection de période */}
      <div>
        <div style={{
          background: 'rgba(47, 111, 115, 0.18)',
          borderRadius: '8px',
          border: '1px solid rgba(47, 111, 115, 0.4)',
          padding: mobile ? '4px 6px' : '8px 10px',
          marginBottom: mobile ? '6px' : '8px'
        }}>
          <h4 style={{
            color: 'var(--foreground)',
            fontSize: mobile ? '12px' : '14px',
            fontWeight: '600',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0px rgba(47, 111, 115, 0)',
                  '0 0 15px rgba(47, 111, 115, 0.65)',
                  '0 0 0px rgba(47, 111, 115, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calendar size={mobile ? 12 : 14} color="var(--foreground)" />
            </motion.div>
            {t.globeControls.dataPeriod}
          </h4>
        </div>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <select
            value={controls.year}
            onChange={(e) => {
              const nextYear = e.target.value;
              const texturedMonths = availableDates?.textureMonthsByYear?.[String(nextYear)];
              const nextMonth = texturedMonths?.includes(controls.month)
                ? controls.month
                : texturedMonths?.[texturedMonths.length - 1] || controls.month;

              onChange({ type: 'setYear', payload: nextYear });
              if (nextMonth !== controls.month) {
                onChange({ type: 'setMonth', payload: nextMonth });
              }
              onChange({ isLoadingTemps: true });
            }}
            style={{
              background: 'rgba(246, 241, 232, 0.035)',
              border: '1px solid rgba(47, 111, 115, 0.4)',
              borderRadius: '8px',
              padding: mobile ? '8px 10px' : '10px 12px',
              color: 'var(--foreground)',
              fontSize: mobile ? '12px' : '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            {yearOptions.map(year => (
              <option key={year} value={year} style={{ background: '#0b0f10', color: 'var(--foreground)' }}>{year}</option>
            ))}
          </select>
          
          <select
            value={controls.month}
            onChange={(e) => {
              onChange({ type: 'setMonth', payload: e.target.value });
              onChange({ isLoadingTemps: true });
            }}
            style={{
              background: 'rgba(246, 241, 232, 0.035)',
              border: '1px solid rgba(47, 111, 115, 0.4)',
              borderRadius: '8px',
              padding: mobile ? '8px 10px' : '10px 12px',
              color: 'var(--foreground)',
              fontSize: mobile ? '12px' : '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            {monthOptions.map(month => (
              <option key={month.value} value={month.value} style={{ background: '#0b0f10', color: 'var(--foreground)' }}>
                {month.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Player chronologique */}
      <div style={{
        background: 'rgba(246, 241, 232, 0.035)',
        borderRadius: '10px',
        border: '1px solid rgba(47, 111, 115, 0.24)',
        padding: mobile ? '8px' : '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--foreground)',
            fontSize: mobile ? '11px' : '13px',
            fontWeight: '700'
          }}>
            <Play size={mobile ? 12 : 14} />
            {t.globeControls.archivePlayer}
          </div>
          <div style={{
            color: 'var(--foreground-muted)',
            fontSize: mobile ? '10px' : '11px',
            whiteSpace: 'nowrap'
          }}>
            {currentFrameIndex >= 0 ? `${currentFrameIndex + 1}/${timeline.length}` : `0/${timeline.length}`}
          </div>
        </div>

        <div style={{
          height: '6px',
          borderRadius: '999px',
          background: 'rgba(246, 241, 232, 0.08)',
          overflow: 'hidden',
          border: '1px solid rgba(246, 241, 232, 0.08)'
        }}>
          <motion.div
            animate={{ width: `${timelineProgress}%` }}
            transition={{ duration: 0.25 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--foreground), var(--accent))',
              borderRadius: '999px'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 44px',
          gap: '6px'
        }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange({ type: 'resetTimeline' })}
            disabled={!timeline.length}
            title={t.globeControls.backToStart}
            style={{
              height: '36px',
              borderRadius: '8px',
              border: '1px solid rgba(246, 241, 232, 0.16)',
              background: 'rgba(246, 241, 232, 0.035)',
              color: 'var(--foreground)',
              cursor: timeline.length ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SkipBack size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange({
              type: controls.isPlayingTimeline ? 'pauseTimeline' : 'playTimeline',
              payload: currentFrameIndex < 0 || currentFrameIndex >= timeline.length - 1 ? 'from-start' : undefined
            })}
            disabled={!timeline.length}
            style={{
              height: '36px',
              borderRadius: '8px',
              border: '1px solid rgba(47, 111, 115, 0.5)',
              background: controls.isPlayingTimeline
                ? 'linear-gradient(135deg, rgba(47, 111, 115, 0.32), rgba(246, 241, 232, 0.05))'
                : 'linear-gradient(135deg, rgba(47, 111, 115, 0.18), rgba(246, 241, 232, 0.035))',
              color: 'var(--foreground)',
              cursor: timeline.length ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: mobile ? '11px' : '12px',
              fontWeight: '700'
            }}
          >
            {controls.isPlayingTimeline ? <Pause size={16} /> : <Play size={16} />}
            {controls.isPlayingTimeline ? 'Pause' : `${t.globeControls.playFrom} ${firstFrame?.year || t.globeControls.start}`}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange({ type: 'playTimeline', payload: 'from-start' })}
            disabled={!timeline.length}
            title={t.globeControls.restartFromStart}
            style={{
              height: '36px',
              borderRadius: '8px',
              border: '1px solid rgba(246, 241, 232, 0.16)',
              background: 'rgba(246, 241, 232, 0.035)',
              color: 'var(--foreground)',
              cursor: timeline.length ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '8px'
        }}>
          <input
            type="range"
            min="80"
            max="1200"
            step="20"
            value={controls.timelineSpeed}
            onChange={(e) => onChange({ type: 'setTimelineSpeed', payload: Number(e.target.value) })}
            style={{
              width: '100%',
              accentColor: 'var(--foreground)'
            }}
          />
          <div
            style={{
              minWidth: '58px',
              border: '1px solid rgba(246, 241, 232, 0.16)',
              borderRadius: '8px',
              padding: '6px 7px',
              color: 'var(--foreground)',
              fontSize: '11px',
              fontWeight: '700',
              textAlign: 'center',
              background: 'rgba(246, 241, 232, 0.035)'
            }}
          >
            {framesPerSecond} fps
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'rgba(246, 241, 232, 0.55)',
          fontSize: mobile ? '9px' : '10px'
        }}>
          <span>{firstFrame ? `${firstFrame.month}/${firstFrame.year}` : '--'}</span>
          <span>{lastFrame ? `${lastFrame.month}/${lastFrame.year}` : '--'}</span>
        </div>
      </div>

      {/* Section des données climatiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : '1fr',
        gap: mobile ? '6px' : '8px'
      }}>
        <DataCard 
          icon={Globe} 
          label={t.globeControls.global}
          value={controls.temps?.global} 
          color="#b87b6b"
          onClick={() => handleCardClick('global')}
          isLoading={controls.isLoadingTemps}
        />
        
        <DataCard 
          icon={Snowflake} 
          label={t.globeControls.northShort}
          value={controls.temps?.north} 
          color="#2f6f73"
          onClick={() => handleCardClick('north')}
          isLoading={controls.isLoadingTemps}
        />
        
        <DataCard 
          icon={Mountain} 
          label={t.globeControls.southShort}
          value={controls.temps?.south} 
          color="#b8b2a8"
          onClick={() => handleCardClick('south')}
          isLoading={controls.isLoadingTemps}
        />
        
        <DataCard 
          icon={Waves} 
          label="ONI" 
          value={controls.temps?.oni} 
          color="#4d8e92"
          onClick={() => handleCardClick('oni')}
          isLoading={controls.isLoadingTemps}
        />
      </div>
    </div>
  );
}
