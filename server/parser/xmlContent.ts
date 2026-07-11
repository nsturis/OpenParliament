/**
 * Text extraction helpers for fast-xml-parser output.
 *
 * fast-xml-parser returns scalars for attribute-less elements and objects
 * with '#text' when attributes are present. Text nodes can be strings,
 * numbers or booleans depending on parser options, so every leaf type must
 * be stringified — dropping numeric leaves silently deletes figures from
 * transcript text (e.g. "har man lukket hele <Char>138</Char> folkeskoler").
 */

export function xmlText(el: unknown): string {
  if (el == null) return ''
  if (typeof el === 'object' && '#text' in (el as Record<string, unknown>)) {
    return String((el as Record<string, unknown>)['#text'])
  }
  return String(el)
}

export function xmlAttr(el: unknown, attr: string): string | undefined {
  if (el != null && typeof el === 'object' && attr in (el as Record<string, unknown>)) {
    return String((el as Record<string, unknown>)[attr])
  }
  return undefined
}

export function extractTextContent(node: unknown): string {
  if (node == null) return ''

  if (typeof node === 'string') return node.trim()

  if (typeof node === 'number' || typeof node === 'boolean') return String(node)

  if (Array.isArray(node)) return node.map(extractTextContent).join(' ')

  if (typeof node === 'object') {
    const record = node as Record<string, unknown>
    if ('#text' in record && typeof record['#text'] !== 'object') {
      return String(record['#text']).trim()
    }

    return Object.entries(record)
      .filter(([key]) => !key.startsWith('@_'))
      .map(([_, value]) => extractTextContent(value))
      .join(' ')
  }

  return ''
}
