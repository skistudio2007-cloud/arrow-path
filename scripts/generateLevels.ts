import { getLevelById } from '../src/utils/levels';
import fs from 'fs';
import path from 'path';

const TOTAL_PREGEN = 150; // Pre-generate 150 levels offline for instant 0ms CPU load
console.log(`Starting pre-generation of ${TOTAL_PREGEN} levels...`);

const dataDir = path.resolve('src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const levels: Record<number, any> = {};

const startTime = Date.now();
for (let id = 1; id <= TOTAL_PREGEN; id++) {
  const t0 = Date.now();
  const lvl = getLevelById(id);
  levels[id] = {
    id: lvl.id,
    rows: lvl.rows,
    cols: lvl.cols,
    difficulty: lvl.difficulty,
    arrows: lvl.arrows.map((a) => ({
      id: a.id,
      dir: a.dir,
      points: a.points,
      shape: a.shape,
    })),
  };
  const elapsed = Date.now() - t0;
  if (id % 10 === 0 || id === 1 || id === TOTAL_PREGEN) {
    console.log(`[Level ${id}/${TOTAL_PREGEN}] Generated in ${elapsed}ms (Arrows: ${lvl.arrows.length})`);
  }
}

const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
const outFile = path.join(dataDir, 'pregeneratedLevels.json');
fs.writeFileSync(outFile, JSON.stringify(levels));

const fileSizeKB = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log(` Successfully pre-generated ${TOTAL_PREGEN} levels in ${totalTime}s! File size: ${fileSizeKB} KB`);
