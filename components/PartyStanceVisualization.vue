<template>
  <div class="party-stance-visualization">
    <h3>Party Stances</h3>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="party-stances">
      <div v-for="party in data" :key="party.name" class="party-stance">
        <div class="party-name">{{ party.name }}</div>
        <div
          class="stance-bar"
          :style="{
            width: `${party.percentage}%`,
            backgroundColor: getStanceColor(party.stance),
          }"
        >
          {{ party.stance }} ({{ party.percentage }}%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const sagId = parseInt(route.params.id as string, 10)

const { data, pending, error } = await useFetch(`/api/sag/partyStances`, {
  params: { id: sagId },
})

function getStanceColor(stance: string): string {
  switch (stance) {
    case 'For':
      return '#4CAF50'
    case 'Against':
      return '#F44336'
    default:
      return '#9E9E9E'
  }
}
</script>

<style scoped>
.party-stance-visualization {
  margin-top: 20px;
}

.party-stances {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.party-stance {
  display: flex;
  align-items: center;
}

.party-name {
  width: 100px;
  font-weight: bold;
}

.stance-bar {
  height: 20px;
  min-width: 40px;
  color: white;
  text-align: center;
  line-height: 20px;
  border-radius: 10px;
}
</style>
