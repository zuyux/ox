import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { vlink, videoID } = req.body;

    // Basic input validation
    if (!vlink || !videoID) {
      return res.status(400).json({ message: 'Missing required fields: vlink and videoID' });
    }

    const timestamp = new Date().toISOString();

    // Get and hash user's IP address
    let userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(userIP)) {
      userIP = userIP[0];
    }

    // Hash the IP address
    const hashedIP = crypto.createHash('sha256').update(userIP || 'unknown').digest('hex');

    try {     
      await sql`INSERT INTO vlinx (vlink, timestamp, userIP, videoID)
        VALUES (${vlink}, ${timestamp}, ${hashedIP}, ${videoID})`;
      return res.status(201).json({ message: 'Form data saved successfully' });
    } catch (error) {
      console.error('Error saving form data:', error);
      return res.status(500).json({ message: 'An error occurred while saving the data. Please try again later.'});
    } 
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
