import { NextApiRequest, NextApiResponse } from 'next';
import { create } from 'ipfs-http-client';
import { getVideoBuffer } from '../../utils/scrapers';
import { sql } from '@vercel/postgres';

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { vlink, videoID } = req.body;

        if (!vlink || !videoID) {
            return res.status(400).json({ message: 'Missing required fields: vlink and videoID' });
        }

        try {
            const videoStream = await getVideoBuffer(vlink);
            const { cid } = await ipfs.add(videoStream);
            const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;

            // Insert into DB
            await sql`
                INSERT INTO vlinx (vlink, timestamp, userIP, videoID, ipfsvurl)
                VALUES (${vlink}, ${new Date().toISOString()}, ${req.socket.remoteAddress}, ${videoID}, ${ipfsUrl})`;

            res.status(201).json({ message: 'Video uploaded successfully', ipfsUrl });
        } catch (error) {
            console.error('Error processing video:', error);
            res.status(500).json({ message: 'An error occurred while saving the data. Please try again later.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
