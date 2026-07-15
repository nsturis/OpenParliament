<template>
  <UContainer class="py-8">
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-8 w-64" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
    </div>
    <UAlert
      v-else-if="errored" color="red" title="Kunne ikke indlæse dossier"
      description="Din arbejdsplads kunne ikke læses i denne browser."
    />
    <UAlert
      v-else-if="!dossier" color="red" title="Dossier ikke fundet"
      description="Dette dossier findes ikke på denne enhed."
    />
    <div v-else class="space-y-6">
      <header class="space-y-2">
        <UInput
          v-model="dossier.title" size="xl" variant="none" class="px-0 text-2xl font-bold"
          aria-label="Dossier-titel" @blur="saveHeader"
        />
        <UTextarea
          v-model="dossier.description" :rows="2" variant="none" class="px-0"
          placeholder="Beskrivelse …" aria-label="Beskrivelse" @blur="saveHeader"
        />
        <div class="flex gap-2">
          <UButton icon="i-heroicons-arrow-down-tray" size="xs" variant="soft" @click="exportMd">
            Eksportér
          </UButton>
          <UButton icon="i-heroicons-trash" size="xs" color="red" variant="soft" @click="removeDossier">
            Slet
          </UButton>
          <span class="self-center text-sm text-gray-500 dark:text-gray-400">{{ items.length }} elementer</span>
        </div>
      </header>

      <WorkspacePositionSummary v-if="sagIds.length" :sag-ids="sagIds" />

      <p v-if="!items.length" class="text-gray-500 dark:text-gray-400">
        Ingen elementer endnu. Tilføj sager, taler, afstemninger m.m. fra deres sider.
      </p>

      <section v-for="g in groups" v-show="g.items.length" :key="g.type" class="space-y-2">
        <h2 class="font-semibold">{{ g.heading }}</h2>
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <li v-for="i in g.items" :key="i.id" class="flex items-start gap-3 py-2">
            <NuxtLink
              :to="sourcePath(i.ref)"
              class="text-primary-600 hover:underline dark:text-primary-400"
            >
              {{ i.ref.meta?.label ?? `${i.ref.type} ${i.ref.id}` }}
            </NuxtLink>
            <UInput
              :model-value="i.note" size="xs" variant="none" placeholder="note …"
              class="flex-1" aria-label="Note" @change="(v: string) => saveNote(i.id, v)"
            />
            <UButton
              icon="i-heroicons-x-mark" size="2xs" color="gray" variant="ghost"
              aria-label="Fjern" @click="removeItem(i.id)"
            />
          </li>
        </ul>
      </section>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Dossier, DossierItem, ItemRef, RefType } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'
import { dossierToMarkdown } from '~/utils/workspace/exportMarkdown'

const route = useRoute()
const router = useRouter()
const repo = useWorkspaceRepo()
const id = computed(() => String(route.params.id))

const loading = ref(true)
const errored = ref(false)
const dossier = ref<Dossier | undefined>()
const items = ref<DossierItem[]>([])

const HEADINGS: Record<RefType, string> = {
  sag: 'Sager', speech: 'Taler', vote: 'Afstemninger', actor: 'Aktører', qna: 'Spørgsmål & svar',
}
const ORDER: RefType[] = ['sag', 'speech', 'vote', 'actor', 'qna']
const groups = computed(() =>
  ORDER.map((type) => ({ type, heading: HEADINGS[type], items: items.value.filter((i) => i.ref.type === type) })))

const sagIds = computed(() => [...new Set(
  items.value.filter((i) => i.ref.type === 'sag' || i.ref.type === 'vote').map((i) => i.ref.id),
)])

function sourcePath(ref: ItemRef) {
  return ref.type === 'actor' ? `/aktoerer/${ref.id}` : `/sager/${ref.id}`
}

async function reloadItems() {
  items.value = dossier.value ? await repo.listItems(id.value) : []
}

async function load() {
  loading.value = true
  errored.value = false
  try {
    dossier.value = await repo.getDossier(id.value)
    await reloadItems()
  } catch {
    errored.value = true
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function saveHeader() {
  if (dossier.value) {
    await repo.updateDossier(id.value, { title: dossier.value.title, description: dossier.value.description })
  }
}
async function saveNote(itemId: string, note: string) {
  await repo.updateItem(itemId, { note })
  await reloadItems()
}
async function removeItem(itemId: string) {
  await repo.removeItem(itemId)
  await reloadItems()
}
async function removeDossier() {
  await repo.deleteDossier(id.value)
  router.push('/')
}

function exportMd() {
  if (!dossier.value) return
  const md = dossierToMarkdown(dossier.value, items.value)
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${dossier.value.title.replace(/[^\p{L}\p{N}]+/gu, '-')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

useHead({ title: () => `${dossier.value?.title ?? 'Dossier'} – Parlamentet.dk` })
</script>
