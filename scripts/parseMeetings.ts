import { parseMeetings } from '../server/parser/meetingParser'
import consola from '../utils/logger'

async function runParser() {
  try {
    consola.info('Starting the meeting parsing process')
    const startTime = Date.now()
    const parsedMeetings = await parseMeetings()
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // duration in seconds

    const meetingCount = Object.keys(parsedMeetings).length
    consola.success(
      `Successfully parsed ${meetingCount} meetings in ${duration} seconds`
    )

    consola.info('Parsing process completed successfully')
  } catch (error) {
    consola.error('An error occurred while parsing meetings:', error)
  }
}

runParser().catch((error) => {
  console.error('Error in main process:', error)
  process.exit(1)
})
