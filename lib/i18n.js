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
      aboutSections: [
        {
          title: 'Climate Sphere',
          paragraphs: [
            'Climate Sphere lets you explore 145 years of temperature anomalies, from January 1880 to today, on an interactive 3D globe built from NASA GISTEMP v4 data. Every month in the instrumental climate record can be displayed instantly, compared, or replayed as a continuous animation.'
          ]
        },
        {
          title: 'The Data',
          paragraphs: [
            'The maps shown here come from GISTEMP v4, the surface temperature analysis produced by the Goddard Institute for Space Studies (NASA GISS). An anomaly does not measure an absolute temperature, but a difference: the gap between the temperature of a given month and the 1951-1980 reference average for the same location and same month. This is what makes it possible to compare climate change from one region to another and from one period to another.',
            'The data is updated monthly after publication by NASA. Areas shown in gray correspond to regions and periods where observations are insufficient — they are common in the nineteenth century, and that is expected: this site presents the data as it exists, without filling gaps or retouching it.',
            'Source: data.giss.nasa.gov/gistemp'
          ]
        },
        {
          title: 'How It Works',
          paragraphs: [
            'A Python pipeline downloads the GISTEMP data, generates a map texture for each of the roughly 1,750 available months, and makes them available to the application. The Three.js globe then displays them, which makes it possible to change date or replay a century and a half of warming without loading delays.',
            'Most of the work is therefore invisible: it happens before the page opens.'
          ]
        },
        {
          title: 'What Exists Elsewhere',
          paragraphs: [
            'Excellent tools already make it possible to explore these same datasets, starting with NASA itself, as well as Climate Pulse, developed by the European Copernicus service, which provides a 3D globe using ERA5 data from 1940 onward. Climate Sphere combines a manipulable 3D globe, instant time navigation, and the full instrumental period since 1880.'
          ]
        },
        {
          title: 'Technologies',
          paragraphs: [
            'The application is built with Next.js and Three.js for 3D rendering, powered by a Python data pipeline.'
          ]
        },
        {
          title: 'The Author',
          paragraphs: [
            'My name is Johan Lorck. I am a freelance developer specializing in Next.js and headless CMS projects, and since 2013 I have edited global-climat.com, a site dedicated to climate science news.',
            'To contact me or discover my work: johanlorck.fr'
          ]
        },
        {
          title: 'Credits',
          paragraphs: [
            'Data: NASA GISS Surface Temperature Analysis (GISTEMP v4), public domain. This site is an independent project and is not affiliated with NASA.'
          ]
        }
      ]
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
        { label: 'Données', value: '145+', detail: 'depuis 1880' },
        { label: 'Source', value: 'NASA', detail: 'GISTEMP v4' },
        { label: 'Rendu', value: '3D', detail: 'globe interactif' }
      ],
      eyebrowA: 'Anomalies de température',
      eyebrowB: 'NASA GISTEMP',
      titleLine1: 'Le climat',
      titleLine2: 'en 3D',
      description: "Explorez 145 ans d'anomalies de température à travers un globe 3D interactif, des tableaux de données et des graphiques détaillés.",
      primaryCta: 'Explorer le dashboard'
    },
    sidebar: {
      globe: 'Globe',
      data: 'Données',
      chart: 'Graphiques',
      about: 'À propos'
    },
    globeControls: {
      dataPeriod: 'Période de données',
      archivePlayer: 'Player archives',
      backToStart: 'Retour au début',
      restartFromStart: 'Relancer depuis le début',
      playFrom: 'Lire depuis',
      start: 'début',
      global: 'Global',
      northShort: 'Hém. Nord',
      southShort: 'Hém. Sud'
    },
    main: {
      climateData: 'Données climatiques',
      anomalyCharts: 'Graphiques des anomalies',
      chartDescription: 'Visualisez les anomalies de température sous forme de graphiques interactifs.',
      openCharts: 'Ouvrir les graphiques',
      about: 'À propos',
      aboutSections: [
        {
          title: 'Climate Sphere',
          paragraphs: [
            "Climate Sphere permet d'explorer 145 ans d'anomalies de température — de janvier 1880 à aujourd'hui — sur un globe 3D interactif, à partir des données NASA GISTEMP v4. Chaque mois de l'histoire instrumentale du climat peut être affiché instantanément, comparé, ou rejoué en animation continue."
          ]
        },
        {
          title: 'Les données',
          paragraphs: [
            "Les cartes affichées proviennent de GISTEMP v4, l'analyse de température de surface produite par le Goddard Institute for Space Studies (NASA GISS). Une anomalie ne mesure pas une température absolue, mais un écart : la différence entre la température d'un mois donné et la moyenne de référence 1951-1980 pour le même lieu et le même mois. C'est cette grandeur qui permet de comparer l'évolution du climat d'une région à l'autre et d'une époque à l'autre.",
            "Les données sont mises à jour chaque mois, à la suite de leur publication par la NASA. Les zones apparaissant en gris correspondent aux régions et aux périodes où les observations sont insuffisantes — elles sont fréquentes au XIXᵉ siècle, et c'est normal : ce site restitue la donnée telle qu'elle existe, sans la compléter ni la retoucher.",
            'Source : data.giss.nasa.gov/gistemp'
          ]
        },
        {
          title: 'Comment ça marche',
          paragraphs: [
            "Un pipeline Python télécharge les données GISTEMP, génère une texture cartographique pour chacun des quelque 1 750 mois disponibles, et les met à disposition de l'application. Le globe Three.js est chargé ensuite de les afficher — c'est ce qui permet de changer de date, ou de rejouer un siècle et demi de réchauffement, sans temps de chargement.",
            "L'essentiel du travail est donc invisible : il a eu lieu avant que la page ne s'ouvre."
          ]
        },
        {
          title: 'Ce qui existe ailleurs',
          paragraphs: [
            "D'excellents outils permettent d'explorer ces mêmes données, à commencer par ceux de la NASA elle-même, ou Climate Pulse, développé par le service européen Copernicus, qui propose un globe 3D sur les données ERA5 à partir de 1940. Climate Sphere combine un globe 3D manipulable, une navigation temporelle instantanée et l'intégralité de la période instrumentale depuis 1880."
          ]
        },
        {
          title: 'Technologies',
          paragraphs: [
            "L'application est construite avec Next.js et Three.js pour le rendu 3D, alimentée par un pipeline de données en Python."
          ]
        },
        {
          title: "L'auteur",
          paragraphs: [
            "Je m'appelle Johan Lorck. Je suis développeur freelance spécialisé en Next.js et CMS headless, et j'édite depuis 2013 global-climat.com, un site consacré à l'actualité scientifique du climat.",
            'Pour me contacter ou découvrir mon travail : johanlorck.fr'
          ]
        },
        {
          title: 'Crédits',
          paragraphs: [
            "Données : NASA GISS Surface Temperature Analysis (GISTEMP v4), domaine public. Ce site est un projet indépendant et n'est pas affilié à la NASA."
          ]
        }
      ]
    },
    table: {
      chooseRegion: 'Choisir la région',
      referencePeriod: 'Période de référence',
      northernHemisphere: 'Hémisphère Nord',
      southernHemisphere: 'Hémisphère Sud',
      preindustrial: '1880-1899 (Pré-industriel)',
      modern: '1991-2020 (Moderne)',
      loading: 'Chargement...'
    },
    modal: {
      northernHemisphere: 'Hémisphère Nord',
      southernHemisphere: 'Hémisphère Sud',
      anomalyDescription: 'Anomalie de température par rapport à la moyenne'
    },
    chart: {
      loadingCharts: 'Chargement des graphiques...',
      preparing: 'Préparation de la visualisation Recharts',
      loadingData: 'Chargement des données...',
      loadError: 'Erreur de chargement des graphiques...',
      noData: 'Aucune donnée à afficher',
      unsupportedType: 'Type de graphique non supporté',
      currentYear: 'Année courante',
      calculatedAverage: 'Moyenne calculée sur',
      availableMonths: 'mois disponibles',
      provisionalAnnual: 'Données annuelles provisoires (année en cours)',
      monthly: 'Mensuel',
      annual: 'Annuel',
      export: 'Exporter',
      exportError: "Erreur lors de l'export du graphique",
      annualAnomalies: 'Anomalies annuelles',
      anomaliesFor: 'Anomalies pour',
      chartFrom: 'Graphique depuis',
      currentYearSuffix: 'Année courante',
      yAxis: 'Anomalie (deg C)',
      monthlyData: 'Données mensuelles',
      annualData: 'Données annuelles',
      currentYearCalculated: 'Année courante - calculée',
      trend1880: 'Tendance/décennie depuis 1880',
      trend1950: 'Tendance/décennie depuis 1950',
      trend2000: 'Tendance/décennie depuis 2000',
      krakatoa: 'Éruption du Krakatoa',
      pinatubo: 'Éruption du Mont Pinatubo',
      strongElNino: 'El Nino intense',
      recordElNino: 'El Nino record'
    },
    globe: {
      temperatureAnomalies: 'Anomalies de température',
      autoRotation: 'Rotation automatique'
    },
    meta: {
      title: 'Climate Sphere - Visualisation climatique NASA GISTEMP',
      description: "Explorez les données d'anomalies de température de la NASA GISTEMP à travers une visualisation interactive 3D et des graphiques détaillés.",
      keywords: 'NASA, GISTEMP, température, anomalies, climat, réchauffement, visualisation',
      imageAlt: 'Globe 3D interactif montrant les anomalies de température NASA GISTEMP'
    }
  }
};

export function getTranslations(locale) {
  return translations[normalizeLocale(locale)];
}
