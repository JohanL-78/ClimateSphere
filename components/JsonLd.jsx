import { getJsonLd } from '@/lib/seo';

export default function JsonLd({ locale = 'en', path = '/' }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd(locale, path)) }}
    />
  );
}
