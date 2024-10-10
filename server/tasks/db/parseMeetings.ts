import { defineTask } from '#imports'
import { parseAllMeetings } from '../../utils/meetingParser'
import consola from 'consola'
import fs from 'fs'
import path from 'path'

export default defineTask({
  meta: {
    name: 'db:parseMeetings',
    description: 'Parse meetings from XML files and save as JSON',
  },
  async run() {
    try {
      const meetings = await parseAllMeetings()
      const meetingsCount = Object.keys(meetings).length

      // Create the output directory if it doesn't exist
      const outputDir = 'assets/data'
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Save the parsed meetings as a JSON file
      const outputPath = path.join(outputDir, 'parsed_meetings.json')
      fs.writeFileSync(outputPath, JSON.stringify(meetings, null, 2))

      consola.success(
        `Successfully parsed ${meetingsCount} meetings and saved to ${outputPath}`
      )
    } catch (error) {
      consola.error('Error parsing meetings:', error)
    }
  },
})
