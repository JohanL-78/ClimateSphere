'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, BarChart3, Download, Settings } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useIsMobile } from '@/hooks/useResponsive';
import { fullMonthNames, getTranslations } from '@/lib/i18n';
import { SITE_NAME, SITE_URL } from '@/lib/seo';


const CustomTooltip = ({ active, payload, label, locale = 'en' }) => {
  const t = getTranslations(locale);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'rgba(8, 12, 13, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-strong)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: 'var(--foreground)',
          fontSize: '13px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--accent)' }}>
          {label} {data.isCurrentYear && <span style={{ color: '#D4A95F', fontSize: '11px' }}>({t.chart.currentYear})</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: payload[0].color,
            border: data.isCurrentYear ? '2px solid #D4A95F' : 'none'
          }} />
          <span>{payload[0].value !== null ? `${payload[0].value.toFixed(2)}°C` : 'N/A'}</span>
        </div>
        {data.isCurrentYear && (
          <div style={{ 
            fontSize: '11px', 
            color: '#D4A95F', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {data.isCalculated 
              ? `${t.chart.calculatedAverage} ${data.monthsUsed} ${t.chart.availableMonths}`
              : t.chart.provisionalAnnual
            }
          </div>
        )}
        {data.notable && (
          <div style={{ 
            fontSize: '11px', 
            color: '#D4A95F', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {data.notable}
          </div>
        )}
      </motion.div>
    );
  }
  return null;
};

const ChartControls = ({ month, onMonthChange, reference, onReferenceChange, source, onSourceChange, viewType, onViewTypeChange, onExport, locale = 'en' }) => {
  const isMobile = useIsMobile();
  const t = getTranslations(locale);

  const references = [
    { value: 'nasa', name: '1951-1980 (NASA)' },
    { value: 'preindustrial', name: t.table.preindustrial },
    { value: 'modern', name: t.table.modern }
  ];

  const sources = [
    { value: 'global', name: 'Global' },
    { value: 'north', name: t.table.northernHemisphere },
    { value: 'south', name: t.table.southernHemisphere }
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '16px',
      marginBottom: '20px',
      padding: '16px',
      background: 'rgba(246, 241, 232, 0.035)',
      borderRadius: '8px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={16} color="var(--accent)" />
        <select
          value={viewType}
          onChange={(e) => onViewTypeChange(e.target.value)}
          style={{
            background: 'rgba(246, 241, 232, 0.06)',
            border: '1px solid rgba(246, 241, 232, 0.18)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--foreground)',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          <option value="monthly" style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>{t.chart.monthly}</option>
          <option value="annual" style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>{t.chart.annual}</option>
        </select>
      </div>

      {viewType === 'monthly' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="var(--accent)" />
          <input
            type="month"
            value={`${new Date().getFullYear()}-${month.toString().padStart(2, '0')}`}
            onChange={(e) => {
              const [, monthValue] = e.target.value.split('-');
              onMonthChange(parseInt(monthValue));
            }}
            style={{
              background: 'rgba(246, 241, 232, 0.06)',
              border: '1px solid rgba(246, 241, 232, 0.18)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--foreground)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={16} color="var(--accent-soft)" />
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          style={{
            background: 'rgba(246, 241, 232, 0.06)',
            border: '1px solid rgba(246, 241, 232, 0.18)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--foreground)',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          {sources.map(s => (
            <option key={s.value} value={s.value} style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings size={16} color="var(--accent)" />
        <select
          value={reference}
          onChange={(e) => onReferenceChange(e.target.value)}
          style={{
            background: 'rgba(246, 241, 232, 0.06)',
            border: '1px solid rgba(246, 241, 232, 0.18)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'var(--foreground)',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          {references.map(r => (
            <option key={r.value} value={r.value} style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExport}
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 12px',
          color: 'var(--foreground)',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '500'
        }}
      >
        <Download size={14} />
        {t.chart.export}
      </motion.button>
    </div>
  );
};

// Composant tooltip
const SimpleTooltip = ({ active, payload, label, locale = 'en' }) => {
  const t = getTranslations(locale);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: 'rgba(8, 12, 13, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-strong)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: 'var(--foreground)',
          fontSize: '13px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--accent)' }}>
          {label} {data.isCurrentYear && <span style={{ color: '#D4A95F', fontSize: '11px' }}>({t.chart.currentYear})</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: payload[0].color,
            border: data.isCurrentYear ? '2px solid #D4A95F' : 'none'
          }} />
          <span>{payload[0].value !== null ? `${payload[0].value.toFixed(2)}°C` : 'N/A'}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TemperatureChart({ isOpen, onClose, tableData, currentMonth, locale = 'en' }) {
  const isMobile = useIsMobile();
  const t = getTranslations(locale);
  const [month, setMonth] = useState(currentMonth || 1);
  
  const [reference, setReference] = useState('nasa');
  const [source, setSource] = useState('global');
  const [viewType, setViewType] = useState('monthly'); // 'monthly' ou 'annual'
  const [currentTableData, setCurrentTableData] = useState(tableData || []);
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);

  // Effet pour recharger les données quand on change de source ou de période de référence
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/table?source=${source}&reference=${reference}`);
        const data = await response.json();
        setCurrentTableData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [source, reference, isOpen]);

  // Traitement des données pour le graphique
  const processChartData = useMemo(() => {
    if (!currentTableData || currentTableData.length < 2) return [];

    const [, ...rows] = currentTableData;
    
    // Si vue annuelle, utiliser la colonne J-D (colonne 13)
    const dataIndex = viewType === 'annual' ? 13 : month;
    
    if (viewType === 'monthly' && (dataIndex < 1 || dataIndex > 12)) return [];

    const data = rows
      .map(row => {
        const year = parseInt(row[0]);
        const value = parseFloat(row[dataIndex]);
        
        if (isNaN(year) || isNaN(value)) return null;
        
        // Ajouter des annotations pour les années notables
        let notable = null;
        const currentYear = new Date().getFullYear();
        
        if (viewType === 'monthly') {
          if (year === 1883 && month === 8) notable = t.chart.krakatoa;
          if (year === 1991 && month === 6) notable = t.chart.pinatubo;
          if (year === 2016 && month >= 1 && month <= 4) notable = t.chart.strongElNino;
          if (year === 1998 && month >= 1 && month <= 6) notable = t.chart.recordElNino;
          
        } else {
          // Annotations pour vue annuelle
          if (year === 1883) notable = t.chart.krakatoa;
          if (year === 1991) notable = t.chart.pinatubo;
          if (year === 2016) notable = t.chart.strongElNino;
          if (year === 1998) notable = t.chart.recordElNino;
          
        }

        return {
          year,
          value,
          notable,
          decade: Math.floor(year / 10) * 10,
          isCurrentYear: viewType === 'annual' && year === currentYear // Seulement en mode annuel
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.year - b.year);

    // En mode annuel, vérifier si l'année courante est présente
    if (viewType === 'annual') {
      const currentYear = new Date().getFullYear();
      const hasCurrentYear = data.some(d => d.year === currentYear);
      
      if (!hasCurrentYear) {
        // Chercher les données mensuelles pour l'année courante
        const currentYearRow = rows.find(row => parseInt(row[0]) === currentYear);
        
        if (currentYearRow) {
          // Calculer la moyenne des mois disponibles (colonnes 1-12)
          const monthlyValues = [];
          for (let monthCol = 1; monthCol <= 12; monthCol++) {
            const value = parseFloat(currentYearRow[monthCol]);
            if (!isNaN(value)) {
              monthlyValues.push(value);
            }
          }
          
          if (monthlyValues.length > 0) {
            const averageValue = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length;
            
            // Ajouter ce point calculé
            data.push({
              year: currentYear,
              value: averageValue,
              notable: null,
              decade: Math.floor(currentYear / 10) * 10,
              isCurrentYear: true,
              isCalculated: true, // Indiquer que c'est calculé
              monthsUsed: monthlyValues.length // Nombre de mois utilisés
            });
            
            // Re-trier après ajout
            data.sort((a, b) => a.year - b.year);
          }
        }
      }
    }

    return data;
  }, [currentTableData, month, viewType, t]);

  // Fonction pour exporter le graphique
  const exportChart = async () => {
    if (!chartRef.current) return;
    
    const filename = `anomalies-${viewType === 'annual' ? 'annual' : monthNames[month]}-${source}-${reference}.png`;
    
    try {
      // Capturer l'élément du graphique
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0f0f0f',
        scale: 2, // Meilleure qualité
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });
      
      // Créer le lien de téléchargement
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('Export error:', error);
      alert(t.chart.exportError);
    }
  };

  // Couleur dynamique basée sur la source
  const getLineColor = () => {
    switch (source) {
      case 'global': return 'var(--accent-soft)';
      case 'north': return '#D4A95F';
      case 'south': return '#C56F4B';
      default: return 'var(--accent)';
    }
  };

  const monthNames = fullMonthNames[locale] || fullMonthNames.en;

  return (
    <AnimatePresence>
      {isOpen && (
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
            background: 'rgba(8, 12, 13, 0.86)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: isMobile ? '20px' : '40px'
          }}
        >
          <motion.div
            ref={chartRef}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(17, 17, 15, 0.96) 0%, rgba(8, 12, 13, 0.96) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid var(--border-strong)',
              padding: isMobile ? '24px' : '32px',
              maxWidth: isMobile ? '95vw' : '90vw',
              maxHeight: isMobile ? '90vh' : '85vh',
              width: '100%',
              color: 'var(--foreground)',
              position: 'relative',
              boxShadow: 'var(--shadow-heavy), 0 0 28px rgba(47, 111, 115, 0.18)',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div
                  style={{
                    background: 'linear-gradient(135deg, rgba(47, 111, 115, 0.6), rgba(47, 111, 115, 0.4))',
                    borderRadius: '8px',
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
                <div>
                  <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '22px', fontWeight: '700' }}>
                    {viewType === 'annual' ? t.chart.annualAnomalies : `${t.chart.anomaliesFor} ${monthNames[month]}`}
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--foreground-muted)' }}>
                    {source === 'global' ? 'Global' : source === 'north' ? t.table.northernHemisphere : t.table.southernHemisphere} • 1880-{new Date().getFullYear()}
                    {viewType === 'annual' && <span style={{ color: '#D4A95F' }}> • {t.chart.currentYearSuffix} ({new Date().getFullYear()})</span>}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--foreground-muted)' }}>
                    {t.chart.chartFrom}{' '}
                    <a 
                      href={SITE_URL}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {SITE_NAME}
                    </a>
                    {' '}({SITE_URL.replace(/^https?:\/\//, '')})
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'rgba(246, 241, 232, 0.06)',
                  border: '1px solid rgba(246, 241, 232, 0.18)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Contrôles */}
            <ChartControls
              month={month}
              onMonthChange={setMonth}
              reference={reference}
              onReferenceChange={setReference}
              source={source}
              onSourceChange={setSource}
              viewType={viewType}
              onViewTypeChange={setViewType}
              onExport={exportChart}
              locale={locale}
            />

            {/* Graphique */}
            <div style={{
              height: isMobile ? '400px' : '500px',
              width: '100%',
              background: 'rgba(246, 241, 232, 0.025)',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              padding: '20px'
            }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--foreground-muted)',
                  fontSize: '16px'
                }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ marginRight: '10px' }}
                  >
                    <BarChart3 size={24} color="var(--accent)" />
                  </motion.div>
                  {t.chart.loadingData}
                </div>
              ) : processChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processChartData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(246, 241, 232, 0.09)" 
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--foreground-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(246, 241, 232, 0.18)' }}
                    />
                    <YAxis 
                      stroke="var(--foreground-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(246, 241, 232, 0.18)' }}
                      label={{ 
                        value: t.chart.yAxis, 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: 'var(--foreground-muted)' }
                      }}
                    />
                    <Tooltip content={<SimpleTooltip locale={locale} />} />
                    <ReferenceLine 
                      y={0} 
                      stroke="rgba(246, 241, 232, 0.42)" 
                      strokeDasharray="2 2" 
                      strokeWidth={1}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getLineColor()}
                      strokeWidth={2}
                      dot={(props) => {
                        const { cx, cy, payload, index } = props;
                        if (payload && payload.isCurrentYear) {
                          return (
                            <circle
                              key={`current-year-${index}`}
                              cx={cx}
                              cy={cy}
                              r={4}
                              fill={payload.isCalculated ? "none" : getLineColor()}
                              stroke="#D4A95F"
                              strokeWidth={3}
                              strokeDasharray={payload.isCalculated ? "4,2" : "0"}
                              opacity={1}
                            />
                          );
                        }
                        return null; // Supprime les points normaux
                      }}
                      activeDot={{ 
                        r: 4, 
                        fill: getLineColor(),
                        strokeWidth: 2,
                        stroke: 'var(--foreground)'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--foreground-muted)',
                  fontSize: '16px'
                }}>
                  {t.chart.loadingData}
                </div>
              )}
            </div>

            {/* Légende */}
            {processChartData.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                margin: '16px 0',
                padding: '12px',
                background: 'rgba(246, 241, 232, 0.035)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--foreground-soft)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '12px',
                    height: '2px',
                    background: getLineColor(),
                    borderRadius: '1px'
                  }} />
                  <span>{viewType === 'annual' ? t.chart.annualData : t.chart.monthlyData}</span>
                </div>
                {viewType === 'annual' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: getLineColor(),
                      borderRadius: '50%',
                      border: '2px solid #D4A95F'
                    }} />
                    <span>{t.chart.currentYearCalculated} ({new Date().getFullYear()})</span>
                  </div>
                )}
              </div>
            )}

            {/* Statistiques */}
            {processChartData.length > 0 && (() => {
              // Fonction pour calculer la tendance par décennie (régression linéaire)
              const calculateTrendPerDecade = (data, startYear) => {
                const filteredData = data.filter(d => d.year >= startYear);
                if (filteredData.length < 2) return 0;
                
                const n = filteredData.length;
                const sumX = filteredData.reduce((sum, d) => sum + d.year, 0);
                const sumY = filteredData.reduce((sum, d) => sum + d.value, 0);
                const sumXY = filteredData.reduce((sum, d) => sum + d.year * d.value, 0);
                const sumX2 = filteredData.reduce((sum, d) => sum + d.year * d.year, 0);
                
                const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
                
                return slope * 10; // Tendance par décennie
              };
              
              const trends = [
                { label: t.chart.trend1880, value: calculateTrendPerDecade(processChartData, 1880), color: '#C56F4B' },
                { label: t.chart.trend1950, value: calculateTrendPerDecade(processChartData, 1950), color: '#D4A95F' },
                { label: t.chart.trend2000, value: calculateTrendPerDecade(processChartData, 2000), color: 'var(--accent-soft)' }
              ];
              
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
                  gap: '16px',
                  marginTop: '20px'
                }}>
                  {trends.map((stat, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(246, 241, 232, 0.035)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginBottom: '4px' }}>
                        {stat.label}
                      </div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: stat.color 
                      }}>
                        {stat.value > 0 ? '+' : ''}{stat.value.toFixed(2)}°C
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
