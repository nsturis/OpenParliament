import { describe, expect, it } from 'vitest'
import { dossierToMarkdown } from '../../utils/workspace/exportMarkdown'
import { makeBase } from '../../utils/workspace/records'
import type { Dossier, DossierItem } from '../../types/workspace'

const d: Dossier = { ...makeBase(), title: 'Klima', description: 'Vores linje' }
const items: DossierItem[] = [
  { ...makeBase(), dossierId: d.id, addedAt: makeBase().createdAt, note: 'kernebilag',
    ref: { type: 'sag', id: 172, meta: { label: 'L172 Klimalov' } } },
]

describe('dossierToMarkdown', () => {
  it('renders title, description, grouped items with links + notes', () => {
    const md = dossierToMarkdown(d, items)
    expect(md).toContain('# Klima')
    expect(md).toContain('Vores linje')
    expect(md).toContain('## Sager')
    expect(md).toContain('- [L172 Klimalov](/sager/172) — kernebilag')
  })
})
