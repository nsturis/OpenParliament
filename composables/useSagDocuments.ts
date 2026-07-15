import type { Ref } from 'vue'
import { ref } from 'vue'

interface Document {
  id: number
  titel: string
  content?: string
  error?: string
  htmlUrl: string
  filurl: string
  format: string
}

export function useSagDocuments(sagId: number) {
  const documents: Ref<Document[]> = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDocuments = async () => {
    isLoading.value = true
    error.value = null

    // useFetch does not throw — it surfaces failures on its own `error` ref, so
    // read that instead of relying on try/catch (which never fired before).
    const { data, error: fetchError } = await useFetch<Document[]>('/api/sag/documents', {
      params: { id: sagId },
    })

    if (fetchError.value) {
      error.value = 'Kunne ikke hente dokumenter'
      console.error(fetchError.value)
    } else if (data.value) {
      documents.value = data.value
    }

    isLoading.value = false
  }

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
  }
}
