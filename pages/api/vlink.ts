import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import ytdl from 'ytdl-core';
import { create } from 'ipfs-http-client';
import { tmpdir } from 'os';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

// IPFS client setup
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
      // Scrape the video from YouTube
      const videoStream = ytdl(vlink, { quality: 'highestvideo' });
      const videoBuffer = await streamToBuffer(videoStream);
      const videoPath = path.join(tmpdir(), `${videoID}.mp4`);
      await writeFile(videoPath, videoBuffer);

      // Upload video to IPFS
      const { cid } = await ipfs.add(videoBuffer);
      const ipfsvurl = `https://ipfs.infura.io/ipfs/${cid.toString()}`;

      // Insert data into the PostgreSQL database
      await sql`
        INSERT INTO vlinx (vlink, timestamp, userIP, videoID, ipfsvurl)
        VALUES (${vlink}, ${timestamp}, ${hashedIP}, ${videoID}, ${ipfsvurl})`;

      // Clean up: remove the local video file
      await unlink(videoPath);

      return res.status(201).json({ message: 'Video uploaded successfully', ipfsvurl });
    } catch (error) {
      console.error('Error processing video:', error);
      return res.status(500).json({ message: 'An error occurred while saving the data. Please try again later.'});
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Helper function to convert stream to buffer
const streamToBuffer = async (stream:any) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
