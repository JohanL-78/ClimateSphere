'use server';

import { getAnnualTemperatureArchiveStatsForYear, getTemperatureArchiveStatsForDate, getOniIndex } from './data';

export async function getTemperatureDataAction(year, month, displayMode = 'monthly') {
  try {
    if (displayMode === 'annual') {
      const [globalStats, northStats, southStats] = await Promise.all([
        getAnnualTemperatureArchiveStatsForYear(year, 'global'),
        getAnnualTemperatureArchiveStatsForYear(year, 'north'),
        getAnnualTemperatureArchiveStatsForYear(year, 'south')
      ]);

      const result = {
        mode: 'annual',
        temperature: globalStats.value,
        global: globalStats.value,
        north: northStats.value,
        south: southStats.value,
        oni: null,
        ranks: {
          global: globalStats.ranks,
          north: northStats.ranks,
          south: southStats.ranks
        }
      };

      console.log('🌡️ Résultat température annuelle :', result);
      return result;
    }

    // Récupération des 3 températures, des rangs d'archive et de l'ONI en parallèle
    const [globalStats, northStats, southStats, oni] = await Promise.all([
      getTemperatureArchiveStatsForDate(year, month, 'global'),
      getTemperatureArchiveStatsForDate(year, month, 'north'),
      getTemperatureArchiveStatsForDate(year, month, 'south'),
      getOniIndex(year, month)
    ]);

    const result = {
      mode: 'monthly',
      temperature: globalStats.value, // rétrocompatibilité
      global: globalStats.value,
      north: northStats.value,
      south: southStats.value,
      oni,
      ranks: {
        global: globalStats.ranks,
        north: northStats.ranks,
        south: southStats.ranks
      }
    };

    console.log('🌡️ Résultat température période A :', result);
    return result;

  } catch (error) {
    console.error(`Erreur dans la Server Action getTemperatureDataAction: ${error.message}`);
    return { 
      error: 'Impossible de récupérer les températures.',
      mode: displayMode,
      temperature: null,
      global: null,
      north: null,
      south: null,
      oni: null,
      ranks: {}
    };
  }
}
