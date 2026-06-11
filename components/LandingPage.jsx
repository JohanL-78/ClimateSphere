'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe } from 'lucide-react';
import LazyShowcaseGlobe from './LazyShowcaseGlobe';
import LanguageToggle from './LanguageToggle';
import { getTranslations } from '@/lib/i18n';

export default function LandingPage({ year, month, locale = 'en' }) {
  const t = getTranslations(locale);
  const dashboardHref = `/${locale}/dashboard`;
  const homeHref = `/${locale}`;

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ─── Background layers ─── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 76% 42%, rgba(47,111,115,0.28), transparent 38%), radial-gradient(circle at 64% 68%, rgba(77,142,146,0.14), transparent 30%), linear-gradient(115deg, #0B0F10 0%, #11110F 44%, #111817 68%, #0B0F10 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,12,13,0.72) 0%, rgba(11,15,16,0.42) 28%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(246,241,232,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.022) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.55,
        }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '160px', background: 'linear-gradient(to bottom, #11110F, transparent)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '192px', background: 'linear-gradient(to top, #11110F, transparent)' }} />
      </div>

      {/* ─── Navbar ─── */}
      <header className="landing-nav">
        <Link href={homeHref} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', fontFamily: 'var(--font-mono-stack)',
          fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>
          <span style={{
            display: 'grid', placeItems: 'center', width: '36px', height: '36px',
            borderRadius: '50%', border: '1px solid rgba(246,241,232,0.16)',
            background: 'rgba(246,241,232,0.04)',
          }}>
            <Globe size={18} color="var(--accent-soft)" />
          </span>
          <span style={{ color: 'var(--foreground-muted)' }}>
            <span style={{ color: 'var(--foreground)' }}>Climate</span> Sphere
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="landing-nav-badge" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--font-mono-stack)', fontSize: '10px',
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: 'rgba(246,241,232,0.45)',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--accent-soft)',
              boxShadow: '0 0 12px rgba(77,142,146,0.5)',
            }} />
            NASA GISTEMP · 1880–2026
          </span>
          <LanguageToggle locale={locale} />
          <Link href={dashboardHref} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', borderRadius: '999px',
            border: '1px solid rgba(246,241,232,0.16)', background: 'transparent',
            color: 'var(--foreground)', fontFamily: 'var(--font-mono-stack)',
            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em',
            textDecoration: 'none', transition: 'all 0.3s ease',
          }}>
            {t.nav.dashboard}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      {/* ─── Globe (desktop) — absolute right like test25graphite ─── */}
      <div className="landing-globe-desktop">
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', left: '36%', top: '25%',
          width: '7rem', height: '7rem', borderRadius: '50%',
          border: '1px solid rgba(246,241,232,0.18)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '31%', top: '20%',
          width: '11rem', height: '11rem', borderRadius: '50%',
          border: '1px solid rgba(47,111,115,0.35)',
          pointerEvents: 'none',
        }} />
        {/* Decorative line */}
        <div style={{
          position: 'absolute', left: '20%', top: '43%',
          width: '13rem', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(246,241,232,0.4), rgba(47,111,115,0.45))',
          pointerEvents: 'none',
        }} />
        {/* Globe */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.95 }}>
          <LazyShowcaseGlobe year={year} month={month} />
        </div>
      </div>

      {/* ─── Globe (mobile) — background ─── */}
      <div className="landing-globe-mobile">
        <LazyShowcaseGlobe year={year} month={month} />
      </div>

      {/* ─── Stats (bottom-right, desktop only) ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="landing-stats"
      >
        {t.landing.stats.map((stat) => (
          <div key={stat.label} style={{
            padding: '12px 14px',
            background: 'rgba(8,12,13,0.88)',
            backdropFilter: 'blur(8px)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono-stack)', fontSize: '9px',
              textTransform: 'uppercase', letterSpacing: '0.22em',
              color: 'var(--foreground-muted)', margin: 0,
            }}>{stat.label}</p>
            <p style={{
              fontFamily: 'var(--font-display-stack)', fontSize: '24px',
              fontWeight: 600, letterSpacing: '-0.04em',
              color: 'var(--foreground)', margin: '8px 0 0',
            }}>{stat.value}</p>
            <p style={{
              fontFamily: 'var(--font-mono-stack)', fontSize: '9px',
              textTransform: 'uppercase', letterSpacing: '0.16em',
              color: 'rgba(246,241,232,0.5)', margin: '4px 0 0',
            }}>{stat.detail}</p>
          </div>
        ))}
      </motion.div>

      {/* ─── Text content (left side) ─── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
        minHeight: '100vh',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          justifyContent: 'center', width: '100%', maxWidth: '72rem',
        }} className="landing-content-wrapper">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-mono-stack)', fontSize: '11px',
              fontWeight: 500, textTransform: 'uppercase',
              letterSpacing: '0.3em', color: 'var(--foreground-muted)', margin: 0,
            }}
          >
            <span style={{ color: 'var(--foreground)' }}>{t.landing.eyebrowA}</span>
            {' — '}
            <span style={{ color: 'var(--accent)' }}>{t.landing.eyebrowB}</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="landing-title"
            style={{
              fontFamily: 'var(--font-display-stack)', fontWeight: 600,
              lineHeight: 0.92, letterSpacing: '-0.035em',
              color: 'var(--foreground)', margin: 0, marginTop: '24px',
              maxWidth: '40rem',
            }}
          >
            {t.landing.titleLine1}<br />
            {t.landing.titleLine2}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ marginTop: '48px', maxWidth: '20rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-mono-stack)', fontSize: '0.875rem',
              lineHeight: 1.7, color: 'rgba(246,241,232,0.72)', margin: 0,
            }}>
              {t.landing.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}
          >
            <Link href={dashboardHref} style={{
              display: 'inline-flex', alignItems: 'center',
              borderRadius: '999px', background: 'var(--foreground)',
              padding: '14px 28px', fontSize: '0.95rem', fontWeight: 600,
              color: '#11110F', textDecoration: 'none', transition: 'background 0.5s',
            }}>
              {t.landing.primaryCta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
