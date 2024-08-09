'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const UpLink = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ vlink: '' })

  // Function to generate a videoID
  const generateVideoID = (vlink) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let hash = 0
    for (let i = 0; i < vlink.length; i++) {
      hash = (hash << 12) - hash + vlink.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    let videoID = ''
    while (hash) {
      videoID += charset[Math.abs(hash % charset.length)]
      hash = Math.floor(Math.abs(hash / charset.length))
    }
    return videoID || Math.random().toString(36).substring(2, 10) // Fallback if the ID is empty
  }

  const submitVlink = async (e) => {
    e.preventDefault()

    const videoID = generateVideoID(formData.vlink) // Generate videoID based on vlink

    try {
      // Send POST request to the API route
      const res = await fetch('/api/vlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          vlink: formData.vlink,
          videoID 
        }),
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to the video page using the generated video ID
        router.push(`/v/${videoID}`)
      } else {
        console.error('Failed to upload video link:', data.message || data.error)
      }
    } catch (error) {
      console.error('Error uploading video link:', error)
    }
  }

  return (
    <>
      <form onSubmit={submitVlink} className='block'>
        <input
          type="text"
          name="vlink"
          value={formData.vlink}
          onChange={(e) => setFormData({ ...formData, vlink: e.target.value })}
          placeholder="Paste Video Link"
          className="fixed w-full lg:w-auto mx-auto lg:right-4 left-0 bottom-4 text-center lg:text-right px-8 py-4 lg:py-2 rounded-full bg-transparent border-[1px] lg:border-[#111] placeholder-[#333]"
        ></input>
        <button type="submit" className="hidden"></button>
      </form>
    </>
  )
}

export default UpLink
