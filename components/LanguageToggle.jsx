'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function pathForLocale(pathname, locale) {
  const cleanPath = pathname || '/';
  const withoutLocalePrefix = cleanPath.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';

  return withoutLocalePrefix === '/'
    ? `/${locale}`
    : `/${locale}${withoutLocalePrefix}`;
}

export default function LanguageToggle({ locale = 'en' }) {
  const pathname = usePathname();
  const isFrench = locale === 'fr';
  const href = pathForLocale(pathname, isFrench ? 'en' : 'fr');

  return (
    <Link
      href={href}
      aria-label={isFrench ? 'Switch to English' : 'Passer en francais'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '44px',
        height: '36px',
        padding: '0 12px',
        borderRadius: '999px',
        border: '1px solid rgba(246, 241, 232, 0.16)',
        background: 'rgba(246, 241, 232, 0.035)',
        color: 'var(--foreground)',
        textDecoration: 'none',
        fontFamily: 'var(--font-mono-stack)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }}
    >
      {isFrench ? 'EN' : 'FR'}
    </Link>
  );
}
