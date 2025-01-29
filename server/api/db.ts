import pkg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { Logger, SQLWrapper } from 'drizzle-orm'
import { consola } from 'consola'
import * as schema from '../database/schema'
import * as relations from '../database/relations'
import { sql } from 'drizzle-orm'
const { Pool } = pkg

// Custom Drizzle logger using consola
class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    consola.info(`Drizzle Query: ${query} - Params: ${JSON.stringify(params)}`)
  }
}

const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}

const pool = new Pool(databaseConfig)

export const db = drizzle(pool, {
  schema: { ...schema, ...relations },
  logger: new CustomLogger(),
})

type DatabaseDefinition = typeof db;

export const explainAnalyze = async <T extends SQLWrapper>(db: DatabaseDefinition, query: T) => {
    const debugResult = await db.execute(sql`EXPLAIN ANALYZE ${query.getSQL()}`);
    console.debug(debugResult);
    return await query;
};
