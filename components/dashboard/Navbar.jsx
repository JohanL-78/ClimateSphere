'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';

export default function Navbar({ onMenuToggle, isMenuOpen, locale = 'en' }) {
  const homeHref = `/${locale}`;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 48px',
      background: 'linear-gradient(to bottom, rgba(11, 15, 16, 0.9), transparent)',
      backdropFilter: 'blur(8px)',
    }} className="dashboard-navbar">

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Menu toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuToggle}
          style={{
            background: 'rgba(246, 241, 232, 0.04)',
            border: '1px solid rgba(246, 241, 232, 0.16)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'var(--foreground)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>

        {/* Logo */}
        <Link href={homeHref} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          fontFamily: 'var(--font-mono-stack)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
          <span style={{
            display: 'grid',
            placeItems: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(246, 241, 232, 0.16)',
            background: 'rgba(246, 241, 232, 0.04)',
          }}>
            <Globe size={18} color="var(--accent-soft)" />
          </span>
          <span className="dashboard-nav-title" style={{ color: 'var(--foreground-muted)' }}>
            <span style={{ color: 'var(--foreground)' }}>Climate</span> Sphere
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="dashboard-nav-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono-stack)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(246, 241, 232, 0.45)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            boxShadow: '0 0 12px rgba(77, 142, 146, 0.5)',
          }} />
          NASA GISTEMP · 1880–2026
        </div>
        <LanguageToggle locale={locale} />
      </div>
    </nav>
  );
}
