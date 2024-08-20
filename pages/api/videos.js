import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Fetch video links from the database
    const result = await sql`SELECT vlink FROM vlinx`;
    
    // Return the video links as a JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
}
