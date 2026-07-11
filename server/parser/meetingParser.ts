import fs from 'node:fs'
import path from 'node:path'
import logger from '../../utils/logger'
import type { SQL } from 'drizzle-orm'
import { and, eq, isNull, sql } from 'drizzle-orm'
import type { X2jOptions } from 'fast-xml-parser'
import { XMLParser } from 'fast-xml-parser'
import { glob } from 'glob'
import { $fetch } from 'ofetch'
import { db } from '../api/db'
import { aktør, idmap, møde, periode, sag, taleSegmentChunk, taleSegmentRaw } from '../database/schema'

// Configuration
let skipEmbeddings = false

export function setSkipEmbeddings(skip: boolean) {
  skipEmbeddings = skip
}

// ── In-memory caches ────────────────────────────────────────────────────
// Loaded once at startup via initCaches(), eliminates most DB round-trips.

const aktørNameCache = new Map<string, number>()       // "fornavn|efternavn" → id
const aktørTingdokCache = new Map<string, number>()    // tingdokID (originalid) → aktør id
const periodeKodeCache = new Map<string, number>()     // kode (where type=samling) → id
const mødeCache = new Map<string, number>()            // "periodeId|nummer" → id (where typeid=1)
let cachesInitialized = false

export async function initCaches(): Promise<void> {
  if (cachesInitialized) return

  console.log('Loading lookup caches...')

  // Load all aktører
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
  }

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
  }

  // Load idmap (tingdokID → aktør id)
  const allIdmap = await db
    .select({ id: idmap.id, originalid: idmap.originalid })
    .from(idmap)
    .where(eq(idmap.entity, 'Aktør'))
  for (const m of allIdmap) {
    aktørTingdokCache.set(m.originalid, m.id)
  }

  cachesInitialized = true
  console.log(`  Caches loaded: ${aktørNameCache.size} aktører, ${aktørTingdokCache.size} idmap, ${periodeKodeCache.size} perioder, ${mødeCache.size} møder`)
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

// ── XML helpers ─────────────────────────────────────────────────────────
// fast-xml-parser returns plain values when elements have no attributes,
// but objects with '#text' when they do.
function xmlText(el: unknown): string {
  if (el == null) return ''
  if (typeof el === 'object' && '#text' in (el as Record<string, unknown>)) {
    return String((el as Record<string, unknown>)['#text'])
  }
  return String(el)
}

function xmlAttr(el: unknown, attr: string): string | undefined {
  if (el != null && typeof el === 'object' && attr in (el as Record<string, unknown>)) {
    return String((el as Record<string, unknown>)[attr])
  }
  return undefined
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
  fornavn?: string
  efternavn?: string
}

interface MetaSubItem {
  ItemNo?: string
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
      EndDateTime: string
    }
  }
  Taler: {
    MetaSpeakerMP: MetaSpeakerMP
  }
}

interface ParsingStats {
  totalMeetings: number
  successfulMeetings: number
  failedMeetings: number
  skippedMeetings: number
  agendaItems: {
    total: number
    successful: number
    failed: number
    failureExamples: Array<{
      itemNo?: string
      error: string
    }>
  }
  sagLookups: {
    total: number
    successful: number
    failed: number
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
    failureExamples: Array<{
      name?: string
      tingdokID?: string
      error: string
    }>
  }
}

// ── Lookup functions (cache-aware) ──────────────────────────────────────

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

  // Fall back to name matching
  const fornavn = item.OratorFirstName || item.fornavn
  const efternavn = item.OratorLastName || item.efternavn

  if (fornavn && efternavn) {
    const key = `${fornavn}|${efternavn}`
    const id = aktørNameCache.get(key)
    if (id) {
      stats.aktørLookups.successful++
      return id
    }
  }

  stats.aktørLookups.failed++
  stats.aktørLookups.failureExamples.push({
    name: `${item.OratorFirstName || item.fornavn} ${item.OratorLastName || item.efternavn}`,
    tingdokID: item['@_tingdokID'],
    error: 'No matching aktør found',
  })
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
    const fornavn = item.OratorFirstName || item.fornavn
    const efternavn = item.OratorLastName || item.efternavn

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
    stats.aktørLookups.failureExamples.push({
      name: `${item.OratorFirstName || item.fornavn} ${item.OratorLastName || item.efternavn}`,
      tingdokID: item['@_tingdokID'],
      error: 'No matching aktør found',
    })
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

// ── Text extraction ─────────────────────────────────────────────────────

function extractTextContent(tekstGruppe: unknown): string {
  if (!tekstGruppe) return ''

  if (typeof tekstGruppe === 'string')
    return tekstGruppe.trim()

  if (Array.isArray(tekstGruppe))
    return tekstGruppe.map(extractTextContent).join(' ')

  if (typeof tekstGruppe === 'object' && tekstGruppe !== null) {
    if ('#text' in tekstGruppe && typeof tekstGruppe['#text'] === 'string')
      return tekstGruppe['#text'].trim()

    return Object.entries(tekstGruppe)
      .filter(([key]) => !key.startsWith('@_'))
      .map(([_, value]) => extractTextContent(value))
      .join(' ')
  }

  return ''
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
  sluttid: string
  lastModified: string | null
  sagid: number | undefined
  aktørid: number
  opdateringsdato: string
}

// ── Main parsing functions ──────────────────────────────────────────────

/**
 * Processes tale segments. When caches are initialized:
 * - Resolves aktørId from in-memory cache (no DB)
 * - Collects all segment values, then batch-inserts them
 * When caches are not initialized, falls back to per-row DB lookups.
 */
async function processTaleSegments(
  taler: RawTale[],
  mødeid: number,
  sagId: number | undefined,
  stats: ParsingStats,
): Promise<Tale[]> {
  const parsedTaler: Tale[] = []
  const batchValues: SegmentInsertValue[] = []

  for (const tale of taler) {
    try {
      const segments = Array.isArray(tale.TaleSegment) ? tale.TaleSegment : [tale.TaleSegment]

      for (const segment of segments) {
        const rawContent = extractTextContent(segment.TekstGruppe)

        const aktørId = await findAktørId(tale.Taler.MetaSpeakerMP, stats)
        if (!aktørId) continue

        if (cachesInitialized && skipEmbeddings) {
          // Fast path: collect for batch insert, no per-row DB queries
          batchValues.push({
            content: rawContent,
            mødeid,
            starttid: segment.MetaSpeechSegment.StartDateTime,
            sluttid: segment.MetaSpeechSegment.EndDateTime,
            lastModified: segment.MetaSpeechSegment.LastModified || null,
            sagid: sagId,
            aktørid: aktørId,
            opdateringsdato: new Date().toISOString(),
          })

          parsedTaler.push({
            aktørTingdokID: aktørId,
            LastModified: segment?.MetaSpeechSegment?.LastModified || null,
            EdixiStatus: segment?.MetaSpeechSegment?.EdixiStatus || '',
            StartDateTime: segment?.MetaSpeechSegment?.StartDateTime || null,
            EndDateTime: segment?.MetaSpeechSegment?.EndDateTime || null,
            content: rawContent,
            sagId,
            chunkIndex: 0,
          })
        } else {
          // Slow path: per-row dedup check + insert + optional embeddings
          const existingSegment = await db
            .select({ id: taleSegmentRaw.id })
            .from(taleSegmentRaw)
            .where(
              and(
                eq(taleSegmentRaw.mødeid, mødeid),
                eq(taleSegmentRaw.starttid, segment.MetaSpeechSegment.StartDateTime),
                eq(taleSegmentRaw.sluttid, segment.MetaSpeechSegment.EndDateTime),
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
                sluttid: segment.MetaSpeechSegment.EndDateTime,
                lastModified: segment.MetaSpeechSegment.LastModified,
                sagid: sagId,
                aktørid: aktørId,
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
            EndDateTime: segment?.MetaSpeechSegment?.EndDateTime || null,
            content: rawContent,
            sagId,
            chunkIndex: 0,
          })
        }
      }
    } catch (error: unknown) {
      stats.agendaItems.failed++
      stats.agendaItems.failureExamples.push({
        error: error instanceof Error ? error.message : 'Unknown tale processing error',
      })
      logger.error('Error processing tale:', error)
    }
  }

  // Batch insert all collected segments (chunks of 500 to avoid query size limits)
  if (batchValues.length > 0) {
    const BATCH_SIZE = 500
    for (let i = 0; i < batchValues.length; i += BATCH_SIZE) {
      const chunk = batchValues.slice(i, i + BATCH_SIZE)
      await db.insert(taleSegmentRaw).values(chunk)
    }
  }

  return parsedTaler
}

async function findSagId(metaFTAgendaItem: MetaFTAgendaItem, mødeid: number, stats: ParsingStats): Promise<number | undefined> {
  stats.sagLookups.total++

  let sagId: number | undefined

  try {
    if (metaFTAgendaItem.FTCase && metaFTAgendaItem.FTCase['@_tingdokID'] !== '') {
      // idmap is empty — skip tingdokID lookup, go straight to fallback
      sagId = undefined
    }
  } catch (error) {
    // Fall through to fallback
  }

  // Fallback: lookup by case number + type + period
  if (!sagId) {
    try {
      const mødeResult = await db.select({ periodeid: møde.periodeid }).from(møde).where(eq(møde.id, mødeid)).limit(1)
      const periodeId = mødeResult[0]?.periodeid

      if (periodeId) {
        const conditions: SQL<unknown>[] = [eq(sag.periodeid, periodeId)]
        if (metaFTAgendaItem.FTCaseNumber) {
          conditions.push(eq(sag.nummernumerisk, metaFTAgendaItem.FTCaseNumber))
        }
        if (metaFTAgendaItem.FTCaseType) {
          conditions.push(eq(sag.nummerprefix, metaFTAgendaItem.FTCaseType))
        }

        if (conditions.length > 1) {
          const sagResult = await db
            .select({ id: sag.id })
            .from(sag)
            .where(and(...conditions))
            .limit(1)
          sagId = sagResult[0]?.id
        }
      }
    } catch {
      // Sag lookup failed, continue without sagId
    }
  }

  if (!sagId) {
    stats.sagLookups.failed++
    stats.sagLookups.failureExamples.push({
      caseNumber: metaFTAgendaItem.FTCaseNumber,
      caseType: metaFTAgendaItem.FTCaseType,
      error: 'No matching sag found',
    })
  } else {
    stats.sagLookups.successful++
  }

  return sagId
}

async function parseSubAgendaItems(
  subItems: RawSubItem[],
  mødeid: number,
  parentSagId: number | undefined,
  stats: ParsingStats,
): Promise<SubItem[]> {
  try {
    return await Promise.all(
      subItems.map(async (subItem: RawSubItem) => {
        const metaSubItem = subItem.MetaFTAgendaSubItem || {}

        const newSubItem: SubItem = {
          ItemNo: metaSubItem.ItemNo || '',
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

async function parseAgendaItem(item: RawAgendaItem, mødeid: number, stats: ParsingStats): Promise<ParsedAgendaItem> {
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

      for (const aktivitet of activities) {
        if (aktivitet.DagsordenUnderpunkt) {
          const subItems = Array.isArray(aktivitet.DagsordenUnderpunkt) ? aktivitet.DagsordenUnderpunkt : [aktivitet.DagsordenUnderpunkt]
          agendaItem.subItems = await parseSubAgendaItems(
            subItems.map((p): RawSubItem => p as RawSubItem),
            mødeid,
            sagId,
            stats,
          )
        }

        if (aktivitet.Tale) {
          const taler = Array.isArray(aktivitet.Tale) ? aktivitet.Tale : [aktivitet.Tale]
          agendaItem.taler = await processTaleSegments(
            taler.map((t): RawTale => t as RawTale),
            mødeid,
            sagId,
            stats,
          )
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

  const rawDp = result.Dokument.DagsordenPunkt || []
  const agendaItems = (Array.isArray(rawDp) ? rawDp : [rawDp]) as RawAgendaItem[]

  const parsedAgendaItems = await Promise.allSettled(
    agendaItems.map((item: RawAgendaItem) => parseAgendaItem(item, mødeid, stats)),
  )

  const successfulItems = parsedAgendaItems
    .filter((r): r is PromiseFulfilledResult<ParsedAgendaItem> => r.status === 'fulfilled')
    .map((r) => r.value)

  meetingData.agendaItems = successfulItems

  return meetingData
}

export async function parseMeetings(
  meetingKey?: string,
): Promise<{ meetings: Record<string, MeetingData>; stats: ParsingStats }> {
  const stats: ParsingStats = {
    totalMeetings: 0,
    successfulMeetings: 0,
    failedMeetings: 0,
    skippedMeetings: 0,
    agendaItems: {
      total: 0,
      successful: 0,
      failed: 0,
      failureExamples: [],
    },
    sagLookups: {
      total: 0,
      successful: 0,
      failed: 0,
      failureExamples: [],
    },
    aktørLookups: {
      total: 0,
      successful: 0,
      failed: 0,
      failureExamples: [],
    },
  }

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
      failureRate: `${((stats.agendaItems.failed / stats.agendaItems.total) * 100).toFixed(2)}%`,
    },
    sagLookups: {
      total: stats.sagLookups.total,
      successful: stats.sagLookups.successful,
      failed: stats.sagLookups.failed,
      failureRate: `${((stats.sagLookups.failed / stats.sagLookups.total) * 100).toFixed(2)}%`,
    },
    aktørLookups: {
      total: stats.aktørLookups.total,
      successful: stats.aktørLookups.successful,
      failed: stats.aktørLookups.failed,
      failureRate: `${((stats.aktørLookups.failed / stats.aktørLookups.total) * 100).toFixed(2)}%`,
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
