import { loadLastUpdateTimestamp, saveLastUpdateTimestamp } from './utils'
import { sagGet } from './oda'
import prisma from '../../backup/prisma_backup/client.js'

async function fetchAndStoreUpdatedEntities() {
  const lastUpdateTimestamp = await loadLastUpdateTimestamp()
  const updatedEntities = await sagGet(ctx, {
    $filter: `opdateringsdato gt ${lastUpdateTimestamp.toISOString()}`,
  })
  await prisma.sag.createMany({
    data: updatedEntities.value,
    skipDuplicates: true,
  })
  await saveLastUpdateTimestamp(new Date())
}