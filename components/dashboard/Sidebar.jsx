'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Table, BarChart3, Info } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import GlobeControls from './GlobeControls';
import { getTranslations } from '@/lib/i18n';

/**
 * Sidebar component for the dashboard navigation and controls
 * 
 * @param {boolean} isOpen - Sidebar open state
 * @param {string} activeTab - Currently active tab
 * @param {function} onTabChange - Callback for tab changes
 * @param {object} availableDates - Available textured dates
 * @param {array} timeline - Chronological textured frames
 * @param {object} globeControls - Globe control state
 * @param {function} onGlobeControlsChange - Callback for globe control changes
 */
export default function Sidebar({
  isOpen,
  activeTab,
  onTabChange,
  availableDates,
  timeline,
  globeControls,
  onGlobeControlsChange,
  locale = 'en'
}) {
  const { isMobile } = useResponsive();
  const t = getTranslations(locale);
  
  const tabs = [
    { id: 'globe', icon: Globe, label: t.sidebar.globe, color: 'var(--foreground)' },
    { id: 'data', icon: Table, label: t.sidebar.data, color: 'var(--foreground)' },
    { id: 'chart', icon: BarChart3, label: t.sidebar.chart, color: 'var(--foreground)' },
    { id: 'about', icon: Info, label: t.sidebar.about, color: 'var(--foreground)' }
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <aside
          style={{
            position: 'fixed',
            top: isMobile ? '60px' : '80px',
            left: 0,
            width: isMobile ? '100%' : 'var(--sidebar-width)',
            height: isMobile ? 'auto' : 'calc(100vh - 80px)',
            maxHeight: isMobile ? '40vh' : 'none',
            background: 'rgba(8, 12, 13, 0.88)',
            backdropFilter: 'blur(20px)',
            borderRight: isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
            zIndex: 90,
            padding: '6px',
            overflow: activeTab === 'globe' ? 'auto' : 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : 'column', 
              gap: '6px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              marginBottom: '8px'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02, x: isMobile ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '6px' : '12px',
                      padding: isMobile ? '8px 12px' : '12px 16px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(47, 111, 115, 0.26), rgba(246, 241, 232, 0.035))'
                        : 'rgba(246, 241, 232, 0.025)',
                      border: isActive
                        ? '1px solid rgba(47, 111, 115, 0.7)'
                        : '1px solid var(--border)',
                      borderRadius: isMobile ? '6px' : '8px',
                      color: isActive ? tab.color : 'rgba(246, 241, 232, 0.58)',
                      cursor: 'pointer',
                      fontSize: isMobile ? '12px' : '14px',
                      fontFamily: 'var(--font-mono-stack)',
                      fontWeight: isActive ? '600' : '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      width: isMobile ? 'auto' : '100%',
                      flex: isMobile ? '1' : 'none',
                      minWidth: isMobile ? 'auto' : '100%'
                    }}
                  >
                    <Icon size={isMobile ? 16 : 18} />
                    <span style={{ 
                      fontWeight: isActive ? '700' : '500',
                      whiteSpace: 'nowrap'
                    }}>
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Contrôles spécifiques au Globe */}
            {activeTab === 'globe' && globeControls && (
              <div>
                <GlobeControls
                  locale={locale}
                  controls={globeControls}
                  availableDates={availableDates}
                  timeline={timeline}
                  onChange={onGlobeControlsChange}
                  isMobile={isMobile}
                />
              </div>
            )}

          </div>
        </aside>
      )}
    </AnimatePresence>
  );
}
