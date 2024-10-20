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
  FTCaseTingdokID?: number
  FullText?: string
  speeches: Speech[]
  subItems?: SubItem[]
}

interface SubItem {
  SubItemNo: string
  FTCaseTingdokID: number
  FTCaseNumber: string
  FTCaseType: string
  ShortTitle: string
  speeches: Speech[]
}

interface Speech {
  aktørTingdokID?: number
  LastModified: string
  EdixiStatus: string
  StartDateTime: string
  EndDateTime: string
  content: string
  embedding: number[]
  sagId?: number
}

// Utility functions
async function extractTingdokID(
  tingdokID: string,
  entity: string,
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
 *
 * @param tekstGruppe - The input data structure containing text content
 * @returns A string of extracted and concatenated text content
 */
function extractTextContent(tekstGruppe: any): string {
  if (!tekstGruppe) return ''

  if (typeof tekstGruppe === 'string') return tekstGruppe.trim()

  if (Array.isArray(tekstGruppe)) {
    return tekstGruppe.map(extractTextContent).join(' ')
  }

  if (typeof tekstGruppe === 'object') {
    if (tekstGruppe['#text']) {
      return typeof tekstGruppe['#text'] === 'string'
        ? tekstGruppe['#text'].trim()
        : ''
    }
    return Object.values(tekstGruppe)
      .filter((value): value is string | object => value != null)
      .map(extractTextContent)
      .join(' ')
  }

  return ''
}

// Main parsing functions
async function processSpeechSegment(
  segment: any,
  tale: any,
  mødeid: number,
  sagId: number | undefined,
): Promise<Speech> {
  const speechMetadata = segment.MetaSpeechSegment || {}
  const content = extractTextContent(segment.TekstGruppe)

  consola.info(`Processing speech segment:`, { mødeid, sagId, speechMetadata })
  consola.info(`Content length: ${content.length}`)
  consola.info(`Content preview: ${content.substring(0, 100)}...`)

  const aktørTingdokID = await findAktørId(tale.Taler?.MetaSpeakerMP)

  // Check if the speech segment already exists and has an embedding
  const existingSpeech = await db.query.taleSegment.findFirst({
    where: and(
      eq(taleSegment.mødeid, mødeid),
      aktørTingdokID !== undefined
        ? eq(taleSegment.aktørid, aktørTingdokID)
        : undefined,
      eq(taleSegment.starttid, speechMetadata.StartDateTime),
    ),
  })

  let embedding: number[] = []

  if (!existingSpeech || !existingSpeech.embedding.length) {
    // Generate embedding only if it doesn't exist
    const response = await $fetch('http://localhost:8000/process_document', {
      method: 'POST',
      body: JSON.stringify({
        content: content,
        file_id: mødeid.toString(),
      }),
    })
    embedding = response.embedding
  } else {
    embedding = existingSpeech.embedding
  }

  const speech: Speech = {
    aktørTingdokID,
    LastModified: speechMetadata.LastModified || null,
    EdixiStatus: speechMetadata.EdixiStatus || '',
    StartDateTime: speechMetadata.StartDateTime || null,
    EndDateTime: speechMetadata.EndDateTime || null,
    content,
    embedding,
    sagId,
  }

  consola.info(`Processed speech:`, speech)
  return speech
}

async function saveSpeechToDatabase(
  speech: Speech,
  mødeid: number,
): Promise<void> {
  consola.info(`Attempting to save or update speech in database:`, {
    aktørTingdokID: speech.aktørTingdokID,
    content: speech.content,
    sagId: speech.sagId,
    mødeid,
  })
  try {
    // Check if the speech segment already exists
    const existingSpeech = await db.query.taleSegment.findFirst({
      where: and(
        eq(taleSegment.mødeid, mødeid),
        eq(taleSegment.aktørid, speech.aktørTingdokID),
        eq(taleSegment.starttid, speech.StartDateTime),
      ),
    })

    if (existingSpeech) {
      // Update only if there are missing values
      const updateData: Partial<typeof taleSegment.$inferInsert> = {}

      if (!existingSpeech.content) updateData.content = speech.content
      if (!existingSpeech.sluttid) updateData.sluttid = speech.EndDateTime
      if (!existingSpeech.lastModified)
        updateData.lastModified = speech.LastModified
      if (!existingSpeech.sagid && speech.sagId) updateData.sagid = speech.sagId
      if (!existingSpeech.embedding.length)
        updateData.embedding = speech.embedding

      if (Object.keys(updateData).length > 0) {
        await db
          .update(taleSegment)
          .set({
            ...updateData,
            opdateringsdato: new Date().toISOString(),
          })
          .where(eq(taleSegment.id, existingSpeech.id))
        consola.info(`Updated existing speech segment:`, {
          id: existingSpeech.id,
          updatedFields: Object.keys(updateData),
        })
      } else {
        consola.info(`No updates needed for existing speech segment:`, {
          id: existingSpeech.id,
        })
      }
    } else {
      // Insert new speech segment
      const result = await db.insert(taleSegment).values({
        content: speech.content,
        mødeid,
        starttid: speech.StartDateTime,
        sluttid: speech.EndDateTime,
        lastModified: speech.LastModified,
        aktørid: speech.aktørTingdokID,
        opdateringsdato: new Date().toISOString(),
        embedding: speech.embedding,
        sagid: speech.sagId,
      })
      consola.success('Inserted new speech segment:', result)
    }
  } catch (error) {
    consola.error('Error saving or updating speech in database:', error)
    if (error instanceof Error) {
      consola.error('Error message:', error.message)
      consola.error('Error stack:', error.stack)
    }
  }
}

async function parseSpeechesFromTale(
  speeches: any[],
  mødeid: number,
  sagId: number | undefined,
): Promise<Speech[]> {
  consola.info(`Parsing speeches:`, {
    mødeid,
    sagId,
    speechesCount: speeches.length,
  })
  const parsedSpeeches: Speech[] = []

  for (const tale of speeches) {
    const taleSegments = Array.isArray(tale.TaleSegment)
      ? tale.TaleSegment
      : [tale.TaleSegment]

    consola.info(`Processing tale:`, { taleSegmentsCount: taleSegments.length })

    for (const segment of taleSegments) {
      try {
        const speech = await processSpeechSegment(segment, tale, mødeid, sagId)
        await saveSpeechToDatabase(speech, mødeid)
        parsedSpeeches.push(speech)
      } catch (error) {
        consola.error('Error in parseSpeechesFromTale:', error)
        if (error.response) {
          consola.error('Response status:', error.response.status)
        }
      }
    }
  }

  consola.info(`Parsed speeches:`, {
    parsedSpeechesCount: parsedSpeeches.length,
  })
  return parsedSpeeches
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
      return false // Ignore all other attributes
    },
  }
}

async function extractMeetingMetadata(
  metaMeeting: any,
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

async function findMødeId(
  metadata: MeetingData['metadata'],
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
          eq(periode.type, 'samling'),
        ),
      )
      .limit(1)

    periodeId = periodeResult[0]?.id
  }

  consola.info('Found periodeId:', periodeId)

  if (!periodeId) {
    consola.warn(
      `No periode found for parlamentariskSession: ${metadata.parlamentariskSession}`,
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
        eq(møde.typeid, 1),
      ),
    )
    .limit(1)

  consola.info('Møde query result:', mødeResult)

  if (!mødeResult.length) {
    consola.warn(
      `No møde found for periode: ${periodeId}, mødeNummer: ${metadata.mødeNummer}, typeid: 1`,
    )
    return undefined
  }

  return mødeResult[0].id
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
  meetingData.agendaItems = await Promise.all(
    agendaItems.map((item) => parseAgendaItem(item, mødeid)),
  )

  consola.info(`Parsed meeting data:`, {
    metadata: meetingData.metadata,
    agendaItemsCount: meetingData.agendaItems.length,
    mødeid,
  })
  return meetingData
}

async function findSagId(
  agendaItem: AgendaItem,
  mødeid: number,
): Promise<number | undefined> {
  consola.info('Finding sagId for:', { agendaItem, mødeid })

  let sagId: number | undefined

  // First, try to get the sagId using the FTCaseTingdokID
  try {
    sagId = await extractTingdokID(agendaItem.FTCaseTingdokID, 'sag')
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
          eq(sag.periodeid, periodeId),
        ),
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
      }, periodeId: ${await findPeriodeId(mødeid)}`,
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

async function parseAgendaItem(item: any, mødeid: number): Promise<AgendaItem> {
  const metaFTAgendaItem = item.MetaFTAgendaItem || {}
  consola.info(`Parsing agenda item:`, { mødeid, metaFTAgendaItem })

  const FTCaseTingdokID = extractTingdokID(metaFTAgendaItem.FTCase, 'sag')

  const agendaItem: AgendaItem = {
    ItemNo: metaFTAgendaItem.ItemNo,
    FTCaseNumber: metaFTAgendaItem.FTCaseNumber,
    FTCaseType: metaFTAgendaItem.FTCaseType,
    FTCaseStage: metaFTAgendaItem.FTCaseStage,
    ShortTitle: metaFTAgendaItem.ShortTitle,
    FTCaseTingdokID,
    FullText: extractTextContent(item.PunktTekst),
    subItems: [],
    speeches: [],
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
        agendaItem.subItems = await parseSubItems(
          aktivitet.DagsordenUnderpunkt,
          mødeid,
          sagId,
        )
      }

      if (aktivitet.Tale) {
        const speeches = Array.isArray(aktivitet.Tale)
          ? aktivitet.Tale
          : [aktivitet.Tale]
        agendaItem.speeches = await parseSpeechesFromTale(
          speeches,
          mødeid,
          sagId,
        )
      }
    }
  }

  consola.info(`Parsed agenda item:`, {
    ItemNo: agendaItem.ItemNo,
    speechesCount: agendaItem.speeches.length,
    subItemsCount: agendaItem.subItems?.length,
  })
  return agendaItem
}

async function parseSubItems(
  subItems: any[],
  mødeid: number,
  parentSagId: number | undefined,
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
        speeches: [],
      }

      const sagId =
        (await extractTingdokID(metaSubItem.FTCase, 'sag')) || parentSagId
      consola.info(`Extracted sagId for sub-item:`, {
        sagId,
        FTCaseTingdokID: newSubItem.FTCaseTingdokID,
      })

      if (subItem.Tale) {
        const speeches = Array.isArray(subItem.Tale)
          ? subItem.Tale
          : [subItem.Tale]
        newSubItem.speeches = await parseSpeechesFromTale(
          speeches,
          mødeid,
          sagId,
        )
      }

      consola.info(`Parsed sub-item:`, {
        SubItemNo: newSubItem.SubItemNo,
        speechesCount: newSubItem.speeches.length,
      })
      return newSubItem
    }),
  )
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

export async function parseMeetings(
  meetingKey?: string,
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
    }),
  )

  consola.info(`Parsed ${Object.keys(allMeetings).length} meeting(s)`)
  return allMeetings
}
