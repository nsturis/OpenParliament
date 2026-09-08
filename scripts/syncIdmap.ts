/**
 * Nightly idmap sync. idmap (our id -> Folketinget tingdok id) is not in the ODA API; it only
 * exists in Folketinget's nightly MSSQL backup. Download it, restore into the MSSQLDB container,
 * copy every idmap row into Postgres (existing rows are kept), stop the container again.
 *
 * Usage: bun scripts/syncIdmap.ts        (~745 MB download, ~5 min)
 */
import { $ } from 'bun'
import mssql from 'mssql'
import pkg from 'pg'

const { Pool } = pkg
const pg = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'oda',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
})

// 1. Download (curl -z: only if newer than the local copy). Same public creds as config/download_oda_bak.py.
await $`curl -sf -z oda.bak -o oda.bak -u ODAwebpublish:b56ff26a-c19b-4322-a3c4-614de155781d https://oda.ft.dk/odapublish/oda.bak`
console.log('oda.bak', (await Bun.file('oda.bak').size / 1e6).toFixed(0), 'MB')

// 2. Start MSSQL and connect
await $`docker compose up -d MSSQLDB`.quiet()
const cfg = { server: 'localhost', user: 'sa', password: process.env.MS_DB_PASSWORD!, options: { trustServerCertificate: true }, requestTimeout: 30 * 60_000 }
let ms: mssql.ConnectionPool | undefined
for (let i = 0; i < 30 && !ms; i++) ms = await mssql.connect(cfg).catch(() => new Promise<undefined>((r) => setTimeout(() => r(undefined), 3000)))
if (!ms) throw new Error('MSSQL did not come up')

// 3. Restore (logical file names come from the backup itself)
const files = (await ms.query(`RESTORE FILELISTONLY FROM DISK = '/var/opt/mssql/backup/oda.bak'`)).recordset as { LogicalName: string; Type: string }[]
const moves = files.map((f) => `MOVE '${f.LogicalName}' TO '/var/opt/mssql/data/${f.LogicalName}.${f.Type === 'L' ? 'ldf' : 'mdf'}'`).join(', ')
console.log('restoring…')
await ms.query(`RESTORE DATABASE ODA FROM DISK = '/var/opt/mssql/backup/oda.bak' WITH REPLACE, ${moves}`)

// 4. Copy idmap in pages; keep rows we already have
const total = (await ms.query('SELECT COUNT(*) AS n FROM ODA.dbo.idmap')).recordset[0].n
let inserted = 0
const PAGE = 20_000 // 3 params per row; Postgres caps a statement at 65,535 bind params
for (let offset = 0; offset < total; offset += PAGE) {
  const rows = (await ms.query(`SELECT id, originalid, entity FROM ODA.dbo.idmap ORDER BY entity, id OFFSET ${offset} ROWS FETCH NEXT ${PAGE} ROWS ONLY`)).recordset
  const values = rows.flatMap((r) => [r.id, String(r.originalid), r.entity])
  const tuples = rows.map((_, i) => `($${i * 3 + 1},$${i * 3 + 2},$${i * 3 + 3})`).join(',')
  const res = await pg.query(`INSERT INTO idmap (id, originalid, entity) VALUES ${tuples} ON CONFLICT DO NOTHING`, values)
  inserted += res.rowCount ?? 0
}
console.log(`idmap: ${total} rows in backup, ${inserted} new rows inserted`)

await ms.close()
await pg.end()
await $`docker compose stop MSSQLDB`.quiet()
