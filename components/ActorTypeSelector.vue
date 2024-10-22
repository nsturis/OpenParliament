<template>
    <div>
        <label for="actor-type">Select Actor Type:</label>
        <select id="actor-type" v-model="selectedActorType">
            <option v-for="type in actorTypes" :key="type" :value="type">
                {{ type }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMetadata } from '~/composables/useMetadata';

const { actorTypes } = useMetadata();
const selectedActorType = ref<string>(actorTypes.value[0] || '');

const actorsByType = computed(() => {
    const { actors, currentPeriode } = useMetadata();
    if (currentPeriode.value && selectedActorType.value) {
        return (
            actors.value[currentPeriode.value.id]?.[selectedActorType.value] || []
        );
    }
    return [];
});
</script>
