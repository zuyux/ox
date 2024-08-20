// v/[id].js
import { sql } from '@vercel/postgres';
import { GetServerSideProps } from 'next';
import ytdl from 'ytdl-core';
import { tmpdir } from 'os';
import path from 'path';

const VideoPage = ({ video }) => {
  if (!video) {
    return (
      <div>
        <h1 className='font-sans text-center h-screen w-full mx-auto'>Video not found</h1>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
        <video controls className='mx-auto max-w-full h-auto'>
          <source src={`/videos/${video.videoID}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  let video = null;

  try {
    // Query the database to get the video data by videoID
    const result = await sql`SELECT vlink, videoID FROM vlinx WHERE videoID = ${id}`;

    
  } catch (error) {
    console.error('Error fetching or processing video data:', error);
  }

  return { props: { video } };
};


export default VideoPage;
