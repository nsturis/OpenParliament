<template>
  <div class="sag-timeline">
    <h2>{{ sag?.titel }}</h2>
    <ul class="timeline">
      <li v-for="step in sagstrin" :key="step.id" class="timeline-item">
        <div class="timeline-info">
          <span>{{ formatDate(step.dato) }}</span>
        </div>
        <div class="timeline-marker" />
        <div class="timeline-content">
          <h3>{{ step.titel }}</h3>
          <p>{{ getStepDescription(step) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSagStore } from '@/stores/sag'
import { useSagDocuments } from '@/composables/useSagDocuments'

const route = useRoute()
const sagId = parseInt(route.params.id as string, 10)
const sagStore = useSagStore()
const { documents, fetchDocuments } = useSagDocuments(sagId)

const sag = computed(() => sagStore.sag)
const sagstrin = computed(() => sag.value?.sagstrin || [])

onMounted(async () => {
  await sagStore.fetchSag(sagId)
  await fetchDocuments()
})

function formatDate(date: string | Date | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

function getStepDescription(step: any) {
  // You can customize this function to provide more detailed descriptions
  // based on the step type, associated documents, etc.
  return `${step.folketingstidende || ''} ${
    step.folketingstidendesidenummer || ''
  }`
}
</script>

<style scoped>
.sag-timeline {
  padding: 20px;
}

.timeline {
  list-style-type: none;
  position: relative;
  padding-left: 30px;
}

.timeline:before {
  content: ' ';
  background: #d4d9df;
  display: inline-block;
  position: absolute;
  left: 9px;
  width: 2px;
  height: 100%;
  z-index: 400;
}

.timeline-item {
  margin: 20px 0;
}

.timeline-marker {
  position: absolute;
  background: #fff;
  border: 3px solid #3498db;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  left: 0;
  margin-left: -6px;
}

.timeline-info {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0 0 0.5em 0;
  text-transform: uppercase;
  white-space: nowrap;
}

.timeline-content {
  background: #f8f9fa;
  border-radius: 5px;
  padding: 15px;
}
</style>
