#!/usr/bin/env node

import { logAllEntities } from './logEntities'

const command = process.argv[2]

if (command === 'logEntities') {
  logAllEntities()
} else {
  console.log('Unknown command')
}
