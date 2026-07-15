/**
 * Diagnose aktør and sag lookup failures across all meeting XMLs.
 * Reads XMLs, resolves against DB caches, reports failure patterns.
 *
 * Usage: bun run scripts/diagnoseLookups.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { XMLParser } from 'fast-xml-parser'
import { glob } from 'glob'
import { setDbLogging } from '../server/utils/db'
import { db } from '../server/utils/db'
import { aktør, sag, møde, periode } from '../server/database/schema'
import { eq, and, like, or } from 'drizzle-orm'

setDbLogging(false)

// ── Load caches ─────────────────────────────────────────────────────────

const aktørNameCache = new Map<string, number>()
const aktørById = new Map<number, { fornavn: string | null; efternavn: string | null }>()
const periodeKodeCache = new Map<string, number>()
const mødeCache = new Map<string, number>()
const mødePeriodeMap = new Map<number, number>() // mødeid → periodeid

async function loadCaches() {
  console.log('Loading caches...')

  const allAktører = await db
    .select({ id: aktør.id, fornavn: aktør.fornavn, efternavn: aktør.efternavn })
    .from(aktør)
  for (const a of allAktører) {
    if (a.fornavn && a.efternavn) {
      const key = `${a.fornavn}|${a.efternavn}`
      if (!aktørNameCache.has(key)) {
        aktørNameCache.set(key, a.id)
      }
    }
    aktørById.set(a.id, { fornavn: a.fornavn, efternavn: a.efternavn })
  }

  const allPerioder = await db
    .select({ id: periode.id, kode: periode.kode })
    .from(periode)
    .where(eq(periode.type, 'samling'))
  for (const p of allPerioder) {
    if (p.kode) periodeKodeCache.set(p.kode, p.id)
  }

  const allMøder = await db
    .select({ id: møde.id, periodeid: møde.periodeid, nummer: møde.nummer })
    .from(møde)
    .where(eq(møde.typeid, 1))
  for (const m of allMøder) {
    if (m.periodeid && m.nummer) {
      mødeCache.set(`${m.periodeid}|${m.nummer}`, m.id)
      mødePeriodeMap.set(m.id, m.periodeid)
    }
  }

  console.log(`  ${aktørNameCache.size} aktører, ${periodeKodeCache.size} perioder, ${mødeCache.size} møder\n`)
}

// ── XML parser setup ────────────────────────────────────────────────────

function createParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    attributeValueProcessor: (attrName: string, attrValue: string) => {
      if (attrName === 'tingdokID') return attrValue.trim()
      return attrValue
    },
  })
}

function xmlText(el: unknown): string {
  if (el == null) return ''
  if (typeof el === 'object' && '#text' in (el as Record<string, unknown>)) {
    return String((el as Record<string, unknown>)['#text'])
  }
  return String(el)
}

// ── Collect failures ────────────────────────────────────────────────────

interface AktørFailure {
  fornavn: string
  efternavn: string
  count: number
  sampleFiles: string[]
}

interface SagFailure {
  caseNumber: string
  caseType: string
  periodeKode: string
  count: number
  sampleFiles: string[]
}

async function main() {
  await loadCaches()

  const directory = 'assets/data/meetings'
  const xmlFiles = glob.sync(path.join(directory, '**/*.xml')).sort()
  console.log(`Scanning ${xmlFiles.length} XML files...\n`)

  const aktørFailures = new Map<string, AktørFailure>()
  const sagFailures = new Map<string, SagFailure>()
  let totalAktørLookups = 0
  let totalAktørHits = 0
  let totalSagLookups = 0
  let totalSagHits = 0

  const parser = createParser()

  for (const xmlFile of xmlFiles) {
    const fileName = path.basename(xmlFile)
    try {
      const xmlData = fs.readFileSync(xmlFile, 'utf8')
      const result = parser.parse(xmlData)

      const meta = result.Dokument?.MetaMeeting
      if (!meta) continue

      const periodeKode = xmlText(meta.ParliamentarySession)
      const meetingNumber = String(meta.MeetingNumber)
      const periodeId = periodeKodeCache.get(periodeKode)
      if (!periodeId) continue

      const mødeid = mødeCache.get(`${periodeId}|${meetingNumber}`)
      if (!mødeid) continue

      // Walk the XML tree to find all Tale elements and FTCase references
      const dagsordenPunkter = result.Dokument.DagsordenPunkt
      if (!dagsordenPunkter) continue

      const items = Array.isArray(dagsordenPunkter) ? dagsordenPunkter : [dagsordenPunkter]

      for (const item of items) {
        // Check sag lookup
        const metaItem = item.MetaFTAgendaItem || {}
        if (metaItem.FTCaseNumber || metaItem.FTCaseType) {
          totalSagLookups++
          const caseNum = metaItem.FTCaseNumber || ''
          const caseType = metaItem.FTCaseType || ''

          // Try lookup
          const conditions = [eq(sag.periodeid, periodeId)] as any[]
          if (caseNum) conditions.push(eq(sag.nummernumerisk, caseNum))
          if (caseType) conditions.push(eq(sag.nummerprefix, caseType))

          if (conditions.length > 1) {
            const found = aktørNameCache.size > 0 // cheap check, real lookup below
            // We'll just check via cache-style approach
            totalSagHits++ // We'll subtract if not found below
            // Actually need real DB check for sag - skip for now, handle below
            totalSagHits--
          }

          // For now, just track the pattern
          const sagKey = `${caseType}|${caseNum}|${periodeKode}`
          if (!sagFailures.has(sagKey)) {
            sagFailures.set(sagKey, {
              caseNumber: caseNum,
              caseType: caseType,
              periodeKode,
              count: 0,
              sampleFiles: [],
            })
          }
          const sf = sagFailures.get(sagKey)!
          sf.count++
          if (sf.sampleFiles.length < 2) sf.sampleFiles.push(fileName)
        }

        // Walk activities to find speakers
        const activities = item.Aktivitet
        if (!activities) continue

        const actList = Array.isArray(activities) ? activities : [activities]
        for (const akt of actList) {
          const taleList = extractTaler(akt)
          for (const tale of taleList) {
            const speaker = tale?.Taler?.MetaSpeakerMP
            if (!speaker) continue

            totalAktørLookups++
            const fornavn = speaker.OratorFirstName || speaker.fornavn || ''
            const efternavn = speaker.OratorLastName || speaker.efternavn || ''

            if (!fornavn && !efternavn) {
              // Truly empty speaker
              const key = '__empty__'
              if (!aktørFailures.has(key)) {
                aktørFailures.set(key, { fornavn: '(empty)', efternavn: '(empty)', count: 0, sampleFiles: [] })
              }
              const af = aktørFailures.get(key)!
              af.count++
              if (af.sampleFiles.length < 2) af.sampleFiles.push(fileName)
              continue
            }

            const cacheKey = `${fornavn}|${efternavn}`
            if (aktørNameCache.has(cacheKey)) {
              totalAktørHits++
            } else {
              const key = cacheKey
              if (!aktørFailures.has(key)) {
                aktørFailures.set(key, { fornavn, efternavn, count: 0, sampleFiles: [] })
              }
              const af = aktørFailures.get(key)!
              af.count++
              if (af.sampleFiles.length < 2) af.sampleFiles.push(fileName)
            }
          }
        }
      }
    } catch {
      // Skip unparseable files
    }
  }

  // ── Report aktør failures ──────────────────────────────────────────
  console.log('=== AKTØR LOOKUP FAILURES ===')
  console.log(`Total lookups: ${totalAktørLookups}, Hits: ${totalAktørHits}, Misses: ${totalAktørLookups - totalAktørHits}`)
  console.log(`Unique failed names: ${aktørFailures.size}\n`)

  // Sort by count descending
  const sortedAktør = [...aktørFailures.values()].sort((a, b) => b.count - a.count)

  // Try to find close matches in DB for each failure
  console.log('Top failed names (with possible DB matches):')
  console.log('-'.repeat(100))

  for (const failure of sortedAktør.slice(0, 40)) {
    // Search for partial matches
    let possibleMatches: string[] = []

    if (failure.fornavn !== '(empty)') {
      // Check if efternavn alone matches
      for (const [key] of aktørNameCache) {
        const [fn, en] = key.split('|')
        if (en === failure.efternavn && fn !== failure.fornavn) {
          possibleMatches.push(`${fn} ${en}`)
        }
        if (fn === failure.fornavn && en !== failure.efternavn) {
          possibleMatches.push(`${fn} ${en}`)
        }
      }
    }

    const matchStr = possibleMatches.length > 0
      ? `  -> DB has: ${possibleMatches.slice(0, 3).join(', ')}${possibleMatches.length > 3 ? ` (+${possibleMatches.length - 3} more)` : ''}`
      : '  -> No close match found'

    console.log(`  "${failure.fornavn} ${failure.efternavn}" (${failure.count}x) [${failure.sampleFiles[0]}]`)
    console.log(matchStr)
  }

  // ── Report sag failures ────────────────────────────────────────────
  // Do real sag lookups for the unique patterns
  console.log('\n\n=== SAG LOOKUP ANALYSIS ===')
  console.log(`Unique case patterns: ${sagFailures.size}\n`)

  let sagHits = 0
  let sagMisses = 0
  const realSagFailures: SagFailure[] = []

  for (const [, sf] of sagFailures) {
    const periodeId = periodeKodeCache.get(sf.periodeKode)
    if (!periodeId) {
      sagMisses += sf.count
      realSagFailures.push(sf)
      continue
    }

    const conditions: any[] = [eq(sag.periodeid, periodeId)]
    if (sf.caseNumber) conditions.push(eq(sag.nummernumerisk, sf.caseNumber))
    if (sf.caseType) conditions.push(eq(sag.nummerprefix, sf.caseType))

    if (conditions.length <= 1) {
      // No case number or type — can't look up
      sagMisses += sf.count
      realSagFailures.push(sf)
      continue
    }

    const found = await db.select({ id: sag.id }).from(sag).where(and(...conditions)).limit(1)
    if (found.length > 0) {
      sagHits += sf.count
    } else {
      sagMisses += sf.count
      realSagFailures.push(sf)
    }
  }

  console.log(`Real sag hits: ${sagHits}, Real sag misses: ${sagMisses}`)
  console.log(`\nTop failed sag patterns:`)
  console.log('-'.repeat(100))

  const sortedSag = realSagFailures.sort((a, b) => b.count - a.count)
  for (const sf of sortedSag.slice(0, 30)) {
    const label = sf.caseNumber ? `${sf.caseType} ${sf.caseNumber}` : `(no case number, type: ${sf.caseType || 'none'})`
    console.log(`  ${label} in periode ${sf.periodeKode} (${sf.count}x) [${sf.sampleFiles[0]}]`)
  }

  process.exit(0)
}

function extractTaler(aktivitet: any): any[] {
  const result: any[] = []
  if (aktivitet.Tale) {
    const tales = Array.isArray(aktivitet.Tale) ? aktivitet.Tale : [aktivitet.Tale]
    result.push(...tales)
  }
  if (aktivitet.DagsordenUnderpunkt) {
    const subs = Array.isArray(aktivitet.DagsordenUnderpunkt) ? aktivitet.DagsordenUnderpunkt : [aktivitet.DagsordenUnderpunkt]
    for (const sub of subs) {
      if (sub.Tale) {
        const tales = Array.isArray(sub.Tale) ? sub.Tale : [sub.Tale]
        result.push(...tales)
      }
    }
  }
  return result
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
