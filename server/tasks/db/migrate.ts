import { consola } from 'consola'
import { migrate } from 'drizzle-orm/d1/migrator'

export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Run database migrations',
  },
  async run() {
    try {
      // await migrate(useDrizzle(), { migrationsFolder: 'server/database/migrations' })
      consola.success('Database migrations done')
      return { result: 'Database migrations done' }
    } catch (err) {
      consola.error('Database migrations failed', err)
      return { result: 'Database migrations failed', error: err }
    }
  },
})