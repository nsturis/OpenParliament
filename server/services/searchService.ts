import { sql, type SQL } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import { db } from '../utils/db'

const RRF_K = 60
const BRANCH_LIMIT = 50
const VECTOR_OVERFETCH = 200 // must equal the SET LOCAL hnsw.ef_search value
const GROUPS_PER_PAGE = 10
const MAX_FUSED = 100 // 50 FTS + 50 vector upper bound

export interface SearchFilters {
  periodeid?: number
  parti?: string
  taler?: number
}

type FtsRow = { id: number; snippet: string }
type VecRow = { id: number; chunk: string }
type MetaRow = {
  id: number
  sequence: number | null
  mødeid: number
  sagid: number | null
  dato: string | null
  aktørid: number | null
  taler: string
  parti: string | null
  partiid: number | null
  sagTitel: string | null
  sagTitelkort: string | null
  sagNummer: string | null
  statusText: string | null
  typeText: string | null
  periodeTitel: string | null
  mødeTitel: string | null
}
type TitleRow = {
  id: number; titel: string; titelkort: string | null; nummer: string | null
  statusText: string; typeText: string
}

async function getQueryEmbedding(searchQuery: string): Promise<number[] | null> {
  const config = useRuntimeConfig()
  try {
    // The service prepends the "query: " prefix that e5 models require
    const response = await $fetch<{ embedding?: number[] }>('/embed_query', {
      baseURL: config.public.llmServiceUrl,
      method: 'POST',
      body: JSON.stringify({ text: searchQuery }),
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    return response?.embedding ?? null
  } catch {
    return null
  }
}

/** Filter fragments shared by both branches. `t` = taleSegmentRaw, `m` = Møde. */
function filterClauses(filters: SearchFilters): SQL[] {
  const clauses: SQL[] = []
  if (filters.periodeid) clauses.push(sql`m.periodeid = ${filters.periodeid}`)
  if (filters.taler) clauses.push(sql`t."aktørid" = ${filters.taler}`)
  if (filters.parti)
    clauses.push(sql`EXISTS (
      SELECT 1 FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = t."aktørid" AND aa.rolleid = 15
        AND g.gruppenavnkort = ${filters.parti}
        AND (aa.startdato IS NULL OR aa.startdato <= m.dato)
        AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)
    )`)
  return clauses
}

function whereFrom(clauses: SQL[]): SQL {
  return clauses.length ? sql`AND ${sql.join(clauses, sql` AND `)}` : sql``
}

async function ftsBranch(q: string, filters: SearchFilters): Promise<FtsRow[]> {
  // An all-stopword q parses to an empty tsquery, which matches nothing —
  // the branch naturally returns [] (no explicit guard needed).
  const rows = await db.execute<FtsRow>(sql`
    SELECT t.id,
           ts_headline('danish', t.content, websearch_to_tsquery('danish', ${q}),
             'MaxWords=60, MinWords=30, StartSel=**, StopSel=**') AS snippet
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    WHERE to_tsvector('danish', t.content) @@ websearch_to_tsquery('danish', ${q})
    ${whereFrom(filterClauses(filters))}
    ORDER BY ts_rank(to_tsvector('danish', t.content), websearch_to_tsquery('danish', ${q})) DESC
    LIMIT ${BRANCH_LIMIT}
  `)
  return rows.rows
}

async function vectorBranch(embedding: number[], filters: SearchFilters): Promise<VecRow[]> {
  const vec = `[${embedding.join(',')}]`
  // SET LOCAL only lives inside a transaction. Without it hnsw.ef_search
  // defaults to 40 and the inner LIMIT silently returns ≤40 rows.
  const rows = await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`SET LOCAL hnsw.ef_search = ${VECTOR_OVERFETCH}`))
    return tx.execute<VecRow & { dist: number }>(sql`
      SELECT t.id, c.chunk, c.dist
      FROM (
        SELECT tale_segment_id, content AS chunk,
               embedding <=> ${vec}::vector AS dist
        FROM "taleSegmentChunk"
        WHERE char_length(content) > 80
        ORDER BY dist
        LIMIT ${VECTOR_OVERFETCH}
      ) c
      JOIN "taleSegmentRaw" t ON t.id = c.tale_segment_id
      JOIN "Møde" m ON m.id = t."mødeid"
      WHERE true ${whereFrom(filterClauses(filters))}
      ORDER BY c.dist
    `)
  })
  // Collapse multiple chunks of the same segment to its best-ranked chunk
  const seen = new Set<number>()
  const out: VecRow[] = []
  for (const r of rows.rows) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push({ id: r.id, chunk: r.chunk })
    if (out.length >= BRANCH_LIMIT) break
  }
  return out
}

async function sagTitleBranch(q: string): Promise<TitleRow[]> {
  const pattern = `%${q}%`
  const rows = await db.execute<TitleRow>(sql`
    SELECT s.id, s.titel, s.titelkort, s.nummer,
           ss.status AS "statusText", st.type AS "typeText"
    FROM sag s
    JOIN sagsstatus ss ON ss.id = s.statusid
    JOIN sagstype st ON st.id = s.typeid
    WHERE s.titel ILIKE ${pattern} OR s.titelkort ILIKE ${pattern} OR s.nummer ILIKE ${pattern}
    ORDER BY s.opdateringsdato DESC NULLS LAST
    LIMIT 5
  `)
  return rows.rows
}

async function fetchMeta(ids: number[]): Promise<Map<number, MetaRow>> {
  if (!ids.length) return new Map()
  const rows = await db.execute<MetaRow>(sql`
    SELECT t.id, t.sequence, t."mødeid", t.sagid, m.dato, t."aktørid",
           coalesce(a.navn, nullif(trim(concat(t."oratorFornavn", ' ', t."oratorEfternavn")), ''), 'Ukendt taler') AS taler,
           p.parti, p.partiid,
           s.titel AS "sagTitel", s.titelkort AS "sagTitelkort", s.nummer AS "sagNummer",
           ss.status AS "statusText", st.type AS "typeText", pe.titel AS "periodeTitel",
           m.titel AS "mødeTitel"
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    LEFT JOIN "Aktør" a ON a.id = t."aktørid"
    LEFT JOIN sag s ON s.id = t.sagid
    LEFT JOIN sagsstatus ss ON ss.id = s.statusid
    LEFT JOIN sagstype st ON st.id = s.typeid
    LEFT JOIN periode pe ON pe.id = s.periodeid
    LEFT JOIN LATERAL (
      SELECT g.id AS partiid, g.gruppenavnkort AS parti
      FROM "AktørAktør" aa
      JOIN "Aktør" g ON g.id = aa."tilaktørid" AND g.typeid = 4
      WHERE aa."fraaktørid" = t."aktørid" AND aa.rolleid = 15 AND g.gruppenavnkort IS NOT NULL
      ORDER BY (aa.startdato IS NOT NULL AND aa.startdato <= m.dato
                AND (aa.slutdato IS NULL OR aa.slutdato >= m.dato)) DESC,
               aa.startdato DESC NULLS LAST
      LIMIT 1
    ) p ON true
    WHERE t.id IN (${sql.join(ids.map((i) => sql`${i}`), sql`, `)})
  `)
  return new Map(rows.rows.map((r) => [r.id, r]))
}

export async function performSearch(q: string, filters: SearchFilters, offset: number) {
  const indexExists = await db.execute(sql`
    SELECT 1 FROM pg_indexes WHERE indexname = 'tale_segment_chunk_embedding_idx' LIMIT 1
  `)
  const embedding = indexExists.rows.length > 0 ? await getQueryEmbedding(q) : null
  const mode: 'hybrid' | 'fts' = embedding ? 'hybrid' : 'fts'

  const [fts, vec, sagTitleMatches] = await Promise.all([
    ftsBranch(q, filters),
    embedding ? vectorBranch(embedding, filters) : Promise.resolve([]),
    sagTitleBranch(q),
  ])

  // RRF fusion over segment ids
  const fused = new Map<number, { score: number; snippet: string; ftsHit: boolean }>()
  fts.forEach((r, i) => {
    fused.set(r.id, { score: 1 / (RRF_K + i + 1), snippet: r.snippet, ftsHit: true })
  })
  vec.forEach((r, i) => {
    const prev = fused.get(r.id)
    const add = 1 / (RRF_K + i + 1)
    if (prev) prev.score += add
    else fused.set(r.id, { score: add, snippet: r.chunk.slice(0, 300), ftsHit: false })
  })

  const ranked = [...fused.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, MAX_FUSED)
  const meta = await fetchMeta(ranked.map(([id]) => id))

  // Group by sagid (meeting when sagid is null)
  const groupMap = new Map<string, { sag: MetaRow | null; møde: MetaRow | null; score: number; hits: unknown[] }>()
  for (const [id, f] of ranked) {
    const m = meta.get(id)
    if (!m) continue
    const key = m.sagid != null ? `sag:${m.sagid}` : `møde:${m.mødeid}`
    let group = groupMap.get(key)
    if (!group) {
      group = { sag: m.sagid != null ? m : null, møde: m.sagid == null ? m : null, score: f.score, hits: [] }
      groupMap.set(key, group)
    }
    group.score = Math.max(group.score, f.score)
    group.hits.push({
      segmentId: id, sequence: m.sequence, mødeid: m.mødeid, dato: m.dato,
      aktørid: m.aktørid, taler: m.taler, parti: m.parti, partiid: m.partiid,
      snippet: f.snippet, score: f.score,
    })
  }

  const allGroups = [...groupMap.values()]
    .sort((a, b) => b.score - a.score)
    .map((g) => ({
      sag: g.sag && g.sag.sagid != null
        ? {
            id: g.sag.sagid, titel: g.sag.sagTitel ?? '', titelkort: g.sag.sagTitelkort,
            nummer: g.sag.sagNummer, statusText: g.sag.statusText ?? '',
            typeText: g.sag.typeText ?? '', periodeTitel: g.sag.periodeTitel ?? '',
          }
        : null,
      møde: g.sag && g.sag.sagid != null
        ? null
        : { id: g.møde!.mødeid, dato: g.møde!.dato, titel: g.møde!.mødeTitel ?? '' },
      score: g.score,
      hits: g.hits,
    }))

  return {
    mode,
    sagTitleMatches,
    groups: allGroups.slice(offset, offset + GROUPS_PER_PAGE),
    hasMore: allGroups.length > offset + GROUPS_PER_PAGE,
  }
}
