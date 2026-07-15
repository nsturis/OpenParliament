/**
 * Populate the idmap table with tingdokID→aktør mappings extracted from XML files.
 * Matches XML speaker tingdokIDs against DB aktør entries by name.
 *
 * Usage: bun run scripts/populateIdmap.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { setDbLogging, db } from '../server/utils/db'
import { aktør, idmap } from '../server/database/schema'
import { eq, and } from 'drizzle-orm'

setDbLogging(false)

// Manual overrides for name changes, party suffixes, hyphenation differences
const MANUAL_OVERRIDES: Record<string, number> = {
  '523979': 15763,  // Peter Kofod Poulsen → Peter Kofod (changed surname)
  '523973': 15757,  // Aaja Chemnitz Larsen → Aaja Chemnitz (dropped Larsen)
  '106945': 180,    // Peter Juel Jensen → Peter Juel-Jensen (hyphen)
  '102337': 117,    // Simon Emil Ammitzbøll → Simon Emil Ammitzbøll-Bille
  '525266': 117,    // Simon Emil Ammitzbøll (2nd tingdokID) → same
  '100655': 280,    // Karen J. Klint → Karen J. Klint (udpeget af S)
  '519111': 79,     // Christian Langballe → Christian Langballe (udpeget af DF)
  '522588': 14372,  // Susanne Eilersen → Susanne Eilersen (udpeget af DF)
  '102339': 70,     // Martin Henriksen → Martin Henriksen (udpeget af DF)
  '523992': 15776,  // Peter Hummelgaard Thomsen → Peter Hummelgaard
  '100678': 288,    // Torben Hansen → Torben Hansen (udpeget af S)
  '102324': 259,    // Anne-Mette Winther Christiansen → (udpeget af V)
  '524003': 15787,  // Kaare Dybvad → Kaare Dybvad Bek
  '517102': 297,    // Maja Panduro → Maja Panduro (udpeget af S)
  '100557': 678,    // Klaus Hækkerup → Klaus Hækkerup (udpeget af S)
  '519239': 47,     // Karen Hækkerup → Karen Hækkerup (udpeget af S)
  '100699': 249,    // Kirsten Brosbøl → Kirsten Brosbøl (udpeget af S)
}

async function main() {
  // 1. Load aktør name→id cache
  console.log('Loading aktør data...')
  const aktørByName = new Map<string, number>()
  const aktørByEfternavn = new Map<string, { id: number; fornavn: string; efternavn: string }[]>()

  const allAktører = await db
    .select({ id: aktør.id, fornavn: aktør.fornavn, efternavn: aktør.efternavn })
    .from(aktør)

  for (const a of allAktører) {
    if (a.fornavn && a.efternavn) {
      const key = `${a.fornavn}|${a.efternavn}`
      if (!aktørByName.has(key)) {
        aktørByName.set(key, a.id)
      }
      if (!aktørByEfternavn.has(a.efternavn)) {
        aktørByEfternavn.set(a.efternavn, [])
      }
      aktørByEfternavn.get(a.efternavn)!.push({ id: a.id, fornavn: a.fornavn, efternavn: a.efternavn })
    }
  }
  console.log(`  ${aktørByName.size} unique name entries\n`)

  // 2. Extract all tingdokID→name pairs from XMLs
  const directory = 'assets/data/meetings'
  const xmlFiles = glob.sync(path.join(directory, '**/*.xml')).sort()
  console.log(`Scanning ${xmlFiles.length} XML files...\n`)

  const tingdokMap = new Map<string, { firstName: string; lastName: string; count: number }>()

  for (const xmlFile of xmlFiles) {
    const content = fs.readFileSync(xmlFile, 'utf8')
    const regex = /<MetaSpeakerMP\s+tingdokID="(\d+)">\s*<OratorFirstName>([^<]*)<\/OratorFirstName>\s*<OratorLastName>([^<]*)<\/OratorLastName>/g

    let match
    while ((match = regex.exec(content)) !== null) {
      const [, tingdokID, firstName, lastName] = match
      if (!tingdokMap.has(tingdokID)) {
        tingdokMap.set(tingdokID, { firstName, lastName, count: 0 })
      }
      tingdokMap.get(tingdokID)!.count++
    }
  }

  console.log(`Found ${tingdokMap.size} unique tingdokIDs\n`)

  // 3. Match and prepare idmap entries
  const toInsert: { id: number; originalid: string; entity: string }[] = []
  let exactMatches = 0
  let partialMatches = 0
  let manualMatches = 0
  let skipped = 0
  const unmatched: { tingdokID: string; name: string; count: number }[] = []

  for (const [tingdokID, entry] of tingdokMap) {
    // Skip sentinel entries
    if (entry.firstName === 'MødeSlut' || entry.firstName === 'Pause' || !entry.firstName || !entry.lastName) {
      skipped++
      continue
    }

    // Check manual override first
    if (MANUAL_OVERRIDES[tingdokID]) {
      toInsert.push({ id: MANUAL_OVERRIDES[tingdokID], originalid: tingdokID, entity: 'Aktør' })
      manualMatches++
      continue
    }

    // Try exact name match
    const key = `${entry.firstName}|${entry.lastName}`
    const dbId = aktørByName.get(key)
    if (dbId) {
      toInsert.push({ id: dbId, originalid: tingdokID, entity: 'Aktør' })
      exactMatches++
      continue
    }

    // Try partial match (first name prefix)
    const candidates = aktørByEfternavn.get(entry.lastName) || []
    const partials = candidates.filter((c) =>
      c.fornavn?.startsWith(entry.firstName) || entry.firstName.startsWith(c.fornavn || ''),
    )
    if (partials.length === 1) {
      // Unambiguous partial match
      toInsert.push({ id: partials[0].id, originalid: tingdokID, entity: 'Aktør' })
      partialMatches++
      continue
    }

    unmatched.push({ tingdokID, name: `${entry.firstName} ${entry.lastName}`, count: entry.count })
  }

  console.log('=== MATCHING RESULTS ===')
  console.log(`Exact: ${exactMatches}, Partial: ${partialMatches}, Manual: ${manualMatches}, Skipped: ${skipped}`)
  console.log(`Unmatched: ${unmatched.length}`)
  console.log(`Total to insert: ${toInsert.length}\n`)

  if (unmatched.length > 0) {
    console.log('UNMATCHED (will not be inserted):')
    for (const u of unmatched.sort((a, b) => b.count - a.count)) {
      console.log(`  tingdokID=${u.tingdokID}  "${u.name}" (${u.count}x)`)
    }
    console.log()
  }

  // 4. Deduplicate: idmap PK is (id, entity), so each aktør ID can only have one mapping.
  // When multiple tingdokIDs map to the same aktør, keep the one with more occurrences.
  const byAktørId = new Map<number, { originalid: string; count: number }>()
  for (const entry of toInsert) {
    const tingdokEntry = tingdokMap.get(entry.originalid)!
    const existing = byAktørId.get(entry.id)
    if (!existing || tingdokEntry.count > existing.count) {
      byAktørId.set(entry.id, { originalid: entry.originalid, count: tingdokEntry.count })
    }
  }

  const dedupedInserts = [...byAktørId.entries()].map(([id, { originalid }]) => ({
    id,
    originalid,
    entity: 'Aktør',
  }))

  console.log(`Deduplicated: ${toInsert.length} → ${dedupedInserts.length} entries (PK constraint: one per aktør)\n`)
  console.log(`Inserting ${dedupedInserts.length} entries into idmap...`)

  let inserted = 0
  let alreadyExists = 0

  for (const entry of dedupedInserts) {
    // Check if originalid already exists
    const existingByOriginal = await db
      .select({ id: idmap.id })
      .from(idmap)
      .where(and(eq(idmap.originalid, entry.originalid), eq(idmap.entity, entry.entity)))
      .limit(1)

    if (existingByOriginal.length > 0) {
      alreadyExists++
      continue
    }

    // Check if aktør id already exists
    const existingById = await db
      .select({ id: idmap.id })
      .from(idmap)
      .where(and(eq(idmap.id, entry.id), eq(idmap.entity, entry.entity)))
      .limit(1)

    if (existingById.length > 0) {
      alreadyExists++
      continue
    }

    await db.insert(idmap).values(entry)
    inserted++
  }

  console.log(`  Inserted: ${inserted}, Already existed: ${alreadyExists}`)

  // 5. Verify
  const total = await db.select({ id: idmap.id }).from(idmap)
  console.log(`\nTotal idmap entries: ${total.length}`)

  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
