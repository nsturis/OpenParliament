/**
 * One-off analysis: Find all Danish parliamentary votes related to
 * Palestine, Gaza, and Israel from the 2022 election onwards.
 *
 * Uses the ODA API directly (no database needed).
 *
 * Usage: bun run scripts/analyzeVotesPalestine.ts
 */

const ODA_BASE = 'https://oda.ft.dk/api'

const KEYWORDS = [
  'palæstina', 'palæstinensisk', 'palæstinensiske', 'palæstinenser',
  'gaza', 'israel', 'israelsk', 'israelske',
  'vestbredden', 'hamas', 'palestine', 'palestinian',
  'netanyahu', 'folkemord', 'gaza-krigen',
]

const PARTY_ORDER = ['S', 'V', 'M', 'SF', 'DD', 'LA', 'KF', 'EL', 'DF', 'RV', 'ALT', 'NB', 'SIU', 'IA', 'JF', 'UFG']

// ── Types ───────────────────────────────────────────────────────────────

interface ODataResponse<T> {
  'odata.metadata': string
  'odata.nextLink'?: string
  value: T[]
}

interface Periode {
  id: number
  startdato: string
  slutdato: string | null
  type: string
  kode: string
  titel: string
}

interface Sag {
  id: number
  titel: string
  titelkort: string | null
  resume: string | null
  nummer: string | null
  nummerprefix: string | null
  typeid: number
  periodeid: number
  statusid: number
  afstemningskonklusion: string | null
}

interface Sagstrin {
  id: number
  titel: string | null
  dato: string | null
  sagid: number
  typeid: number
  Afstemning?: Afstemning[]
}

interface Afstemning {
  id: number
  nummer: number
  konklusion: string | null
  vedtaget: boolean
  kommentar: string | null
  mødeid: number
  typeid: number
  sagstrinid: number
}

interface Stemme {
  id: number
  typeid: number
  afstemningid: number
  aktørid: number
}

interface Stemmetype {
  id: number
  type: string
}

interface Emneord {
  id: number
  emneord: string
  typeid: number
}

interface EmneordSag {
  id: number
  emneordid: number
  sagid: number
}

interface AktørBio {
  id: number
  biografi: string | null
  gruppenavnkort: string | null
}

// ── Fetch helper ────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchAll<T>(endpoint: string, params?: Record<string, string>): Promise<T[]> {
  const all: T[] = []
  const searchParams = new URLSearchParams(params)

  let url: string | null = `${ODA_BASE}/${endpoint}?${searchParams.toString()}`
  let page = 0

  while (url) {
    page++
    if (page % 5 === 1) {
      console.error(`  Fetching ${endpoint} page ${page} (${all.length} so far)...`)
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }

    const data: ODataResponse<T> = await response.json()
    all.push(...data.value)

    url = data['odata.nextLink'] || null
    if (url) await delay(100)
  }

  return all
}

// Fetch with concurrency control
async function fetchAllConcurrent<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 4,
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
  }
  return results
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.error('=== Palestine/Gaza/Israel Vote Analysis ===\n')

  // 1. Fetch vote types
  console.error('Fetching vote types...')
  const stemmetyper = await fetchAll<Stemmetype>('Stemmetype')
  const stemmetypeMap = new Map(stemmetyper.map((s) => [s.id, s.type]))
  console.error(`  Vote types: ${stemmetyper.map((s) => `${s.id}=${s.type}`).join(', ')}`)

  // 2. Fetch periods from 2022 onwards
  console.error('\nFetching periods...')
  const allPerioder = await fetchAll<Periode>('Periode')
  const post2022 = allPerioder.filter((p) => {
    const start = new Date(p.startdato)
    return start >= new Date('2022-10-01') // 2022 election was Nov 1
  })
  console.error(`  Found ${post2022.length} periods from 2022 onwards:`)
  for (const p of post2022) {
    console.error(`    ${p.kode} (${p.titel}) [${p.id}]`)
  }
  const periodIds = new Set(post2022.map((p) => p.id))
  const periodeMap = new Map(post2022.map((p) => [p.id, p]))

  // 3. Fetch cases for those periods (with $select to reduce payload)
  console.error('\nFetching cases for matching periods...')
  const periodFilter = post2022.map((p) => `periodeid eq ${p.id}`).join(' or ')
  const allSager = await fetchAll<Sag>('Sag', {
    $filter: periodFilter,
    $select: 'id,titel,titelkort,resume,nummer,nummerprefix,typeid,periodeid,statusid,afstemningskonklusion',
  })
  console.error(`  Fetched ${allSager.length} cases total`)

  // 4. Filter by keywords (client-side, case-insensitive)
  const matchingSager = allSager.filter((s) => {
    const text = [s.titel, s.titelkort, s.resume].filter(Boolean).join(' ').toLowerCase()
    return KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))
  })
  console.error(`  ${matchingSager.length} cases match keywords`)

  // 5. Supplement with Emneord search
  console.error('\nSearching Emneord (subject keywords)...')
  const EMNEORD_KEYWORDS = ['Palæstina', 'Gaza', 'Israel', 'palæstinensisk', 'Hamas', 'Vestbredden', 'folkemord']
  const emneordFilter = EMNEORD_KEYWORDS.map((kw) => `substringof('${kw}', emneord)`).join(' or ')
  const matchingEmneord = await fetchAll<Emneord>('Emneord', { $filter: emneordFilter })

  const FALSE_POSITIVES = ['bahamas', 'israels plads', 'free gaza danmark', 'boykot']
  const filteredEmneord = matchingEmneord.filter((e) =>
    !FALSE_POSITIVES.some((fp) => e.emneord.toLowerCase().includes(fp)),
  )
  console.error(`  Found ${filteredEmneord.length} matching emneord`)

  if (filteredEmneord.length > 0) {
    const existingSagIds = new Set(matchingSager.map((s) => s.id))
    const allExtraSagIds = new Set<number>()

    // Batch emneord queries in groups of 10
    for (let i = 0; i < filteredEmneord.length; i += 10) {
      const batch = filteredEmneord.slice(i, i + 10)
      const batchFilter = batch.map((e) => `emneordid eq ${e.id}`).join(' or ')
      const links = await fetchAll<EmneordSag>('EmneordSag', { $filter: batchFilter })
      for (const l of links) {
        if (!existingSagIds.has(l.sagid)) allExtraSagIds.add(l.sagid)
      }
    }

    if (allExtraSagIds.size > 0) {
      console.error(`  Found ${allExtraSagIds.size} additional cases via emneord`)
      // Batch fetch extra sag in groups of 15 instead of one-by-one
      const extraIds = [...allExtraSagIds]
      for (let i = 0; i < extraIds.length; i += 15) {
        const batch = extraIds.slice(i, i + 15)
        const batchFilter = batch.map((id) => `id eq ${id}`).join(' or ')
        const sager = await fetchAll<Sag>('Sag', {
          $filter: batchFilter,
          $select: 'id,titel,titelkort,resume,nummer,nummerprefix,typeid,periodeid,statusid,afstemningskonklusion',
        })
        for (const s of sager) {
          if (periodIds.has(s.periodeid)) matchingSager.push(s)
        }
      }
    }
  }

  // Deduplicate
  const sagMap = new Map<number, Sag>()
  for (const s of matchingSager) sagMap.set(s.id, s)
  const finalSager = [...sagMap.values()].sort((a, b) => a.id - b.id)
  console.error(`\n  Total unique matching cases: ${finalSager.length}`)

  // 6. Pre-build party lookup from Aktør biografi
  // Fetch all MF-type aktører (typeid=5) with just id + biografi + gruppenavnkort
  console.error('\nBuilding party lookup...')
  const aktører = await fetchAll<AktørBio>('Akt%C3%B8r', {
    $filter: 'typeid eq 5',
    $select: 'id,biografi,gruppenavnkort',
  })
  const partyCache = new Map<number, string>()
  for (const a of aktører) {
    if (a.gruppenavnkort) {
      partyCache.set(a.id, a.gruppenavnkort)
    } else if (a.biografi) {
      const match = a.biografi.match(/<partyShortname>([^<]+)<\/partyShortname>/)
      if (match) partyCache.set(a.id, match[1])
    }
  }
  console.error(`  Cached party for ${partyCache.size} aktører`)

  // 7. For each case, fetch votes (Stemme without Aktør expand — use party cache)
  console.error('\nFetching votes for matching cases...')

  interface VoteCounts { for: number; imod: number; undlader: number; fraværende: number }
  interface CaseWithVotes {
    sag: Sag
    periode: Periode | undefined
    afstemninger: Array<{
      afstemning: Afstemning
      dato: string | undefined
      partyVotes: Map<string, VoteCounts>
    }>
    matchedKeywords: string[]
  }

  const results: CaseWithVotes[] = []

  // Process cases with concurrency
  const processCase = async (sag: Sag): Promise<CaseWithVotes> => {
    const text = [sag.titel, sag.titelkort, sag.resume].filter(Boolean).join(' ').toLowerCase()
    const matchedKeywords = KEYWORDS.filter((kw) => text.includes(kw.toLowerCase()))

    // Fetch sagstrin with afstemning
    const sagstrin = await fetchAll<Sagstrin>('Sagstrin', {
      $filter: `sagid eq ${sag.id}`,
      $expand: 'Afstemning',
    })

    const afstemninger: CaseWithVotes['afstemninger'] = []

    for (const st of sagstrin) {
      if (!st.Afstemning?.length) continue

      for (const afst of st.Afstemning) {
        // Fetch stemme WITHOUT Aktør expand — much smaller response
        const stemmer = await fetchAll<Stemme>('Stemme', {
          $filter: `afstemningid eq ${afst.id}`,
          $select: 'id,typeid,afstemningid,aktørid',
        })
        if (!stemmer.length) continue

        const dato = st.dato || undefined
        const partyVotes = new Map<string, VoteCounts>()

        for (const stemme of stemmer) {
          const party = partyCache.get(stemme.aktørid) || 'Ukendt'
          if (!partyVotes.has(party)) {
            partyVotes.set(party, { for: 0, imod: 0, undlader: 0, fraværende: 0 })
          }
          const counts = partyVotes.get(party)!
          const type = stemmetypeMap.get(stemme.typeid) || ''
          if (type.toLowerCase().includes('for')) counts.for++
          else if (type.toLowerCase().includes('imod')) counts.imod++
          else if (type.toLowerCase().includes('hverken')) counts.undlader++
          else if (type.toLowerCase().includes('fravær')) counts.fraværende++
        }

        afstemninger.push({ afstemning: afst, dato, partyVotes })
      }
    }

    console.error(`  ${sag.nummer || sag.id}: ${(sag.titelkort || sag.titel || '').slice(0, 60)} — ${afstemninger.length} vote(s)`)

    return {
      sag,
      periode: periodeMap.get(sag.periodeid),
      afstemninger,
      matchedKeywords,
    }
  }

  // Process 4 cases concurrently
  const allResults = await fetchAllConcurrent(finalSager, processCase, 4)
  results.push(...allResults)

  // ── Output markdown report ──────────────────────────────────────────
  console.error('\n=== Generating report ===\n')

  const casesWithVotes = results.filter((r) => r.afstemninger.length > 0)
  const casesWithoutVotes = results.filter((r) => r.afstemninger.length === 0)

  // Sort helper
  const sortParties = (entries: [string, VoteCounts][]) =>
    entries.sort((a, b) => {
      const ai = PARTY_ORDER.indexOf(a[0])
      const bi = PARTY_ORDER.indexOf(b[0])
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

  // Header
  console.log('# Palæstina/Gaza/Israel — Afstemninger i Folketinget (2022–)')
  console.log()
  console.log(`*Genereret ${new Date().toISOString().slice(0, 10)}. Data fra oda.ft.dk.*`)
  console.log()

  // Summary
  console.log(`## Overblik`)
  console.log()
  console.log(`- **${results.length}** forslag fundet i alt`)
  console.log(`- **${casesWithVotes.length}** forslag med afstemning`)
  console.log(`- **${casesWithoutVotes.length}** forslag uden afstemning`)
  console.log()

  // ── Aggregate party positions across ALL votes ──
  // Determine each party's majority position per vote, then count how many times they voted For/Against/Abstain
  const totalAfstemninger = casesWithVotes.reduce((sum, r) => sum + r.afstemninger.length, 0)

  type PartyPosition = { for: number; imod: number; undlader: number; fraværende: number }
  const partyPositions = new Map<string, PartyPosition>()

  for (const result of casesWithVotes) {
    for (const { partyVotes } of result.afstemninger) {
      for (const [party, counts] of partyVotes) {
        if (party === 'Ukendt') continue
        if (!partyPositions.has(party)) {
          partyPositions.set(party, { for: 0, imod: 0, undlader: 0, fraværende: 0 })
        }
        const pos = partyPositions.get(party)!

        // Determine majority position (ignoring absent members)
        const active = counts.for + counts.imod + counts.undlader
        if (active === 0) {
          pos.fraværende++ // entire party absent
        } else if (counts.for > counts.imod && counts.for >= counts.undlader) {
          pos.for++
        } else if (counts.imod > counts.for && counts.imod >= counts.undlader) {
          pos.imod++
        } else if (counts.undlader >= counts.for && counts.undlader >= counts.imod) {
          pos.undlader++
        } else {
          // Tie — count as split/undecided
          pos.undlader++
        }
      }
    }
  }

  console.log(`## Samlet partioversigt (${totalAfstemninger} afstemninger)`)
  console.log()
  console.log('*Partiets position pr. afstemning baseret på flertallets stemme.*')
  console.log()
  console.log('| Parti | Stemte For | Stemte Imod | Undlod | Fraværende |')
  console.log('|-------|-----------|-------------|--------|------------|')
  for (const [party, pos] of sortParties([...partyPositions.entries()])) {
    console.log(`| ${party} | ${pos.for} | ${pos.imod} | ${pos.undlader} | ${pos.fraværende} |`)
  }
  console.log()

  // Cases with votes
  if (casesWithVotes.length > 0) {
    console.log('## Forslag med afstemning')
    console.log()

    for (const result of casesWithVotes) {
      const { sag, periode, afstemninger, matchedKeywords } = result
      const label = sag.nummer ? `${sag.nummerprefix || ''}${sag.nummer}` : `Sag ${sag.id}`

      console.log(`### ${label}: ${sag.titelkort || sag.titel}`)
      console.log()
      if (sag.titelkort && sag.titel && sag.titel !== sag.titelkort) {
        console.log(`> ${sag.titel}`)
        console.log()
      }
      console.log(`- **Periode**: ${periode?.titel || periode?.kode || sag.periodeid}`)
      console.log(`- **Konklusion**: ${sag.afstemningskonklusion || 'Ingen'}`)
      console.log(`- **Matchede søgeord**: ${matchedKeywords.join(', ')}`)
      if (sag.resume) {
        const shortResume = sag.resume.length > 300 ? sag.resume.slice(0, 300) + '...' : sag.resume
        console.log(`- **Resumé**: ${shortResume}`)
      }
      console.log()

      for (const { afstemning, dato, partyVotes } of afstemninger) {
        const dateStr = dato ? new Date(dato).toISOString().slice(0, 10) : 'Ukendt dato'
        console.log(`**Afstemning #${afstemning.nummer}** (${dateStr}) — ${afstemning.vedtaget ? 'VEDTAGET' : 'FORKASTET'}`)
        if (afstemning.konklusion) {
          console.log(`*${afstemning.konklusion}*`)
        }
        console.log()

        const sorted = sortParties([...partyVotes.entries()])

        console.log('| Parti | For | Imod | Undlader | Fraværende |')
        console.log('|-------|-----|------|----------|------------|')
        let totalFor = 0, totalImod = 0, totalUndlader = 0, totalFraværende = 0
        for (const [party, counts] of sorted) {
          if (party === 'Ukendt') continue
          console.log(`| ${party} | ${counts.for} | ${counts.imod} | ${counts.undlader} | ${counts.fraværende} |`)
          totalFor += counts.for
          totalImod += counts.imod
          totalUndlader += counts.undlader
          totalFraværende += counts.fraværende
        }
        console.log(`| **Total** | **${totalFor}** | **${totalImod}** | **${totalUndlader}** | **${totalFraværende}** |`)
        console.log()
      }
    }
  }

  // Cases without votes
  if (casesWithoutVotes.length > 0) {
    console.log('## Forslag uden afstemning')
    console.log()
    console.log('| Nr. | Titel | Periode | Matchede søgeord |')
    console.log('|-----|-------|---------|------------------|')
    for (const { sag, periode, matchedKeywords } of casesWithoutVotes) {
      const label = sag.nummer ? `${sag.nummerprefix || ''}${sag.nummer}` : `${sag.id}`
      const title = (sag.titelkort || sag.titel || '').slice(0, 80)
      console.log(`| ${label} | ${title} | ${periode?.kode || ''} | ${matchedKeywords.join(', ')} |`)
    }
    console.log()
  }

  console.error('Done!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
