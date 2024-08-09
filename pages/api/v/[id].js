import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // Query to fetch video data based on videoID
    const result = await sql`
      SELECT vlink FROM vlinx WHERE videoID = ${id}
    `;

    if (result.rows.length > 0) {
      return res.status(200).json({ vlink: result.rows[0].vlink });
    } else {
      return res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error('Error fetching video data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
