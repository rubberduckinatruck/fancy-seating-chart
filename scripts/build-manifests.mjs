// Scans public/students/{p1,p3,p4,p5,p6} for images and writes public/manifests/*.json
// Adjust the PERIODS array or folders to your needs.

import { readdir, stat, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PERIODS = ['p1','p3','p4','p5','p6']
const ROOT = 'public/students'
const OUT = 'public/manifests'
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function toTitleCase(s) {
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

async function ensureDir(p) {
  try { await stat(p) } catch { await import('node:fs/promises').then(fs => fs.mkdir(p, { recursive: true })) }
}

async function buildForPeriod(period) {
  const dir = join(ROOT, period)
  let files
  try {
    files = await readdir(dir)
  } catch {
    return []
  }
  const entries = []
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (!IMAGE_EXTS.has(ext)) continue
    const id = f.replace(ext, '')
    const name = toTitleCase(id)
    // Public assets are served under /fancy-seating-chart/ in Pages
    const photo = `/fancy-seating-chart/students/${period}/${encodeURIComponent(f)}`
    entries.push({ id, name, photo })
  }
  await ensureDir(OUT)
  await writeFile(join(OUT, `${period}.json`), JSON.stringify(entries, null, 2))
  return entries
}

async function main() {
  await ensureDir(OUT)
  const results = {}
  for (const p of PERIODS) {
    results[p] = await buildForPeriod(p)
  }
  await writeFile(join(OUT, `index.json`), JSON.stringify({ periods: PERIODS }, null, 2))
  console.log('Manifests built:', Object.fromEntries(Object.entries(results).map(([k,v]) => [k, v.length])))
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
