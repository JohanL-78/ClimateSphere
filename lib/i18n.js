export const SUPPORTED_LOCALES = ['en', 'fr'];
export const DEFAULT_LOCALE = 'en';

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export const monthOptionsByLocale = {
  en: [
    { value: '01', name: 'Jan' },
    { value: '02', name: 'Feb' },
    { value: '03', name: 'Mar' },
    { value: '04', name: 'Apr' },
    { value: '05', name: 'May' },
    { value: '06', name: 'Jun' },
    { value: '07', name: 'Jul' },
    { value: '08', name: 'Aug' },
    { value: '09', name: 'Sep' },
    { value: '10', name: 'Oct' },
    { value: '11', name: 'Nov' },
    { value: '12', name: 'Dec' }
  ],
  fr: [
    { value: '01', name: 'Jan' },
    { value: '02', name: 'Fev' },
    { value: '03', name: 'Mar' },
    { value: '04', name: 'Avr' },
    { value: '05', name: 'Mai' },
    { value: '06', name: 'Juin' },
    { value: '07', name: 'Juil' },
    { value: '08', name: 'Aout' },
    { value: '09', name: 'Sep' },
    { value: '10', name: 'Oct' },
    { value: '11', name: 'Nov' },
    { value: '12', name: 'Dec' }
  ]
};

export const fullMonthNames = {
  en: [
    '',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  fr: [
    '',
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
  ]
};

export const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      menu: 'Menu',
      close: 'Close'
    },
    landing: {
      stats: [
        { label: 'Data', value: '145+', detail: 'since 1880' },
        { label: 'Source', value: 'NASA', detail: 'GISTEMP v4' },
        { label: 'Render', value: '3D', detail: 'interactive globe' }
      ],
      eyebrowA: 'Temperature anomalies',
      eyebrowB: 'NASA GISTEMP',
      titleLine1: 'Climate',
      titleLine2: 'in 3D',
      description: 'Explore 145 years of temperature anomalies through an interactive 3D globe, data tables, and detailed charts.',
      primaryCta: 'Explore dashboard'
    },
    sidebar: {
      globe: 'Globe',
      data: 'Data',
      chart: 'Charts',
      about: 'About'
    },
    globeControls: {
      dataPeriod: 'Data period',
      archivePlayer: 'Archive player',
      backToStart: 'Back to start',
      restartFromStart: 'Restart from start',
      playFrom: 'Play from',
      start: 'start',
      global: 'Global',
      northShort: 'N. Hem.',
      southShort: 'S. Hem.'
    },
    main: {
      climateData: 'Climate data',
      anomalyCharts: 'Anomaly charts',
      chartDescription: 'Visualize temperature anomalies as interactive charts.',
      openCharts: 'Open charts',
      about: 'About',
      aboutTitle: 'NASA GISTEMP Viewer Dashboard',
      aboutDescription: 'This application presents NASA GISTEMP temperature anomaly data as an interactive 3D visualization and data tables.',
      developedBy: 'Developed by',
      viewSource: 'View source code on GitHub'
    },
    table: {
      chooseRegion: 'Choose region',
      referencePeriod: 'Reference period',
      northernHemisphere: 'Northern Hemisphere',
      southernHemisphere: 'Southern Hemisphere',
      preindustrial: '1880-1899 (Pre-industrial)',
      modern: '1991-2020 (Modern)',
      loading: 'Loading...'
    },
    modal: {
      northernHemisphere: 'Northern Hemisphere',
      southernHemisphere: 'Southern Hemisphere',
      anomalyDescription: 'Temperature anomaly relative to the average'
    },
    chart: {
      loadingCharts: 'Loading charts...',
      preparing: 'Preparing the Recharts visualization',
      loadingData: 'Loading data...',
      loadError: 'Chart loading error...',
      noData: 'No data to display',
      unsupportedType: 'Unsupported chart type',
      currentYear: 'Current year',
      calculatedAverage: 'Calculated average over',
      availableMonths: 'available months',
      provisionalAnnual: 'Provisional annual data (current year)',
      monthly: 'Monthly',
      annual: 'Annual',
      export: 'Export',
      exportError: 'Error exporting chart',
      annualAnomalies: 'Annual anomalies',
      anomaliesFor: 'Anomalies for',
      chartFrom: 'Chart from',
      currentYearSuffix: 'Current year',
      yAxis: 'Anomaly (deg C)',
      monthlyData: 'Monthly data',
      annualData: 'Annual data',
      currentYearCalculated: 'Current year - calculated',
      trend1880: 'Trend/decade since 1880',
      trend1950: 'Trend/decade since 1950',
      trend2000: 'Trend/decade since 2000',
      krakatoa: 'Krakatoa eruption',
      pinatubo: 'Mount Pinatubo eruption',
      strongElNino: 'Strong El Nino',
      recordElNino: 'Record El Nino'
    },
    globe: {
      temperatureAnomalies: 'Temperature anomalies',
      autoRotation: 'Auto rotation'
    },
    meta: {
      title: 'Climate Sphere - NASA GISTEMP climate visualization',
      description: 'Explore NASA GISTEMP temperature anomaly data through an interactive 3D visualization and detailed charts.',
      keywords: 'NASA, GISTEMP, temperature, anomalies, climate, warming, visualization',
      imageAlt: 'Interactive 3D globe showing NASA GISTEMP temperature anomalies'
    }
  },
  fr: {
    nav: {
      dashboard: 'Dashboard',
      menu: 'Menu',
      close: 'Fermer'
    },
    landing: {
      stats: [
        { label: 'Donnees', value: '145+', detail: 'depuis 1880' },
        { label: 'Source', value: 'NASA', detail: 'GISTEMP v4' },
        { label: 'Rendu', value: '3D', detail: 'globe interactif' }
      ],
      eyebrowA: 'Anomalies de temperature',
      eyebrowB: 'NASA GISTEMP',
      titleLine1: 'Le climat',
      titleLine2: 'en 3D',
      description: "Explorez 145 ans d'anomalies de temperature a travers un globe 3D interactif, des tableaux de donnees et des graphiques detailles.",
      primaryCta: 'Explorer le dashboard'
    },
    sidebar: {
      globe: 'Globe',
      data: 'Donnees',
      chart: 'Graphiques',
      about: 'A propos'
    },
    globeControls: {
      dataPeriod: 'Periode de donnees',
      archivePlayer: 'Player archives',
      backToStart: 'Retour au debut',
      restartFromStart: 'Relancer depuis le debut',
      playFrom: 'Lire depuis',
      start: 'debut',
      global: 'Global',
      northShort: 'Hem. Nord',
      southShort: 'Hem. Sud'
    },
    main: {
      climateData: 'Donnees climatiques',
      anomalyCharts: 'Graphiques des anomalies',
      chartDescription: 'Visualisez les anomalies de temperature sous forme de graphiques interactifs.',
      openCharts: 'Ouvrir les graphiques',
      about: 'A propos',
      aboutTitle: 'NASA GISTEMP Viewer Dashboard',
      aboutDescription: "Cette application presente les donnees d'anomalies de temperature de la NASA GISTEMP sous forme d'une visualisation 3D interactive et de tableaux de donnees.",
      developedBy: 'Developpe par',
      viewSource: 'Voir le code source sur GitHub'
    },
    table: {
      chooseRegion: 'Choisir la region',
      referencePeriod: 'Periode de reference',
      northernHemisphere: 'Hemisphere Nord',
      southernHemisphere: 'Hemisphere Sud',
      preindustrial: '1880-1899 (Pre-industriel)',
      modern: '1991-2020 (Moderne)',
      loading: 'Chargement...'
    },
    modal: {
      northernHemisphere: 'Hemisphere Nord',
      southernHemisphere: 'Hemisphere Sud',
      anomalyDescription: 'Anomalie de temperature par rapport a la moyenne'
    },
    chart: {
      loadingCharts: 'Chargement des graphiques...',
      preparing: 'Preparation de la visualisation Recharts',
      loadingData: 'Chargement des donnees...',
      loadError: 'Erreur de chargement des graphiques...',
      noData: 'Aucune donnee a afficher',
      unsupportedType: 'Type de graphique non supporte',
      currentYear: 'Annee courante',
      calculatedAverage: 'Moyenne calculee sur',
      availableMonths: 'mois disponibles',
      provisionalAnnual: 'Donnees annuelles provisoires (annee en cours)',
      monthly: 'Mensuel',
      annual: 'Annuel',
      export: 'Exporter',
      exportError: "Erreur lors de l'export du graphique",
      annualAnomalies: 'Anomalies annuelles',
      anomaliesFor: 'Anomalies pour',
      chartFrom: 'Graphique depuis',
      currentYearSuffix: 'Annee courante',
      yAxis: 'Anomalie (deg C)',
      monthlyData: 'Donnees mensuelles',
      annualData: 'Donnees annuelles',
      currentYearCalculated: 'Annee courante - calculee',
      trend1880: 'Tendance/decennie depuis 1880',
      trend1950: 'Tendance/decennie depuis 1950',
      trend2000: 'Tendance/decennie depuis 2000',
      krakatoa: 'Eruption du Krakatoa',
      pinatubo: 'Eruption du Mont Pinatubo',
      strongElNino: 'El Nino intense',
      recordElNino: 'El Nino record'
    },
    globe: {
      temperatureAnomalies: 'Anomalies de temperature',
      autoRotation: 'Rotation automatique'
    },
    meta: {
      title: 'Climate Sphere - Visualisation climatique NASA GISTEMP',
      description: "Explorez les donnees d'anomalies de temperature de la NASA GISTEMP a travers une visualisation interactive 3D et des graphiques detailles.",
      keywords: 'NASA, GISTEMP, temperature, anomalies, climat, rechauffement, visualisation',
      imageAlt: 'Globe 3D interactif montrant les anomalies de temperature NASA GISTEMP'
    }
  }
};

export function getTranslations(locale) {
  return translations[normalizeLocale(locale)];
}
