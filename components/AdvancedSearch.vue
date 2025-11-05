<template>
    <div class="advanced-search">
        <MentionableSearch v-model="searchQuery" @search="performSearch" />
    </div>
</template>

<script setup lang="ts">
import MentionableSearch from '~/components/MentionableSearch.vue'
import type { MentionSearchQuery } from '~/types/mentions'

const searchQuery = ref('')

function performSearch(query: MentionSearchQuery) {
    // Handle the search action
    console.log('Search query:', query)
}
</script>

<style scoped>
.advanced-search {
    /* Your styles */
}
</style>
