<template>
  <div class="min-h-full">

    <HeaderMenu />
    <div class="-mt-32">
      <main class="flex-grow mt-0">
        <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div
            class="rounded-lg px-5 py-6 shadow-lg sm:px-6"
            style="background-image: url('/gradient.jpg'); background-size: cover"
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
