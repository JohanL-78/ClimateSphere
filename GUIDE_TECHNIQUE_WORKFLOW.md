# 🌍 Guide Technique MVP - Climate Sphere Application

## 📋 Vue d'ensemble de l'application

**Climate Sphere** est une application Next.js 15 qui visualise les données d'anomalies climatiques de la NASA GISTEMP à travers :
- 🌐 Un globe 3D interactif (Three.js)
- 📊 Des graphiques temporels (Recharts)
- 🌤️ Des données météorologiques en temps réel
- 📱 Interface responsive avec dashboard modulaire

---

## 🏗️ Architecture globale

### Workflow de données
```
NASA GISTEMP API → Cache Local → Parsing CSV → Composants React → Visualisations 3D/2D
```

### Stack technique
- **Framework** : Next.js 15 (App Router)
- **UI** : React 19, Framer Motion, Tailwind CSS
- **3D** : Three.js, React-Three-Fiber, Globe.gl
- **Charts** : Recharts, D3-scale
- **Build** : Webpack optimisé, Bundle splitting

---

## 📁 Structure des fichiers - Contenu MVP minimal fonctionnel

### 🔧 Configuration racine

#### `package.json`
**Rôle MVP** : Définit les dépendances et scripts de build
```json
{
  "dependencies": {
    "next": "15.3.3",
    "@react-three/fiber": "^9.1.2", // Rendu 3D
    "recharts": "^3.1.0",           // Graphiques
    "framer-motion": "^12.23.12"    // Animations
  }
}
```
**Technique** : Gère les versions des libs critiques pour la compatibilité 3D et charts.

#### `next.config.js`
**Rôle MVP** : Optimise les performances et le chunking
- **Chunks séparés** : Three.js, Recharts, Framer Motion dans des bundles distincts
- **Cache headers** : Assets statiques avec cache long (1 an)
- **MDX support** : Pour la documentation intégrée

**Mode MVP** : Utiliser la config de base sans optimisations avancées.

### 🎯 Point d'entrée de l'application

#### `app/layout.js`
**Rôle MVP** : Layout global avec SEO et métadonnées
```javascript
export const metadata = {
  title: "NASA GISTEMP Viewer",
  description: "Visualisation des anomalies climatiques"
}
```
**Technique** :
- **Police** : Montserrat pré-chargée pour éviter les FOUT
- **SEO** : Open Graph + Schema.org pour référencement
- **Performance** : Preconnect vers Google Fonts

**Mode MVP** : Layout minimal sans SEO avancé.

#### `app/page.js`
**Rôle MVP** : Page d'accueil, fetch des données serveur
```javascript
export default async function HomePage() {
  const availableDates = await getAvailableDates();
  const tableData = await getNasaTableData();
  return <PageContent availableDates={availableDates} tableData={tableData} />
}
```
**Technique** : Server Component qui pré-fetch les données NASA au build time.

**Mode MVP** : Données mockées en dur, pas d'API calls.

### 📊 Couche de données

#### `lib/data.js`
**Rôle MVP** : Gestionnaire central des données climatiques
**Fonctions clés** :
- `fetchAndCacheNasaData()` : Cache intelligent 48h avec fallback
- `getAvailableDates()` : Extraction des années/mois disponibles
- `getNasaTableData()` : Parsing CSV → format exploitable
- `getTemperatureForDate()` : Récupération température par date
- `getOniIndex()` : Données El Niño/La Niña

**Technique** :
- **Cache système** : Fichiers CSV locaux avec expiration
- **Resilience** : Données d'urgence si API down
- **Parsing robuste** : Gestion des "***" et cellules vides
- **DNS optimisation** : ipv4first pour réduire latence

**Mode MVP** : Fichier JSON statique avec 2-3 années de données.

### 🎨 Composants d'interface

#### `components/PageContent.jsx`
**Rôle MVP** : Wrapper client pour passer des props serveur vers Dashboard
```javascript
'use client';
export default function PageContent({ availableDates, tableData }) {
  return <Dashboard availableDates={availableDates} tableData={tableData} />
}
```
**Technique** : Pont entre Server Components et Client Components.

#### `components/Dashboard.jsx`
**Rôle MVP** : Chef d'orchestre de l'interface utilisateur
**États gérés** :
- `globeControls` : Année, mois, températures, modal
- `meteoControls` : Coordonnées, ville, météo temps réel
- `sidebarOpen`, `activeTab`, `chartOpen` : UI state

**Technique** :
- **State management** : useReducer pattern avec actions typées
- **API integration** : Open-Meteo pour météo, OpenStreetMap pour géocodage
- **Performance** : Lazy loading conditionnel des composants lourds

**Mode MVP** : Interface fixe sans contrôles dynamiques.

#### `components/LazyClimateGlobe.jsx`
**Rôle MVP** : Wrapper de lazy loading pour le globe 3D
```javascript
const ClimateGlobe = dynamic(() => import('./ClimateGlobe'), {
  ssr: false,
  loading: () => <GlobeLoadingFallback />
});
```
**Technique** :
- **Code splitting** : Three.js chargé uniquement côté client
- **Loading state** : Animation pendant l'initialisation WebGL
- **Error boundary** : Fallback si WebGL non supporté

**Mode MVP** : Image statique ou carte 2D simple.

#### `components/LazyTemperatureChart.jsx`
**Rôle MVP** : Lazy loading pour les graphiques Recharts
**Technique** :
- **Conditional rendering** : Chargé seulement si modal ouverte
- **Bundle optimization** : Recharts dans chunk séparé
- **Animation loading** : Barre de progression pendant le chargement

**Mode MVP** : Graphique statique avec Chart.js ou canvas.

### 🗂️ Composants Dashboard

#### `components/dashboard/Navbar.jsx`
**Rôle MVP** : Barre de navigation avec toggle sidebar
**Mode MVP** : Header simple avec titre.

#### `components/dashboard/Sidebar.jsx`
**Rôle MVP** : Panneau de contrôles avec onglets Globe/Météo
**Mode MVP** : Contrôles basiques year/month.

#### `components/dashboard/MainContent.jsx`
**Rôle MVP** : Zone principale d'affichage conditionnelle par onglet
**Mode MVP** : Affichage unique sans tabs.

#### `components/dashboard/GlobeControls.jsx`
**Rôle MVP** : Contrôles spécifiques au globe (année, mois, modal)
**Mode MVP** : Select simple pour année.

#### `components/dashboard/MeteoControls.jsx`
**Rôle MVP** : Contrôles météo (recherche ville, mode jour/nuit)
**Mode MVP** : Input text pour ville fixe.

#### `components/dashboard/DetailModal.jsx`
**Rôle MVP** : Modal d'affichage détaillé des anomalies
**Mode MVP** : Alert simple ou popup basique.

### 🎣 Hooks utilitaires

#### `hooks/useResponsive.js`
**Rôle MVP** : Gestion centralisée de la responsivité
```javascript
export const useResponsive = () => {
  return { isMobile, isTablet, isDesktop, width, height }
}
```
**Technique** :
- **Debounced resize** : Évite les re-renders excessifs
- **Multiple breakpoints** : Mobile/Tablet/Desktop
- **Performance** : Mise à jour seulement si changement réel

**Mode MVP** : Hook simple isMobile avec breakpoint fixe.

---

## 🚀 Workflow de développement MVP

### Phase 1 - Base minimale
1. **Layout** : HTML/CSS de base sans animations
2. **Données** : JSON statique avec 3 années de données
3. **Globe** : Image ou carte 2D interactive
4. **Charts** : Canvas ou SVG simple avec 1-2 métriques

### Phase 2 - Interactivité
1. **État** : useState simple pour year/month
2. **API** : Fetch basique des données NASA (sans cache)
3. **Responsive** : Breakpoints mobile/desktop de base
4. **Navigation** : Tabs simples sans sidebar

### Phase 3 - Optimisations
1. **Lazy loading** : Composants critiques uniquement
2. **Cache** : localStorage pour données
3. **SEO** : Métadonnées de base
4. **Performance** : Bundle basic sans optimisations

### Phase 4 - Production
1. **3D** : Integration Three.js complète
2. **Cache avancé** : Système actuel avec fallbacks
3. **SEO complet** : Schema.org + OpenGraph
4. **Optimisations** : Config actuelle next.config.js

---

## 🎯 Points clés d'explication technique

### Gestion des données
- **Cache intelligent** : Évite les appels API répétés
- **Parsing robuste** : Gère les incohérences CSV NASA
- **Fallback système** : Données d'urgence si API indisponible

### Performance
- **Code splitting** : Three.js et Recharts chargés à la demande
- **Lazy components** : Rendu conditionnel des composants lourds
- **Bundle optimization** : Chunks séparés par type de lib

### UX/UI
- **Progressive loading** : Animations de chargement élégantes
- **Responsive design** : Adaptation mobile/tablet/desktop
- **State management** : Centralisation avec patterns React modernes

### Architecture
- **Séparation Server/Client** : Données serveur, interaction client
- **Modularity** : Composants réutilisables et testables
- **Scalability** : Structure préparée pour nouvelles features

---

## 🛠️ Commandes de développement

```bash
# Développement
npm run dev

# Build production
npm run build

# Analyse du bundle
npm run build:analyze

# Linting
npm run lint
```

---

*Ce guide permet de comprendre chaque fichier dans son contexte global et d'expliquer une approche MVP progressive pour chaque composant.*