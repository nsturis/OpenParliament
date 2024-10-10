import type { X2jOptions } from 'fast-xml-parser'
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import consola from 'consola'

interface MeetingData {
  metadata: {
    parlamentariskSession: string
    periodeTingdokID: string
    aktørGruppe: string
    aktørTingdokID: string
    mødeDato: string
    mødeNummer: string
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
  speeches: Speech[]
  subItems?: SubItem[] // Add this line
}

// Add this new interface
interface SubItem {
  SubItemNo: string
  FTCaseTingdokID: string
  FTCaseNumber: string
  FTCaseType: string
  ShortTitle: string
}

interface Speech {
  aktørTingdokID?: string
  LastModified: string
  EdixiStatus: string
  StartDateTime: string
  EndDateTime: string
  content: string | object | Array<string | object>
}

function extractTingdokID(obj: any): string | undefined {
  return obj?.tingdokID ?? obj?.['@_tingdokID']
}

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
      .filter(
        (value): value is string | object =>
          value !== null && value !== undefined
      )
      .map(extractTextContent)
      .join(' ')
  }

  return ''
}

function parseMeetingXML(filePath: string): MeetingData {
  const options: X2jOptions = {
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

  const parser = new XMLParser(options)
  const xmlData = fs.readFileSync(filePath, 'utf8')
  const result = parser.parse(xmlData)

  const metaMeeting = result.Dokument.MetaMeeting
  const meetingData: MeetingData = {
    metadata: {
      parlamentariskSession: metaMeeting.ParliamentarySession,
      periodeTingdokID: metaMeeting.ParliamentarySession['@_tingdokID'],
      aktørGruppe: metaMeeting.ParliamentaryGroup,
      aktørTingdokID: metaMeeting.ParliamentaryGroup['@_tingdokID'],
      mødeDato: metaMeeting.DateOfSitting,
      mødeNummer: metaMeeting.MeetingNumber,
    },
    agendaItems: [],
  }

  const agendaItems = result.Dokument.DagsordenPunkt || []
  meetingData.agendaItems = agendaItems.map((item: any) => {
    const metaFTAgendaItem = item.MetaFTAgendaItem || {}
    const agendaItem: AgendaItem = {
      ItemNo: metaFTAgendaItem.ItemNo,
      FTCaseNumber: metaFTAgendaItem.FTCaseNumber,
      FTCaseType: metaFTAgendaItem.FTCaseType,
      FTCaseStage: metaFTAgendaItem.FTCaseStage,
      ShortTitle: metaFTAgendaItem.ShortTitle,
      FTCaseTingdokID: metaFTAgendaItem.FTCase?.['@_tingdokID'],
      FullText: extractTextContent(item.PunktTekst),
      subItems: [],
      speeches: [],
    }

    if (item.Aktivitet) {
      const activities = Array.isArray(item.Aktivitet)
        ? item.Aktivitet
        : [item.Aktivitet]
      activities.forEach((aktivitet: any) => {
        if (aktivitet.DagsordenUnderpunkt) {
          const subItems = Array.isArray(aktivitet.DagsordenUnderpunkt)
            ? aktivitet.DagsordenUnderpunkt
            : [aktivitet.DagsordenUnderpunkt]

          subItems.forEach((subItem: any) => {
            const metaSubItem = subItem.MetaFTAgendaSubItem || {}
            const newSubItem: SubItem = {
              SubItemNo: metaSubItem.SubItemNo || '',
              FTCaseTingdokID: metaSubItem.FTCase?.['@_tingdokID'] || '',
              FTCaseNumber: metaSubItem.FTCaseNumber || '',
              FTCaseType: metaSubItem.FTCaseType || '',
              ShortTitle: metaSubItem.ShortTitle || '',
              speeches: [],
            }

            // Parse speeches within subItem
            if (subItem.Tale) {
              const speeches = Array.isArray(subItem.Tale)
                ? subItem.Tale
                : [subItem.Tale]
              newSubItem.speeches = parseSpeechesFromTale(speeches)
            }

            agendaItem.subItems?.push(newSubItem)
          })
        }

        // Parse speeches for the main agenda item
        if (aktivitet.Tale) {
          const speeches = Array.isArray(aktivitet.Tale)
            ? aktivitet.Tale
            : [aktivitet.Tale]
          agendaItem.speeches = parseSpeechesFromTale(speeches)
        }
      })
    }

    return agendaItem
  })

  consola.info(
    `Parsed ${meetingData.agendaItems.length} agenda items from ${filePath}`
  )
  return meetingData
}

function parseSpeechesFromTale(speeches: any[]): Speech[] {
  return speeches.flatMap((tale: any) => {
    const taleSegments = Array.isArray(tale.TaleSegment)
      ? tale.TaleSegment
      : [tale.TaleSegment]
    return taleSegments.map((segment: any) => {
      const speechMetadata = segment.MetaSpeechSegment || {}
      return {
        aktørTingdokID: extractTingdokID(tale.Taler?.MetaSpeakerMP),
        LastModified: speechMetadata.LastModified || '',
        EdixiStatus: speechMetadata.EdixiStatus || '',
        StartDateTime: speechMetadata.StartDateTime || '',
        EndDateTime: speechMetadata.EndDateTime || '',
        content: extractTextContent(segment.TekstGruppe),
      }
    })
  })
}

export async function parseAllMeetings(): Promise<Record<string, MeetingData>> {
  const directory = 'assets/data/meetings/'
  consola.info(`Parsing meetings from ${directory}`)
  const allMeetings: Record<string, MeetingData> = {}

  const xmlFiles = glob.sync(path.join(directory, '**/*.xml'))
  // const xmlFiles = glob.sync(
  //   path.join(directory, '20231/20231_M10_helemoedet.xml')
  // )
  consola.info(`Found ${xmlFiles.length} XML files`)

  for (const xmlFile of xmlFiles) {
    const meetingKey = path.parse(xmlFile).name.replace('_helemoedet', '')
    allMeetings[meetingKey] = parseMeetingXML(xmlFile)
  }

  consola.info(`Parsed ${Object.keys(allMeetings).length} meetings`)
  return allMeetings
}
