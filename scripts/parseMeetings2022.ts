/**
 * Parse only the 2022 parliamentary session transcripts.
 *
 * Usage: bun run scripts/parseMeetings2022.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { parseMeetingXML } from '../server/parser/meetingParser'
import logger from '../utils/logger'

interface ParsingStats {
  totalMeetings: number
  successfulMeetings: number
  failedMeetings: number
  skippedMeetings: number
  agendaItems: {
    total: number
    successful: number
    failed: number
    failureExamples: Array<{ itemNo?: string; error: string }>
  }
  sagLookups: {
    total: number
    successful: number
    failed: number
    failureExamples: Array<{ caseNumber?: string; caseType?: string; error: string }>
  }
  aktørLookups: {
    total: number
    successful: number
    failed: number
    failureExamples: Array<{ name?: string; tingdokID?: string; error: string }>
  }
}

async function main() {
  const stats: ParsingStats = {
    totalMeetings: 0,
    successfulMeetings: 0,
    failedMeetings: 0,
    skippedMeetings: 0,
    agendaItems: { total: 0, successful: 0, failed: 0, failureExamples: [] },
    sagLookups: { total: 0, successful: 0, failed: 0, failureExamples: [] },
    aktørLookups: { total: 0, successful: 0, failed: 0, failureExamples: [] },
  }

  const directory = 'assets/data/meetings'
  const sessions = ['20221', '20222']

  const xmlFiles: string[] = []
  for (const session of sessions) {
    const sessionDir = path.join(directory, session)
    if (fs.existsSync(sessionDir)) {
      const files = glob.sync(path.join(sessionDir, '*.xml'))
      xmlFiles.push(...files)
    }
  }

  console.log(`Found ${xmlFiles.length} XML files for 2022 sessions`)
  stats.totalMeetings = xmlFiles.length

  const startTime = Date.now()

  for (const xmlFile of xmlFiles) {
    const key = path.parse(xmlFile).name.replace('_helemoedet', '')
    try {
      console.log(`Parsing ${key}...`)
      await parseMeetingXML(xmlFile, stats)
      stats.successfulMeetings++
      console.log(`  OK (${stats.successfulMeetings}/${stats.totalMeetings})`)
    } catch (error) {
      stats.failedMeetings++
      const msg = error instanceof Error ? error.message : String(error)
      console.error(`  FAILED: ${msg}`)
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n=== Parsing Statistics ===')
  console.log(`Duration: ${duration}s`)
  console.log(`Meetings: ${stats.successfulMeetings}/${stats.totalMeetings} successful, ${stats.failedMeetings} failed`)
  console.log(`Agenda items: ${stats.agendaItems.successful}/${stats.agendaItems.total} successful`)
  console.log(`Sag lookups: ${stats.sagLookups.successful}/${stats.sagLookups.total} successful`)
  console.log(`Aktør lookups: ${stats.aktørLookups.successful}/${stats.aktørLookups.total} successful`)

  if (stats.aktørLookups.failureExamples.length > 0) {
    console.log('\nSample Aktør lookup failures:')
    for (const ex of stats.aktørLookups.failureExamples.slice(0, 5)) {
      console.log(`  ${ex.name} (tingdokID: ${ex.tingdokID}): ${ex.error}`)
    }
  }
  if (stats.sagLookups.failureExamples.length > 0) {
    console.log('\nSample Sag lookup failures:')
    for (const ex of stats.sagLookups.failureExamples.slice(0, 5)) {
      console.log(`  ${ex.caseNumber} (${ex.caseType}): ${ex.error}`)
    }
  }

  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
