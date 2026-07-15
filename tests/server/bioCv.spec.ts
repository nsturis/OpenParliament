import { describe, expect, it } from 'vitest'
import { parseBioCv } from '../../server/utils/bioCv'

const XML = `<member><profession>Fhv. MF, økonom</profession><born>25-07-1951</born>
<educationStatistic>LVU</educationStatistic><occupationStatistic>Privat</occupationStatistic>
<phoneFolketinget>+45 3337 5006</phoneFolketinget><emails><email>x@ft.dk</email></emails>
<career><currentConstituency>Folketingsmedlem for Enhedslisten i Københavns Omegns Storkreds fra 13. november 2007.</currentConstituency>
<constituencies><constituency>A 2007 - 2015.</constituency><constituency>B 2005 - 2007.</constituency></constituencies></career>
<personalInformation><memberData><p>søn af ... Gift med ...</p></memberData></personalInformation></member>`

describe('parseBioCv', () => {
  it('returns null for non-member blobs', () => {
    expect(parseBioCv(null)).toBeNull()
    expect(parseBioCv('<something/>')).toBeNull()
  })
  it('extracts the curated CV fields', () => {
    const cv = parseBioCv(XML)!
    expect(cv.profession).toBe('Fhv. MF, økonom')
    expect(cv.born).toBe('25-07-1951')
    expect(cv.uddannelse).toBe('LVU')
    expect(cv.beskæftigelse).toBe('Privat')
    expect(cv.currentConstituency).toContain('Københavns Omegns Storkreds')
    expect(cv.constituencies).toEqual(['A 2007 - 2015.', 'B 2005 - 2007.'])
  })
  it('omits contact details and family prose', () => {
    const s = JSON.stringify(parseBioCv(XML))
    expect(s).not.toContain('3337')
    expect(s).not.toContain('@ft.dk')
    expect(s).not.toContain('Gift med')
  })
})
