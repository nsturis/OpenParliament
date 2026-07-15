import type { BaseRecord } from '~/types/workspace'

export function newId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function makeBase(now: string = nowIso()): BaseRecord {
  return { id: newId(), createdAt: now, updatedAt: now, deleted: false }
}

export function touch<T extends BaseRecord>(r: T, now: string = nowIso()): T {
  return { ...r, updatedAt: now }
}

export function softDelete<T extends BaseRecord>(r: T, now: string = nowIso()): T {
  return { ...r, deleted: true, updatedAt: now }
}
