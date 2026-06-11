'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/lib/i18n';

const controlLabelStyle = {
  color: '#11110f',
  fontWeight: 700,
  fontSize: '13px',
  marginRight: '8px'
};

const controlSelectStyle = {
  backgroundColor: '#f6f1e8',
  color: '#11110f',
  border: '1px solid rgba(17, 17, 15, 0.16)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontFamily: 'var(--font-body-stack)',
  fontWeight: 600,
  colorScheme: 'light'
};

const controlOptionStyle = {
  backgroundColor: '#f6f1e8',
  color: '#11110f'
};

// Composant séparé pour les contrôles
export function DataTableControls({ source, reference, onSourceChange, onReferenceChange, locale = 'en' }) {
  const t = getTranslations(locale);

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <label htmlFor="source" style={controlLabelStyle}>{t.table.chooseRegion} </label>
        <select id="source" value={source} onChange={(e) => onSourceChange(e.target.value)} style={controlSelectStyle}>
          <option value="global" style={controlOptionStyle}>Global</option>
          <option value="north" style={controlOptionStyle}>{t.table.northernHemisphere}</option>
          <option value="south" style={controlOptionStyle}>{t.table.southernHemisphere}</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="reference" style={controlLabelStyle}>{t.table.referencePeriod} </label>
        <select id="reference" value={reference} onChange={(e) => onReferenceChange(e.target.value)} style={controlSelectStyle}>
          <option value="nasa" style={controlOptionStyle}>1951-1980 (NASA)</option>
          <option value="preindustrial" style={controlOptionStyle}>{t.table.preindustrial}</option>
          <option value="modern" style={controlOptionStyle}>{t.table.modern}</option>
        </select>
      </div>
    </div>
  );
}

export default function DataTable({ initialData, hideControls = false, source: propSource, reference: propReference, locale = 'en' }) {
  const t = getTranslations(locale);
  const [tableData, setTableData] = useState(initialData);
  const [sortOrder, setSortOrder] = useState({});
  const [source, setSource] = useState(propSource || 'global');
  const [reference, setReference] = useState(propReference || 'nasa');

  // Synchroniser avec les props
  useEffect(() => {
    if (propSource) setSource(propSource);
  }, [propSource]);

  useEffect(() => {
    if (propReference) setReference(propReference);
  }, [propReference]);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({ source, reference });
        const res = await fetch(`/api/table?${params.toString()}`);
        const data = await res.json();
        setTableData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    }
    fetchData();
  }, [source, reference]);

  const sortTableByColumn = (colIndex) => {
    const order = sortOrder[colIndex] === 'desc' ? 'asc' : 'desc';
    setSortOrder({ [colIndex]: order });

    const header = tableData[0];
    let rows = [...tableData.slice(1)];

    const numericSamples = rows.map(row => parseFloat(row[colIndex])).filter(v => !isNaN(v));
    const isNumeric = numericSamples.length > rows.length / 2;

    const parse = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? -Infinity : num;
    };

    rows.sort((a, b) => {
      if (isNumeric) {
        const aVal = parse(a[colIndex]);
        const bVal = parse(b[colIndex]);
        return order === 'desc' ? bVal - aVal : aVal - bVal;
      } else {
        const aVal = a[colIndex]?.toLowerCase?.() || '';
        const bVal = b[colIndex]?.toLowerCase?.() || '';
        if (aVal < bVal) return order === 'desc' ? 1 : -1;
        if (aVal > bVal) return order === 'desc' ? -1 : 1;
        return 0;
      }
    });

    setTableData([header, ...rows]);
  };

  if (!tableData || tableData.length < 2) {
    return <p>{t.table.loading}</p>;
  }

  const header = tableData[0];
  const rows = tableData.slice(1);

  // Limiter aux 14 premières colonnes (année + 12 mois + J-D moyenne annuelle)
  const limitedHeader = header ? header.slice(0, 14) : [];
  const limitedRows = rows.map(row => row.slice(0, 14));

  return (
    <div>
      {!hideControls && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="source" style={controlLabelStyle}>{t.table.chooseRegion} </label>
            <select id="source" value={source} onChange={(e) => setSource(e.target.value)} style={controlSelectStyle}>
              <option value="global" style={controlOptionStyle}>Global</option>
              <option value="north" style={controlOptionStyle}>{t.table.northernHemisphere}</option>
              <option value="south" style={controlOptionStyle}>{t.table.southernHemisphere}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="reference" style={controlLabelStyle}>{t.table.referencePeriod} </label>
            <select id="reference" value={reference} onChange={(e) => setReference(e.target.value)} style={controlSelectStyle}>
              <option value="nasa" style={controlOptionStyle}>1951-1980 (NASA)</option>
              <option value="preindustrial" style={controlOptionStyle}>{t.table.preindustrial}</option>
              <option value="modern" style={controlOptionStyle}>{t.table.modern}</option>
            </select>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            {limitedHeader.map((headerText, index) => (
              <th key={index} onClick={() => sortTableByColumn(index)} style={{ cursor: 'pointer' }}>
                {headerText}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {limitedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                let style = {};
                if (cellIndex > 0 && !isNaN(parseFloat(cell))) {
                  const temp = parseFloat(cell);
                  if (temp > 0) {
                    // Températures positives - Rouge sur fond blanc
                    const intensity = Math.min(255, Math.floor(temp * 100));
                    style.backgroundColor = `rgba(255, ${255 - intensity}, ${255 - intensity}, 0.7)`;
                    style.color = intensity > 150 ? '#fff' : '#000';
                  } else if (temp < 0) {
                    // Températures négatives - Bleu sur fond blanc
                    const intensity = Math.min(255, Math.floor(Math.abs(temp) * 100));
                    style.backgroundColor = `rgba(${255 - intensity}, ${255 - intensity}, 255, 0.7)`;
                    style.color = intensity > 150 ? '#fff' : '#000';
                  }
                }
                return <td key={cellIndex} style={style}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
