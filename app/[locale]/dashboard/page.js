import PageContent from '@/components/PageContent';
import JsonLd from '@/components/JsonLd';
import { getAvailableDates, getNasaTableData } from '@/lib/data';
import { normalizeLocale } from '@/lib/i18n';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return getPageMetadata(normalizeLocale(locale), '/dashboard');
}

export default async function DashboardPage({ params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const availableDates = await getAvailableDates('global', normalizedLocale);
  const tableData = await getNasaTableData();

  return (
    <>
      <JsonLd locale={normalizedLocale} path="/dashboard" />
      <PageContent
        locale={normalizedLocale}
        availableDates={availableDates}
        tableData={tableData}
      />
    </>
  );
}
