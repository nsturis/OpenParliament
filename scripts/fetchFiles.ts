// Download ft.dk file bodies (HTML render of each PDF) into assets/data/html/{filId}.html
// so scripts/processDocuments.ts can embed them into FilContent.
// ft.dk sits behind Cloudflare Turnstile; a plain fetch gets 403. CloakBrowser clears it.
// Usage: DB_LOG=false bun scripts/fetchFiles.ts [limit]
import fs from 'node:fs'
import { launchPersistentContext } from 'cloakbrowser'
import { desc, eq, notExists, and } from 'drizzle-orm'
import { db } from '../server/utils/db'
import { fil, filContent } from '../server/database/schema'

const limit = Number(process.argv[2] ?? 50)
const outDir = 'assets/data/html'
fs.mkdirSync(outDir, { recursive: true })

const rows = await db
  .select({ id: fil.id, url: fil.filurl })
  .from(fil)
  .where(and(eq(fil.format, 'PDF'), notExists(db.select().from(filContent).where(eq(filContent.filId, fil.id)))))
  .orderBy(desc(fil.opdateringsdato))
  .limit(limit)
const todo = rows.filter((r) => !fs.existsSync(`${outDir}/${r.id}.html`))
console.log(`${todo.length} files to fetch`)

const ctx = await launchPersistentContext({ userDataDir: '.cloak-profile', headless: true })
const page = ctx.pages()[0] ?? (await ctx.newPage())
await page.goto('https://www.ft.dk/', { waitUntil: 'domcontentloaded' })
// wait for Turnstile to clear (passive pass takes ~5s; headless has never needed a click so far)
for (let i = 0; i < 24 && /just a moment|øjeblik/i.test(await page.title()); i++) await page.waitForTimeout(5000)
if (/just a moment|øjeblik/i.test(await page.title())) throw new Error('Cloudflare challenge not cleared')

let ok = 0
for (const { id, url } of todo) {
  const htmlUrl = url.includes('ripdf') ? url.replace('.pdf', '.htm') : url.replace('.pdf', '/index.htm')
  const r = await page.evaluate(async (u) => {
    const res = await fetch(u, { credentials: 'include' })
    return { status: res.status, body: await res.text() }
  }, htmlUrl).catch((e) => ({ status: 0, body: String(e.message) }))
  const good = r.status === 200 && !/Just a moment|Et øjeblik/.test(r.body)
  if (good) { fs.writeFileSync(`${outDir}/${id}.html`, r.body); ok++ }
  console.log(`${id} ${good ? 'OK' : `FAIL ${r.status}`} ${htmlUrl}`)
  await page.waitForTimeout(1000) // ponytail: fixed 1s politeness delay; add backoff if ft.dk starts 429ing
}
console.log(`done: ${ok}/${todo.length}`)
await ctx.close()
process.exit(0)
