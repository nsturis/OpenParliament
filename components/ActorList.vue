<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
      <UFormGroup label="Søg efter navn" class="sm:w-80">
        <UInput v-model="searchTerm" placeholder="Fx Mette Frederiksen" icon="i-heroicons-magnifying-glass" />
      </UFormGroup>
      <p v-if="currentPeriode" class="text-sm text-gray-600 dark:text-gray-300">
        Viser aktører for {{ currentPeriode.titel }}
      </p>
    </div>

    <div v-if="!hasData" class="py-8 text-gray-600">Indlæser aktører …</div>

    <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <section v-for="group in groups" :key="group.label">
        <h2 class="mb-3 border-b border-gray-300 pb-1 text-xl font-semibold dark:border-gray-600">
          {{ group.label }} <span class="text-sm font-normal text-gray-500">({{ group.items.length }})</span>
        </h2>
        <ul class="space-y-1">
          <li v-for="actor in group.items" :key="actor.id">
            {{ actor.navn }}
          </li>
        </ul>
        <p v-if="!group.items.length" class="text-sm text-gray-500">Ingen fundet.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMetadata } from '~/composables/useMetadata';
import type { ActorType, Actor } from '~/types/actors';

const { actors, currentPeriode } = useMetadata();

const searchTerm = ref('')

const actorsByType = computed<Record<ActorType, Actor[]>>(() => {
  if (currentPeriode.value) {
    return actors.value[currentPeriode.value.id] || {} as Record<ActorType, Actor[]>;
  }
  return {} as Record<ActorType, Actor[]>;
});

const hasData = computed(() => Object.keys(actorsByType.value).length > 0)

const filterByName = (items: Actor[]) => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return items
  return items.filter((a) => a.navn?.toLowerCase().includes(term))
}

const groups = computed(() => [
  { label: 'Politikere', items: filterByName(actorsByType.value['Person'] || []) },
  { label: 'Udvalg', items: filterByName(actorsByType.value['Udvalg'] || []) },
  { label: 'Folketingsgrupper', items: filterByName(actorsByType.value['Folketingsgruppe'] || []) },
])
</script>
