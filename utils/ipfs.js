// utils/ipfs.js

import { createHelia } from 'helia'
import { create as createIpfsHttpClient } from 'ipfs-http-client'

// Inicializa Helia
export const initializeHelia = async () => {
  const heliaNode = await createHelia()

  return heliaNode
}
