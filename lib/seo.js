import { getTranslations, normalizeLocale } from './i18n';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://climate-sphere.vercel.app';
export const OG_IMAGE = `${SITE_URL}/screenshots/ClimateGlobe.png`;
export const SITE_NAME = 'Climate Sphere';

export function getLocalizedPath(locale, path = '/') {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedPath = path === '/' ? '' : path;

  return `/${normalizedLocale}${normalizedPath}`;
}

export function getAbsoluteUrl(locale, path = '/') {
  return `${SITE_URL}${getLocalizedPath(locale, path)}`;
}

export function getAlternates(path = '/') {
  return {
    canonical: getAbsoluteUrl('en', path),
    languages: {
      en: getAbsoluteUrl('en', path),
      fr: getAbsoluteUrl('fr', path),
      'x-default': getAbsoluteUrl('en', path),
    },
  };
}

export function getOpenGraph(locale, path = '/') {
  const normalizedLocale = normalizeLocale(locale);
  const meta = getTranslations(normalizedLocale).meta;

  return {
    title: meta.title,
    description: meta.description,
    url: getAbsoluteUrl(normalizedLocale, path),
    siteName: SITE_NAME,
    type: 'website',
    locale: normalizedLocale === 'fr' ? 'fr_FR' : 'en_US',
    alternateLocale: normalizedLocale === 'fr' ? ['en_US'] : ['fr_FR'],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: meta.imageAlt,
      }
    ],
  };
}

export function getTwitter(locale) {
  const meta = getTranslations(locale).meta;

  return {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: [OG_IMAGE],
    creator: '@globalclimat',
  };
}

export function getPageMetadata(locale = 'en', path = '/') {
  const normalizedLocale = normalizeLocale(locale);
  const meta = getTranslations(normalizedLocale).meta;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: getAbsoluteUrl(normalizedLocale, path),
      languages: {
        en: getAbsoluteUrl('en', path),
        fr: getAbsoluteUrl('fr', path),
        'x-default': getAbsoluteUrl('en', path),
      },
    },
    openGraph: getOpenGraph(normalizedLocale, path),
    twitter: getTwitter(normalizedLocale),
  };
}

export function getJsonLd(locale = 'en', path = '/') {
  const normalizedLocale = normalizeLocale(locale);
  const meta = getTranslations(normalizedLocale).meta;
  const url = getAbsoluteUrl(normalizedLocale, path);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#webapp`,
    name: SITE_NAME,
    alternateName: 'NASA GISTEMP Viewer',
    description: meta.description,
    url,
    image: OG_IMAGE,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    inLanguage: normalizedLocale,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Person',
      name: 'Johan Lorck',
      url: 'https://github.com/JohanL-78'
    },
    keywords: meta.keywords,
    about: {
      '@type': 'Thing',
      name: normalizedLocale === 'fr' ? 'Changement climatique' : 'Climate Change',
      description: normalizedLocale === 'fr'
        ? 'Visualisation des anomalies de temperature NASA GISTEMP'
        : 'NASA GISTEMP temperature anomaly data visualization'
    }
  };
}
