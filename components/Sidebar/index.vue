<script setup lang="ts">
const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden">
      <button
        class="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        @click="toggleSidebar"
      >
        <Icon
          :name="isOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
          class="h-6 w-6"
        />
      </button>
    </div>

    <!-- Mobile Sidebar -->
    <div
      v-show="isOpen"
      class="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gray-100 shadow-lg transform transition-transform duration-300"
      :class="{ '-translate-x-full': !isOpen }"
    >
      <div class="p-4">
        <slot name="sidebar-content">
          <!-- Default sidebar content -->
          <nav class="space-y-2">
            <!-- Add your sidebar navigation items here -->
          </nav>
        </slot>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <div class="hidden lg:block w-64 bg-gray-100 min-h-screen p-4">
      <slot name="sidebar-content">
        <!-- Default sidebar content -->
        <nav class="space-y-2">
          <!-- Add your sidebar navigation items here -->
        </nav>
      </slot>
    </div>
  </div>
</template>
