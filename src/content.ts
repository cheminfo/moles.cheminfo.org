/**
 * What each address says in the HTML the server hands out, above the crawl path.
 *
 * All 5 addresses used to ship the same body — this site's menu — so a crawler
 * was handed one text for every page and told, by the title alone, that they
 * were different pages. Read by the build and by nothing else: `vite.config.ts`
 * calls it once per route, so none of this reaches the bundle a browser
 * downloads.
 *
 * A page with nothing written for it falls back to the name and the sentence it
 * is already indexed under. That repeats the snippet rather than adding to it,
 * which is thin — but the route table writes those distinctly per page, so a
 * thin page is never a duplicate of its neighbour.
 */

import type { PageContent, RouteMeta } from 'react-cheminfo/core';

/** The pages written for in their own words. */
const PAGES: Record<string, PageContent> = {
  '/': {
    heading: 'Balance a chemical reaction',
    paragraphs: [
      'Write an unbalanced equation and read the coefficients back. The balancing is solved exactly rather than guessed, so a reaction that cannot be balanced is told so instead of being given wrong numbers.',
      'From the balanced equation the other tools follow: the molar mass of each species, the mass percent of every element, and the mass of each element in a sample you weigh out.',
    ],
  },
};

/**
 * What one address says for itself.
 *
 * Read by `cheminfoPrerender` once per route at build time.
 * @param route - The address being written.
 * @returns Its text, authored where there is any and otherwise the name and
 * sentence the route already carries.
 */
export function pageContent(route: RouteMeta): PageContent {
  return (
    PAGES[route.path] ?? {
      heading: route.title,
      paragraphs: [route.description],
    }
  );
}
