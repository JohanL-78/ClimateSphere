# 🌍 Guide MVP Pédagogique - Climate Sphere Application

> Guide détaillé du contenu minimal de chaque fichier pour une version MVP entièrement fonctionnelle

---

## 📦 Configuration racine

### `package.json` - Dépendances minimales
```json
{
  "name": "climate-sphere-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@react-three/fiber": "^9.1.2",
    "@react-three/drei": "^10.3.0",
    "recharts": "^3.1.0",
    "framer-motion": "^12.23.12",
    "three": "^0.177.0",
    "lucide-react": "^0.522.0"
  }
}
```

**Explication pédagogique** :
- **next** : Framework React avec rendu serveur et routing
- **@react-three/fiber** : Pont entre React et Three.js pour la 3D
- **@react-three/drei** : Composants utilitaires pour Three.js
- **recharts** : Graphiques réactifs basés sur D3
- **framer-motion** : Animations fluides et performantes
- **lucide-react** : Icônes modernes et légères

### `next.config.js` - Configuration optimisée
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'all',
            priority: 20,
          },
          recharts: {
            test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            name: 'recharts',
            chunks: 'all',
            priority: 20,
          }
        }
      }
    }
    return config
  },
}

module.exports = nextConfig
```

**Explication pédagogique** :
- **splitChunks** : Sépare les librairies lourdes en bundles distincts
- **three chunk** : Three.js isolé pour éviter de ralentir le chargement initial
- **recharts chunk** : Graphiques chargés seulement quand nécessaire

---

## 🎯 Structure App Router

### `app/layout.js` - Layout racine
```javascript
import "./globals.css";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: "Climate Sphere - Anomalies climatiques NASA",
  description: "Visualisation interactive des données GISTEMP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={montserrat.className}>
        <div className="main-container">
          {children}
        </div>
      </body>
    </html>
  );
}
```

**Explication pédagogique** :
- **Montserrat** : Police Google chargée avec optimisation Next.js
- **metadata** : SEO de base pour le référencement
- **main-container** : Wrapper pour styles globaux

### `app/page.js` - Page principale
```javascript
import PageContent from '@/components/PageContent';
import { getAvailableDates, getNasaTableData } from '@/lib/data';

export default async function HomePage() {
  const availableDates = await getAvailableDates();
  const tableData = await getNasaTableData();

  return (
    <PageContent
      availableDates={availableDates}
      tableData={tableData}
    />
  );
}
```

**Explication pédagogique** :
- **Server Component** : Fetch des données côté serveur
- **getAvailableDates** : Récupère les années/mois disponibles
- **getNasaTableData** : Charge toutes les données tabulaires
- **PageContent** : Client Component pour l'interactivité

---

## 📊 Couche de données

### `lib/data.js` - Gestionnaire central (version simplifiée)
```javascript
import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const NASA_URLS = {
  global: 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv',
};

const CACHE_FILE = path.join(process.cwd(), 'cache_global.csv');
const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 48h

// Fonction de fetch basique
function fetchNasaData() {
  return new Promise((resolve, reject) => {
    const url = new URL(NASA_URLS.global);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      timeout: 30000
    };

    let data = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

// Cache intelligent avec fallback
export async function fetchAndCacheNasaData() {
  const stats = await fs.stat(CACHE_FILE).catch(() => null);
  const age = stats ? Date.now() - stats.mtimeMs : Infinity;

  if (age < CACHE_DURATION) {
    console.log('✅ Cache valide');
    return;
  }

  try {
    const rawData = await fetchNasaData();
    const cleanedData = rawData.replace(/\\*\\*\\*/g, '');
    await fs.writeFile(CACHE_FILE, cleanedData);
    console.log('📂 Cache mis à jour');
  } catch (error) {
    console.error('❌ Erreur fetch:', error.message);
  }
}

// Parsing CSV simplifié
async function parseCSV() {
  await fetchAndCacheNasaData();
  const csvData = await fs.readFile(CACHE_FILE, 'utf-8');
  const lines = csvData.trim().split('\\n');
  return lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
}

// API publique
export async function getAvailableDates() {
  const parsedData = await parseCSV();
  const years = parsedData.map(row => parseInt(row[0])).filter(Boolean);

  return {
    years: years.sort((a, b) => b - a),
    months: [
      { value: "01", name: "Jan" }, { value: "02", name: "Fév" },
      { value: "03", name: "Mar" }, { value: "04", name: "Avr" },
      { value: "05", name: "Mai" }, { value: "06", name: "Juin" },
      { value: "07", name: "Juil" }, { value: "08", name: "Aoû" },
      { value: "09", name: "Sep" }, { value: "10", name: "Oct" },
      { value: "11", name: "Nov" }, { value: "12", name: "Déc" }
    ],
    current_year: Math.max(...years),
    current_month: "01"
  };
}

export async function getNasaTableData() {
  await fetchAndCacheNasaData();
  const csvData = await fs.readFile(CACHE_FILE, 'utf-8');
  const lines = csvData.trim().split('\\n');
  const header = lines[0].split(',').map(cell => cell.trim());
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
  return [header, ...rows];
}

export async function getTemperatureForDate(year, month) {
  const parsedData = await parseCSV();
  const monthIndex = parseInt(month, 10);
  const yearRow = parsedData.find(row => row[0] === String(year));

  if (!yearRow || !yearRow[monthIndex]) return null;
  return parseFloat(yearRow[monthIndex]);
}
```

**Explication pédagogique** :
- **Cache système** : Évite les appels API répétés (48h)
- **Parsing robuste** : Nettoyage des données NASA (retire les ***)
- **API simple** : 3 fonctions principales pour les composants
- **Error handling** : Fallback gracieux si API indisponible

### `lib/actions.js` - Server Actions
```javascript
'use server';

import { getTemperatureForDate } from './data';

export async function getTemperatureDataAction(year, month) {
  try {
    const temperature = await getTemperatureForDate(year, month);

    return {
      temperature,
      global: temperature,
      year,
      month
    };
  } catch (error) {
    console.error('Erreur Server Action:', error.message);
    return {
      error: 'Impossible de récupérer les températures.',
      temperature: null
    };
  }
}
```

**Explication pédagogique** :
- **'use server'** : Directive Next.js pour Server Actions
- **Bridge** : Pont entre Client Components et fonctions serveur
- **Error handling** : Retour structuré même en cas d'erreur

---

## 🎨 Composants Interface

### `components/PageContent.jsx` - Wrapper client
```javascript
'use client';

import Dashboard from './Dashboard';

export default function PageContent({ availableDates, tableData }) {
  return (
    <Dashboard
      availableDates={availableDates}
      tableData={tableData}
    />
  );
}
```

**Explication pédagogique** :
- **'use client'** : Directive pour Client Component
- **Bridge** : Passe les données serveur aux composants interactifs
- **Isolation** : Sépare Server Components des Client Components

### `components/Dashboard.jsx` - Orchestrateur principal (simplifié)
```javascript
'use client';

import { useState } from 'react';
import LazyTemperatureChart from './LazyTemperatureChart';
import LazyClimateGlobe from './LazyClimateGlobe';

export default function Dashboard({ availableDates, tableData }) {
  const [activeTab, setActiveTab] = useState('globe');
  const [chartOpen, setChartOpen] = useState(false);

  const [globeControls, setGlobeControls] = useState({
    year: availableDates.current_year,
    month: availableDates.current_month,
    temps: {},
    isLoadingTemps: false
  });

  const handleGlobeControlsChange = (newControls) => {
    setGlobeControls(prev => ({ ...prev, ...newControls }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      {/* Sidebar simple */}
      <div style={{
        width: '300px',
        background: '#1a1a1a',
        padding: '20px',
        color: '#fff'
      }}>
        <h2>Climate Sphere</h2>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('globe')}
            style={{
              background: activeTab === 'globe' ? '#0066cc' : '#333',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              marginRight: '10px'
            }}
          >
            Globe 3D
          </button>

          <button
            onClick={() => setChartOpen(true)}
            style={{
              background: '#333',
              color: '#fff',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px'
            }}
          >
            Graphiques
          </button>
        </div>

        {/* Contrôles année/mois */}
        <div>
          <label>Année: </label>
          <select
            value={globeControls.year}
            onChange={(e) => handleGlobeControlsChange({ year: parseInt(e.target.value) })}
            style={{ background: '#333', color: '#fff', padding: '5px' }}
          >
            {availableDates.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Mois: </label>
          <select
            value={globeControls.month}
            onChange={(e) => handleGlobeControlsChange({ month: e.target.value })}
            style={{ background: '#333', color: '#fff', padding: '5px' }}
          >
            {availableDates.months.map(month => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone principale */}
      <div style={{ flex: 1, background: '#0a0a0a' }}>
        {activeTab === 'globe' && (
          <LazyClimateGlobe
            availableDates={availableDates}
            controls={globeControls}
            onControlsChange={handleGlobeControlsChange}
          />
        )}
      </div>

      {/* Modal graphique */}
      <LazyTemperatureChart
        isOpen={chartOpen}
        onClose={() => setChartOpen(false)}
        tableData={tableData}
        currentMonth={new Date().getMonth() + 1}
      />
    </div>
  );
}
```

**Explication pédagogique** :
- **State management** : useState pour les contrôles
- **Tab system** : Navigation simple entre vues
- **Props drilling** : Passage des données aux composants enfants
- **Styling inline** : CSS direct pour la simplicité MVP

---

## 🌐 Composants 3D

### `components/LazyClimateGlobe.jsx` - Lazy loading
```javascript
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Globe } from 'lucide-react';

const ClimateGlobe = dynamic(() => import('./ClimateGlobe'), {
  ssr: false,
  loading: () => <GlobeLoadingFallback />
});

function GlobeLoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: '#0ff'
    }}>
      <Globe size={40} />
      <span style={{ marginLeft: '10px' }}>Chargement du globe 3D...</span>
    </div>
  );
}

export default function LazyClimateGlobe({ availableDates, controls, onControlsChange }) {
  return (
    <Suspense fallback={<GlobeLoadingFallback />}>
      <ClimateGlobe
        availableDates={availableDates}
        controls={controls}
        onControlsChange={onControlsChange}
      />
    </Suspense>
  );
}
```

**Explication pédagogique** :
- **dynamic import** : Charge Three.js seulement côté client
- **ssr: false** : Évite les erreurs de rendu serveur
- **Loading fallback** : État de chargement pendant l'initialisation WebGL
- **Code splitting** : Three.js dans un bundle séparé

### `components/ClimateGlobe.jsx` - Globe 3D (simplifié)
```javascript
'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getTemperatureDataAction } from '@/lib/actions';

// Composant Globe 3D
const Globe = ({ year, month, onLoad }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  // Rotation automatique
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Chargement texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Essayer texture spécifique, fallback sur texture par défaut
    loader.load(
      `/textures/gistemp_${year}_${month}.png`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback vers texture par défaut
        loader.load('/textures/default_earth.jpg', setTexture);
      }
    );

    // Charger données température
    if (onLoad) {
      getTemperatureDataAction(year, month)
        .then(onLoad)
        .catch(console.error);
    }
  }, [year, month, onLoad]);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default function ClimateGlobe({ availableDates, controls, onControlsChange }) {
  const year = controls?.year || availableDates.current_year;
  const month = controls?.month || availableDates.current_month;

  const handleTempsLoad = (newTemps) => {
    if (onControlsChange) {
      onControlsChange({
        ...controls,
        temps: newTemps || {},
        isLoadingTemps: false
      });
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <hemisphereLight intensity={1} />
          <Globe
            year={year}
            month={month}
            onLoad={handleTempsLoad}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            enablePan={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

**Explication pédagogique** :
- **Canvas** : Container Three.js/React
- **useFrame** : Hook pour animations (rotation)
- **TextureLoader** : Chargement dynamique des textures
- **OrbitControls** : Navigation 3D (zoom, rotation)
- **Fallback texture** : Image par défaut si texture spécifique manquante

---

## 📈 Composants Charts

### `components/LazyTemperatureChart.jsx` - Lazy loading
```javascript
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';

const TemperatureChart = dynamic(() => import('./TemperatureChart'), {
  ssr: false,
  loading: () => <ChartLoadingFallback />
});

function ChartLoadingFallback() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <BarChart3 size={40} />
        <p>Chargement des graphiques...</p>
      </div>
    </div>
  );
}

export default function LazyTemperatureChart({ isOpen, onClose, tableData, currentMonth }) {
  if (!isOpen) return null;

  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <TemperatureChart
        isOpen={isOpen}
        onClose={onClose}
        tableData={tableData}
        currentMonth={currentMonth}
      />
    </Suspense>
  );
}
```

### `components/TemperatureChart.jsx` - Graphiques (simplifié)
```javascript
'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

export default function TemperatureChart({ isOpen, onClose, tableData, currentMonth }) {
  const [month, setMonth] = useState(currentMonth || 1);

  // Traitement données pour graphique
  const chartData = useMemo(() => {
    if (!tableData || tableData.length < 2) return [];

    const [, ...rows] = tableData;

    return rows
      .map(row => {
        const year = parseInt(row[0]);
        const value = parseFloat(row[month]);

        if (isNaN(year) || isNaN(value)) return null;

        return { year, value };
      })
      .filter(Boolean)
      .sort((a, b) => a.year - b.year);
  }, [tableData, month]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '40px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a2e',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '90vw',
          maxHeight: '85vh',
          width: '100%',
          color: '#fff',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px' }}>
              Anomalies de température
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#bbb' }}>
              Données NASA GISTEMP 1880-{new Date().getFullYear()}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Contrôles */}
        <div style={{ marginBottom: '20px' }}>
          <label>Mois: </label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              marginLeft: '10px'
            }}
          >
            {[
              'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
              'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ].map((name, idx) => (
              <option key={idx + 1} value={idx + 1} style={{ background: '#1a1a2e' }}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Graphique */}
        <div style={{ height: '500px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="year"
                stroke="#888"
                fontSize={12}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                label={{
                  value: 'Anomalie (°C)',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#64b5f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

**Explication pédagogique** :
- **Recharts** : Graphiques réactifs basés sur SVG
- **useMemo** : Optimisation calcul données
- **Modal pattern** : Overlay plein écran
- **Responsive** : S'adapte à toutes tailles d'écran

---

## 🎨 Styles globaux

### `app/globals.css` - Styles minimaux
```css
@import "tailwindcss/preflight";

:root {
  --background: #0a0a0a;
  --foreground: rgba(0, 255, 255, 0.9);
}

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
  background: var(--background);
  color: var(--foreground);
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

/* Scrollbar personnalisé */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 181, 246, 0.3);
  border-radius: 10px;
}
```

**Explication pédagogique** :
- **CSS Variables** : Couleurs cohérentes dans toute l'app
- **Box-sizing** : Modèle de boîte prévisible
- **Scrollbar** : Style personnalisé pour l'esthétique

---

## 🔗 Dépendances minimales entre fichiers

### Ordre de chargement MVP
1. **package.json** → Installe les dépendances
2. **next.config.js** → Configure le build
3. **app/layout.js** → Structure HTML de base
4. **lib/data.js** → Fonctions de récupération données
5. **lib/actions.js** → Server Actions
6. **app/page.js** → Point d'entrée (fetch données)
7. **components/PageContent.jsx** → Bridge Server/Client
8. **components/Dashboard.jsx** → Orchestrateur principal
9. **components/Lazy*.jsx** → Composants avec lazy loading
10. **app/globals.css** → Styles globaux

### Dépendances critiques
- `lib/data.js` ← `app/page.js` ← `components/PageContent.jsx`
- `lib/actions.js` ← `components/ClimateGlobe.jsx`
- `next.config.js` → Optimisations bundle
- `app/globals.css` → Styles cohérents

---

## 🚀 Commandes MVP

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Démarrage production
npm start
```

---

*Ce guide permet de recréer une version MVP entièrement fonctionnelle avec le minimum de code nécessaire pour chaque fichier.*