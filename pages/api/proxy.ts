import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoURL } = req.query;

  if (!videoURL) {
    return res.status(400).json({ message: 'Missing video URL' });
  }

  try {
    const response = await fetch(videoURL as string);

    if (!response.ok) {
      throw new Error('Failed to fetch the video');
    }

    // Ensure that response.body is not null before piping it
    if (response.body) {
      res.setHeader('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
      res.setHeader('Content-Length', response.headers.get('Content-Length') || '');

      response.body.pipe(res);
    } else {
      return res.status(500).json({ message: 'No content to stream from the video source.' });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return res.status(500).json({ message: 'Error streaming video' });
  }
}
