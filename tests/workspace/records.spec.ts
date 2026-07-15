import { describe, expect, it } from 'vitest'
import { makeBase, softDelete, touch } from '../../utils/workspace/records'

describe('record helpers', () => {
  it('makeBase creates a uuid-keyed, non-deleted record with equal timestamps', () => {
    const b = makeBase('2026-07-13T00:00:00.000Z')
    expect(b.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(b.deleted).toBe(false)
    expect(b.createdAt).toBe('2026-07-13T00:00:00.000Z')
    expect(b.updatedAt).toBe(b.createdAt)
  })

  it('touch bumps updatedAt but not createdAt', () => {
    const b = makeBase('2026-01-01T00:00:00.000Z')
    const t = touch(b, '2026-02-02T00:00:00.000Z')
    expect(t.createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(t.updatedAt).toBe('2026-02-02T00:00:00.000Z')
  })

  it('softDelete sets the tombstone and bumps updatedAt', () => {
    const b = makeBase('2026-01-01T00:00:00.000Z')
    const d = softDelete(b, '2026-03-03T00:00:00.000Z')
    expect(d.deleted).toBe(true)
    expect(d.updatedAt).toBe('2026-03-03T00:00:00.000Z')
  })
})
