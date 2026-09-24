# moles.cheminfo.org

Balance a chemical reaction, and work out the mass composition of a compound in
percent and in grams — each with a calculator and a graded series of questions.

| Page       | Address       | What it does                                                    |
| ---------- | ------------- | --------------------------------------------------------------- |
| Balance    | `/`           | The smallest whole coefficients, every element counted per side |
| Mass %     | `/percent`    | The molar mass and each element's share of it                   |
| Mass in g  | `/grams`      | The mass of each element in a sample                            |
| Cheatsheet | `/cheatsheet` | The rules on one printable page                                 |
| About      | `/about`      | What the site is, what it is built on, how to cite it           |

A tool page carries `?seed=`, the series of questions on screen: the address
bar is always the link that reopens the same questions. `?count=` sets the
length of a series, `?embed` frames the page in a course, and `?hide=` switches
parts off (`playground`, `exercises`, `solutions`, `tabs`).

## Shape of the site

The family's pedagogic tools ship Tutorial · Playground · Exercises ·
Cheatsheet for a site that is one tool. This site holds three, so the shape is
applied per tool: every tool page opens on its calculator (the playground) and
follows it with its graded series (the exercises), and the site ends on one
cheatsheet.

## Development

```sh
npm install
npm run dev        # http://localhost:10921
npm run test       # unit tests, types, tokens, deployment contract, lint, format
npm run test-e2e   # Playwright
npm run build
```

## Content and languages

Every answer is computed, never stored: reactions are balanced exactly over
rational numbers (`src/chemistry/balance.ts`), and the mass composition uses the
standard atomic masses of mass-tools (`src/chemistry/composition.ts`). The
grading, hints and solutions of each tool are in `src/tools/`.

The pools are language-free (`src/data/*.ts`); the names a question shows are
per locale, in `src/data/locales/en.ts` and `src/data/locales/fr.ts`. Only
English is rendered today. `data/source/` holds the datasets as they were first
written, in French.

## Deployment

```sh
cp .env.example .env    # uncomment one COMPOSE_FILE line
docker compose up -d
```

The server's global `deploy.sh` pulls, tags and health-checks the image
(`/health`). `TRACKING_SCRIPT` in `.env` injects the analytics snippet into
every page at container start; unset, nothing is loaded.

## License

MIT
