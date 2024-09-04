import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    headerTitle: 'Unfuck The System.dk – deltagende demokrati',
  }),
  actions: {
    updateHeaderTitle(title: string) {
      this.headerTitle = title
    },
  },
})
