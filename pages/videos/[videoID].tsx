import { GetServerSideProps } from 'next';
import { sql } from '@vercel/postgres';

type VideoPageProps = {
  videoURL: string | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { videoID } = context.params as { videoID: string };

  if (!videoID) {
    return {
      notFound: true,
    };
  }

  try {
    const result = await sql`SELECT ipfsvurl FROM vlinx WHERE videoID = ${videoID}`;
    const videoURL = result.rows[0]?.ipfsvurl || null;

    if (!videoURL) {
      return {
        notFound: true,
      };
    }

    return {
      props: { videoURL },
    };
  } catch (error) {
    console.error('Error fetching video URL:', error);
    return {
      notFound: true,
    };
  }
};

// Now you can use the videoURL in your component
const VideoPage: React.FC<VideoPageProps> = ({ videoURL }) => {
  return (
    <div>
      <h1>Video Streaming</h1>
      {videoURL ? (
        <video controls>
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Video not found.</p>
      )}
    </div>
  );
};

export default VideoPage;
