import { useRouter } from 'next/router'

// Component to display the video
const VideoPage = ({ video }) => {
  const router = useRouter()
  const { id } = router.query

  // Handle case where video is not found
  if (!video) {
    return <div>Video not found</div>
  }

  return (
    <div>
      <h1>Video ID: {id}</h1>
      <iframe
        width="560"
        height="315"
        src={video.vlink}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

// Fetch video data based on videoID
export async function getServerSideProps(context) {
  const { id } = context.params
  let video = null

  try {
    const res = await fetch(`/api/v/${id}`) 
    if (res.ok) {
      video = await res.json()
    } else {
      console.error('Failed to fetch video data:', res.status)
    }
  } catch (error) {
    console.error('Error fetching video data:', error)
  }

  // Pass video data as props
  return { props: { video } }
}

export default VideoPage
