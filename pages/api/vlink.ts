import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { vlink, videoID } = req.body;

    if (!vlink || !videoID) {
      return res.status(400).json({ message: 'Missing required fields: vlink and videoID' });
    }

    const timestamp = new Date().toISOString();
    let userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    userIP = Array.isArray(userIP) ? userIP[0] : userIP;
    const hashedIP = crypto.createHash('sha256').update(userIP || 'unknown').digest('hex');

    try {
      // Insert data into the PostgreSQL database
      await sql`
        INSERT INTO vlinx (vlink, timestamp, userIP, videoID)
        VALUES (${vlink}, ${timestamp}, ${hashedIP}, ${videoID})`;

      // Return a success response
      return res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error processing video:', error);
      return res.status(500).json({ message: 'An error occurred while saving the data. Please try again later.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
