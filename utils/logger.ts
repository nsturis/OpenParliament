import fs from 'fs'
import type { LogObject } from 'consola'
import { consola } from 'consola'

const logFile = fs.createWriteStream('meetingParser.log', { flags: 'a' })

const fileReporter = {
  log(logObj: LogObject) {
    const message = logObj.args
      .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg))
      .join(' ')

    logFile.write(
      `[${new Date(logObj.date).toISOString()}] ${logObj.type.toUpperCase()}: ${message}\n`
    )
  },
}

const logger = consola.create({
  reporters: [fileReporter],
  level: process.env.NODE_ENV === 'production' ? 3 : 4, // 3 = Info, 4 = Debug
})

export default logger
