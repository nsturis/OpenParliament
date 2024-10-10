import { parseAllMeetings } from '../server/utils/meetingParser'
import readline from 'readline'
import consola from '../utils/logger'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function runParser() {
  try {
    consola.info('Starting the meeting parsing process')
    const startTime = Date.now()
    const parsedMeetings = await parseAllMeetings()
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // duration in seconds

    const meetingCount = Object.keys(parsedMeetings).length
    consola.success(
      `Successfully parsed ${meetingCount} meetings in ${duration} seconds`
    )

    // Here you can add logic to save the parsed data to a database or file
    // For example:
    // await saveParsedMeetingsToDatabase(parsedMeetings)

    consola.info('Parsing process completed successfully')
  } catch (error) {
    consola.error('An error occurred while parsing meetings:', error)
  } finally {
    rl.close()
  }
}

rl.question('Do you want to parse all meetings? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    consola.info('User confirmed to start parsing')
    runParser()
  } else {
    consola.info('User cancelled parsing')
    rl.close()
  }
})
