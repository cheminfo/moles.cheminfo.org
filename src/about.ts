/**
 * What this site says about itself: the record the shared About page is drawn
 * from. The prose limits are checked by `aboutProblems` in the test suite, so
 * this file never grows into a page nobody reads.
 */

import { BUILD_INFO } from 'react-cheminfo/build-info';
import type { AboutContent } from 'react-cheminfo/core';
import { PLATFORM_WORK, TEACHING_WORK } from 'react-cheminfo/core';

/** The About record of moles.cheminfo.org. */
export const ABOUT: AboutContent = {
  siteId: 'moles',
  // Which release, built when, from which commit: the build says so.
  build: BUILD_INFO,
  what: 'Balance a chemical reaction, and work out the mass composition of a compound in percent and in grams.',
  can: [
    'Balance any reaction with the smallest whole coefficients, ions included.',
    'See every element counted on each side of a reaction.',
    'Work out the molar mass and the mass percent of every element of a compound.',
    'Work out how many grams of each element a sample holds.',
    'Practise on graded questions, with hints from a nudge to nearly the answer.',
    'Hand out a series of questions as a link, or frame it in a course page.',
  ],
  paragraphs: [
    'Reactions are balanced exactly: the element counts are solved over whole fractions, never floating-point numbers, so a coefficient is never off by a rounding error. The mass composition uses the standard atomic masses of mass-tools.',
    'A series of questions is drawn from its seed, and the seed is in the address, so the link on screen reopens the same questions for anyone: a teacher hands one series to a whole class.',
  ],
  people: [{ name: 'Luc Patiny' }],
  providedBy: ['epfl'],
  credits: [
    'mass-tools',
    'react-mf',
    'ml-xsadd',
    'react-cheminfo',
    'blueprint',
    'preact-signals',
    'react',
    'vite',
  ],
  cite: [PLATFORM_WORK, TEACHING_WORK],
};
