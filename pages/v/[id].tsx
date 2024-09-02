// pages/v/[videoID].tsx

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPage = () => {
  const router = useRouter();
  const { videoID } = router.query;
  const [videoURL, setVideoURL] = useState<string | null>(null);

  useEffect(() => {
    if (videoID) {
      // Fetch the vlink (video URL) from your backend API based on the videoID
      const fetchVideoURL = async () => {
        try {
          const res = await fetch(`/api/v/${videoID}`);
          if (res.ok) {
            const data = await res.json();
            setVideoURL(data.vlink);
          } else {
            console.error('Failed to fetch video URL');
          }
        } catch (error) {
          console.error('Error fetching video URL:', error);
        }
      };

      fetchVideoURL();
    }
  }, [videoID]);

  if (!videoURL) {
    return <div>Loading video...</div>;
  }

  return (
    <div className="video-container">
      <h1>Video ID: {videoID}</h1>
      <ReactPlayer url={`/api/proxy?videoURL=${encodeURIComponent(videoURL)}`} controls={true} />
    </div>
  );
};

export default VideoPage;
