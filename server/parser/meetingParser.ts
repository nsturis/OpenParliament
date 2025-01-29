import fs from 'node:fs'
import path from 'node:path'
import logger from '../../utils/logger'
import type { SQL } from 'drizzle-orm'
import { and, eq, isNull } from 'drizzle-orm'
import type { X2jOptions } from 'fast-xml-parser'
import { XMLParser } from 'fast-xml-parser'
import { glob } from 'glob'
import { $fetch } from 'ofetch'
import { db } from '../api/db'
import { aktør, idmap, møde, periode, sag, taleSegmentChunk, taleSegmentRaw } from '../database/schema'

// Interfaces
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

// Utility functions
async function extractTingdokID(tingdokID: string, entity: string): Promise<number | undefined> {
  logger.info(`Extracting TingdokID for ${entity}:`, { tingdokID })

  const mappedId = await db
    .select({ id: idmap.id })
    .from(idmap)
    .where(and(eq(idmap.originalid, tingdokID), eq(idmap.entity, entity)))
    .limit(1)

  logger.info(`Mapped ID for ${entity}:`, {
    tingdokID,
    mappedId: mappedId[0]?.id,
  })
  return mappedId[0]?.id
}

/**
 * Extracts text content from various data structures.
 * This function handles strings, arrays, and nested objects.
 * It removes all attributes in the extracted text content.
 *
 * @param tekstGruppe - The input data structure containing text content
 * @returns A string of extracted and concatenated text content without attributes
 */
function extractTextContent(tekstGruppe: unknown): string {
  if (!tekstGruppe) return ''

  if (typeof tekstGruppe === 'string')
    return tekstGruppe.trim()

  if (Array.isArray(tekstGruppe))
    return tekstGruppe.map(extractTextContent).join(' ')

  if (typeof tekstGruppe === 'object' && tekstGruppe !== null) {
    // If the node itself has a #text property, return that text.
    if ('#text' in tekstGruppe && typeof tekstGruppe['#text'] === 'string')
      return tekstGruppe['#text'].trim()

    // Else, recurse into any child properties that are not attributes (i.e., skip keys starting with "@_").
    return Object.entries(tekstGruppe)
      .filter(([key]) => !key.startsWith('@_'))  // <--- Skip all XML attributes
      .map(([_, value]) => extractTextContent(value))
      .join(' ')
  }

  return ''
}

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
// Main parsing functions
/**
 * Processes an array of RawTale segments, checking each one for an existing entry in:
 *  1) taleSegmentRaw (to see if it's already been inserted)
 *  2) taleSegmentChunk (to see if embeddings have already been generated)
 * 
 * If either is missing, it proceeds with insertion or embedding generation accordingly.
 */
async function processTaleSegments(
  taler: RawTale[],
  mødeid: number,
  sagId: number | undefined,
  stats: ParsingStats,
): Promise<Tale[]> {
  const parsedTaler: Tale[] = []

  for (const tale of taler) {
    try {
      // A "TaleSegment" can actually be an array in some XML data
      const segments = Array.isArray(tale.TaleSegment) ? tale.TaleSegment : [tale.TaleSegment]

      for (const segment of segments) {
        // 1) Extract raw text from the XML
        const rawContent = extractTextContent(segment.TekstGruppe)

        // 2) Find aktør (speaker) ID from DB
        const aktørTingdokID = await findAktørId(tale.Taler.MetaSpeakerMP, stats)
        if (!aktørTingdokID) {
          logger.error('No aktørTingdokID found for tale:', tale)
          continue
        }

        // 3) Check for an existing matching segment in taleSegmentRaw
        //    We'll match on mødeid, start/end time, aktørID, sagId, and content
        const existingSegment = await db
          .select({ id: taleSegmentRaw.id })
          .from(taleSegmentRaw)
          .where(
            and(
              eq(taleSegmentRaw.mødeid, mødeid),
              eq(taleSegmentRaw.starttid, segment.MetaSpeechSegment.StartDateTime),
              eq(taleSegmentRaw.sluttid, segment.MetaSpeechSegment.EndDateTime),
              eq(taleSegmentRaw.aktørid, aktørTingdokID),
              sagId == null
                ? isNull(taleSegmentRaw.sagid)
                : eq(taleSegmentRaw.sagid, sagId),
              eq(taleSegmentRaw.content, rawContent),
            ),
          )
          .limit(1)

        let rawSegmentId: number

        if (existingSegment.length > 0) {
          // 3a) If it exists, re-use its ID so we can check embeddings
          rawSegmentId = existingSegment[0].id
          logger.info(
            `Skipping insertion for existing taleSegmentRaw (id=${rawSegmentId}, mødeid=${mødeid}, aktørid=${aktørTingdokID})`,
          )
        } else {
          // 3b) Insert a new raw segment if none existed
          const [rawSegment] = await db
            .insert(taleSegmentRaw)
            .values({
              content: rawContent,
              mødeid,
              starttid: segment.MetaSpeechSegment.StartDateTime,
              sluttid: segment.MetaSpeechSegment.EndDateTime,
              lastModified: segment.MetaSpeechSegment.LastModified,
              sagid: sagId,
              aktørid: aktørTingdokID,
              opdateringsdato: new Date().toISOString(),
            })
            .returning()
          rawSegmentId = rawSegment.id
          logger.info(`Inserted new taleSegmentRaw (id=${rawSegmentId})`)
        }

        // 4) Check if embeddings are already generated for this segment
        const existingChunks = await db
          .select({ id: taleSegmentChunk.id })
          .from(taleSegmentChunk)
          .where(eq(taleSegmentChunk.taleSegmentId, rawSegmentId))
          .limit(1)

        // If no embeddings are found, generate them
        if (existingChunks.length === 0) {
          const embeddingResponse = await generateEmbedding(rawContent)
          if (embeddingResponse?.status === 'success') {
            // Store each chunk with its embedding
            for (let i = 0; i < embeddingResponse.chunks.length; i++) {
              await db.insert(taleSegmentChunk).values({
                taleSegmentId: rawSegmentId,
                content: embeddingResponse.chunks[i],
                embedding: embeddingResponse.embeddings[i],
                chunkIndex: i,
                totalChunks: embeddingResponse.chunks.length,
              })
            }
            logger.info(`Generated and inserted embeddings for taleSegmentRaw (id=${rawSegmentId})`)
          } else {
            logger.warn(`Failed to generate embedding for taleSegmentRaw (id=${rawSegmentId})`)
          }
        } else {
          logger.info(`Embeddings already exist for taleSegmentRaw (id=${rawSegmentId}). Skipping generation.`)
        }

        // 5) Add the final data to the response structure in memory
        parsedTaler.push({
          aktørTingdokID,
          LastModified: segment?.MetaSpeechSegment?.LastModified || null,
          EdixiStatus: segment?.MetaSpeechSegment?.EdixiStatus || '',
          StartDateTime: segment?.MetaSpeechSegment?.StartDateTime || null,
          EndDateTime: segment?.MetaSpeechSegment?.EndDateTime || null,
          content: rawContent,
          sagId,
          chunkIndex: 0, // for backward compatibility
        })
      }
    } catch (error: unknown) {
      // Log and collect errors in stats
      stats.agendaItems.failed++
      stats.agendaItems.failureExamples.push({
        error: error instanceof Error ? error.message : 'Unknown tale processing error',
      })
      logger.error('Error processing tale:', error)
      logger.error('Problematic tale data:', JSON.stringify(tale, null, 2))
    }
  }

  return parsedTaler
}

async function findAktørId(item: MetaSpeakerMP, stats: ParsingStats): Promise<number | undefined> {
  stats.aktørLookups.total++

  let aktørId: number | undefined

  // First, try to get the aktørId using the tingdokID
  if (item['@_tingdokID']) {
    aktørId = await extractTingdokID(item['@_tingdokID'], 'Aktør')
  }

  // If aktørId is not found using tingdokID, look it up using name
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
  logger.info('Finding møde ID for:', metadata)

  let periodeId: number | undefined

  // First, try to get the periodeId using the periodeTingdokID
  if (metadata.ParliamentarySession['@_tingdokID']) {
    periodeId = await extractTingdokID(metadata.ParliamentarySession['@_tingdokID'], 'Periode')
  }

  // If periodeId is not found using tingdokID, look it up using ParliamentarySession
  if (!periodeId) {
    const periodeResult = await db
      .select({ id: periode.id })
      .from(periode)
      .where(and(eq(periode.kode, metadata.ParliamentarySession['#text']), eq(periode.type, 'samling')))
      .limit(1)

    periodeId = periodeResult[0]?.id
  }

  logger.info('Found periodeId:', periodeId)

  if (!periodeId) {
    logger.warn(`No periode found for parlamentariskSession: ${metadata.ParliamentarySession['#text']}`)
    return undefined
  }

  // Now, find the correct møde based on the periode, mødeNummer, and typeid = 1
  const mødeResult = await db
    .select({
      id: møde.id,
      nummer: møde.nummer,
      typeid: møde.typeid,
      periodeid: møde.periodeid,
    })
    .from(møde)
    .where(and(eq(møde.periodeid, periodeId), eq(møde.nummer, metadata.MeetingNumber.toString()), eq(møde.typeid, 1)))
    .limit(1)

  logger.info('Møde query result:', mødeResult)

  if (!mødeResult.length) {
    logger.warn(`No møde found for periode: ${periodeId}, mødeNummer: ${metadata.MeetingNumber}, typeid: 1`)
    return undefined
  }

  return mødeResult[0].id
}

async function findSagId(metaFTAgendaItem: MetaFTAgendaItem, mødeid: number, stats: ParsingStats): Promise<number | undefined> {
  stats.sagLookups.total++
  logger.info('Finding sagId for:', { metaFTAgendaItem, mødeid })

  let sagId: number | undefined

  try {
    if (metaFTAgendaItem.FTCase && metaFTAgendaItem.FTCase['@_tingdokID'] !== '') {
      sagId = await extractTingdokID(metaFTAgendaItem.FTCase['@_tingdokID'], 'Sag')
      logger.info('Extracted sagId using FTCaseTingdokID:', {
        sagId,
        FTCaseTingdokID: metaFTAgendaItem.FTCase['@_tingdokID'],
      })
    }
  } catch (error) {
    logger.error('Error extracting sagId:', error)
    const periodeId = await findPeriodeId(mødeid)
    logger.info('Found periodeId:', { periodeId, mødeid })

    if (!periodeId) {
      logger.warn(`No periode found for møde: ${mødeid}`)
      return undefined
    }

    const conditions: SQL<unknown>[] = [eq(sag.periodeid, periodeId)]

    if (metaFTAgendaItem.FTCaseNumber) {
      conditions.push(eq(sag.nummernumerisk, metaFTAgendaItem.FTCaseNumber))
    }
    if (metaFTAgendaItem.FTCaseType) {
      conditions.push(eq(sag.nummerprefix, metaFTAgendaItem.FTCaseType))
    }
    const sagResult = await db
      .select({ id: sag.id })
      .from(sag)
      .where(and(...conditions))
      .limit(1)

    sagId = sagResult[0]?.id
    logger.info('Extracted sagId using fallback method:', {
      sagId,
      FTCaseNumber: metaFTAgendaItem.FTCaseNumber,
      FTCaseType: metaFTAgendaItem.FTCaseType,
      periodeId,
    })
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

// Helper function to find periodeId for a given mødeid
async function findPeriodeId(mødeid: number): Promise<number | undefined> {
  const mødeResult = await db.select({ periodeid: møde.periodeid }).from(møde).where(eq(møde.id, mødeid)).limit(1)

  return mødeResult[0]?.periodeid
}

async function parseSubAgendaItems(
  subItems: RawSubItem[],
  mødeid: number,
  parentSagId: number | undefined,
  stats: ParsingStats,
): Promise<SubItem[]> {
  logger.info('Parsing sub-items:', {
    mødeid,
    parentSagId,
    subItemsCount: subItems.length,
  })

  try {
    return await Promise.all(
      subItems.map(async (subItem: RawSubItem) => {
        const metaSubItem = subItem.MetaFTAgendaSubItem || {}
        logger.info('Processing sub-item:', { metaSubItem })

        const newSubItem: SubItem = {
          ItemNo: metaSubItem.ItemNo || '',
          FTCaseTingdokID: metaSubItem.FTCase?.['@_tingdokID'] || '',
          FTCaseNumber: metaSubItem.FTCaseNumber || '',
          FTCaseType: metaSubItem.FTCaseType || '',
          ShortTitle: metaSubItem.ShortTitle || '',
          taler: [],
        }

        // const sagId = (await extractTingdokID(metaSubItem.FTCase?.['@_tingdokID'] ?? '', 'Sag')) || parentSagId

        const sagId = (metaSubItem.FTCase ? await findSagId(metaSubItem, mødeid, stats) : parentSagId)

        logger.info('Extracted sagId for sub-item:', {
          sagId,
          FTCaseTingdokID: newSubItem.FTCaseTingdokID,
        })

        if (subItem.Tale) {
          const taler = Array.isArray(subItem.Tale) ? subItem.Tale : [subItem.Tale]
          newSubItem.taler = await processTaleSegments(
            taler.map((t): RawTale => t as RawTale),
            mødeid,
            sagId,
            stats,
          )
        }

        logger.info('Parsed sub-item:', {
          ItemNo: newSubItem.ItemNo,
          talerCount: newSubItem.taler.length,
        })
        return newSubItem
      }),
    )
  } catch (error: unknown) {
    logger.error('Error parsing sub-items:', error)
    if (error instanceof Error) {
      logger.error('Error details:', error.message)
    }
    return []
  }
}

async function parseAgendaItem(item: RawAgendaItem, mødeid: number, stats: ParsingStats): Promise<ParsedAgendaItem> {
  stats.agendaItems.total++
  try {
    const metaFTAgendaItem = item.MetaFTAgendaItem || {}
    logger.info('Parsing agenda item:', { mødeid, metaFTAgendaItem })

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
          agendaItem.subItems = await parseSubAgendaItems(
            aktivitet.DagsordenUnderpunkt.map((p): RawSubItem => p as RawSubItem),
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
    parlamentariskSession: metaMeeting.ParliamentarySession['@_tingdokID'],
    periodeTingdokID: metaMeeting.ParliamentarySession['@_tingdokID'],
    aktørGruppe: metaMeeting.ParliamentaryGroup['@_tingdokID'],
    aktørTingdokID: metaMeeting.ParliamentaryGroup['@_tingdokID'],
    mødeDato: metaMeeting.DateOfSitting,
    mødeNummer: Number.parseInt(metaMeeting.MeetingNumber, 10),
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
  logger.info('Parsing meeting XML:', filePath)
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

  const agendaItems = (result.Dokument.DagsordenPunkt || []) as RawAgendaItem[]
  logger.info(`Parsing agenda items:`, {
    agendaItemsCount: agendaItems.length,
    mødeid,
  })

  const parsedAgendaItems = await Promise.allSettled(
    agendaItems.map((item: RawAgendaItem) => parseAgendaItem(item, mødeid, stats)),
  )

  const successfulItems = parsedAgendaItems
    .filter((r): r is PromiseFulfilledResult<ParsedAgendaItem> => r.status === 'fulfilled')
    .map((r) => r.value)

  const failedItems = parsedAgendaItems.filter(
    (r): r is PromiseRejectedResult => r.status === 'rejected',
  )

  failedItems.forEach((item) => logger.error('Failed to parse agenda item:', item.reason))

  meetingData.agendaItems = successfulItems

  logger.info(`Parsed meeting data:`, {
    metadata: meetingData.metadata,
    agendaItemsCount: meetingData.agendaItems.length,
    mødeid,
  })

  return meetingData
}

export async function parseMeetings(
  meetingKey?: string,
): Promise<{ meetings: Record<string, MeetingData>; stats: ParsingStats }> {
  const stats: ParsingStats = {
    totalMeetings: 0,
    successfulMeetings: 0,
    failedMeetings: 0,
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

  // Log final statistics
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

  // Log some example failures
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
