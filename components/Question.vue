<template>
  <UCard class="flex h-full flex-col items-center justify-center">
    <UTypography
      variant="h1"
      class="mb-10 mt-8 text-center text-3xl font-bold italic md:mt-0"
      style="word-break: break-word"
    >
      {{ question.title }}
    </UTypography>
    <div class="mb-10 flex w-full items-center justify-center">
      <UButton
        v-if="electionQuizStore.step !== 0"
        icon="i-heroicons-arrow-uturn-left"
        color="yellow"
        variant="ghost"
        @click="previousStep"
      />
      <UButton
        icon="i-heroicons-hand-thumb-up"
        color="green"
        variant="ghost"
        @click="updateAnswer('yay')"
      />
      <UButton
        icon="i-heroicons-hand-thumb-down"
        color="red"
        variant="ghost"
        @click="updateAnswer('nay')"
      />
      <UButton
        v-if="electionQuizStore.step < electionQuizStore.quiz.length"
        icon="i-heroicons-arrow-uturn-right"
        color="yellow"
        variant="ghost"
        @click="nextStep"
      />
    </div>
    <UButton
      :to="question.link"
      target="_blank"
      class="hidden md:inline-flex"
      color="gray"
    >
      LÆS MERE OM FORSLAGET
    </UButton>
  </UCard>
</template>

<script setup lang="ts">
import { useElectionQuizStore } from '@/stores/electionQuiz'

const electionQuizStore = useElectionQuizStore()

const question = computed(() => {
  return electionQuizStore.quiz[electionQuizStore.step]
})

const nextStep = () => {
  electionQuizStore.nextStep()
}

const previousStep = () => {
  electionQuizStore.previousStep()
}

const updateAnswer = (answer: string) => {
  electionQuizStore.reply(answer)
  saveAnswer(answer)
  if (!electionQuizStore.hasScrolled) {
    electionQuizStore.setScroll(true)
    document
      .getElementById('quiz-progress')
      ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
}

const saveAnswer = (answer: string) => {
  fetch('/api/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: electionQuizStore.quiz[electionQuizStore.step].title,
      ftid: electionQuizStore.quiz[electionQuizStore.step].ftid,
      samling: electionQuizStore.quiz[electionQuizStore.step].samling,
      vote: answer,
    }),
  })
}
</script>
