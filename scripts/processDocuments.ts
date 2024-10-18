import fs from 'fs'
import path from 'path'

function getDocumentFiles(directory: string): string[] {
  const files: string[] = []

  function readDirRecursive(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        readDirRecursive(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath)
      }
    }
  }

  readDirRecursive(directory)
  return files
}

async function processDocuments() {
  const documentFiles = getDocumentFiles('assets/data/html')
  const numWorkers = Math.min(documentFiles.length, 4)
  const workerPool: Worker[] = []
  const chunkSize = Math.ceil(documentFiles.length / numWorkers)

  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    })
    workerPool.push(worker)
  }

  const tasks = workerPool.map((worker, index) => {
    const start = index * chunkSize
    const end = Math.min(start + chunkSize, documentFiles.length)
    const files = documentFiles.slice(start, end)

    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        if (event.data.type === 'done') {
          resolve(event.data.result)
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.error))
        }
      }
      worker.postMessage({ files })
    })
  })

  try {
    await Promise.all(tasks)
    console.log('All documents processed successfully')
  } catch (error) {
    console.error('Error processing documents:', error)
  } finally {
    workerPool.forEach((worker) => worker.terminate())
  }
}

processDocuments().catch((error) => {
  console.error('Error in main process:', error)
  process.exit(1)
})
