import { describe, expect, it } from 'vitest'
import { XMLParser } from 'fast-xml-parser'
import { extractTextContent } from '../../server/parser/xmlContent'

describe('extractTextContent', () => {
  it('preserves numeric-only text nodes', () => {
    expect(extractTextContent(138)).toBe('138')
    expect(extractTextContent({ '#text': 42, '@_formaChar': 'Bold' })).toBe('42')
  })

  it('joins nested Linea/Char structures', () => {
    const node = {
      Exitus: {
        Linea: {
          Char: ['har man lukket hele', 138, 'folkeskoler.'],
        },
      },
    }
    expect(extractTextContent(node)).toBe('har man lukket hele 138 folkeskoler.')
  })

  it('skips attributes', () => {
    expect(extractTextContent({ '@_formaForma': 'NormalInd', Char: 'tekst' })).toBe('tekst')
  })

  it('keeps numbers embedded in real parsed XML', () => {
    const xml = '<TekstGruppe><Exitus><Linea><Char>har man lukket hele </Char><Char>138</Char><Char> folkeskoler.</Char></Linea></Exitus></TekstGruppe>'
    const parsed = new XMLParser({ ignoreAttributes: false, textNodeName: '#text' }).parse(xml)
    expect(extractTextContent(parsed.TekstGruppe)).toContain('138')
  })
})
