import LandingPage from '@/components/LandingPage';
import JsonLd from '@/components/JsonLd';
import { getAvailableDates } from '@/lib/data';
import { normalizeLocale } from '@/lib/i18n';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getPageMetadata(normalizeLocale(locale), '/');
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const availableDates = await getAvailableDates('global', normalizedLocale);

  return (
    <>
      <JsonLd locale={normalizedLocale} path="/" />
      <LandingPage
        locale={normalizedLocale}
        year={availableDates.current_year}
        month={availableDates.current_month}
      />
    </>
  );
}
