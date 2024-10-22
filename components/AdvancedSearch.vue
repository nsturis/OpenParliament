<template>
    <div class="advanced-search">
        <Mentionable v-model="searchQuery" @search="performSearch" />
    </div>
</template>

<script setup lang="ts">
import Mentionable from '~/components/Mentionable.vue'

const searchQuery = ref('')

function performSearch(query: string) {
    // Handle the search action
    console.log('Search query:', query)
}
</script>

<style scoped>
.advanced-search {
    /* Your styles */
}
</style>
