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
      <UGrid cols="1" md="2">
        <Parties class="order-last md:order-first" />
        <Question
          v-if="electionQuizStore.step < electionQuizStore.quiz.length"
          class="lg:ml-5"
        />
        <UCard v-else class="text-xl lg:ml-5">
          <UTypography variant="h1">Færdig!</UTypography>
          <UTypography>
            Du er nået til enden. Om du kan bruge denne test til noget, er helt op
            til dig selv.
          </UTypography>
          <UTypography>
            Du kan se det samlede
            <NuxtLink to="/valgtest-resultat">
              <UButton>resultat her</UButton>
            </NuxtLink>.
          </UTypography>
          <UButton v-if="electionQuizStore.step !== 0" icon="i-heroicons-arrow-uturn-left" color="yellow" @click="previousStep" />
        </UCard>
      </UGrid>
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
  if (state.step === state.quiz.length - 1) {
    if (!resultIsSaved.value) {
      resultIsSaved.value = true
      saveResult()
    }
  }
})

const saveResult = async () => {
  // Remove title
  const data = electionQuizStore.quizResult.map((item) => {
    delete item.title
    return item
  })
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
