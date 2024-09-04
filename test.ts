import { ServerConfiguration, ok } from '@typoas/runtime';

import { afstemningGet, createContext } from './utils/oda'

const ctx = createContext()

const res = await afstemningGet(ctx, {$top: 1}).then((afstemning) => {
  console.log(afstemning)
})
