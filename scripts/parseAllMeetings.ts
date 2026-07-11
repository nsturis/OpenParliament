/**
 * Parse all parliamentary session transcripts (without embeddings).
 * Optimized with: in-memory caches, batch inserts, concurrent processing,
 * skip-already-imported meetings.
 *
 * Usage: bun run scripts/parseAllMeetings.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { setDbLogging } from '../server/api/db'
import {
  initCaches,
  loadImportedMødeIds,
  parseMeetingXML,
  resolveFileToMødeId,
  setSkipEmbeddings,
} from '../server/parser/meetingParser'

const CONCURRENCY = 5

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

async function pLimit(concurrency: number, tasks: (() => Promise<void>)[]): Promise<void> {
  let i = 0
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < tasks.length) {
      const taskIndex = i++
      await tasks[taskIndex]()
    }
  })
  await Promise.all(workers)
}

async function main() {
  // Disable Drizzle query logging for batch import
  setDbLogging(false)

  // Skip embeddings — we just want the transcript data in the DB
  setSkipEmbeddings(true)

  // Load in-memory caches (aktør, periode, møde)
  await initCaches()

  // Load set of already-imported mødeids (one query)
  const importedMødeIds = await loadImportedMødeIds()
  console.log(`Already imported: ${importedMødeIds.size} meetings\n`)

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

  // Discover all session directories
  const sessionDirs = fs.readdirSync(directory)
    .filter((d) => fs.statSync(path.join(directory, d)).isDirectory())
    .sort()

  console.log(`Found ${sessionDirs.length} session directories: ${sessionDirs.join(', ')}`)

  const xmlFiles: string[] = []
  for (const session of sessionDirs) {
    const sessionDir = path.join(directory, session)
    const files = glob.sync(path.join(sessionDir, '*.xml'))
    xmlFiles.push(...files)
  }

  xmlFiles.sort()
  stats.totalMeetings = xmlFiles.length

  // Pre-filter: skip files whose meetings are already imported
  const filesToParse: string[] = []
  for (const xmlFile of xmlFiles) {
    const mødeid = resolveFileToMødeId(xmlFile)
    if (mødeid && importedMødeIds.has(mødeid)) {
      stats.skippedMeetings++
    } else {
      filesToParse.push(xmlFile)
    }
  }

  console.log(`${filesToParse.length} to parse, ${stats.skippedMeetings} already imported, ${xmlFiles.length} total`)
  console.log(`Concurrency: ${CONCURRENCY}\n`)

  const startTime = Date.now()

  // Build tasks for concurrent execution
  const tasks = filesToParse.map((xmlFile) => async () => {
    const key = path.parse(xmlFile).name.replace('_helemoedet', '')

    try {
      await parseMeetingXML(xmlFile, stats)
      stats.successfulMeetings++
      const elapsed = Math.max(1, (Date.now() - startTime) / 1000)
      const rate = (stats.successfulMeetings / elapsed * 60).toFixed(0)
      console.log(`  OK ${key} (${stats.successfulMeetings}/${filesToParse.length}, ${rate}/min)`)
    } catch (error) {
      stats.failedMeetings++
      const msg = error instanceof Error ? error.message : String(error)
      console.error(`  FAIL ${key}: ${msg}`)
    }
  })

  // Run with concurrency limiter
  await pLimit(CONCURRENCY, tasks)

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n=== Parsing Statistics ===')
  console.log(`Duration: ${duration}s`)
  console.log(`Meetings: ${stats.successfulMeetings} ok, ${stats.skippedMeetings} skipped, ${stats.failedMeetings} failed (${stats.totalMeetings} total)`)
  console.log(`Agenda items: ${stats.agendaItems.successful}/${stats.agendaItems.total} successful`)
  console.log(`Sag lookups: ${stats.sagLookups.successful}/${stats.sagLookups.total} successful`)
  console.log(`Aktør lookups: ${stats.aktørLookups.successful}/${stats.aktørLookups.total} successful`)

  if (stats.aktørLookups.failureExamples.length > 0) {
    console.log('\nSample Aktør lookup failures:')
    for (const ex of stats.aktørLookups.failureExamples.slice(0, 10)) {
      console.log(`  ${ex.name} (tingdokID: ${ex.tingdokID}): ${ex.error}`)
    }
  }
  if (stats.sagLookups.failureExamples.length > 0) {
    console.log('\nSample Sag lookup failures:')
    for (const ex of stats.sagLookups.failureExamples.slice(0, 10)) {
      console.log(`  ${ex.caseNumber} (${ex.caseType}): ${ex.error}`)
    }
  }

  process.exit(0)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
