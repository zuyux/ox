import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Ensure id is a string
  const vid = Array.isArray(id) ? id[0] : id;

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM vlinx WHERE id = ${vid}`;
      res.status(200).json({ message: 'Vlink deleted successfully' });
    } catch (error) {
      console.error('Error deleting vlink:', error);
      res.status(500).json({ message: 'An error occurred while deleting the vlink' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
