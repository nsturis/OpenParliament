// Download ft.dk PDFs into assets/data/pdf/{filId}.pdf so scripts/processDocuments.ts
// can convert them to markdown (LLM service /pdf_to_markdown) and embed them into FilContent.
// ft.dk sits behind Cloudflare Turnstile; a plain fetch gets 403. CloakBrowser clears it.
// Usage: DB_LOG=false bun scripts/fetchFiles.ts [limit] [dokumenttype ids, default 21,7,15,1 = Forslagstekst,Fremsættelsestale,Beretning,Redegørelse] [periode id, default = latest samling]
import fs from 'node:fs'
import { launchPersistentContext } from 'cloakbrowser'
import { desc, eq, inArray, notExists, and, ne } from 'drizzle-orm'
import { db } from '../server/utils/db'
import { dokument, fil, filContent, periode, sag, sagdokument } from '../server/database/schema'

const limit = Number(process.argv[2] ?? 50)
const typeIds = (process.argv[3] ?? '21,7,15,1').split(',').map(Number)
const periodeId =
  Number(process.argv[4]) ||
  (await db.select({ id: periode.id }).from(periode).where(eq(periode.type, 'samling')).orderBy(desc(periode.startdato)).limit(1))[0].id
const outDir = 'assets/data/pdf'
fs.mkdirSync(outDir, { recursive: true })

const rows = await db
  .selectDistinct({ id: fil.id, url: fil.filurl, opdateringsdato: fil.opdateringsdato })
  .from(fil)
  .innerJoin(dokument, eq(dokument.id, fil.dokumentid))
  .innerJoin(sagdokument, eq(sagdokument.dokumentid, dokument.id))
  .innerJoin(sag, eq(sag.id, sagdokument.sagid))
  .where(
    and(
      eq(fil.format, 'PDF'),
      ne(fil.filurl, ''),
      inArray(dokument.typeid, typeIds),
      eq(sag.periodeid, periodeId),
      notExists(db.select().from(filContent).where(eq(filContent.filId, fil.id))),
    ),
  )
  .orderBy(desc(fil.opdateringsdato))
  .limit(limit)
const todo = rows.filter((r) => !fs.existsSync(`${outDir}/${r.id}.pdf`))
console.log(`${todo.length} files to fetch (periode ${periodeId})`)

const ctx = await launchPersistentContext({ userDataDir: '.cloak-profile', headless: true })
const page = ctx.pages()[0] ?? (await ctx.newPage())

async function clearChallenge() {
  await page.goto('https://www.ft.dk/', { waitUntil: 'domcontentloaded' })
  // wait for Turnstile to clear (passive pass takes ~5s; headless has never needed a click so far)
  for (let i = 0; i < 24 && /just a moment|øjeblik/i.test(await page.title()); i++) await page.waitForTimeout(5000)
  if (/just a moment|øjeblik/i.test(await page.title())) throw new Error('Cloudflare challenge not cleared')
}
await clearChallenge()

// fetch inside the page (browser TLS + cookies); bytes come back base64 since evaluate() only passes JSON
const get = (u: string) =>
  page
    .evaluate(async (u) => {
      const res = await fetch(u, { credentials: 'include' })
      const bytes = new Uint8Array(await res.arrayBuffer())
      let bin = ''
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
      return { status: res.status, type: res.headers.get('content-type') ?? '', b64: btoa(bin) }
    }, u)
    .catch((e) => ({ status: 0, type: '', b64: '', error: String(e.message) }))

let ok = 0
let consecutive403 = 0
for (const { id, url } of todo) {
  let r = await get(url)
  if (r.status === 403) {
    // ft.dk rate-limits with 403 after ~1300 requests; it clears after a few minutes
    await page.waitForTimeout(++consecutive403 >= 3 ? 300_000 : 30_000)
    await clearChallenge()
    r = await get(url)
  }
  if (r.status !== 403) consecutive403 = 0
  const good = r.status === 200 && r.type.includes('pdf')
  if (good) { fs.writeFileSync(`${outDir}/${id}.pdf`, Buffer.from(r.b64, 'base64')); ok++ }
  console.log(`${id} ${good ? 'OK' : `FAIL ${r.status} ${r.type}`} ${url}`)
  await page.waitForTimeout(2000)
}
console.log(`done: ${ok}/${todo.length}`)
await ctx.close()
process.exit(0)
