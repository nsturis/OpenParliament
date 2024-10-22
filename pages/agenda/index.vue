<template>
  <div>
    <div class="filters">
      <UFormGroup label="Vælg startdato">
        <UInput v-model="startDate" type="date" @change="fetchDocket" />
      </UFormGroup>
      <UFormGroup label="Vælg person">
        <USelectMenu v-model="selectedPerson" :options="aktørStore.aktører" option-attribute="navn" searchable
          placeholder="Vælg person" @change="fetchDocket" />
      </UFormGroup>
      <UFormGroup label="Vælg mødetype">
        <UCheckbox v-for="type in meetingTypes" :key="type.id" v-model="selectedMeetingTypes" :label="type.type"
          :value="type.id" @change="fetchDocket" />
      </UFormGroup>
    </div>
    <UTable :columns="columns" :rows="weeklyDocket">
      <template #date-data="{ row }">
        {{ formatDate(row.dato) }}
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
import { useAktørStore } from '~/stores/aktør'
import { useMetadata } from '~/composables/useMetadata'
import type { Meeting, MeetingType } from '~/types/meeting'

interface weeklyDocket {
  date: string
  title: string
  startTid: string
  lokale: string
  agendaItems: {
    nummer: number
    titel: string
    kommentar: string
  }[]
}

const aktørStore = useAktørStore()
const { currentPeriode } = useMetadata()

const weeklyDocket = ref<Meeting[]>([])
const meetingTypes = ref<MeetingType[]>([])
const startDate = ref(new Date().toISOString().split('T')[0])
const selectedPerson = ref('')
const selectedMeetingTypes = ref<number[]>([])

const columns = [
  { key: 'date', label: 'Dato' },
  { key: 'titel', label: 'Titel' },
  { key: 'starttidsbemærkning', label: 'Starttid' },
  { key: 'lokale', label: 'Lokale' },
  { key: 'agendaItems', label: 'Dagsorden' },
]

const fetchDocket = async () => {
  const { data } = await useFetch<{ weeklyDocket: Meeting[], persons: Aktør[], meetingTypes: MeetingType[] }>('/api/ugeplan', {
    params: {
      date: startDate.value,
      aktørId: selectedPerson.value,
      mødetypeIds: selectedMeetingTypes.value.join(','),
      periodeId: currentPeriode.value?.id,
    }
  })
  weeklyDocket.value = data.value?.weeklyDocket ?? []
  aktørStore.setAktører(data.value?.persons as Aktør[])
  meetingTypes.value = data.value?.meetingTypes as MeetingType[]
}

const fetchPersons = async () => {
  const persons = await $fetch<Aktør[]>('/api/actors', {
    params: { typeId: 5 } // 5 is for "Person"
  })
  aktørStore.setAktører(persons)
}

onMounted(async () => {
  await fetchPersons()
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

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-selector,
.person-selector,
.meeting-type-selector {
  display: flex;
  flex-direction: column;
}

.meeting {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
