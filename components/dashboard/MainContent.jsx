'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, BarChart3, Info } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import LazyClimateGlobe from '../LazyClimateGlobe';
import DataTable, { DataTableControls } from '../DataTable';
import { getTranslations } from '@/lib/i18n';

/**
 * MainContent component that renders different content based on active tab
 * 
 * @param {string} activeTab - Currently active tab
 * @param {boolean} sidebarOpen - Sidebar open state
 * @param {object} availableDates - Available dates data
 * @param {array} timeline - Chronological textured frames
 * @param {array} tableData - Table data
 * @param {function} onOpenChart - Callback to open chart modal
 * @param {object} globeControls - Globe control state
 * @param {function} onGlobeControlsChange - Callback for globe control changes
 */
export default function MainContent({
  activeTab,
  sidebarOpen,
  availableDates,
  timeline,
  tableData,
  onOpenChart,
  globeControls,
  onGlobeControlsChange,
  locale = 'en'
}) {
  const { isMobile } = useResponsive();
  const t = getTranslations(locale);
  const [tableSource, setTableSource] = useState('global');
  const [tableReference, setTableReference] = useState('nasa');
  const mobileGlobeTop = isMobile && sidebarOpen ? 'calc(60px + 40vh)' : (isMobile ? '60px' : '80px');
  
  const containerStyle = {
    marginLeft: (isMobile) ? '0px' : (sidebarOpen ? 'var(--sidebar-width)' : '0px'),
    minHeight: 'calc(100vh - 70px)',
    background: 'var(--background)',
    position: 'relative'
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'globe':
        return (
          <div className={`globe-stage ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
            position: 'fixed',
            top: mobileGlobeTop,
            left: (isMobile) ? '0' : sidebarOpen ? 'var(--sidebar-width)' : '0',
            right: '0',
            bottom: '0',
            overflow: 'hidden',
            background: 'var(--background-deep)',
            transition: 'none'
          }}>
            <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
              <LazyClimateGlobe
                locale={locale}
                availableDates={availableDates}
                timeline={timeline}
                controls={globeControls}
                onControlsChange={onGlobeControlsChange}
              />
            </div>
          </div>
        );

      case 'data':
        return (
          <div style={{ 
            paddingLeft: isMobile ? '20px' : '30px',
            paddingRight: isMobile ? '20px' : '30px',
            paddingBottom: isMobile ? '20px' : '30px',
            paddingTop: isMobile ? '240px' : '90px',
            color: 'var(--foreground)',
            height: 'calc(100vh - 80px)',
            overflow: 'auto'
          }}>
            <div style={{
              background: 'rgba(27, 26, 23, 0.84)',
              backdropFilter: 'blur(10px)',
              borderRadius: isMobile ? '10px' : '12px',
              border: '1px solid var(--border)',
              padding: isMobile ? '20px' : '30px',
              height: 'fit-content',
              minHeight: (isMobile) ? 'calc(100vh - 400px)' : 'calc(100vh - 120px)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: isMobile ? '20px' : '30px'
              }}>
                <Table size={isMobile ? 20 : 24} color="var(--accent)" />
                <h2 style={{
                  margin: 0,
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: 'var(--foreground)'
                }}>
                  {t.main.climateData}
                </h2>
              </div>
              <div style={{ 
                background: '#f6f1e8',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: 'calc(100vh - 200px)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  padding: '20px 20px 10px 20px',
                  borderBottom: '1px solid rgba(17, 17, 15, 0.1)',
                  background: '#eee8dc',
                  flexShrink: 0
                }}>
                  <DataTableControls 
                    locale={locale}
                    source={tableSource}
                    reference={tableReference}
                    onSourceChange={setTableSource}
                    onReferenceChange={setTableReference}
                  />
                </div>
                <div style={{
                  overflow: 'auto',
                  flex: 1,
                  padding: '0',
                  position: 'relative'
                }}>
                  <DataTable 
                    locale={locale}
                    initialData={tableData} 
                    hideControls={true}
                    source={tableSource}
                    reference={tableReference}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div style={{ 
            paddingLeft: isMobile ? '20px' : '30px',
            paddingRight: isMobile ? '20px' : '30px',
            paddingBottom: isMobile ? '20px' : '30px',
            paddingTop: isMobile ? '240px' : '50px',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)'
          }}>
            <div style={{
              background: 'rgba(27, 26, 23, 0.84)',
              backdropFilter: 'blur(10px)',
              borderRadius: isMobile ? '10px' : '12px',
              border: '1px solid var(--border)',
              padding: isMobile ? '30px' : '40px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <BarChart3 size={isMobile ? 36 : 48} color="var(--accent)" style={{ marginBottom: '20px' }} />
              <h3 style={{ 
                fontWeight: '700', 
                marginBottom: '15px',
                fontSize: isMobile ? '18px' : '20px'
              }}>
                {t.main.anomalyCharts}
              </h3>
              <p style={{
                color: 'var(--foreground-muted)',
                fontSize: isMobile ? '13px' : '14px',
                maxWidth: isMobile ? '280px' : 'none',
                marginBottom: '25px'
              }}>
                {t.main.chartDescription}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenChart}
                style={{
                  background: 'linear-gradient(135deg, rgba(47, 111, 115, 0.26), rgba(246, 241, 232, 0.04))',
                  border: '1px solid rgba(47, 111, 115, 0.45)',
                  borderRadius: '999px',
                  padding: '12px 24px',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                <BarChart3 size={18} />
                {t.main.openCharts}
              </motion.button>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div style={{ 
            paddingLeft: isMobile ? '20px' : '30px',
            paddingRight: isMobile ? '20px' : '30px',
            paddingBottom: isMobile ? '20px' : '30px',
            paddingTop: isMobile ? '240px' : '90px',
            color: 'var(--foreground)',
            minHeight: 'calc(100vh - 80px)',
            overflow: 'auto'
          }}>
            <div style={{
              background: 'rgba(27, 26, 23, 0.84)',
              backdropFilter: 'blur(10px)',
              borderRadius: isMobile ? '10px' : '12px',
              border: '1px solid var(--border)',
              padding: isMobile ? '20px' : '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: isMobile ? '20px' : '30px'
              }}>
                <Info size={isMobile ? 20 : 24} color="var(--accent)" />
                <h2 style={{
                  margin: 0,
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: 'var(--foreground)'
                }}>
                  {t.main.about}
                </h2>
              </div>
              
              <div style={{ 
                lineHeight: '1.6',
                fontSize: isMobile ? '14px' : '15px',
                color: 'var(--foreground-muted)' 
              }}>
                <p style={{ 
                  marginBottom: '20px', 
                  fontSize: isMobile ? '15px' : '16px',
                  color: 'var(--foreground)',
                  fontWeight: '600' 
                }}>
                  {t.main.aboutTitle}
                </p>
                <p style={{ marginBottom: '15px' }}>
                  {t.main.aboutDescription}
                </p>
                <p style={{ marginBottom: '15px' }}>
                  {t.main.developedBy} <strong style={{ color: 'var(--foreground)', fontWeight: '700' }}>Johan Lorck</strong>
                </p>
                <p>
                  <a 
                    href="https://github.com/JohanL-78/nasa-gistemp-viewer"
                    style={{ 
                      color: 'var(--accent)', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.main.viewSource}
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={`main-content-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={containerStyle}>
      {renderContent()}
    </div>
  );
}
