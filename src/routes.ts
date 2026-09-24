/**
 * Every address this site answers, each with the name and the sentence it is
 * indexed under.
 *
 * One table, read by four things that must agree on it: the router, which turns
 * an address into a page; the build, which writes one real HTML file per entry
 * plus the sitemap listing them; the `noscript` crawl path; and the running
 * app, which retitles the tab after an in-app move. Pure data, so the vite
 * config can import it.
 */

import type { RouteMeta } from 'react-cheminfo/core';

/** The site, as the header, the prerender and the share dialog name it. */
export const SITE_ID = 'moles';

/** What the site is called in prose, spelled as the address it is. */
export const SITE_NAME = 'moles.cheminfo.org';

/** Where the site is served, and what every canonical address is built on. */
export const SITE_URL = 'https://moles.cheminfo.org';

/** Where the sources live. */
export const REPOSITORY = 'https://github.com/cheminfo/moles.cheminfo.org';

/** The pages, named as the router and the state name them. */
export type TabId = 'balance' | 'percent' | 'grams' | 'cheatsheet' | 'about';

/** A tool page, as opposed to the cheatsheet and the About. */
export type ToolTab = Exclude<TabId, 'cheatsheet' | 'about'>;

/** A routed page: what a crawler is told about it, and what the bar writes. */
export interface RouteDefinition extends RouteMeta {
  /** The page this address opens. */
  tab: TabId;
  /** How the page is named in the header bar. */
  label: string;
}

/**
 * The pages, in the order the bar lists them. The first is the home page, and
 * is what an address the site does not know opens.
 */
const ROUTE_TABLE = [
  {
    path: '/',
    tab: 'balance',
    label: 'Balance',
    title: 'Balance a chemical reaction',
    short: 'Balance',
    note: 'the smallest whole coefficients',
    description:
      'Balance any chemical reaction with the smallest whole coefficients, the atoms of every element counted on each side, and practise on graded reactions.',
  },
  {
    path: '/percent',
    tab: 'percent',
    label: 'Mass %',
    title: 'Mass percent composition of a compound',
    short: 'Mass %',
    note: 'each element’s share of the molar mass',
    description:
      'Work out the mass percent of every element of a compound from its formula: the molar mass, the mass each element brings, and graded questions.',
  },
  {
    path: '/grams',
    tab: 'grams',
    label: 'Mass in g',
    title: 'Mass of each element in a sample',
    short: 'Mass in g',
    note: 'the mass percent times the sample',
    description:
      'Work out how many grams of each element a sample of a compound holds, from its formula and the mass of the sample, with graded questions.',
  },
  {
    path: '/cheatsheet',
    tab: 'cheatsheet',
    label: 'Cheatsheet',
    title: 'Balancing, molar mass and mass composition',
    short: 'Cheatsheet',
    note: 'the rules on one printable page',
    description:
      'The rules these tools apply on one printable page: balancing a reaction, the mole and the molar mass, the mass percent and the mass in a sample.',
  },
  {
    path: '/about',
    tab: 'about',
    label: 'About',
    title: 'About',
    short: 'About',
    note: 'what it is built on, and how to cite it',
    description:
      'What moles.cheminfo.org is, who provides it, where its atomic masses come from, what it is built on, and how to cite it in a course or a paper.',
  },
] as const satisfies readonly RouteDefinition[];

/** Every address the site answers. */
export const ROUTES: readonly RouteDefinition[] = ROUTE_TABLE;

/** The tools, in the order the bar lists them. */
export const TOOL_TABS: readonly ToolTab[] = ['balance', 'percent', 'grams'];

/** The page an address the site does not know opens. */
export const HOME_TAB: TabId = 'balance';

/**
 * The route of a tab.
 * @param tab - The tab being asked about.
 * @returns Its route, which is the home page for a tab the table does not name.
 */
export function routeForTab(tab: TabId): RouteDefinition {
  for (const route of ROUTES) {
    if (route.tab === tab) return route;
  }
  return ROUTE_TABLE[0];
}

/**
 * Whether a tab is one of the tools.
 * @param tab - The tab being asked about.
 * @returns True for the three tools.
 */
export function isToolTab(tab: TabId): tab is ToolTab {
  return (TOOL_TABS as readonly string[]).includes(tab);
}
