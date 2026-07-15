// Headless browser check of the actor page (SPA renders client-side, so curl
// can't see it). Throwaway verification — run with the dev server up.
import { chromium } from 'playwright-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:3000'

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`))

const results = []
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`)

// ---- Person page: Bjarne Laustsen (257) ----
await page.goto(`${BASE}/aktoerer/257`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const bodyText = await page.innerText('body')
check('person header shows name', bodyText.includes('Bjarne Laustsen'))
check('header stat strip (Partiloyalitet)', bodyText.includes('Partiloyalitet'))
check('loyalty % rendered', /9\d(?:[.,]\d)?%/.test(bodyText), (bodyText.match(/Partiloyalitet[\s\S]{0,40}?(\d[\d.,]*%)/) || [])[1] || '?')
check('tabs present', ['Oversigt', 'Afstemninger', 'Taler', 'Sager'].every((t) => bodyText.includes(t)))
check('Oversigt: Nuværende hverv', bodyText.includes('Nuværende hverv'))
check('Oversigt: recent sections', bodyText.includes('Seneste afstemninger') && bodyText.includes('Seneste taler'))

// Click "Afstemninger" tab
await page.getByRole('tab', { name: 'Afstemninger' }).click()
await page.waitForTimeout(1000)
const votesText = await page.innerText('body')
check('votes tab: agreement chip', /Med partiet|Mod partiet|Fraværende/.test(votesText))
check('votes tab: filter "Kun oprør"', votesText.includes('Kun oprør'))
check('votes tab: pass/fail badge', /Vedtaget|Forkastet/.test(votesText))

// Click "Taler" tab
await page.getByRole('tab', { name: 'Taler' }).click()
await page.waitForTimeout(1200)
const talerText = await page.innerText('body')
check('taler tab: deep-link link', talerText.includes('Gå til debatten'))
check('taler tab: search handoff button', talerText.includes('Søg i') && talerText.includes('taler'))
const searchHref = await page.getByRole('link', { name: /Søg i .* taler/ }).getAttribute('href').catch(() => null)
check('taler search handoff → /soeg?taler=257', searchHref === '/soeg?taler=257', searchHref || 'no href')

// Click "Sager" tab
await page.getByRole('tab', { name: 'Sager' }).click()
await page.waitForTimeout(800)
check('sager tab renders (no crash)', (await page.innerText('body')).includes('Sager'))

// ---- Non-person fallback: party S (571) ----
await page.goto(`${BASE}/aktoerer/571`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
const partyText = await page.innerText('body')
check('party page: no person tabs', !(partyText.includes('Partiloyalitet') || partyText.includes('Nuværende hverv')))
check('party page: still shows something', partyText.trim().length > 20)

console.log('\n' + results.join('\n'))
console.log(`\nConsole errors (${errors.length}):`)
console.log(errors.slice(0, 15).map((e) => '  ' + e).join('\n') || '  (none)')
await browser.close()
const failed = results.filter((r) => r.startsWith('FAIL')).length
process.exit(failed ? 1 : 0)
