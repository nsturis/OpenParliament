<template>
    <div>
        <label for="actor-type">Select Actor Type:</label>
        <select id="actor-type" v-model="selectedActorType" @change="fetchByActorType">
            <option v-for="type in possibleActorTypes" :key="type" :value="type">
                {{ type }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ActorType } from '~/types/actors';

// Suppose you only want these five, matching your ActorType union
const possibleActorTypes: ActorType[] = [
    'Udvalg',
    'Person',
    'Ministerium',
    'Folketingsgruppe',
    'Ministerområde'
];

const selectedActorType = ref<ActorType>('Person');

async function fetchByActorType() {
    // Call your /api/actors/by-period with the selected actor type
    await $fetch('/api/actors/by-period', {
        params: {
            periodeId: 123, // example
            types: selectedActorType.value // e.g. 'Person'
        }
    });
}
</script>
