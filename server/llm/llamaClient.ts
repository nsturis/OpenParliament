import { $fetch } from 'ofetch'

export class LLaMAClient {
  private apiUrl: string

  constructor() {
    const config = useRuntimeConfig()
    this.apiUrl = config.public.llmServiceUrl || 'http://localhost:8000'
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      console.log('About to call /generate_question')
      const response = await $fetch('/generate_question', {
        baseURL: this.apiUrl,
        method: 'POST',
        body: {
          text: prompt,
        },
      })
      console.log('Received response:', response)

      if (!response.question) {
        throw new Error('Question generation failed')
      }

      return response.question
    } catch (error) {
      console.error('Error generating response from local LLM service:', error)
      throw new Error('Failed to generate response from local LLM service')
    }
  }

  async search(query: string, topK: number = 5): Promise<any> {
    try {
      console.log('About to call /search')
      const response = await $fetch('/search', {
        baseURL: this.apiUrl,
        method: 'POST',
        body: {
          query,
          top_k: topK,
        },
      })
      console.log('Received search results:', response)

      return response.results
    } catch (error) {
      console.error('Error searching with local LLM service:', error)
      throw new Error('Failed to search with local LLM service')
    }
  }
}
