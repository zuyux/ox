import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoID } = req.query;

  if (!videoID || typeof videoID !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid videoID' });
  }

  try {
    // Execute the query and get the result
    const result = await sql`SELECT vlink FROM vlinx WHERE videoID = ${videoID}`;

    // Access the rows property of the result to get the data
    if (result.rows.length === 0) { 
      return res.status(404).json({ message: 'Video not found' });
    }

    const videoData = result.rows[0];
    return res.status(200).json({ vlink: videoData.vlink });
  } catch (error) {
    console.error('Error fetching video data:', error);
    return res.status(500).json({ message: 'Error fetching video data' });
  }
}
