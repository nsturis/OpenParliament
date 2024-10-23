// import { describe, it, expect, vi } from 'vitest'
// import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
// import SagerIndex from '~/pages/sager/index.vue'

// mockNuxtImport ( '')

// describe('Sager Page Tests', async () => {

//   // Mock data
//   const mockSager = [
//     { id: 1, titel: 'Test Sag 1', typeid: 1, periodeid: 160 },
//     { id: 2, titel: 'Test Sag 2', typeid: 2, periodeid: 160 }
//   ]

//   const mockPerioder = [
//     { id: 160, titel: 'Test Periode' }
//   ]

//   const mockSagstyper = [
//     { id: 1, type: 'Test Type 1' },
//     { id: 2, type: 'Test Type 2' }
//   ]

//   // Register all required endpoints
//   beforeEach(() => {
//     registerEndpoint('/api/sag/list', () => ({
//       items: mockSager,
//       totalPages: 1,
//       currentPage: 1,
//       pageSize: 10,
//       totalCount: 2
//     }))

//     registerEndpoint('/api/perioder', () => mockPerioder)
//     registerEndpoint('/api/sag/types', () => mockSagstyper)
//   })

//   it('should load initial data correctly', async () => {
//     const wrapper = await mountSuspended(SagerIndex)
//     await wrapper.vm.$nextTick()

//     expect(wrapper.vm.isLoading).toBe(false)
//     expect(wrapper.vm.sagData).toBeDefined()
//     expect(wrapper.vm.sagData.length).toBe(2)
//   })

//   it('should handle period changes correctly', async () => {
//     const wrapper = await mountSuspended(SagerIndex)
    
//     const fetchSpy = vi.spyOn(global, '$fetch')
    
//     await wrapper.vm.setCurrentPeriode(160)
//     await wrapper.vm.$nextTick()

//     expect(wrapper.vm.filters.periodeid).toBe(160)
//     expect(fetchSpy).toHaveBeenCalledWith('/api/sag/list', {
//       query: expect.objectContaining({
//         periodeid: 160
//       })
//     })
//   })

//   it('should handle loading states correctly', async () => {
//     const wrapper = await mountSuspended(SagerIndex)
    
//     expect(wrapper.vm.isLoading).toBe(true)
//     await wrapper.vm.$nextTick()
//     expect(wrapper.vm.isLoading).toBe(false)
//   })

//   it('should handle errors gracefully', async () => {
//     registerEndpoint('/api/sag/list', () => {
//       throw new Error('Test error')
//     })

//     const wrapper = await mountSuspended(SagerIndex)
//     await wrapper.vm.$nextTick()

//     expect(wrapper.vm.error).toBeDefined()
//   })
// })
