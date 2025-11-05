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
import type { ActorType, Actor } from '~/types/actors';

const { actors, currentPeriode } = useMetadata();

const actorsByType = computed<Record<ActorType, Actor[]>>(() => {
  if (currentPeriode.value) {
    return actors.value[currentPeriode.value.id] || {} as Record<ActorType, Actor[]>;
  }
  return {} as Record<ActorType, Actor[]>;
});

const politicians = computed(() => actorsByType.value['Person'] || []);
const committees = computed(() => actorsByType.value['Udvalg'] || []);
// ... other actor types
</script>
