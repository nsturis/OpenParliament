import type { Dossier, DossierItem, SavedSearch, WorkspaceSnapshot } from '~/types/workspace'
import { WORKSPACE_SCHEMA_VERSION } from '~/types/workspace'

type Bundle = { dossiers: Dossier[]; items: DossierItem[]; savedSearches: SavedSearch[] }

export function exportWorkspace(data: Bundle): WorkspaceSnapshot {
  return { schemaVersion: WORKSPACE_SCHEMA_VERSION, ...data }
}

export function importWorkspace(snapshot: unknown): Bundle {
  const s = snapshot as Partial<WorkspaceSnapshot>
  if (
    !s || typeof s !== 'object'
    || s.schemaVersion !== WORKSPACE_SCHEMA_VERSION
    || !Array.isArray(s.dossiers) || !Array.isArray(s.items) || !Array.isArray(s.savedSearches)
  ) {
    throw new Error('Ugyldig arbejdsplads-fil')
  }
  return { dossiers: s.dossiers, items: s.items, savedSearches: s.savedSearches }
}
