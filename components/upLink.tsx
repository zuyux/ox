'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const UpLink = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ vlink: '' })
  const [isLoading, setIsLoading] = useState(false); // State for loading

  // Function to generate a videoID
  const generateVideoID = (vlink: string) => {
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

  const submitVlink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    const videoID = generateVideoID(formData.vlink); // Generate videoID based on vlink
  
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
      });
  
      const contentType = res.headers.get('content-type');
  
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await res.json();
        
        if (res.ok) {
          console.log('vlink uploaded');
          
        } else {
          console.error('Failed to upload video link:', data.message || data.error);
        }
      } else {
        const errorText = await res.text(); // Read the response as text if it's not JSON
        console.error('Unexpected response format:', errorText);
      }
    } catch (error) {
      console.error('Error uploading video link:', error);
    } finally {
      setIsLoading(false);
      router.push('/bin'); 
    }
  };
  
  return (
    <>
      <form onSubmit={submitVlink} className="flex flex-col items-center justify-center h-screen">
        {isLoading ? (
          <p className="text-white text-center px-8 py-4 lg:py-2 rounded-lg bg-transparent border-[1px] lg:border-[#111]">
            Processing...
          </p>
        ) : (
          <input
            type="text"
            name="vlink"
            value={formData.vlink}
            onChange={(e) => setFormData({ ...formData, vlink: e.target.value })}
            placeholder="Paste your video link here"
            className="text-white text-center px-8 py-4 lg:py-2 rounded-lg bg-transparent border-[1px] lg:border-[#111] placeholder-[#333]"
          />
        )}
        <button type="submit" className="hidden"></button>
      </form>
    </>
  )
}

export default UpLink
