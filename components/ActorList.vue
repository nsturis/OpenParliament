<template>
  <div>
    <h2>Politicians</h2>
    <ul>
      <li v-for="politician in politicians" :key="politician.id">
        {{ politician.navn }}
      </li>
    </ul>

    <h2>Committees</h2>
    <ul>
      <li v-for="committee in committees" :key="committee.id">
        {{ committee.navn }}
      </li>
    </ul>
    <!-- Repeat for other actor types -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMetadata } from '~/composables/useMetadata';

const { actors, currentPeriode } = useMetadata();

const actorsByType = computed(() => {
  if (currentPeriode.value) {
    return actors.value[currentPeriode.value.id] || {};
  }
  return {};
});

const politicians = computed(() => actorsByType.value['Person'] || []);
const committees = computed(() => actorsByType.value['Udvalg'] || []);
// ... other actor types
</script>
