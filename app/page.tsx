"use client";
import { useEffect, useRef, useState } from 'react';
import UpLink from '@/components/upLink';

interface Video {
  vlink: string;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos'); // Fetch video links from the API
        const data: Video[] = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0 && videoRef.current) {
      videoRef.current.src = videos[currentVideoIndex].vlink;
      videoRef.current.play();
    }
  }, [videos, currentVideoIndex]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <main>
      <div className="h-screen w-full bg-[#111] rounded-3xl">
      <iframe width="379" height="674" 
        src="" 
        title="x" 
        frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
        className='mx-auto'>
        </iframe>
      </div>
      <UpLink/>
    </main>
  );
}
