<template>
  <UPopover>
    <UButton
      :icon="member.length ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
      color="gray"
      variant="ghost"
      size="xs"
      :aria-label="member.length ? `Gemt i ${member.length} dossier(er)` : 'Tilføj til dossier'"
    >
      <span v-if="member.length" class="text-xs">{{ member.length }}</span>
    </UButton>

    <template #panel>
      <div class="w-72 space-y-3 p-3">
        <p class="text-sm font-semibold">Tilføj til dossier</p>
        <UTextarea v-model="note" :rows="2" placeholder="Note (valgfri)" aria-label="Note" />
        <ul class="max-h-48 space-y-1 overflow-y-auto">
          <li v-for="d in dossiers" :key="d.id">
            <label class="flex cursor-pointer items-center gap-2 text-sm">
              <UCheckbox
                :model-value="member.includes(d.id)"
                @update:model-value="(v: boolean) => toggle(d.id, v)"
              />
              {{ d.title }}
            </label>
          </li>
          <li v-if="!dossiers.length" class="text-sm text-gray-500 dark:text-gray-400">
            Ingen dossierer endnu.
          </li>
        </ul>
        <form class="flex gap-2" @submit.prevent="createAndAdd">
          <UInput
            v-model="newTitle" size="xs" placeholder="Nyt dossier …"
            aria-label="Nyt dossier" class="flex-1"
          />
          <UButton type="submit" size="xs" :disabled="!newTitle.trim()">Opret</UButton>
        </form>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { Dossier, ItemRef } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'

const props = defineProps<{ itemRef: ItemRef }>()
const repo = useWorkspaceRepo()
const toast = useToast()

const dossiers = ref<Dossier[]>([])
const member = ref<string[]>([])
const note = ref('')
const newTitle = ref('')

async function refresh() {
  dossiers.value = await repo.listDossiers()
  member.value = await repo.dossiersForRef(props.itemRef)
}
onMounted(refresh)

const title = (id: string) => dossiers.value.find((d) => d.id === id)?.title ?? 'dossier'

async function toggle(dossierId: string, add: boolean) {
  try {
    if (add) {
      await repo.addItem(dossierId, props.itemRef, note.value.trim())
      toast.add({ title: `Tilføjet til «${title(dossierId)}»` })
    } else {
      const existing = await repo.findItem(dossierId, props.itemRef)
      if (existing) await repo.removeItem(existing.id)
      toast.add({ title: `Fjernet fra «${title(dossierId)}»` })
    }
    await refresh()
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}

async function createAndAdd() {
  const t = newTitle.value.trim()
  if (!t) return
  try {
    const d = await repo.createDossier(t)
    await repo.addItem(d.id, props.itemRef, note.value.trim())
    newTitle.value = ''
    toast.add({ title: `Tilføjet til «${t}»` })
    await refresh()
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}
</script>
