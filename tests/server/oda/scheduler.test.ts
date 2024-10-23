import { describe, it, expect, vi } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'
import {
  startSyncScheduler,
  runManualSync,
} from '~/server/oda/scheduler'

describe('ODA Scheduler Tests', async () => {
  await setup({
    // test context options
  })

  it('should start sync scheduler without errors', () => {
    expect(() => startSyncScheduler()).not.toThrow()
  })

  it('should run manual sync without errors', async () => {
    await expect(runManualSync()).resolves.not.toThrow()
  })

  it('should run scheduled sync', async () => {
    vi.useFakeTimers()
    const schedulerSpy = vi.spyOn(global, 'setInterval')

    startSyncScheduler()

    expect(schedulerSpy).toHaveBeenCalled()

    vi.advanceTimersByTime(3600000) // Advance by 1 hour

    // You might need to adjust this expectation based on your actual implementation
    expect(schedulerSpy).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
