/**
 * Incremental sync from the ODA API (oda.ft.dk) into Postgres.
 * Watermark per table = MAX(opdateringsdato); rows newer than that are upserted page by page.
 * ODA JSON keys equal our column names, so the same loop serves every entity.
 *
 * Usage: bun scripts/syncFromODA.ts [Entity ...]   (default: all entities below, parents first)
 */
import pkg from 'pg'

const { Pool } = pkg
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'oda',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
})

const ENTITIES = [
  // lookup tables (a few rows each, change a few times a year)
  'Aktørtype', 'AktørAktørRolle', 'Afstemningstype', 'Dokumentkategori', 'Dokumentstatus', 'Dokumenttype',
  'Emneordstype', 'Mødestatus', 'Mødetype', 'SagAktørRolle', 'SagstrinAktørRolle', 'DokumentAktørRolle',
  'SagDokumentRolle', 'Sagskategori', 'Sagsstatus', 'Sagstrinsstatus', 'Sagstrinstype', 'Sagstype', 'Stemmetype',
  'EntitetBeskrivelse', 'KolloneBeskrivelse',
  // data tables, parents first
  'Periode', 'Aktør', 'AktørAktør', 'Møde', 'MødeAktør',
  'Sag', 'Sagstrin', 'Dokument', 'Fil',
  'SagDokument', 'SagAktør', 'DokumentAktør', 'SagstrinAktør', 'SagstrinDokument',
  'Afstemning', 'Stemme',
  'Dagsordenspunkt', 'DagsordenspunktSag', 'DagsordenspunktDokument',
  'Emneord', 'EmneordSag', 'EmneordDokument', 'Sambehandlinger', 'Omtryk',
]
// pgloader kept mixed case only for names containing Aktør/Møde; the rest are lowercase
const tableFor = (entity: string) => (/Aktør|Møde/.test(entity) ? entity : entity.toLowerCase())

async function fetchJson(url: string) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url)
    if (res.ok) return res.json()
    if (attempt === 3) throw new Error(`HTTP ${res.status} for ${url}`)
    await new Promise((r) => setTimeout(r, 2000 * attempt))
  }
}

async function upsertPage(table: string, rows: Record<string, unknown>[]) {
  const cols = Object.keys(rows[0])
  const values = rows.flatMap((r) => cols.map((c) => r[c]))
  const tuples = rows
    .map((_, i) => `(${cols.map((_, j) => `$${i * cols.length + j + 1}`).join(',')})`)
    .join(',')
  const set = cols.filter((c) => c !== 'id').map((c) => `"${c}" = EXCLUDED."${c}"`).join(', ')
  await pool.query(
    `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(',')}) VALUES ${tuples}
     ON CONFLICT ("id") DO UPDATE SET ${set}`,
    values,
  )
}

async function syncEntity(entity: string) {
  const table = tableFor(entity)
  const t0 = Date.now()
  const { rows: [{ max }] } = await pool.query(`SELECT MAX(opdateringsdato) AS max FROM "${table}"`)
  // DB stores ODA's naive Danish local time labelled UTC; send it back unchanged, without the Z
  const since = (max ?? new Date(0)).toISOString().slice(0, -1)
  const params = new URLSearchParams({
    $filter: `opdateringsdato gt datetime'${since}'`,
    $orderby: 'opdateringsdato asc',
  }) // no $top: the server pages at 100 and only emits odata.nextLink when $top is absent or > 100
  let url: string | null = `https://oda.ft.dk/api/${encodeURIComponent(entity)}?${params}`
  let rows = 0
  let pages = 0
  while (url) {
    const data = await fetchJson(url)
    if (data.value.length) await upsertPage(table, data.value)
    rows += data.value.length
    pages++
    url = data['odata.nextLink'] ?? null
  }
  console.log(`${entity.padEnd(24)} since ${since}  rows=${rows} pages=${pages} ${((Date.now() - t0) / 1000).toFixed(1)}s`)
}

const requested = process.argv.slice(2)
for (const entity of requested.length ? requested : ENTITIES) await syncEntity(entity)
await pool.end()
