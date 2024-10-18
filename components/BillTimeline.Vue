<!-- <template>
  <div class="bill-timeline">
    <h2>{{ bill.titel }}</h2>
    <ul class="timeline">
      <li v-for="step in billSteps" :key="step.id" class="timeline-item">
        <div class="timeline-info">
          <span>{{ formatDate(step.dato) }}</span>
        </div>
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h3>{{ step.titel }}</h3>
          <p>{{ step.beskrivelse }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const billId = route.params.id as string
const bill = ref<any>({})
const billSteps = ref<any[]>([])

onMounted(async () => {
  bill.value = await fetchBill(billId)
  billSteps.value = await fetchBillSteps(billId)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
/* Add your timeline styling here */
</style> -->
-->
