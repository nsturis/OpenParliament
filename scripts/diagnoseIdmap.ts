/**
 * Extract all unique aktør tingdokID→name mappings from XMLs,
 * then check which ones match in the DB aktør table.
 *
 * Usage: bun run scripts/diagnoseIdmap.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { setDbLogging, db } from '../server/utils/db'
import { aktør } from '../server/database/schema'
import { eq, and, like } from 'drizzle-orm'

setDbLogging(false)

interface TingdokEntry {
  tingdokID: string
  firstName: string
  lastName: string
  fullName: string
  count: number
}

async function main() {
  // Load aktør cache
  console.log('Loading aktør data...')
  const aktørByName = new Map<string, { id: number; fornavn: string; efternavn: string; navn: string | null }>()
  const aktørByEfternavn = new Map<string, { id: number; fornavn: string; efternavn: string; navn: string | null }[]>()

  const allAktører = await db
    .select({ id: aktør.id, fornavn: aktør.fornavn, efternavn: aktør.efternavn, navn: aktør.navn })
    .from(aktør)

  for (const a of allAktører) {
    if (a.fornavn && a.efternavn) {
      const key = `${a.fornavn}|${a.efternavn}`
      if (!aktørByName.has(key)) {
        aktørByName.set(key, { id: a.id, fornavn: a.fornavn, efternavn: a.efternavn, navn: a.navn })
      }
      if (!aktørByEfternavn.has(a.efternavn)) {
        aktørByEfternavn.set(a.efternavn, [])
      }
      aktørByEfternavn.get(a.efternavn)!.push({ id: a.id, fornavn: a.fornavn, efternavn: a.efternavn, navn: a.navn })
    }
  }
  console.log(`  ${aktørByName.size} unique name entries, ${allAktører.length} total aktører\n`)

  // Scan all XMLs
  const directory = 'assets/data/meetings'
  const xmlFiles = glob.sync(path.join(directory, '**/*.xml')).sort()
  console.log(`Scanning ${xmlFiles.length} XML files for MetaSpeakerMP tingdokIDs...\n`)

  const tingdokMap = new Map<string, TingdokEntry>()

  for (const xmlFile of xmlFiles) {
    const content = fs.readFileSync(xmlFile, 'utf8')

    // Regex to extract MetaSpeakerMP blocks
    const regex = /<MetaSpeakerMP\s+tingdokID="(\d+)">\s*<OratorFirstName>([^<]*)<\/OratorFirstName>\s*<OratorLastName>([^<]*)<\/OratorLastName>/g

    let match
    while ((match = regex.exec(content)) !== null) {
      const [, tingdokID, firstName, lastName] = match
      if (!tingdokMap.has(tingdokID)) {
        tingdokMap.set(tingdokID, {
          tingdokID,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          count: 0,
        })
      }
      tingdokMap.get(tingdokID)!.count++
    }
  }

  console.log(`Found ${tingdokMap.size} unique tingdokIDs\n`)

  // Match against DB
  let exactMatches = 0
  let noMatch = 0
  let partialMatch = 0
  const unmatched: TingdokEntry[] = []
  const matched: { tingdokID: string; name: string; dbId: number; dbName: string; count: number }[] = []

  for (const [, entry] of tingdokMap) {
    // Skip meta entries
    if (entry.firstName === 'MødeSlut' || entry.firstName === 'Pause' || !entry.firstName || !entry.lastName) {
      continue
    }

    const key = `${entry.firstName}|${entry.lastName}`
    const dbMatch = aktørByName.get(key)

    if (dbMatch) {
      exactMatches++
      matched.push({
        tingdokID: entry.tingdokID,
        name: entry.fullName,
        dbId: dbMatch.id,
        dbName: `${dbMatch.fornavn} ${dbMatch.efternavn}`,
        count: entry.count,
      })
    } else {
      // Try partial match on efternavn
      const candidates = aktørByEfternavn.get(entry.lastName) || []
      const partials = candidates.filter((c) => {
        // Check if first name is a prefix or contains
        return c.fornavn?.startsWith(entry.firstName) || entry.firstName.startsWith(c.fornavn || '')
      })

      if (partials.length > 0) {
        partialMatch++
        const best = partials[0]
        unmatched.push(entry)
        matched.push({
          tingdokID: entry.tingdokID,
          name: entry.fullName,
          dbId: best.id,
          dbName: `${best.fornavn} ${best.efternavn} (partial)`,
          count: entry.count,
        })
      } else {
        noMatch++
        unmatched.push(entry)
      }
    }
  }

  console.log('=== TINGDOKID MATCHING RESULTS ===')
  console.log(`Exact name matches: ${exactMatches}`)
  console.log(`Partial name matches: ${partialMatch}`)
  console.log(`No match: ${noMatch}`)
  console.log()

  // Show unmatched with their efternavn candidates
  console.log('UNMATCHED tingdokIDs (sorted by occurrence count):')
  console.log('-'.repeat(120))

  const sortedUnmatched = unmatched.sort((a, b) => b.count - a.count)
  for (const entry of sortedUnmatched) {
    const candidates = aktørByEfternavn.get(entry.lastName) || []
    const candidateStr = candidates.length > 0
      ? candidates.slice(0, 5).map((c) => `${c.fornavn} ${c.efternavn} (${c.navn || 'no navn'}) [id=${c.id}]`).join(', ')
      : '(no efternavn match)'
    console.log(`  tingdokID=${entry.tingdokID}  "${entry.fullName}" (${entry.count}x)`)
    console.log(`    DB candidates: ${candidateStr}`)
  }

  // Show a sample of exact matches to verify they're correct
  console.log('\n\nSAMPLE EXACT MATCHES (verify correctness):')
  console.log('-'.repeat(120))
  for (const m of matched.filter((m) => !m.dbName.includes('partial')).slice(0, 15)) {
    console.log(`  tingdokID=${m.tingdokID}  "${m.name}" → DB id=${m.dbId} "${m.dbName}" (${m.count}x)`)
  }

  // Show partial matches
  console.log('\n\nPARTIAL MATCHES (need verification):')
  console.log('-'.repeat(120))
  for (const m of matched.filter((m) => m.dbName.includes('partial')).sort((a, b) => b.count - a.count)) {
    console.log(`  tingdokID=${m.tingdokID}  "${m.name}" → DB id=${m.dbId} "${m.dbName}" (${m.count}x)`)
  }

  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
