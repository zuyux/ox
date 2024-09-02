import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await sql`SELECT id, vlink, vid, timestamp FROM vlinx`;
    res.status(200).json(result.rows); // Return the rows directly
  } catch (error) {
    console.error('Error fetching video links:', error);
    res.status(500).json({ message: 'Error fetching video links' });
  }
}
