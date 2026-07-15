<template>
  <div class="relative">
    <UBadge
      id="quiz-progress"
      class="absolute -right-4 -top-5 lg:-right-10 lg:-top-10"
      color="emerald"
      size="lg"
    >
      {{ electionQuizStore.step + 1 }} / {{ electionQuizStore.quiz.length }}
    </UBadge>
    <UContainer>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Parties class="order-last md:order-first" />
        <Question
          v-if="electionQuizStore.step < electionQuizStore.quiz.length"
          class="lg:ml-5"
        />
        <UCard v-else class="text-xl lg:ml-5">
          <h2 class="mb-4 text-3xl font-bold">Færdig!</h2>
          <p class="mb-2">
            Du er nået til enden. Om du kan bruge denne test til noget, er helt op
            til dig selv.
          </p>
          <p class="mb-4">
            Du kan se det samlede
            <UButton to="/valgtest-resultat">resultat her</UButton>.
          </p>
          <UButton v-if="electionQuizStore.step !== 0" icon="i-heroicons-arrow-uturn-left" color="yellow" @click="previousStep" />
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useElectionQuizStore } from '@/stores/electionQuiz'
import { useMainStore } from '@/stores/main'

const electionQuizStore = useElectionQuizStore()
const mainStore = useMainStore()
const resultIsSaved = ref(false)

const previousStep = () => {
  electionQuizStore.previousStep()
}

onMounted(() => {
  mainStore.updateHeaderTitle('Folketingsvalg 2022 – Den Historiske Valgtest')
})

electionQuizStore.$subscribe((_mutation, state) => {
  // reply() records the answer then increments step, so the quiz is fully
  // answered when step reaches quiz.length — save then, or the final answer
  // is dropped from the persisted result.
  if (state.step === state.quiz.length) {
    if (!resultIsSaved.value) {
      resultIsSaved.value = true
      saveResult()
    }
  }
})

const saveResult = async () => {
  // Strip `title` via destructuring rather than `delete`, so the live store
  // party objects aren't mutated as a side effect of serialization.
  const data = electionQuizStore.quizResult.map(({ title: _title, ...rest }) => rest)
  await fetch('/api/election', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

useHead({
  title: 'Folketingsvalg 2022 – Den Historiske Valgtest – Parlamentet.dk',
  meta: [
    {
      property: 'og:image',
      content: 'https://Parlamentet-dk.vercel.app/valgtest.jpg',
    },
    {
      property: 'description',
      content:
        'Du kan på denne side afgive din stemme til udvalgte forslag fra folketinget. Folketingets medlemmer har allerede afgivet deres stemme til forslagene, så når du har afgivet dine stemmer, kan du se, hvor enig du i virkeligheden er med folketingets partier.',
    },
    {
      property: 'og:description',
      content:
        'Du kan på denne side afgive din stemme til udvalgte forslag fra folketinget. Folketingets medlemmer har allerede afgivet deres stemme til forslagene, så når du har afgivet dine stemmer, kan du se, hvor enig du i virkeligheden er med folketingets partier.',
    },
  ],
})
</script>
