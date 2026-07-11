<template>
  <div>
    <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
      <UFormGroup label="Vælg startdato">
        <UInput v-model="startDate" type="date" @change="fetchDocket" />
      </UFormGroup>
      <UFormGroup label="Vælg person">
        <USelectMenu
v-model="selectedPerson" :options="actorsPeriod" option-attribute="navn" searchable
          placeholder="Vælg person" @change="fetchDocket" />
      </UFormGroup>
      <UFormGroup label="Vælg mødetype">
        <UCheckbox
v-for="type in meetingTypes" :key="type.id" v-model="selectedMeetingTypes" :label="type.type"
          :value="type.id" @change="fetchDocket" />
      </UFormGroup>
    </div>
    <div v-if="pending" class="py-8 text-center text-gray-600">Indlæser ugeplan …</div>
    <div v-else-if="error" class="py-8 text-center text-red-600">{{ error }}</div>
    <UTable
      v-else :columns="columns" :rows="weeklyDocket"
      :empty-state="{ icon: 'i-heroicons-calendar-days', label: 'Ingen møder i den valgte uge.' }">
      <template #date-data="{ row }">
        {{ formatDate(row.dato) }}
      </template>
      <template #titel-data="{ row }">
        <NuxtLink :to="`/meeting/${row.id}`" class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
          {{ row.titel }}
        </NuxtLink>
      </template>
      <template #agendaItems-data="{ row }">
        <ul>
          <li v-for="item in row.agendaItems" :key="item.id">
            {{ item.nummer }}. {{ item.titel }}
            <p v-if="item.kommentar">{{ item.kommentar }}</p>
          </li>
        </ul>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { useMetadata } from '~/composables/useMetadata'
import type { Meeting, MeetingType } from '~/types/meeting'
import type { Actor } from '~/types/actors'

const { currentPeriode, actors } = useMetadata()
const mainStore = useMainStore()
mainStore.updateHeaderTitle('Ugeplan')

const weeklyDocket = ref<Meeting[]>([])
const meetingTypes = ref<MeetingType[]>([])
const startDate = ref(new Date().toISOString().split('T')[0])
const selectedPerson = ref<Actor | undefined>(undefined)
const selectedMeetingTypes = ref<number[]>([])
const pending = ref(false)
const error = ref('')

const columns = [
  { key: 'date', label: 'Dato' },
  { key: 'titel', label: 'Titel' },
  { key: 'starttidsbemærkning', label: 'Starttid' },
  { key: 'lokale', label: 'Lokale' },
  { key: 'agendaItems', label: 'Dagsorden' },
]

const actorsPeriod = computed(() => {
  if (currentPeriode.value && actors.value[currentPeriode.value.id]) {
    return actors.value[currentPeriode.value.id]['Person'] || []
  }
  return []
})

const fetchDocket = async () => {
  pending.value = true
  error.value = ''
  try {
    const data = await $fetch<{ weeklyDocket: Meeting[], meetingTypes: MeetingType[] }>('/api/ugeplan', {
      params: {
        date: startDate.value,
        aktørId: selectedPerson.value?.id,
        mødetypeIds: selectedMeetingTypes.value.join(','),
        periodeId: currentPeriode.value?.id,
      }
    })
    weeklyDocket.value = data?.weeklyDocket ?? []
    meetingTypes.value = data?.meetingTypes ?? []
  } catch {
    error.value = 'Ugeplanen kunne ikke hentes. Prøv igen senere.'
  } finally {
    pending.value = false
  }
}

onMounted(async () => {
  await fetchDocket()
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
