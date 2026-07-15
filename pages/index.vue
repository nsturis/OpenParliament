<template>
  <UContainer class="space-y-10 py-8">
    <section>
      <h1 class="mb-1 text-2xl font-bold">Hvad leder du efter?</h1>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Søg i sager og folketingsdebatter, eller gå direkte til
        <NuxtLink to="/sager">sagerne</NuxtLink>,
        <NuxtLink to="/ugeplan">ugeplanen</NuxtLink> eller
        <NuxtLink to="/actors">aktørerne</NuxtLink>.
      </p>
      <SearchBar />
    </section>

    <UAlert
      v-if="storageError"
      color="amber"
      title="Din arbejdsplads kan ikke gemmes i denne browser"
      description="Dossierer og gemte søgninger kræver lokal lagring (IndexedDB), som ikke er tilgængelig her (fx privat browsing). Dine data gemmes kun på din egen enhed."
    />

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Dine dossierer</h2>
        <form class="flex gap-2" @submit.prevent="createDossier">
          <UInput v-model="newTitle" size="sm" placeholder="Nyt dossier …" aria-label="Nyt dossier" />
          <UButton type="submit" size="sm" :disabled="!newTitle.trim()">Opret</UButton>
        </form>
      </div>
      <p v-if="!storageError && !dossiers.length" class="text-gray-500 dark:text-gray-400">
        Din arbejdsplads er tom og gemmes kun lokalt på denne enhed. Opret dit første dossier for at samle sager,
        taler og afstemninger om et emne.
      </p>
      <div v-else-if="dossiers.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <WorkspaceDossierCard v-for="d in dossiers" :key="d.id" :dossier="d" :count="counts[d.id] ?? 0" />
      </div>
    </section>

    <section v-if="savedSearches.length">
      <h2 class="mb-3 text-xl font-semibold">Gemte søgninger</h2>
      <ul class="divide-y divide-gray-100 dark:divide-gray-800">
        <WorkspaceSavedSearchRow v-for="s in savedSearches" :key="s.id" :search="s" />
      </ul>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
import type { Dossier, SavedSearch } from '~/types/workspace'
import { useWorkspaceRepo } from '~/composables/useWorkspaceRepo'

const repo = useWorkspaceRepo()
const toast = useToast()
const dossiers = ref<Dossier[]>([])
const savedSearches = ref<SavedSearch[]>([])
const counts = ref<Record<string, number>>({})
const newTitle = ref('')
const storageError = ref(false)

async function load() {
  try {
    dossiers.value = await repo.listDossiers()
    savedSearches.value = await repo.listSavedSearches()
    const entries = await Promise.all(
      dossiers.value.map(async (d) => [d.id, (await repo.listItems(d.id)).length] as const),
    )
    counts.value = Object.fromEntries(entries)
  } catch {
    storageError.value = true
  }
}
onMounted(load)

async function createDossier() {
  const t = newTitle.value.trim()
  if (!t) return
  try {
    const d = await repo.createDossier(t)
    newTitle.value = ''
    navigateTo(`/dossier/${d.id}`)
  } catch {
    toast.add({ title: 'Kunne ikke gemme lokalt', color: 'red' })
  }
}

useHead({ title: 'Din arbejdsplads – Parlamentet.dk' })
</script>
