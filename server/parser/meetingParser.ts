import fs from 'node:fs'
import path from 'node:path'
import logger from '../../utils/logger'
import { and, eq, isNull, sql } from 'drizzle-orm'
import type { X2jOptions } from 'fast-xml-parser'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { glob } from 'glob'
import { $fetch } from 'ofetch'
import { db } from '../api/db'
import { aktør, idmap, møde, periode, sag, stemme, taleSegmentChunk, taleSegmentRaw } from '../database/schema'
import { extractTextContent, xmlAttr, xmlText } from './xmlContent'
import { isPseudoSpeaker, SpeakerIndex } from './speakerMatching'

// Configuration
let skipEmbeddings = false

export function setSkipEmbeddings(skip: boolean) {
  skipEmbeddings = skip
}

// ── In-memory caches ────────────────────────────────────────────────────
// Loaded once at startup via initCaches(), eliminates most DB round-trips.

let speakerIndex: SpeakerIndex | null = null
const aktørTingdokCache = new Map<string, number>()    // tingdokID (originalid) → aktør id
const sagTingdokCache = new Map<string, number>()      // tingdokID (originalid) → sag id
const periodeKodeCache = new Map<string, number>()     // kode (where type=samling) → id
const mødeCache = new Map<string, number>()            // "periodeId|nummer" → id (where typeid=1)
const mødePeriodeCache = new Map<number, number>()     // møde id → periodeid
const sagNummerCache = new Map<string, number | undefined>() // "periodeId|nummer" → sag id (memo)
let cachesInitialized = false

// Distinct unmatched speaker names with occurrence counts — the source for
// extending NAME_ALIASES in speakerMatching.ts.
const unmatchedSpeakerCounts = new Map<string, number>()

export function getUnmatchedSpeakerCounts(): Map<string, number> {
  return unmatchedSpeakerCounts
}

export async function initCaches(): Promise<void> {
  if (cachesInitialized) return

  console.log('Loading lookup caches...')

  // Vote counts disambiguate duplicate names: the active politician has
  // thousands of votes, stray duplicate rows have none.
  const voteCounts = await db
    .select({ aktørid: stemme.aktørid, votes: sql<number>`count(*)::int` })
    .from(stemme)
    .groupBy(stemme.aktørid)
  const votesByAktør = new Map<number, number>()
  for (const v of voteCounts) {
    if (v.aktørid != null) votesByAktør.set(v.aktørid, v.votes)
  }

  // Person-type aktører only (typeid=5) — the unfiltered table also holds
  // thousands of Privatperson rows that collide with MP names.
  const persons = await db
    .select({ id: aktør.id, fornavn: aktør.fornavn, efternavn: aktør.efternavn, navn: aktør.navn })
    .from(aktør)
    .where(eq(aktør.typeid, 5))
  speakerIndex = new SpeakerIndex(
    persons.map((p) => ({ ...p, weight: votesByAktør.get(p.id) ?? 0 })),
  )

  // Load all perioder (samling type)
  const allPerioder = await db
    .select({ id: periode.id, kode: periode.kode })
    .from(periode)
    .where(eq(periode.type, 'samling'))
  for (const p of allPerioder) {
    if (p.kode) periodeKodeCache.set(p.kode, p.id)
  }

  // Load all møder (typeid=1)
  const allMøder = await db
    .select({ id: møde.id, periodeid: møde.periodeid, nummer: møde.nummer })
    .from(møde)
    .where(eq(møde.typeid, 1))
  for (const m of allMøder) {
    if (m.periodeid && m.nummer) {
      mødeCache.set(`${m.periodeid}|${m.nummer}`, m.id)
    }
    if (m.periodeid) mødePeriodeCache.set(m.id, m.periodeid)
  }

  // Load idmap (tingdokID → aktør id / sag id)
  const allIdmap = await db
    .select({ id: idmap.id, originalid: idmap.originalid, entity: idmap.entity })
    .from(idmap)
    .where(sql`${idmap.entity} IN ('Aktør', 'Sag')`)
  for (const m of allIdmap) {
    if (m.entity === 'Aktør') aktørTingdokCache.set(m.originalid, m.id)
    else sagTingdokCache.set(m.originalid, m.id)
  }

  cachesInitialized = true
  console.log(`  Caches loaded: ${persons.length} personer, ${aktørTingdokCache.size} aktør-idmap, ${sagTingdokCache.size} sag-idmap, ${periodeKodeCache.size} perioder, ${mødeCache.size} møder`)
}

// Load set of all mødeids that already have segments (single query, for skip-already-imported)
export async function loadImportedMødeIds(): Promise<Set<number>> {
  const result = await db
    .selectDistinct({ mødeid: taleSegmentRaw.mødeid })
    .from(taleSegmentRaw)
  return new Set(result.map((r) => r.mødeid))
}

// Resolve a file's mødeid using caches (no DB, no full XML parse)
export function resolveFileToMødeId(filePath: string): number | undefined {
  if (!cachesInitialized) return undefined

  const fd = fs.openSync(filePath, 'r')
  const buf = Buffer.alloc(1024)
  fs.readSync(fd, buf, 0, 1024, 0)
  fs.closeSync(fd)
  const header = buf.toString('utf8')

  const sessionMatch = header.match(/<ParliamentarySession[^>]*>(\d+)<\/ParliamentarySession>/)
  const numberMatch = header.match(/<MeetingNumber>(\d+)<\/MeetingNumber>/)
  if (!sessionMatch || !numberMatch) return undefined

  const periodeId = periodeKodeCache.get(sessionMatch[1])
  if (!periodeId) return undefined

  return mødeCache.get(`${periodeId}|${numberMatch[1]}`)
}

// ── Interfaces ──────────────────────────────────────────────────────────

interface MeetingData {
  metadata: {
    parlamentariskSession: string
    periodeTingdokID: string
    aktørGruppe: string
    aktørTingdokID: string
    mødeDato: string
    mødeNummer: number
    lokale: string
  }
  agendaItems: AgendaItem[]
}

interface AgendaItem {
  ItemNo?: string
  FTCaseNumber?: string
  FTCaseType?: string
  FTCaseStage?: string
  ShortTitle?: string
  FTCaseTingdokID?: string | number | undefined
  FullText?: string
  taler: Tale[]
  subItems?: SubItem[]
}

interface ParsedAgendaItem extends AgendaItem {
  sagId?: number
}

interface SubItem {
  ItemNo: string
  FTCaseTingdokID: string
  FTCaseNumber: string
  FTCaseType: string
  ShortTitle: string
  taler: Tale[]
}

interface Tale {
  aktørTingdokID?: number
  LastModified: string
  EdixiStatus: string
  StartDateTime: string
  EndDateTime: string
  content: string
  embedding?: number[]
  sagId?: number
  chunkIndex: number
}

interface MetaSpeakerMP {
  '@_tingdokID'?: string
  OratorFirstName?: string
  OratorLastName?: string
  OratorRole?: string
  fornavn?: string
  efternavn?: string
}

interface MetaSubItem {
  SubItemNo?: string | number
  ItemNo?: string | number
  FTCase?: { '@_tingdokID': string } | undefined
  FTCaseNumber?: string
  FTCaseType?: string
  ShortTitle?: string
}

interface RawSubItem {
  MetaFTAgendaSubItem?: MetaSubItem
  Tale?: unknown[]
}

interface MetaFTAgendaItem {
  ItemNo?: string
  FTCaseNumber?: string
  FTCaseType?: string
  FTCaseStage?: string
  ShortTitle?: string
  FTCase?: { '@_tingdokID': string }
}

interface RawAgendaItem {
  MetaFTAgendaItem?: MetaFTAgendaItem
  PunktTekst?: unknown
  Aktivitet?: {
    DagsordenUnderpunkt?: RawSubItem[]
    Tale?: unknown[]
  }[]
}

interface MetaMeeting {
  ParliamentarySession: {
    '@_tingdokID': string
    '#text': string
  }
  ParliamentaryGroup: {
    '@_tingdokID': string
    '#text': string
  }
  DateOfSitting: string
  MeetingNumber: string
  Location: string
}

interface RawTale {
  TaleSegment: {
    TekstGruppe: unknown
    MetaSpeechSegment: {
      LastModified: string
      EdixiStatus: string
      StartDateTime: string
      EndDateTime?: string
    }
  }
  Taler: {
    MetaSpeakerMP: MetaSpeakerMP
  }
}

const MAX_FAILURE_EXAMPLES = 100

export interface ParsingStats {
  totalMeetings: number
  successfulMeetings: number
  failedMeetings: number
  skippedMeetings: number
  /** Pseudo-speaker blocks (MødeSlut/Pause markers) skipped by design. */
  meetingEvents: number
  agendaItems: {
    total: number
    successful: number
    failed: number
    failureExamples: Array<{
      itemNo?: string
      error: string
    }>
  }
  taleErrors: {
    count: number
    examples: Array<{ error: string }>
  }
  sagLookups: {
    total: number
    successful: number
    failed: number
    /** Agenda items without a case reference (FM/VALG/UVP or no number) — not failures. */
    skipped: number
    /** Lookups matching >1 sag row — left unlinked. */
    ambiguous: number
    failureExamples: Array<{
      caseNumber?: string
      caseType?: string
      error: string
    }>
  }
  aktørLookups: {
    total: number
    successful: number
    failed: number
    /** Name maps to several equally plausible aktører — left unlinked. */
    ambiguous: number
    failureExamples: Array<{
      name?: string
      tingdokID?: string
      error: string
    }>
  }
}

export function newParsingStats(): ParsingStats {
  return {
    totalMeetings: 0,
    successfulMeetings: 0,
    failedMeetings: 0,
    skippedMeetings: 0,
    meetingEvents: 0,
    agendaItems: { total: 0, successful: 0, failed: 0, failureExamples: [] },
    taleErrors: { count: 0, examples: [] },
    sagLookups: { total: 0, successful: 0, failed: 0, skipped: 0, ambiguous: 0, failureExamples: [] },
    aktørLookups: { total: 0, successful: 0, failed: 0, ambiguous: 0, failureExamples: [] },
  }
}

// ── Lookup functions (cache-aware) ──────────────────────────────────────

function speakerName(item: MetaSpeakerMP): { fornavn: string; efternavn: string } {
  return {
    fornavn: xmlText(item.OratorFirstName ?? item.fornavn ?? ''),
    efternavn: xmlText(item.OratorLastName ?? item.efternavn ?? ''),
  }
}

function findAktørIdCached(item: MetaSpeakerMP, stats: ParsingStats): number | undefined {
  stats.aktørLookups.total++

  // Try tingdokID first (most reliable)
  if (item['@_tingdokID']) {
    const id = aktørTingdokCache.get(String(item['@_tingdokID']))
    if (id) {
      stats.aktørLookups.successful++
      return id
    }
  }

  const { fornavn, efternavn } = speakerName(item)
  if (fornavn || efternavn) {
    const outcome = speakerIndex!.resolve(fornavn, efternavn)
    if (outcome.kind === 'match') {
      stats.aktørLookups.successful++
      return outcome.id
    }
    if (outcome.kind === 'ambiguous') {
      stats.aktørLookups.ambiguous++
      return undefined
    }
  }

  stats.aktørLookups.failed++
  const nameKey = `${fornavn}|${efternavn}`
  unmatchedSpeakerCounts.set(nameKey, (unmatchedSpeakerCounts.get(nameKey) ?? 0) + 1)
  if (stats.aktørLookups.failureExamples.length < MAX_FAILURE_EXAMPLES) {
    stats.aktørLookups.failureExamples.push({
      name: `${fornavn} ${efternavn}`,
      tingdokID: item['@_tingdokID'],
      error: 'No matching aktør found',
    })
  }
  return undefined
}

function findMødeIdCached(metadata: MetaMeeting): number | undefined {
  const periodeKode = xmlText(metadata.ParliamentarySession)
  if (!periodeKode) return undefined

  const periodeId = periodeKodeCache.get(periodeKode)
  if (!periodeId) return undefined

  const meetingNumber = String(metadata.MeetingNumber)
  return mødeCache.get(`${periodeId}|${meetingNumber}`)
}

// DB-based tingdokID lookup via idmap table
async function extractTingdokID(tingdokID: string, entity: string): Promise<number | undefined> {
  const result = await db
    .select({ id: idmap.id })
    .from(idmap)
    .where(and(eq(idmap.originalid, tingdokID), eq(idmap.entity, entity)))
    .limit(1)
  return result[0]?.id
}

async function findAktørId(item: MetaSpeakerMP, stats: ParsingStats): Promise<number | undefined> {
  if (cachesInitialized) return findAktørIdCached(item, stats)

  stats.aktørLookups.total++
  let aktørId: number | undefined

  if (item['@_tingdokID']) {
    aktørId = await extractTingdokID(item['@_tingdokID'], 'Aktør')
  }

  if (!aktørId) {
    const { fornavn, efternavn } = speakerName(item)

    if (fornavn && efternavn) {
      const aktørResult = await db
        .select({ id: aktør.id })
        .from(aktør)
        .where(and(eq(aktør.fornavn, fornavn), eq(aktør.efternavn, efternavn)))
        .limit(1)

      aktørId = aktørResult[0]?.id
    }
  }

  if (!aktørId) {
    stats.aktørLookups.failed++
    if (stats.aktørLookups.failureExamples.length < MAX_FAILURE_EXAMPLES) {
      const { fornavn, efternavn } = speakerName(item)
      stats.aktørLookups.failureExamples.push({
        name: `${fornavn} ${efternavn}`,
        tingdokID: item['@_tingdokID'],
        error: 'No matching aktør found',
      })
    }
  } else {
    stats.aktørLookups.successful++
  }

  return aktørId
}

async function findMødeId(metadata: MetaMeeting): Promise<number | undefined> {
  if (cachesInitialized) return findMødeIdCached(metadata)

  let periodeId: number | undefined

  const periodeTingdokID = xmlAttr(metadata.ParliamentarySession, '@_tingdokID')
  if (periodeTingdokID) {
    periodeId = await extractTingdokID(periodeTingdokID, 'Periode')
  }

  const periodeKode = xmlText(metadata.ParliamentarySession)
  if (!periodeId && periodeKode) {
    const periodeResult = await db
      .select({ id: periode.id })
      .from(periode)
      .where(and(eq(periode.kode, periodeKode), eq(periode.type, 'samling')))
      .limit(1)

    periodeId = periodeResult[0]?.id
  }

  if (!periodeId) return undefined

  const mødeResult = await db
    .select({ id: møde.id })
    .from(møde)
    .where(and(eq(møde.periodeid, periodeId), eq(møde.nummer, metadata.MeetingNumber.toString()), eq(møde.typeid, 1)))
    .limit(1)

  return mødeResult[0]?.id
}

// ── Embedding generation ────────────────────────────────────────────────

type DocumentResponse = {
  status: string
  chunks: string[]
  embeddings: number[][]
}

async function generateEmbedding(text: string): Promise<DocumentResponse | null> {
  try {
    const response: DocumentResponse = await $fetch('http://127.0.0.1:8000/process_document_embeddings', {
      method: 'POST',
      body: { text },
      retry: 3,
      retryDelay: 10000,
    })
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Failed to generate embedding:', error.message)
    } else {
      logger.error('Failed to generate embedding:', error)
    }
    return null
  }
}

// ── Segment value type for batch inserts ────────────────────────────────

interface SegmentInsertValue {
  content: string
  mødeid: number
  starttid: string
  sluttid: string | null
  lastModified: string | null
  sagid: number | undefined
  aktørid: number | null
  oratorFornavn: string | null
  oratorEfternavn: string | null
  oratorRolle: string | null
  opdateringsdato: string
}

// ── Main parsing functions ──────────────────────────────────────────────

/**
 * Processes tale segments. When caches are initialized:
 * - Resolves aktørId from in-memory cache (no DB)
 * - Collects segment values into `meetingBuffer`; the caller writes the
 *   whole meeting in one transaction (delete + insert = idempotent re-import)
 * When caches are not initialized, falls back to per-row DB lookups.
 */
async function processTaleSegments(
  taler: RawTale[],
  mødeid: number,
  sagId: number | undefined,
  stats: ParsingStats,
  meetingBuffer?: SegmentInsertValue[],
): Promise<Tale[]> {
  const parsedTaler: Tale[] = []

  for (const tale of taler) {
    try {
      const speaker = tale.Taler.MetaSpeakerMP
      const { fornavn, efternavn } = speakerName(speaker)

      // MødeSlut/Pause markers and empty speaker blocks are meeting events,
      // not speech — skip without touching lookup stats.
      if (isPseudoSpeaker(fornavn, efternavn, xmlText(speaker.OratorRole ?? ''))) {
        stats.meetingEvents++
        continue
      }

      const segments = Array.isArray(tale.TaleSegment) ? tale.TaleSegment : [tale.TaleSegment]
      const aktørId = await findAktørId(speaker, stats)

      for (const segment of segments) {
        const rawContent = extractTextContent(segment.TekstGruppe)
        // The final segment of every meeting has no EndDateTime.
        const sluttid = segment.MetaSpeechSegment.EndDateTime || null

        if (meetingBuffer) {
          // Fast path: collect for transactional batch insert, no per-row DB queries.
          // Unmatched speakers are persisted with aktørid NULL — the orator
          // fields keep the attribution so the rows can be healed later.
          meetingBuffer.push({
            content: rawContent,
            mødeid,
            starttid: segment.MetaSpeechSegment.StartDateTime,
            sluttid,
            lastModified: segment.MetaSpeechSegment.LastModified || null,
            sagid: sagId,
            aktørid: aktørId ?? null,
            oratorFornavn: fornavn || null,
            oratorEfternavn: efternavn || null,
            oratorRolle: xmlText(speaker.OratorRole ?? '') || null,
            opdateringsdato: new Date().toISOString(),
          })

          parsedTaler.push({
            aktørTingdokID: aktørId,
            LastModified: segment?.MetaSpeechSegment?.LastModified || null,
            EdixiStatus: segment?.MetaSpeechSegment?.EdixiStatus || '',
            StartDateTime: segment?.MetaSpeechSegment?.StartDateTime || null,
            EndDateTime: sluttid,
            content: rawContent,
            sagId,
            chunkIndex: 0,
          })
        } else {
          // Slow path: per-row dedup check + insert + optional embeddings
          if (!aktørId) continue

          const existingSegment = await db
            .select({ id: taleSegmentRaw.id })
            .from(taleSegmentRaw)
            .where(
              and(
                eq(taleSegmentRaw.mødeid, mødeid),
                eq(taleSegmentRaw.starttid, segment.MetaSpeechSegment.StartDateTime),
                sluttid == null
                  ? isNull(taleSegmentRaw.sluttid)
                  : eq(taleSegmentRaw.sluttid, sluttid),
                eq(taleSegmentRaw.aktørid, aktørId),
                sagId == null
                  ? isNull(taleSegmentRaw.sagid)
                  : eq(taleSegmentRaw.sagid, sagId),
                eq(taleSegmentRaw.content, rawContent),
              ),
            )
            .limit(1)

          let rawSegmentId: number

          if (existingSegment.length > 0) {
            rawSegmentId = existingSegment[0].id
          } else {
            const [rawSegment] = await db
              .insert(taleSegmentRaw)
              .values({
                content: rawContent,
                mødeid,
                starttid: segment.MetaSpeechSegment.StartDateTime,
                sluttid,
                lastModified: segment.MetaSpeechSegment.LastModified,
                sagid: sagId,
                aktørid: aktørId,
                oratorFornavn: fornavn || null,
                oratorEfternavn: efternavn || null,
                oratorRolle: xmlText(speaker.OratorRole ?? '') || null,
                opdateringsdato: new Date().toISOString(),
              })
              .returning()
            rawSegmentId = rawSegment.id
          }

          if (!skipEmbeddings) {
            const existingChunks = await db
              .select({ id: taleSegmentChunk.id })
              .from(taleSegmentChunk)
              .where(eq(taleSegmentChunk.taleSegmentId, rawSegmentId))
              .limit(1)

            if (existingChunks.length === 0) {
              const embeddingResponse = await generateEmbedding(rawContent)
              if (embeddingResponse?.status === 'success') {
                for (let i = 0; i < embeddingResponse.chunks.length; i++) {
                  await db.insert(taleSegmentChunk).values({
                    taleSegmentId: rawSegmentId,
                    content: embeddingResponse.chunks[i],
                    embedding: embeddingResponse.embeddings[i],
                    chunkIndex: i,
                    totalChunks: embeddingResponse.chunks.length,
                  })
                }
              }
            }
          }

          parsedTaler.push({
            aktørTingdokID: aktørId,
            LastModified: segment?.MetaSpeechSegment?.LastModified || null,
            EdixiStatus: segment?.MetaSpeechSegment?.EdixiStatus || '',
            StartDateTime: segment?.MetaSpeechSegment?.StartDateTime || null,
            EndDateTime: sluttid,
            content: rawContent,
            sagId,
            chunkIndex: 0,
          })
        }
      }
    } catch (error: unknown) {
      stats.taleErrors.count++
      if (stats.taleErrors.examples.length < MAX_FAILURE_EXAMPLES) {
        stats.taleErrors.examples.push({
          error: error instanceof Error ? error.message : 'Unknown tale processing error',
        })
      }
      logger.error('Error processing tale:', error)
    }
  }

  return parsedTaler
}

// Agenda-item types that never reference a sag (housekeeping, elections).
const NON_CASE_TYPES = new Set(['FM', 'VALG', 'UVP'])

async function findSagId(
  metaFTAgendaItem: Pick<MetaFTAgendaItem, 'FTCase' | 'FTCaseNumber' | 'FTCaseType'>,
  mødeid: number,
  stats: ParsingStats,
): Promise<number | undefined> {
  const tingdokID = metaFTAgendaItem.FTCase
    ? String(metaFTAgendaItem.FTCase['@_tingdokID'] ?? '').trim()
    : ''
  const caseNumber = metaFTAgendaItem.FTCaseNumber != null ? String(metaFTAgendaItem.FTCaseNumber).trim() : ''
  const caseType = metaFTAgendaItem.FTCaseType != null ? String(metaFTAgendaItem.FTCaseType).trim() : ''
  const hasNumberKey = caseNumber !== '' && caseType !== '' && !NON_CASE_TYPES.has(caseType)

  // No usable case reference — this is not a lookup failure.
  if (!tingdokID && !hasNumberKey) {
    stats.sagLookups.skipped++
    return undefined
  }

  stats.sagLookups.total++

  // Primary: FTCase tingdokID via idmap (sessions ~20191+, most precise)
  if (tingdokID) {
    const sagId = cachesInitialized
      ? sagTingdokCache.get(tingdokID)
      : await extractTingdokID(tingdokID, 'Sag')
    if (sagId) {
      stats.sagLookups.successful++
      return sagId
    }
  }

  // Fallback: sag.nummer = "<type> <number>" within the meeting's periode.
  // Matching the composite nummer (not nummerprefix/nummernumerisk) is
  // era-stable and handles split cases like "L 4 A".
  if (hasNumberKey) {
    try {
      let periodeId = mødePeriodeCache.get(mødeid)
      if (!periodeId) {
        const mødeResult = await db.select({ periodeid: møde.periodeid }).from(møde).where(eq(møde.id, mødeid)).limit(1)
        periodeId = mødeResult[0]?.periodeid ?? undefined
      }

      if (periodeId) {
        const nummer = `${caseType} ${caseNumber}`
        const cacheKey = `${periodeId}|${nummer}`
        if (cachesInitialized && sagNummerCache.has(cacheKey)) {
          const cached = sagNummerCache.get(cacheKey)
          if (cached) stats.sagLookups.successful++
          else stats.sagLookups.failed++
          return cached
        }

        const rows = await db
          .select({ id: sag.id })
          .from(sag)
          .where(and(eq(sag.periodeid, periodeId), eq(sag.nummer, nummer)))
          .limit(2)

        if (rows.length === 1) {
          if (cachesInitialized) sagNummerCache.set(cacheKey, rows[0].id)
          stats.sagLookups.successful++
          return rows[0].id
        }
        if (rows.length > 1) {
          stats.sagLookups.ambiguous++
          logger.warn(`Ambiguous sag lookup: ${nummer} in periode ${periodeId}`)
        }
        if (cachesInitialized) sagNummerCache.set(cacheKey, undefined)
      }
    } catch (error) {
      logger.error('Sag lookup failed:', error)
    }
  }

  stats.sagLookups.failed++
  if (stats.sagLookups.failureExamples.length < MAX_FAILURE_EXAMPLES) {
    stats.sagLookups.failureExamples.push({
      caseNumber,
      caseType,
      error: 'No matching sag found',
    })
  }
  return undefined
}

async function parseSubAgendaItems(
  subItems: RawSubItem[],
  mødeid: number,
  parentSagId: number | undefined,
  stats: ParsingStats,
  meetingBuffer?: SegmentInsertValue[],
): Promise<SubItem[]> {
  try {
    return await Promise.all(
      subItems.map(async (subItem: RawSubItem) => {
        const metaSubItem = subItem.MetaFTAgendaSubItem || {}

        const newSubItem: SubItem = {
          // Sub-items carry SubItemNo (ItemNo never occurs on them)
          ItemNo: String(metaSubItem.SubItemNo ?? metaSubItem.ItemNo ?? ''),
          FTCaseTingdokID: metaSubItem.FTCase?.['@_tingdokID'] || '',
          FTCaseNumber: metaSubItem.FTCaseNumber || '',
          FTCaseType: metaSubItem.FTCaseType || '',
          ShortTitle: metaSubItem.ShortTitle || '',
          taler: [],
        }

        const sagId = (metaSubItem.FTCase ? await findSagId(metaSubItem, mødeid, stats) : parentSagId)

        if (subItem.Tale) {
          const taler = Array.isArray(subItem.Tale) ? subItem.Tale : [subItem.Tale]
          newSubItem.taler = await processTaleSegments(
            taler.map((t): RawTale => t as RawTale),
            mødeid,
            sagId,
            stats,
            meetingBuffer,
          )
        }

        return newSubItem
      }),
    )
  } catch (error: unknown) {
    logger.error('Error parsing sub-items:', error)
    return []
  }
}

async function parseAgendaItem(
  item: RawAgendaItem,
  mødeid: number,
  stats: ParsingStats,
  meetingBuffer?: SegmentInsertValue[],
): Promise<ParsedAgendaItem> {
  stats.agendaItems.total++
  try {
    const metaFTAgendaItem = item.MetaFTAgendaItem || {}

    const sagId = await findSagId(metaFTAgendaItem, mødeid, stats)
    const agendaItem: AgendaItem = {
      ItemNo: metaFTAgendaItem.ItemNo,
      FTCaseNumber: metaFTAgendaItem.FTCaseNumber,
      FTCaseType: metaFTAgendaItem.FTCaseType,
      FTCaseStage: metaFTAgendaItem.FTCaseStage,
      ShortTitle: metaFTAgendaItem.ShortTitle,
      FTCaseTingdokID: sagId,
      FullText: extractTextContent(item.PunktTekst),
      subItems: [],
      taler: [],
    }

    if (item.Aktivitet) {
      const activities = Array.isArray(item.Aktivitet) ? item.Aktivitet : [item.Aktivitet]

      // Agenda items average 1.7 Aktivitet — accumulate across all of them.
      for (const aktivitet of activities) {
        if (aktivitet.DagsordenUnderpunkt) {
          const subItems = Array.isArray(aktivitet.DagsordenUnderpunkt) ? aktivitet.DagsordenUnderpunkt : [aktivitet.DagsordenUnderpunkt]
          agendaItem.subItems!.push(...await parseSubAgendaItems(
            subItems.map((p): RawSubItem => p as RawSubItem),
            mødeid,
            sagId,
            stats,
            meetingBuffer,
          ))
        }

        if (aktivitet.Tale) {
          const taler = Array.isArray(aktivitet.Tale) ? aktivitet.Tale : [aktivitet.Tale]
          agendaItem.taler.push(...await processTaleSegments(
            taler.map((t): RawTale => t as RawTale),
            mødeid,
            sagId,
            stats,
            meetingBuffer,
          ))
        }
      }
    }

    stats.agendaItems.successful++
    return { ...agendaItem, sagId }
  } catch (error: unknown) {
    stats.agendaItems.failed++
    stats.agendaItems.failureExamples.push({
      itemNo: item.MetaFTAgendaItem?.ItemNo,
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return {
      ItemNo: item.MetaFTAgendaItem?.ItemNo || 'Unknown',
      ShortTitle: item.MetaFTAgendaItem?.ShortTitle || 'Unknown',
      taler: [],
      sagId: undefined,
      subItems: [],
    }
  }
}

async function extractMeetingMetadata(metaMeeting: MetaMeeting): Promise<MeetingData['metadata']> {
  return {
    parlamentariskSession: xmlAttr(metaMeeting.ParliamentarySession, '@_tingdokID') || xmlText(metaMeeting.ParliamentarySession),
    periodeTingdokID: xmlAttr(metaMeeting.ParliamentarySession, '@_tingdokID') || xmlText(metaMeeting.ParliamentarySession),
    aktørGruppe: xmlAttr(metaMeeting.ParliamentaryGroup, '@_tingdokID') || xmlText(metaMeeting.ParliamentaryGroup),
    aktørTingdokID: xmlAttr(metaMeeting.ParliamentaryGroup, '@_tingdokID') || xmlText(metaMeeting.ParliamentaryGroup),
    mødeDato: metaMeeting.DateOfSitting,
    mødeNummer: Number.parseInt(String(metaMeeting.MeetingNumber), 10),
    lokale: metaMeeting.Location,
  }
}

function createParserOptions(): X2jOptions {
  return {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    // Transcript text must never be type-coerced: <Char>138</Char> parsed
    // as a number used to be dropped from the extracted speech text.
    parseTagValue: false,
    attributeValueProcessor: (attrName: string, attrValue: string) => {
      if (attrName === 'tingdokID') {
        return attrValue.trim()
      }
      return attrValue
    },
  }
}

export async function parseMeetingXML(filePath: string, stats: ParsingStats): Promise<MeetingData> {
  const options = createParserOptions()
  const parser = new XMLParser(options)
  const xmlData = fs.readFileSync(filePath, 'utf8')

  // fast-xml-parser silently returns partial trees for truncated files —
  // everything after the corruption point would be lost without this check.
  const validation = XMLValidator.validate(xmlData)
  if (validation !== true) {
    throw new Error(`Malformed XML (${validation.err.msg} at line ${validation.err.line}) — re-download the file: ${filePath}`)
  }

  const result = parser.parse(xmlData)

  const metaMeeting = result.Dokument.MetaMeeting as MetaMeeting
  const metadata = await extractMeetingMetadata(metaMeeting)
  const mødeid = await findMødeId(metaMeeting)

  if (!mødeid) {
    throw new Error(`Could not find mødeid for file: ${filePath}`)
  }

  const meetingData: MeetingData = {
    metadata,
    agendaItems: [],
  }

  // Fast path buffers the whole meeting and writes it in one transaction.
  const meetingBuffer = cachesInitialized && skipEmbeddings ? [] as SegmentInsertValue[] : undefined

  const rawDp = result.Dokument.DagsordenPunkt || []
  const agendaItems = (Array.isArray(rawDp) ? rawDp : [rawDp]) as RawAgendaItem[]

  const parsedAgendaItems = await Promise.allSettled(
    agendaItems.map((item: RawAgendaItem) => parseAgendaItem(item, mødeid, stats, meetingBuffer)),
  )

  const successfulItems = parsedAgendaItems
    .filter((r): r is PromiseFulfilledResult<ParsedAgendaItem> => r.status === 'fulfilled')
    .map((r) => r.value)

  meetingData.agendaItems = successfulItems

  if (meetingBuffer) {
    // Delete + insert in one transaction: re-imports (Foreløbig re-releases,
    // parser fixes) are idempotent, and a failure leaves the previous state.
    const BATCH_SIZE = 500
    await db.transaction(async (tx) => {
      await tx.delete(taleSegmentRaw).where(eq(taleSegmentRaw.mødeid, mødeid))
      for (let i = 0; i < meetingBuffer.length; i += BATCH_SIZE) {
        await tx.insert(taleSegmentRaw).values(meetingBuffer.slice(i, i + BATCH_SIZE))
      }
    })
  }

  return meetingData
}

export async function parseMeetings(
  meetingKey?: string,
): Promise<{ meetings: Record<string, MeetingData>; stats: ParsingStats }> {
  const stats = newParsingStats()

  const directory = 'assets/data/meetings'
  logger.info(`Parsing meetings from ${directory}`)
  const allMeetings: Record<string, MeetingData> = {}

  let xmlFiles: string[]
  if (meetingKey) {
    const specificFile = path.join(directory, `${meetingKey}_helemoedet.xml`)
    if (fs.existsSync(specificFile)) {
      xmlFiles = [specificFile]
    } else {
      throw new Error(`File not found for meeting key: ${meetingKey}`)
    }
  } else {
    xmlFiles = glob.sync(path.join(directory, '**/*.xml'))
  }

  logger.info(`Found ${xmlFiles.length} XML file(s)`)

  stats.totalMeetings = xmlFiles.length

  await Promise.all(
    xmlFiles.map(async (xmlFile) => {
      const key = path.parse(xmlFile).name.replace('_helemoedet', '')
      try {
        const meetingData = await parseMeetingXML(xmlFile, stats)
        allMeetings[key] = meetingData
        stats.successfulMeetings++
      } catch (error) {
        stats.failedMeetings++
        logger.error(`Failed to parse meeting ${key}:`, error)
      }
    }),
  )

  const pct = (failed: number, total: number) => total > 0 ? `${((failed / total) * 100).toFixed(2)}%` : 'n/a'
  logger.info('Parsing Statistics:', {
    meetings: {
      total: stats.totalMeetings,
      successful: stats.successfulMeetings,
      failed: stats.failedMeetings,
    },
    agendaItems: {
      total: stats.agendaItems.total,
      successful: stats.agendaItems.successful,
      failed: stats.agendaItems.failed,
      failureRate: pct(stats.agendaItems.failed, stats.agendaItems.total),
    },
    sagLookups: {
      total: stats.sagLookups.total,
      successful: stats.sagLookups.successful,
      failed: stats.sagLookups.failed,
      skipped: stats.sagLookups.skipped,
      ambiguous: stats.sagLookups.ambiguous,
      failureRate: pct(stats.sagLookups.failed, stats.sagLookups.total),
    },
    aktørLookups: {
      total: stats.aktørLookups.total,
      successful: stats.aktørLookups.successful,
      failed: stats.aktørLookups.failed,
      ambiguous: stats.aktørLookups.ambiguous,
      failureRate: pct(stats.aktørLookups.failed, stats.aktørLookups.total),
    },
  })

  if (stats.agendaItems.failureExamples.length > 0) {
    logger.info('Sample Agenda Item Failures:', stats.agendaItems.failureExamples.slice(0, 3))
  }
  if (stats.sagLookups.failureExamples.length > 0) {
    logger.info('Sample Sag Lookup Failures:', stats.sagLookups.failureExamples.slice(0, 3))
  }
  if (stats.aktørLookups.failureExamples.length > 0) {
    logger.info('Sample Aktør Lookup Failures:', stats.aktørLookups.failureExamples.slice(0, 3))
  }

  return { meetings: allMeetings, stats }
}
