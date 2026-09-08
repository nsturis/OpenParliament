import { sql, type SQL } from 'drizzle-orm'
import { $fetch } from 'ofetch'
import { db } from '../utils/db'

const RRF_K = 60
const BRANCH_LIMIT = 50
const VECTOR_OVERFETCH = 200 // must equal the SET LOCAL hnsw.ef_search value
const GROUPS_PER_PAGE = 10
const MAX_FUSED = 150 // 50 FTS + 50 vector + 50 document upper bound
// ponytail: documents have no FTS branch to anchor them, so an absolute cosine floor keeps a
// tiny/unrelated corpus from always contributing its 50 nearest chunks (relevant e5 hits sit at
// dist 0.14-0.20, unrelated at 0.22+). Revisit once FilContent covers the full corpus.
const DOC_MAX_DIST = 0.21

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
type DocRow = {
  id: number; filId: number; chunk: string; filurl: string; dokumentTitel: string | null; dato: string | null
  sagid: number; sagTitel: string | null; sagTitelkort: string | null; sagNummer: string | null
  statusText: string | null; typeText: string | null; periodeTitel: string | null
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
  const tsq = sql`websearch_to_tsquery('danish', ${q})`
  // Match and rank against the stored `content_tsv` column, not the
  // to_tsvector(...) expression: ranking on the expression re-tokenises every
  // matched row (≈4 s for a common word like "regeringen"); the materialised
  // column ranks in ≈0.2 s. `, t.id` gives a deterministic total order so ties
  // in ts_rank do not shuffle between identical requests (offset pagination
  // would otherwise skip/duplicate groups). ts_headline keeps using the raw
  // content — it needs the original text, not the lexeme vector.
  const rows = await db.execute<FtsRow>(sql`
    SELECT t.id,
           ts_headline('danish', t.content, ${tsq},
             'MaxWords=60, MinWords=30, StartSel=**, StopSel=**') AS snippet
    FROM "taleSegmentRaw" t
    JOIN "Møde" m ON m.id = t."mødeid"
    WHERE t.content_tsv @@ ${tsq}
    ${whereFrom(filterClauses(filters))}
    ORDER BY ts_rank(t.content_tsv, ${tsq}) DESC, t.id
    LIMIT ${BRANCH_LIMIT}
  `)
  return rows.rows
}

async function vectorBranch(embedding: number[], filters: SearchFilters): Promise<VecRow[]> {
  const vec = `[${embedding.join(',')}]`
  const clauses = filterClauses(filters)

  const result = clauses.length
    // Filtered: exact KNN over the filtered set. The HNSW over-fetch below
    // applies filters only AFTER the top-200 ANN cut, so a selective filter
    // (e.g. a single speaker's ~2.4k of 897k chunks) matches almost none of
    // the global nearest 200 and the branch returns [] — semantic search
    // silently vanishes for every filtered query. The filtered set is small
    // enough (≤~90k chunks, the largest party) for an exact scan within
    // budget (~0.15–0.8 s); `jit = off` trims the cold JIT-compile overhead
    // that dominates the larger scans.
    ? await db.transaction(async (tx) => {
        await tx.execute(sql.raw('SET LOCAL jit = off'))
        return tx.execute<VecRow & { dist: number }>(sql`
          SELECT t.id, c.content AS chunk,
                 c.embedding <=> ${vec}::vector AS dist
          FROM "taleSegmentChunk" c
          JOIN "taleSegmentRaw" t ON t.id = c.tale_segment_id
          JOIN "Møde" m ON m.id = t."mødeid"
          WHERE char_length(c.content) > 80 ${whereFrom(clauses)}
          ORDER BY dist, t.id
          LIMIT ${VECTOR_OVERFETCH}
        `)
      })
    // Unfiltered: HNSW ANN over-fetch. SET LOCAL only lives in a transaction;
    // without hnsw.ef_search the GUC defaults to 40 and the LIMIT silently
    // returns ≤40 rows. The inner ORDER BY must stay the bare distance
    // operator (adding a tiebreak column defeats the HNSW index and forces a
    // full scan of 897k rows), so the deterministic `, t.id` tiebreak goes on
    // the outer sort over the 200 fetched rows.
    : await db.transaction(async (tx) => {
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
          ORDER BY c.dist, t.id
        `)
      })

  // Collapse multiple chunks of the same segment to its best-ranked chunk
  const seen = new Set<number>()
  const out: VecRow[] = []
  for (const r of result.rows) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push({ id: r.id, chunk: r.chunk })
    if (out.length >= BRANCH_LIMIT) break
  }
  return out
}

async function documentBranch(embedding: number[], filters: SearchFilters): Promise<DocRow[]> {
  // Documents have no speaker, so a speaker/party filter excludes them entirely.
  if (filters.taler || filters.parti) return []
  const vec = `[${embedding.join(',')}]`
  // HNSW over FilContent, same over-fetch as the speech branch. Only files linked to a sag are
  // returned, because result groups are keyed by sag. No FTS branch for documents: FilContent has
  // no tsvector column/index yet.
  // ponytail: periodeid applies after the ANN cut; switch to an exact scan if filtered document
  // results come back empty once FilContent is large.
  const result = await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`SET LOCAL hnsw.ef_search = ${VECTOR_OVERFETCH}`))
    return tx.execute<DocRow & { dist: number }>(sql`
      SELECT c.id, c.filid AS "filId", c.content AS chunk, c.dist,
             f.filurl, d.titel AS "dokumentTitel", d.dato,
             s.id AS sagid, s.titel AS "sagTitel", s.titelkort AS "sagTitelkort", s.nummer AS "sagNummer",
             ss.status AS "statusText", st.type AS "typeText", pe.titel AS "periodeTitel"
      FROM (
        SELECT id, filid, content, embedding <=> ${vec}::vector AS dist
        FROM "FilContent"
        ORDER BY dist
        LIMIT ${VECTOR_OVERFETCH}
      ) c
      JOIN fil f ON f.id = c.filid
      JOIN dokument d ON d.id = f.dokumentid
      JOIN LATERAL (SELECT sagid FROM sagdokument WHERE dokumentid = d.id ORDER BY id LIMIT 1) sd ON true
      JOIN sag s ON s.id = sd.sagid
      LEFT JOIN sagsstatus ss ON ss.id = s.statusid
      LEFT JOIN sagstype st ON st.id = s.typeid
      LEFT JOIN periode pe ON pe.id = s.periodeid
      WHERE c.dist < ${DOC_MAX_DIST} ${filters.periodeid ? sql`AND s.periodeid = ${filters.periodeid}` : sql``}
      ORDER BY c.dist, c.id
    `)
  })

  // Collapse multiple chunks of the same file to its best-ranked chunk
  const seen = new Set<number>()
  const out: DocRow[] = []
  for (const r of result.rows) {
    if (seen.has(r.filId)) continue
    seen.add(r.filId)
    out.push(r)
    if (out.length >= BRANCH_LIMIT) break
  }
  return out
}

async function sagTitleBranch(q: string): Promise<TitleRow[]> {
  // Escape LIKE metacharacters: a literal % or _ in the query must match
  // itself, not act as a wildcard (q="%" would otherwise ILIKE '%%%' and
  // return five arbitrary cases). q is already a bound param, so this is a
  // correctness fix, not injection hardening.
  const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`
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

async function fetchMeta(ids: number[]): Promise<Map<string, MetaRow>> {
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
  return new Map(rows.rows.map((r) => [String(r.id), r]))
}

type SagInfo = { id: number; titel: string; titelkort: string | null; nummer: string | null; statusText: string; typeText: string; periodeTitel: string }
const sagInfo = (r: { sagid: number | null; sagTitel: string | null; sagTitelkort: string | null; sagNummer: string | null; statusText: string | null; typeText: string | null; periodeTitel: string | null }): SagInfo => ({
  id: r.sagid!, titel: r.sagTitel ?? '', titelkort: r.sagTitelkort, nummer: r.sagNummer,
  statusText: r.statusText ?? '', typeText: r.typeText ?? '', periodeTitel: r.periodeTitel ?? '',
})

export async function performSearch(q: string, filters: SearchFilters, offset: number) {
  const indexExists = await db.execute(sql`
    SELECT 1 FROM pg_indexes WHERE indexname = 'tale_segment_chunk_embedding_idx' LIMIT 1
  `)
  const embedding = indexExists.rows.length > 0 ? await getQueryEmbedding(q) : null
  const mode: 'hybrid' | 'fts' = embedding ? 'hybrid' : 'fts'

  const [fts, vec, docs, sagTitleMatches] = await Promise.all([
    ftsBranch(q, filters),
    embedding ? vectorBranch(embedding, filters) : Promise.resolve([]),
    embedding ? documentBranch(embedding, filters) : Promise.resolve([]),
    sagTitleBranch(q),
  ])

  // RRF fusion. Keys: `t:<segment id>` for speeches, `d:<FilContent id>` for documents.
  const fused = new Map<string, { score: number; snippet: string }>()
  const add = (key: string, rank: number, snippet: string) => {
    const prev = fused.get(key)
    const s = 1 / (RRF_K + rank + 1)
    if (prev) prev.score += s
    else fused.set(key, { score: s, snippet })
  }
  fts.forEach((r, i) => add(`t:${r.id}`, i, r.snippet))
  vec.forEach((r, i) => add(`t:${r.id}`, i, r.chunk.slice(0, 300)))
  docs.forEach((r, i) => add(`d:${r.id}`, i, r.chunk.slice(0, 300)))
  // FilContent.id is bigint, which pg returns as a string; key by string on both sides
  const docById = new Map(docs.map((r) => [String(r.id), r]))

  const ranked = [...fused.entries()]
    // `|| localeCompare`: break equal RRF scores by key for a stable total order (an FTS-only and
    // a vector-only hit at the same branch rank score identically), otherwise group membership
    // drifts between requests.
    .sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0]))
    .slice(0, MAX_FUSED)
  const meta = await fetchMeta(ranked.filter(([k]) => k.startsWith('t:')).map(([k]) => Number(k.slice(2))))
  // pg returns bigint ids as strings; look up by string so both id types match the keys

  // Group by sagid (meeting when a speech has no sagid)
  type Group = { key: string; sag: SagInfo | null; møde: { id: number; dato: string | null; titel: string } | null; score: number; hits: unknown[] }
  const groupMap = new Map<string, Group>()
  const groupFor = (key: string, make: () => Omit<Group, 'key' | 'score' | 'hits'>, score: number) => {
    let g = groupMap.get(key)
    if (!g) { g = { key, ...make(), score, hits: [] }; groupMap.set(key, g) }
    g.score = Math.max(g.score, score)
    return g
  }
  for (const [key, f] of ranked) {
    if (key.startsWith('d:')) {
      const r = docById.get(key.slice(2))!
      groupFor(`sag:${r.sagid}`, () => ({ sag: sagInfo(r), møde: null }), f.score).hits.push({
        kind: 'dokument', filId: r.filId, filurl: r.filurl, dokumentTitel: r.dokumentTitel ?? 'Dokument',
        dato: r.dato, snippet: f.snippet, score: f.score,
      })
      continue
    }
    const m = meta.get(key.slice(2))
    if (!m) continue
    const id = m.id
    const g = m.sagid != null
      ? groupFor(`sag:${m.sagid}`, () => ({ sag: sagInfo(m), møde: null }), f.score)
      : groupFor(`møde:${m.mødeid}`, () => ({ sag: null, møde: { id: m.mødeid, dato: m.dato, titel: m.mødeTitel ?? '' } }), f.score)
    g.hits.push({
      kind: 'tale', segmentId: id, sequence: m.sequence, mødeid: m.mødeid, dato: m.dato,
      aktørid: m.aktørid, taler: m.taler, parti: m.parti, partiid: m.partiid,
      snippet: f.snippet, score: f.score,
    })
  }

  const allGroups = [...groupMap.values()]
    // Break equal group scores by the stable group key so offset pagination
    // returns a consistent slice across the two requests it spans.
    .sort((a, b) => b.score - a.score || a.key.localeCompare(b.key))
    .map(({ sag, møde, score, hits }) => ({ sag, møde, score, hits }))

  return {
    mode,
    sagTitleMatches,
    groups: allGroups.slice(offset, offset + GROUPS_PER_PAGE),
    hasMore: allGroups.length > offset + GROUPS_PER_PAGE,
  }
}
