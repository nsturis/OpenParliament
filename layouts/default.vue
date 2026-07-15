<template>
  <div class="min-h-full">

    <HeaderMenu />
    <div class="-mt-32">
      <main class="flex-grow mt-0">
        <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div
            class="content-card rounded-lg px-5 py-6 shadow-lg dark:bg-none sm:px-6 dark:bg-gray-900 dark:text-gray-100"
          >
            <div class="h-full">
              <slot />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.content-card {
  background-image: url('/gradient.jpg');
  background-size: cover;
}
:global(.dark) .content-card {
  background-image: none;
}
</style>
