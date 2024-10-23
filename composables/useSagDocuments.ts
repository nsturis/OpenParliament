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

    try {
      const { data } = await useFetch<Document[]>('/api/sag/documents', {
        params: { id: sagId },
      })

      if (data.value) {
        documents.value = data.value
      }
    } catch (err) {
      error.value = 'Failed to fetch documents'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
  }
}
