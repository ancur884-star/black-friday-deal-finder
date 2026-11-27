// DealHunt's hand-in program (Node 22, standard library only): the site is this
// directory's app/ folder — plain static files a browser opens at app/index.html
// (ES modules, CSS, no build step) — and screenshots/ holds four renders of it
// running. The program copies both to /output and writes /output/dossier.json,
// the summary the scorer reads (the screenshots, the first load's files and bytes,
// and the site's source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte
// for byte what its own copy writes.
//
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const shots = readdirSync(join(here, 'screenshots')).filter((name) => !name.startsWith('.'));
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files and directories in app/ or 16 MiB of app files).
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// Read the dossier back: it must parse, and the run reports what it handed in.
const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
const appFiles = readdirSync(join(out, 'app'));
console.log(
  `handed in ${appFiles.length} app entries and ${shots.length} screenshots; ` +
  `dossier.json is ${statSync(dossierPath).size} bytes ` +
  `(${Object.keys(dossier).length} top-level keys)`,
);
