'use client';

import { useState, useEffect } from 'react';

const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 0,
      height: 0
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
    height
  };
};

/**
 * Hook centralisé pour gérer la responsivité
 * Remplace les multiples hooks useIsMobile dupliqués
 * 
 * @returns {Object} Objet contenant les états de responsivité
 * @returns {boolean} isMobile - true si largeur < 768px
 * @returns {boolean} isTablet - true si largeur entre 768px et 1024px  
 * @returns {boolean} isDesktop - true si largeur >= 1024px
 * @returns {number} width - Largeur actuelle de la fenêtre
 * @returns {number} height - Hauteur actuelle de la fenêtre
 */
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint);

  useEffect(() => {
    const updateBreakpoint = () => {
      const newBreakpoint = getCurrentBreakpoint();

      // Optimisation : ne mettre à jour que si les valeurs ont changé
      setBreakpoint(prev => {
        if (
          prev.isMobile === newBreakpoint.isMobile && 
          prev.isTablet === newBreakpoint.isTablet && 
          prev.isDesktop === newBreakpoint.isDesktop &&
          prev.width === newBreakpoint.width &&
          prev.height === newBreakpoint.height
        ) {
          return prev;
        }
        return newBreakpoint;
      });
    };

    // Débounce pour éviter trop d'appels lors du redimensionnement
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 100);
    };

    // Initialisation
    updateBreakpoint();
    
    // Event listener avec débounce
    window.addEventListener('resize', debouncedUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return breakpoint;
};

/**
 * Hook simplifié pour compatibilité avec l'ancien useIsMobile
 * @returns {boolean} true si mobile (largeur < 768px)
 */
export const useIsMobile = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

/**
 * Hook pour vérifier si on est sur tablette
 * @returns {boolean} true si tablette (768px <= largeur < 1024px)
 */
export const useIsTablet = () => {
  const { isTablet } = useResponsive();
  return isTablet;
};

/**
 * Hook pour vérifier si on est sur desktop
 * @returns {boolean} true si desktop (largeur >= 1024px)
 */
export const useIsDesktop = () => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};

/**
 * Hook pour obtenir les dimensions de la fenêtre
 * @returns {Object} { width, height }
 */
export const useWindowSize = () => {
  const { width, height } = useResponsive();
  return { width, height };
};

export default useResponsive;
