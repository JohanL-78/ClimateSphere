'use client';

import Dashboard from './Dashboard';

export default function PageContent({ availableDates, tableData, locale = 'en' }) {
  return (
    <Dashboard 
      locale={locale}
      availableDates={availableDates} 
      tableData={tableData} 
    />
  );
}
