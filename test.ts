import { afstemningGet, createContext } from './utils/oda'

const ctx = createContext()

afstemningGet(ctx, { $top: 1 }).then((afstemning) => {
  console.log(afstemning)
})
