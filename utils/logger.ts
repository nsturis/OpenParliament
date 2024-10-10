import { consola } from 'consola'

// Configure consola
consola.create({
  level: process.env.NODE_ENV === 'production' ? 3 : 4, // 3 = Info, 4 = Debug
})

// Export consola as the default logger
export default consola
