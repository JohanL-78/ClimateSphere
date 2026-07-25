'use client';

import { useEffect, useMemo, useState } from 'react';
import LazyTemperatureChart from './LazyTemperatureChart';
import Navbar from './dashboard/Navbar';
import Sidebar from './dashboard/Sidebar';
import MainContent from './dashboard/MainContent';
import DetailModal from './dashboard/DetailModal';

export default function Dashboard({ availableDates, tableData, locale = 'en' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('globe');
  const [chartOpen, setChartOpen] = useState(false);
  const annualTimeline = useMemo(() => (
    (availableDates?.annualYears || [])
      .map(year => ({ year: String(year) }))
      .sort((a, b) => Number(a.year) - Number(b.year))
  ), [availableDates]);
  
  // États pour les contrôles du globe
  const [globeControls, setGlobeControls] = useState({
    displayMode: 'monthly',
    year: availableDates.current_year,
    month: availableDates.current_month,
    temps: {},
    isLoadingTemps: true,
    modalOpen: false,
    modalType: null,
    isPlayingTimeline: false,
    timelineSpeed: 420
  });
  
  const handleOpenChart = () => {
    setChartOpen(true);
  };
  
  const handleGlobeControlsChange = (action) => {
    if (typeof action === 'object' && !action.type) {
      // Cas où c'est directement un update des contrôles depuis le Globe
      setGlobeControls(prev => ({ ...prev, ...action }));
      return;
    }
    
    switch (action.type) {
      case 'setDisplayMode':
        setGlobeControls(prev => {
          const nextMode = action.payload;
          if (nextMode === 'annual') {
            return {
              ...prev,
              displayMode: 'annual',
              year: availableDates.current_annual_year || prev.year,
              isLoadingTemps: true,
              isPlayingTimeline: false
            };
          }

          return {
            ...prev,
            displayMode: 'monthly',
            year: availableDates.current_year || prev.year,
            month: availableDates.current_month || prev.month,
            isLoadingTemps: true,
            isPlayingTimeline: false
          };
        });
        break;
      case 'setYear':
        setGlobeControls(prev => ({ ...prev, year: action.payload, isLoadingTemps: true, isPlayingTimeline: false }));
        break;
      case 'setMonth':
        setGlobeControls(prev => ({ ...prev, month: action.payload, isLoadingTemps: true, isPlayingTimeline: false }));
        break;
      case 'playTimeline':
        setGlobeControls(prev => {
          if (prev.displayMode !== 'annual') return { ...prev, isPlayingTimeline: false };

          const firstFrame = annualTimeline[0];
          if (!firstFrame) return { ...prev, isPlayingTimeline: false };

          const shouldRestart = action.payload === 'from-start';
          return {
            ...prev,
            year: shouldRestart ? firstFrame.year : prev.year,
            isLoadingTemps: false,
            isPlayingTimeline: true
          };
        });
        break;
      case 'pauseTimeline':
        setGlobeControls(prev => ({ ...prev, isPlayingTimeline: false }));
        break;
      case 'resetTimeline':
        setGlobeControls(prev => {
          if (prev.displayMode !== 'annual') return { ...prev, isPlayingTimeline: false };

          const firstFrame = annualTimeline[0];
          if (!firstFrame) return { ...prev, isPlayingTimeline: false };

          return {
            ...prev,
            year: firstFrame.year,
            isLoadingTemps: false,
            isPlayingTimeline: false
          };
        });
        break;
      case 'setTimelineSpeed':
        setGlobeControls(prev => ({ ...prev, timelineSpeed: action.payload }));
        break;
      case 'setTemps':
        setGlobeControls(prev => ({ ...prev, temps: action.payload, isLoadingTemps: false }));
        break;
      case 'openModal':
        setGlobeControls(prev => ({ ...prev, modalOpen: true, modalType: action.payload }));
        break;
      case 'closeModal':
        setGlobeControls(prev => ({ ...prev, modalOpen: false, modalType: null }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (globeControls.displayMode !== 'annual' || !globeControls.isPlayingTimeline || annualTimeline.length === 0) return;

    const interval = window.setInterval(() => {
      setGlobeControls(prev => {
        const currentIndex = annualTimeline.findIndex(frame => String(frame.year) === String(prev.year));

        const nextFrame = annualTimeline[currentIndex + 1];
        if (!nextFrame) {
          return { ...prev, isPlayingTimeline: false };
        }

        return {
          ...prev,
          year: nextFrame.year,
          isLoadingTemps: false
        };
      });
    }, globeControls.timelineSpeed);

    return () => window.clearInterval(interval);
  }, [globeControls.displayMode, globeControls.isPlayingTimeline, globeControls.timelineSpeed, annualTimeline]);
  
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar 
        locale={locale}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMenuOpen={sidebarOpen}
      />
      
      <Sidebar
        locale={locale}
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        availableDates={availableDates}
        timeline={annualTimeline}
        globeControls={globeControls}
        onGlobeControlsChange={handleGlobeControlsChange}
      />
      
      <MainContent 
        locale={locale}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        availableDates={availableDates}
        timeline={annualTimeline}
        tableData={tableData}
        onOpenChart={handleOpenChart}
        globeControls={globeControls}
        onGlobeControlsChange={handleGlobeControlsChange}
      />
      
      {/* Graphique des anomalies géré au niveau Dashboard */}
      <LazyTemperatureChart
        locale={locale}
        isOpen={chartOpen}
        onClose={() => setChartOpen(false)}
        tableData={tableData}
        currentMonth={new Date().getMonth() + 1}
      />
      
      {/* Modale de détails pour les anomalies du globe */}
      {globeControls.modalOpen && (
        <DetailModal
          locale={locale}
          isOpen={globeControls.modalOpen}
          onClose={() => handleGlobeControlsChange({ type: 'closeModal' })}
          data={globeControls.temps}
          type={globeControls.modalType}
          year={globeControls.year}
          month={globeControls.month}
          displayMode={globeControls.displayMode}
        />
      )}
    </div>
  );
}
