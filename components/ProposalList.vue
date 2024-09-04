<template>
  <div class="grid gap-6">
    <div
      v-for="proposal in proposals"
      :key="proposal.id"
      class="card rounded-lg bg-white p-6 shadow-md"
    >
      <h2 class="mb-2 text-xl font-bold">{{ proposal.titelkort }}</h2>
      <p class="mb-2 text-gray-600">{{ proposal.nummer }}</p>
      <p class="mb-4">{{ proposal.resume }}</p>
      <p class="mb-4 text-sm text-gray-500">
        Opdateret: {{ proposal.opdateringsdato }}
      </p>
      <nuxt-link
        :to="`/lovforslag/${proposal.id}`"
        class="text-blue-600 transition-colors duration-200 hover:text-blue-800"
      >
        Se detaljer
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  proposals: {
    type: Array,
    required: true,
  },
})
</script>
