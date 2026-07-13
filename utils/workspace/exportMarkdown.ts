import type { Dossier, DossierItem, ItemRef, RefType } from '~/types/workspace'

const GROUP: Record<RefType, string> = {
  sag: 'Sager', speech: 'Taler', vote: 'Afstemninger', actor: 'Aktører', qna: 'Spørgsmål & svar',
}
const ORDER: RefType[] = ['sag', 'speech', 'vote', 'actor', 'qna']

function sourcePath(ref: ItemRef): string {
  switch (ref.type) {
    case 'actor': return `/aktoerer/${ref.id}`
    default: return `/sager/${ref.id}` // sag, vote, qna, speech all resolve via their case
  }
}

export function dossierToMarkdown(dossier: Dossier, items: DossierItem[]): string {
  const lines: string[] = [`# ${dossier.title}`, '']
  if (dossier.description.trim()) lines.push(dossier.description.trim(), '')
  for (const type of ORDER) {
    const group = items.filter((i) => i.ref.type === type)
    if (!group.length) continue
    lines.push(`## ${GROUP[type]}`, '')
    for (const i of group) {
      const label = i.ref.meta?.label ?? `${type} ${i.ref.id}`
      const note = i.note.trim() ? ` — ${i.note.trim()}` : ''
      lines.push(`- [${label}](${sourcePath(i.ref)})${note}`)
    }
    lines.push('')
  }
  return lines.join('\n').trimEnd() + '\n'
}
