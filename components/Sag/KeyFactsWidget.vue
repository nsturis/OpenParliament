<script setup lang="ts">
import type { SagWithRelations } from '~/types/sag'

// /api/sag returns these lookup relations (wave A); SagWithRelations doesn't
// declare them yet, so extend locally — a plain SagWithRelations stays assignable.
type SagMedOpslag = Omit<SagWithRelations, 'sagstrin'> & {
  sagsstatus?: { id: number; status: string } | null
  sagstype?: { id: number; type: string } | null
  periode?: { id: number; titel: string; kode: string } | null
  sagstrin: Array<
    SagWithRelations['sagstrin'][number] & {
      sagstrinstype?: { type: string } | null
    }
  >
}

const props = defineProps<{ sag: SagMedOpslag }>()

// Only actual fremsættelse steps count ("Fremsættelse", "Fremsættelse (en
// beh.)") — for most cases the earliest step is something else (Besvarelse,
// Rådsmødepunkt, …) and the row must be omitted.
const fremsat = computed(() => {
  const datoer = props.sag.sagstrin
    .filter((trin) => /fremsæt/i.test(trin.sagstrinstype?.type ?? ''))
    .map((trin) => trin.dato)
    .filter((dato): dato is string => !!dato)
    .sort()
  return datoer.length ? formatDato(datoer[0]) : ''
})

const rows = computed(() => {
  const r: Array<{ label: string; value: string }> = []
  if (props.sag.sagstype?.type) r.push({ label: 'Type', value: props.sag.sagstype.type })
  if (props.sag.sagsstatus?.status) r.push({ label: 'Status', value: props.sag.sagsstatus.status })
  if (props.sag.periode?.titel) r.push({ label: 'Samling', value: props.sag.periode.titel })
  if (fremsat.value) r.push({ label: 'Fremsat', value: fremsat.value })
  if (props.sag.lovnummer) r.push({ label: 'Lovnummer', value: props.sag.lovnummer })
  return r
})

const relaterede = computed(() => {
  const rel: Array<{ id: number; label: string }> = []
  if (props.sag.fremsatundersagid)
    rel.push({ id: props.sag.fremsatundersagid, label: `Fremsat under sag ${props.sag.fremsatundersagid}` })
  if (props.sag.deltundersagid)
    rel.push({ id: props.sag.deltundersagid, label: `Delt under sag ${props.sag.deltundersagid}` })
  return rel
})
</script>

<template>
  <SagWidgetCard titel="Nøglefakta" default-open>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <template v-for="row in rows" :key="row.label">
        <dt class="font-medium text-gray-500 dark:text-gray-400">{{ row.label }}</dt>
        <dd class="text-gray-900 dark:text-gray-100">{{ row.value }}</dd>
      </template>
      <template v-if="sag.retsinformationsurl">
        <dt class="font-medium text-gray-500 dark:text-gray-400">Retsinformation</dt>
        <dd>
          <UButton
            :to="sag.retsinformationsurl"
            target="_blank"
            size="xs"
            variant="soft"
            trailing-icon="i-heroicons-arrow-top-right-on-square"
          >
            Åbn
          </UButton>
        </dd>
      </template>
      <template v-if="relaterede.length">
        <dt class="font-medium text-gray-500 dark:text-gray-400">Relaterede sager</dt>
        <dd class="flex flex-wrap gap-x-3 gap-y-1">
          <NuxtLink
            v-for="rel in relaterede"
            :key="rel.id"
            :to="`/sager/${rel.id}`"
            class="text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            {{ rel.label }}
          </NuxtLink>
        </dd>
      </template>
    </dl>
  </SagWidgetCard>
</template>
