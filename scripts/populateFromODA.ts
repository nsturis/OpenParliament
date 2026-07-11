/**
 * Populate the PostgreSQL database from the ODA (Folketingets Åbne Data) API.
 * This fetches all lookup tables and core entities needed for the meeting parser.
 *
 * Usage: bun run scripts/populateFromODA.ts
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

const ODA_BASE = 'https://oda.ft.dk/api'

interface ODataResponse<T> {
  'odata.metadata': string
  'odata.nextLink'?: string
  value: T[]
}

async function fetchAll<T>(endpoint: string, filter?: string): Promise<T[]> {
  const all: T[] = []
  const params = new URLSearchParams()
  if (filter) params.set('$filter', filter)

  let url: string | null = `${ODA_BASE}/${endpoint}?${params.toString()}`
  let page = 0

  while (url) {
    page++
    console.log(`  Fetching ${endpoint} page ${page} (${all.length} so far)...`)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }

    const data: ODataResponse<T> = await response.json()
    all.push(...data.value)

    url = data['odata.nextLink'] || null
  }

  return all
}

async function upsertRows(
  tableName: string,
  rows: Record<string, unknown>[],
  conflictColumn = 'id',
) {
  if (rows.length === 0) {
    console.log(`  No rows to insert for ${tableName}`)
    return
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const row of rows) {
      const columns = Object.keys(row)
      const values = Object.values(row)
      const placeholders = columns.map((_, i) => `$${i + 1}`)
      const updateSet = columns
        .filter((c) => c !== conflictColumn)
        .map((c, i) => {
          const idx = columns.indexOf(c)
          return `"${c}" = $${idx + 1}`
        })
        .join(', ')

      const quotedCols = columns.map((c) => `"${c}"`).join(', ')

      let sql: string
      if (updateSet) {
        sql = `INSERT INTO "${tableName}" (${quotedCols}) VALUES (${placeholders.join(', ')})
               ON CONFLICT ("${conflictColumn}") DO UPDATE SET ${updateSet}`
      } else {
        sql = `INSERT INTO "${tableName}" (${quotedCols}) VALUES (${placeholders.join(', ')})
               ON CONFLICT ("${conflictColumn}") DO NOTHING`
      }

      await client.query(sql, values)
    }

    await client.query('COMMIT')
    console.log(`  Inserted/updated ${rows.length} rows in ${tableName}`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Batch upsert for large datasets
async function upsertRowsBatch(
  tableName: string,
  rows: Record<string, unknown>[],
  conflictColumn = 'id',
  batchSize = 500,
) {
  if (rows.length === 0) {
    console.log(`  No rows to insert for ${tableName}`)
    return
  }

  let inserted = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    await upsertRows(tableName, batch, conflictColumn)
    inserted += batch.length
    if (rows.length > batchSize) {
      console.log(`  Progress: ${inserted}/${rows.length}`)
    }
  }
}

// --- Lookup tables ---

async function syncLookupTable(apiEndpoint: string, tableName: string, mapFn: (item: any) => Record<string, unknown>) {
  console.log(`\nSyncing ${tableName} from ${apiEndpoint}...`)
  const items = await fetchAll(apiEndpoint)
  const rows = items.map(mapFn)
  await upsertRows(tableName, rows)
}

function simpleTypeMap(item: any) {
  return {
    id: item.id,
    type: item.type,
    opdateringsdato: item.opdateringsdato,
  }
}

function simpleStatusMap(item: any) {
  return {
    id: item.id,
    status: item.status,
    opdateringsdato: item.opdateringsdato,
  }
}

function simpleRolleMap(item: any) {
  return {
    id: item.id,
    rolle: item.rolle,
    opdateringsdato: item.opdateringsdato,
  }
}

function simpleKategoriMap(item: any) {
  return {
    id: item.id,
    kategori: item.kategori,
    opdateringsdato: item.opdateringsdato,
  }
}

// --- Main sync functions ---

async function syncPeriode() {
  console.log('\nSyncing Periode...')
  const items = await fetchAll<any>('Periode')
  const rows = items.map((p) => ({
    id: p.id,
    startdato: p.startdato,
    slutdato: p.slutdato,
    type: p.type,
    kode: p.kode,
    titel: p.titel,
    opdateringsdato: p.opdateringsdato,
  }))
  await upsertRows('periode', rows)
}

async function syncAktør() {
  console.log('\nSyncing Aktør...')
  const items = await fetchAll<any>('Akt%C3%B8r')
  console.log(`  Fetched ${items.length} actors`)
  const rows = items.map((a) => ({
    id: a.id,
    typeid: a.typeid,
    gruppenavnkort: a.gruppenavnkort,
    navn: a.navn,
    fornavn: a.fornavn,
    efternavn: a.efternavn,
    biografi: a.biografi,
    periodeid: a.periodeid,
    opdateringsdato: a.opdateringsdato,
    startdato: a.startdato,
    slutdato: a.slutdato,
  }))
  await upsertRowsBatch('Aktør', rows)
}

async function syncMøde() {
  console.log('\nSyncing Møde...')
  const items = await fetchAll<any>('M%C3%B8de')
  console.log(`  Fetched ${items.length} meetings`)
  const rows = items.map((m) => ({
    id: m.id,
    titel: m.titel,
    lokale: m.lokale,
    nummer: m.nummer,
    dagsordenurl: m.dagsordenurl,
    starttidsbemærkning: m['starttidsbemærkning'],
    offentlighedskode: m.offentlighedskode,
    dato: m.dato,
    statusid: m.statusid,
    typeid: m.typeid,
    periodeid: m.periodeid,
    opdateringsdato: m.opdateringsdato,
  }))
  await upsertRowsBatch('Møde', rows)
}

async function syncSag() {
  console.log('\nSyncing Sag (this is a large table)...')
  const items = await fetchAll<any>('Sag')
  console.log(`  Fetched ${items.length} cases`)

  // Pass 1: Insert all rows with self-referencing FKs set to NULL
  console.log('  Pass 1: Inserting base records (no self-references)...')
  const rows = items.map((s) => ({
    id: s.id,
    typeid: s.typeid,
    kategoriid: s.kategoriid,
    statusid: s.statusid,
    titel: s.titel,
    titelkort: s.titelkort,
    offentlighedskode: s.offentlighedskode,
    nummer: s.nummer,
    nummerprefix: s.nummerprefix,
    nummernumerisk: s.nummernumerisk,
    nummerpostfix: s.nummerpostfix,
    resume: s.resume,
    afstemningskonklusion: s.afstemningskonklusion,
    periodeid: s.periodeid,
    afgørelsesresultatkode: s['afgørelsesresultatkode'],
    baggrundsmateriale: s.baggrundsmateriale,
    opdateringsdato: s.opdateringsdato,
    statsbudgetsag: s.statsbudgetsag,
    begrundelse: s.begrundelse,
    paragrafnummer: s.paragrafnummer,
    paragraf: s.paragraf,
    afgørelsesdato: s['afgørelsesdato'],
    afgørelse: s['afgørelse'],
    rådsmødedato: s['rådsmødedato'],
    lovnummer: s.lovnummer,
    lovnummerdato: s.lovnummerdato,
    retsinformationsurl: s.retsinformationsurl,
    fremsatundersagid: null,
    deltundersagid: null,
  }))
  await upsertRowsBatch('sag', rows)

  // Pass 2: Update self-referencing FK columns
  const selfRefs = items.filter((s) => s.fremsatundersagid || s.deltundersagid)
  if (selfRefs.length > 0) {
    console.log(`  Pass 2: Updating ${selfRefs.length} self-referencing FK records...`)
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (const s of selfRefs) {
        await client.query(
          `UPDATE "sag" SET "fremsatundersagid" = $1, "deltundersagid" = $2 WHERE "id" = $3`,
          [s.fremsatundersagid, s.deltundersagid, s.id],
        )
      }
      await client.query('COMMIT')
      console.log(`  Updated ${selfRefs.length} self-references`)
    } catch (err) {
      await client.query('ROLLBACK')
      // Non-fatal: some self-references may point to deleted sag records
      console.warn('  Warning: Some self-references failed (likely deleted records):', (err as Error).message)
    } finally {
      client.release()
    }
  }
}

async function main() {
  console.log('=== Populating database from ODA API ===\n')
  const startTime = Date.now()

  try {
    // 1. Lookup/type tables (no FK dependencies)
    console.log('--- Phase 1: Lookup tables ---')
    await syncLookupTable('Akt%C3%B8rtype', 'Aktørtype', simpleTypeMap)
    await syncLookupTable('M%C3%B8detype', 'Mødetype', simpleTypeMap)
    await syncLookupTable('M%C3%B8destatus', 'Mødestatus', simpleStatusMap)
    await syncLookupTable('Sagstype', 'sagstype', simpleTypeMap)
    await syncLookupTable('Sagsstatus', 'sagsstatus', simpleStatusMap)
    await syncLookupTable('Sagskategori', 'sagskategori', simpleKategoriMap)
    await syncLookupTable('Sagstrinsstatus', 'sagstrinsstatus', simpleStatusMap)
    await syncLookupTable('Sagstrinstype', 'sagstrinstype', simpleTypeMap)
    await syncLookupTable('SagAkt%C3%B8rRolle', 'SagAktørRolle', simpleRolleMap)
    await syncLookupTable('SagstrinAkt%C3%B8rRolle', 'SagstrinAktørRolle', simpleRolleMap)
    await syncLookupTable('DokumentAkt%C3%B8rRolle', 'DokumentAktørRolle', simpleRolleMap)
    await syncLookupTable('SagDokumentRolle', 'sagdokumentrolle', simpleRolleMap)
    await syncLookupTable('Dokumenttype', 'dokumenttype', simpleTypeMap)
    await syncLookupTable('Dokumentstatus', 'dokumentstatus', simpleStatusMap)
    await syncLookupTable('Dokumentkategori', 'dokumentkategori', simpleKategoriMap)
    await syncLookupTable('Afstemningstype', 'afstemningstype', simpleTypeMap)
    await syncLookupTable('Stemmetype', 'stemmetype', simpleTypeMap)
    await syncLookupTable('Emneordstype', 'emneordstype', simpleTypeMap)
    await syncLookupTable('Akt%C3%B8rAkt%C3%B8rRolle', 'AktørAktørRolle', simpleRolleMap)

    // 2. Core entities
    console.log('\n--- Phase 2: Core entities ---')
    // Skip if already loaded (check row counts)
    const client = await pool.connect()
    const { rows: counts } = await client.query(`
      SELECT 'periode' as tbl, COUNT(*)::int as cnt FROM periode
      UNION ALL SELECT 'Aktør', COUNT(*)::int FROM "Aktør"
      UNION ALL SELECT 'Møde', COUNT(*)::int FROM "Møde"
      UNION ALL SELECT 'sag', COUNT(*)::int FROM sag
    `)
    client.release()
    const countMap = Object.fromEntries(counts.map((r: any) => [r.tbl, r.cnt]))
    console.log('  Current row counts:', countMap)

    if (countMap.periode < 100) await syncPeriode()
    else console.log('  Skipping Periode (already loaded)')

    if (countMap['Aktør'] < 1000) await syncAktør()
    else console.log('  Skipping Aktør (already loaded)')

    if (countMap['Møde'] < 1000) await syncMøde()
    else console.log('  Skipping Møde (already loaded)')

    if (countMap.sag < 50000) await syncSag()
    else console.log('  Skipping Sag (already loaded)')

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n=== Done! Took ${duration}s ===`)
  } catch (err) {
    console.error('Fatal error:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
