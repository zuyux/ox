// components/UploadFile.js

import { useState } from 'react'
import { initializeHelia } from '../utils/ipfs'

const UploadFile = () => {
  const [file, setFile] = useState(null)
  const [cid, setCid] = useState(null)
  const [status, setStatus] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.')
      return
    }

    try {
      setStatus('Uploading...')

      const helia = await initializeHelia()
      const fileBuffer = await file.arrayBuffer()
      const { cid } = await helia.blockstore.put(Buffer.from(fileBuffer))

      setCid(cid.toString())
      setStatus('Upload successful!')

      // Asegúrate de usar una puerta de enlace compatible con CDN, como Cloudflare
      const ipfsUrl = `https://cloudflare-ipfs.com/ipfs/${cid.toString()}`
      console.log('IPFS URL:', ipfsUrl)
      
    } catch (error) {
      console.error('Error uploading file:', error)
      setStatus('Upload failed.')
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
      {cid && (
        <div>
          <p>File CID: {cid}</p>
          <a href={`https://cloudflare-ipfs.com/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
            View file on IPFS via Cloudflare
          </a>
        </div>
      )}
    </div>
  )
}

export default UploadFile
