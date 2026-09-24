# Source datasets

The pools as they were first written, in French, kept so the site can be
translated back without losing a name. The site reads the language-free
skeleton in `src/data/*.ts` and the names in `src/data/locales/`.

| File                | Holds                                              |
| ------------------- | -------------------------------------------------- |
| `reactions.json`    | 55 reactions, as `reactifs` and `produits` strings |
| `mass-percent.json` | 63 compounds and their names                       |
| `mass-grams.json`   | 7 compounds and the mass of each sample            |

What the site reads differs from these files in a few places, each on purpose:

- two reactions listed twice appear once, which leaves 53;
- the undecyl radical `C11H23` is written as undecane, `C11H24`;
- `SiO2` is listed twice (as quartz and as silicon oxide) and appears once;
- `K2O2` is potassium **peroxide**; the file calls it _superoxyde_, which is
  `KO2`. The French locale names it _peroxyde de potassium_;
- the typos _Bichormate_ and _détartramt_ are corrected in the French locale;
- leading and trailing spaces are trimmed, and `MgSO4 H2O` is written
  `MgSO4.H2O`.
