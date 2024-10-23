import type { X2jOptions } from 'fast-xml-parser'
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import consola from 'consola'
import { $fetch } from 'ofetch'
import { db } from '../api/db'
import {
  taleSegment,
  idmap,
  aktør,
  møde,
  sag,
  periode,
} from '../database/schema'
import { eq, and } from 'drizzle-orm'

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
  FTCaseTingdokID?: string
  FullText?: string
  taler: Tale[]
  subItems?: SubItem[]
}

interface SubItem {
  SubItemNo: string
  FTCaseTingdokID: number
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

interface TaleSegment {
  TekstGruppe?: {
    Exitus: Array<{
      Linea: Array<{
        Char:
          | string
          | Array<{
              '#text'?: string
              '@_formaChar'?: string
            }>
      }>
    }>
  }
  MetaSpeechSegment: {
    LastModified: string
    EdixiStatus: string
    StartDateTime: string
    EndDateTime: string
  }
}

// Utility functions
async function extractTingdokID(
  tingdokID: string,
  entity: string
): Promise<number | undefined> {
  consola.info(`Extracting TingdokID for ${entity}:`, { tingdokID })

  const mappedId = await db
    .select({ id: idmap.id })
    .from(idmap)
    .where(and(eq(idmap.originalid, tingdokID), eq(idmap.entity, entity)))
    .limit(1)

  consola.info(`Mapped ID for ${entity}:`, {
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

  if (typeof tekstGruppe === 'string') return tekstGruppe.trim()

  if (Array.isArray(tekstGruppe)) {
    return tekstGruppe.map(extractTextContent).join(' ')
  }

  if (typeof tekstGruppe === 'object' && tekstGruppe !== null) {
    if ('#text' in tekstGruppe && typeof tekstGruppe['#text'] === 'string') {
      return tekstGruppe['#text'].trim()
    }
    return Object.values(tekstGruppe)
      .filter((value): value is string | object => value != null)
      .map(extractTextContent)
      .join(' ')
  }

  return ''
}

type DocumentResponse = {
  status: string
  chunks: string[]
  embeddings: number[][]
}

async function generateEmbedding(
  text: string
): Promise<DocumentResponse | null> {
  try {
    const response: DocumentResponse = await $fetch(
      'http://127.0.0.1:8000/process_document_embeddings',
      {
        method: 'POST',
        body: { text },
        retry: 3, // Add retry logic
        retryDelay: 10000, // Wait 1 second between retries
      }
    )
    return response
  } catch (error) {
    consola.error('Failed to generate embedding:', error.detail)
    return null // Return null instead of throwing an error
  }
}

async function saveTaleToDatabase(
  taler: Tale[],
  mødeid: number,
  sagId: number | undefined
): Promise<Tale[]> {
  for (const tale of taler) {
    if (!tale?.aktørTingdokID) {
      consola.warn('Missing aktørTingdokID for tale:', tale)
      // Resolve promise with a warning and continue
      return Promise.resolve([tale])
    }

    const aktørTingdokID = tale.aktørTingdokID

    consola.info(`Attempting to save tale chunks in database:`, {
      aktørTingdokID,
      taler,
      sagId,
      mødeid,
    })
    try {
      await db.insert(taleSegment).values({
        content: tale.content,
        mødeid,
        starttid: tale.StartDateTime,
        sluttid: tale.EndDateTime,
        lastModified: tale.LastModified,
        aktørid: tale.aktørTingdokID,
        opdateringsdato: new Date().toISOString(),
        embedding: tale.embedding,
        sagid: tale.sagId,
        chunkIndex: tale.chunkIndex,
      })
    } catch (error) {
      consola.error('Error saving tale chunks in database:', error)
      if (error instanceof Error) {
        consola.error('Error message:', error.message)
        consola.error('Error stack:', error.stack)
      }
    }
  }
}

// Main parsing functions
async function processTaleSegments(
  taler: any[],
  mødeid: number,
  sagId: number | undefined
): Promise<Tale[]> {
  const parsedTaler: Tale[] = []

  for (const tale of taler) {
    if (!tale) {
      consola.warn('Encountered undefined tale, skipping...')
      continue
    }

    try {
      const segments = Array.isArray(tale.TaleSegment)
        ? tale.TaleSegment
        : [tale.TaleSegment]
      for (const segment of segments) {
        if (!segment?.TekstGruppe) {
          consola.warn('No TekstGruppe found for speech segment:', {
            segment,
            tale,
          })
          continue
        }

        const speechMetadata = segment?.MetaSpeechSegment || {}
        const content = extractTextContent(segment.TekstGruppe)

        const aktørTingdokID = await findAktørId(tale.Taler?.MetaSpeakerMP)
        let chunks: string[] = []
        let embeddings: number[][] = []
        try {
          // Generate embedding with chunking
          const embeddingResponse = await generateEmbedding(content)

          if (!embeddingResponse) {
            consola.warn('Failed to generate embedding for tale segment:', {
              content,
            })
            continue // Skip this tale if embedding generation failed
          }

          const {
            status,
            chunks: responseChunks,
            embeddings: responseEmbeddings,
          } = embeddingResponse

          if (status === 'success' && responseChunks && responseEmbeddings) {
            chunks = responseChunks
            embeddings = responseEmbeddings
          } else {
            consola.warn(
              `Unexpected response from embedding service:`,
              embeddingResponse
            )
          }
        } catch (error) {
          consola.error(`Failed to generate embedding for tale segment:`, error)
          consola.error(content)
          // Create a dummy embedding (all zeros) as fallback
          chunks = [content]
          embeddings = [[0]]
        }

        const processedTaler: Tale[] = chunks.map((chunk, index) => ({
          aktørTingdokID,
          LastModified: speechMetadata.LastModified || null,
          EdixiStatus: speechMetadata.EdixiStatus || '',
          StartDateTime: speechMetadata.StartDateTime || null,
          EndDateTime: speechMetadata.EndDateTime || null,
          content: chunk,
          mødeid,
          embedding: embeddings[index],
          sagId,
          chunkIndex: index,
        }))

        // Save each chunk to the database
        await saveTaleToDatabase(processedTaler, mødeid, sagId)

        parsedTaler.push(...processedTaler)
      }
    } catch (error) {
      consola.error('Error processing tale:', error)
      consola.error('Problematic tale data:', JSON.stringify(tale, null, 2))
    }
  }

  return parsedTaler
}

async function findAktørId(item: any): Promise<number | undefined> {
  consola.info(`Finding aktørId for:`, item)

  let aktørId: number | undefined

  // First, try to get the aktørId using the tingdokID
  if (item['@_tingdokID']) {
    aktørId = await extractTingdokID(item['@_tingdokID'], 'Aktør')
    consola.info(`Extracted aktørId using tingdokID:`, {
      aktørId,
      tingdokID: item['@_tingdokID'],
    })
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

      if (aktørResult.length > 0) {
        aktørId = aktørResult[0].id
        consola.info(`Found aktør by name:`, {
          fornavn,
          efternavn,
          id: aktørId,
        })
      }
    }
  }

  if (!aktørId) {
    consola.warn(`No aktør found for:`, item)
  }

  return aktørId
}

async function findMødeId(
  metadata: MeetingData['metadata']
): Promise<number | undefined> {
  consola.info('Finding møde ID for:', metadata)

  let periodeId: number | undefined

  // First, try to get the periodeId using the periodeTingdokID
  if (metadata.periodeTingdokID) {
    periodeId = await extractTingdokID(metadata.periodeTingdokID, 'Periode')
  }

  // If periodeId is not found using tingdokID, look it up using ParliamentarySession
  if (!periodeId) {
    const periodeResult = await db
      .select({ id: periode.id })
      .from(periode)
      .where(
        and(
          eq(periode.kode, metadata.parlamentariskSession),
          eq(periode.type, 'samling')
        )
      )
      .limit(1)

    periodeId = periodeResult[0]?.id
  }

  consola.info('Found periodeId:', periodeId)

  if (!periodeId) {
    consola.warn(
      `No periode found for parlamentariskSession: ${metadata.parlamentariskSession}`
    )
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
    .where(
      and(
        eq(møde.periodeid, periodeId),
        eq(møde.nummer, metadata.mødeNummer.toString()),
        eq(møde.typeid, 1)
      )
    )
    .limit(1)

  consola.info('Møde query result:', mødeResult)

  if (!mødeResult.length) {
    consola.warn(
      `No møde found for periode: ${periodeId}, mødeNummer: ${metadata.mødeNummer}, typeid: 1`
    )
    return undefined
  }

  return mødeResult[0].id
}

async function findSagId(
  agendaItem: AgendaItem,
  mødeid: number
): Promise<number | undefined> {
  consola.info('Finding sagId for:', { agendaItem, mødeid })

  let sagId: number | undefined

  // First, try to get the sagId using the FTCaseTingdokID
  try {
    sagId = await extractTingdokID(agendaItem.FTCaseTingdokID.toString(), 'Sag')
    consola.info(`Extracted sagId using FTCaseTingdokID:`, {
      sagId,
      FTCaseTingdokID: agendaItem.FTCaseTingdokID,
    })
  } catch (error) {
    const periodeId = await findPeriodeId(mødeid)
    consola.info(`Found periodeId:`, { periodeId, mødeid })

    if (!periodeId) {
      consola.warn(`No periode found for møde: ${mødeid}`)
      return undefined
    }

    const sagResult = await db
      .select({ id: sag.id })
      .from(sag)
      .where(
        and(
          eq(sag.nummernumerisk, agendaItem.FTCaseNumber),
          eq(sag.nummerprefix, agendaItem.FTCaseType),
          eq(sag.periodeid, periodeId)
        )
      )
      .limit(1)

    sagId = sagResult[0]?.id
    consola.info(`Extracted sagId using fallback method:`, {
      sagId,
      FTCaseNumber: agendaItem.FTCaseNumber,
      FTCaseType: agendaItem.FTCaseType,
      periodeId,
    })
  }

  if (!sagId) {
    consola.warn(
      `No sag found for FTCaseNumber: ${agendaItem.FTCaseNumber}, FTCaseType: ${
        agendaItem.FTCaseType
      }, periodeId: ${await findPeriodeId(mødeid)}`
    )
  }

  return sagId
}

// Helper function to find periodeId for a given mødeid
async function findPeriodeId(mødeid: number): Promise<number | undefined> {
  const mødeResult = await db
    .select({ periodeid: møde.periodeid })
    .from(møde)
    .where(eq(møde.id, mødeid))
    .limit(1)

  return mødeResult[0]?.periodeid
}

async function parseSubAgendaItems(
  subItems: any[],
  mødeid: number,
  parentSagId: number | undefined
): Promise<SubItem[]> {
  consola.info(`Parsing sub-items:`, {
    mødeid,
    parentSagId,
    subItemsCount: subItems.length,
  })
  return await Promise.all(
    subItems.map(async (subItem: any) => {
      const metaSubItem = subItem.MetaFTAgendaSubItem || {}
      consola.info(`Processing sub-item:`, { metaSubItem })

      const newSubItem: SubItem = {
        SubItemNo: metaSubItem.SubItemNo || '',
        FTCaseTingdokID: metaSubItem.FTCase?.['@_tingdokID'] || '',
        FTCaseNumber: metaSubItem.FTCaseNumber || '',
        FTCaseType: metaSubItem.FTCaseType || '',
        ShortTitle: metaSubItem.ShortTitle || '',
        taler: [],
      }

      const sagId =
        (await extractTingdokID(metaSubItem.FTCase, 'Sag')) || parentSagId
      consola.info(`Extracted sagId for sub-item:`, {
        sagId,
        FTCaseTingdokID: newSubItem.FTCaseTingdokID,
      })

      if (subItem.Tale) {
        const taler = Array.isArray(subItem.Tale)
          ? subItem.Tale
          : [subItem.Tale]
        newSubItem.taler = await processTaleSegments(taler, mødeid, sagId)
      }

      consola.info(`Parsed sub-item:`, {
        SubItemNo: newSubItem.SubItemNo,
        talerCount: newSubItem.taler.length,
      })
      return newSubItem
    })
  )
}

async function parseAgendaItem(
  item: any,
  mødeid: number
): Promise<ParsedAgendaItem> {
  try {
    const metaFTAgendaItem = item.MetaFTAgendaItem || {}
    consola.info(`Parsing agenda item:`, { mødeid, metaFTAgendaItem })

    const FTCaseTingdokID = await extractTingdokID(
      metaFTAgendaItem.FTCase,
      'Sag'
    )

    const agendaItem: AgendaItem = {
      ItemNo: metaFTAgendaItem.ItemNo,
      FTCaseNumber: metaFTAgendaItem.FTCaseNumber,
      FTCaseType: metaFTAgendaItem.FTCaseType,
      FTCaseStage: metaFTAgendaItem.FTCaseStage,
      ShortTitle: metaFTAgendaItem.ShortTitle,
      FTCaseTingdokID,
      FullText: extractTextContent(item.PunktTekst),
      subItems: [],
      taler: [],
    }

    const sagId = await findSagId(agendaItem, mødeid)

    consola.info(`Found sagId for agenda item:`, {
      sagId,
      FTCaseTingdokID: agendaItem.FTCaseTingdokID,
      FTCaseNumber: agendaItem.FTCaseNumber,
      FTCaseType: agendaItem.FTCaseType,
    })

    if (item.Aktivitet) {
      const activities = Array.isArray(item.Aktivitet)
        ? item.Aktivitet
        : [item.Aktivitet]
      consola.info(`Processing activities:`, {
        activitiesCount: activities.length,
      })

      for (const aktivitet of activities) {
        if (aktivitet.DagsordenUnderpunkt) {
          agendaItem.subItems = await parseSubAgendaItems(
            aktivitet.DagsordenUnderpunkt,
            mødeid,
            sagId
          )
        }

        if (aktivitet.Tale) {
          const taler = Array.isArray(aktivitet.Tale)
            ? aktivitet.Tale
            : [aktivitet.Tale]
          agendaItem.taler = await processTaleSegments(taler, mødeid, sagId)
        }
      }
    }

    consola.info(`Parsed agenda item:`, {
      ItemNo: agendaItem.ItemNo,
      talerCount: agendaItem.taler.length,
      subItemsCount: agendaItem.subItems?.length,
    })
    return agendaItem
  } catch (error) {
    consola.error('Error parsing agenda item:', error)
    return {
      ItemNo: item.MetaFTAgendaItem?.ItemNo || 'Unknown',
      ShortTitle: item.MetaFTAgendaItem?.ShortTitle || 'Unknown',
      taler: [],
      sagId: undefined,
      subItems: [],
    }
  }
}

async function extractMeetingMetadata(
  metaMeeting: any
): Promise<MeetingData['metadata']> {
  return {
    parlamentariskSession: metaMeeting.ParliamentarySession,
    periodeTingdokID: metaMeeting.ParliamentarySession['@_tingdokID'],
    aktørGruppe: metaMeeting.ParliamentaryGroup,
    aktørTingdokID: metaMeeting.ParliamentaryGroup['@_tingdokID'],
    mødeDato: metaMeeting.DateOfSitting,
    mødeNummer: parseInt(metaMeeting.MeetingNumber, 10),
    lokale: metaMeeting.Location,
  }
}

// function createParserOptions(): X2jOptions {
//   return {
//     ignoreAttributes: false,
//     attributeNamePrefix: '@_',
//     textNodeName: '#text',
//     parseAttributeValue: true,
//   }
// }

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
    },
  }
}

async function parseMeetingXML(filePath: string): Promise<MeetingData> {
  consola.info(`Parsing meeting XML:`, { filePath })
  const options = createParserOptions()
  const parser = new XMLParser(options)
  const xmlData = fs.readFileSync(filePath, 'utf8')
  const result = parser.parse(xmlData)

  const metaMeeting = result.Dokument.MetaMeeting
  const metadata = await extractMeetingMetadata(metaMeeting)
  const mødeid = await findMødeId(metadata)

  if (!mødeid) {
    throw new Error(`Could not find mødeid for file: ${filePath}`)
  }

  const meetingData: MeetingData = {
    metadata,
    agendaItems: [],
  }

  const agendaItems = result.Dokument.DagsordenPunkt || []
  consola.info(`Parsing agenda items:`, {
    agendaItemsCount: agendaItems.length,
    mødeid,
  })

  const parsedAgendaItems = await Promise.allSettled(
    agendaItems.map((item) => parseAgendaItem(item, mødeid))
  )

  const successfulItems = parsedAgendaItems
    .filter(
      (result): result is PromiseFulfilledResult<ParsedAgendaItem> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)

  const failedItems = parsedAgendaItems.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  )

  failedItems.forEach((item) =>
    consola.error('Failed to parse agenda item:', item.reason)
  )

  meetingData.agendaItems = successfulItems

  consola.info(`Parsed meeting data:`, {
    metadata: meetingData.metadata,
    agendaItemsCount: meetingData.agendaItems.length,
    mødeid,
  })
  return meetingData
}

export async function parseMeetings(
  meetingKey?: string
): Promise<Record<string, MeetingData>> {
  const directory = 'assets/data/meetings/'
  consola.info(`Parsing meetings from ${directory}`)
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

  consola.info(`Found ${xmlFiles.length} XML file(s)`)

  await Promise.all(
    xmlFiles.map(async (xmlFile) => {
      const key = path.parse(xmlFile).name.replace('_helemoedet', '')
      allMeetings[key] = await parseMeetingXML(xmlFile)
    })
  )

  consola.info(`Parsed ${Object.keys(allMeetings).length} meeting(s)`)
  return allMeetings
}
