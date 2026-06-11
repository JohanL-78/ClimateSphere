import https from 'https';

export async function GET() {
  try {
    const data = await new Promise((resolve, reject) => {
      const url = 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv';

      https.get(url, (res) => {
        let csvData = '';

        res.on('data', (chunk) => {
          csvData += chunk;
        });

        res.on('end', () => {
          // Nettoyer les données
          const cleanedData = csvData.replace(/\*\*\*/g, '');

          // Parser le CSV
          const lines = cleanedData.trim().split('\n');
          const header = lines[0].split(',').map(cell => cell.trim());
          const rows = lines.slice(1).map(line =>
            line.split(',').map(cell => cell.trim())
          );

          resolve({ header, rows });
        });
      }).on('error', reject);
    });

    return Response.json(data);
  } catch (error) {
    console.error('Erreur API NASA:', error);
    return Response.json(
      { error: 'Impossible de récupérer les données NASA' },
      { status: 500 }
    );
  }
}