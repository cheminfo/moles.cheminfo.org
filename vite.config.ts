import react from '@vitejs/plugin-react';
import { cheminfoBuildInfo, cheminfoPrerender } from 'react-cheminfo/vite';
import { defineConfig } from 'vite';

import { ROUTES, SITE_ID, SITE_URL } from './src/routes.ts';

/**
 * The port this project owns, derived from a date by rules/backend.md: its
 * creation date, 2026-09-18, gives 10918, which atoms.cheminfo.org holds, so
 * the next free date, 2026-09-20, gives 6·09·20 = 60920, over 60000, less
 * 50000. Docker publishes it; the Vite dev server takes the next number,
 * claimed strictly, so two cheminfo checkouts never answer for each other.
 */
const port = Number(process.env.PORT ?? 10_920);

export default defineConfig({
  // The build carries no mount path. Every asset is written relative, so the
  // one `dist` serves this site's own host and a path of a shared one without
  // being rebuilt: the `<base>` the page carries is what resolves them.
  base: './',
  plugins: [
    react(),
    cheminfoBuildInfo(),
    // One real HTML file per routed address, each with its own title,
    // description and canonical, plus the sitemap and robots.txt. A static
    // image has nothing to rewrite a head per request.
    cheminfoPrerender({
      site: SITE_ID,
      routes: ROUTES,
      origin: SITE_URL,
      description:
        'Balance a chemical reaction, and work out the mass composition of a compound in percent and in grams, with graded questions.',
      operatingSystem: 'Any modern browser',
      noscript: {
        hrefs: 'relative',
        heading: 'moles.cheminfo.org — balancing and mass composition',
        intro:
          'Balance a reaction, and work out the mass composition of a compound in percent and in grams, each with a calculator and a graded series of questions. The tools need JavaScript, because the chemistry runs in your browser.',
        routes: ROUTES,
        ecosystem: { taglines: false },
      },
    }),
  ],
  resolve: {
    // One copy of each, even when a dependency is linked from a checkout: two
    // copies of React make hooks read a dispatcher the renderer never filled.
    dedupe: ['react', 'react-dom', '@blueprintjs/core'],
  },
  server: { port: port + 1, strictPort: true },
  preview: { port: port + 1, strictPort: true },
  build: {
    // The isotope tables of mass-tools and Blueprint's icons fill one chunk.
    chunkSizeWarningLimit: 2048,
  },
});
