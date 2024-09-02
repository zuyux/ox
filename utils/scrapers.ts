import ytdl from 'ytdl-core';
import puppeteer from 'puppeteer';
import { Readable } from 'stream';

export const getVideoBuffer = async (vlink: string): Promise<Readable> => {
    if (vlink.includes("youtube.com") || vlink.includes("youtu.be")) {
        return ytdl(vlink, { quality: 'highestvideo' });
    } else if (vlink.includes("vimeo.com")) {
        // Vimeo downloader code
    } else if (vlink.includes("tiktok.com")) {
        return await scrapeTikTokVideo(vlink);
    }
    // Add more scrapers as needed
    throw new Error("Unsupported platform");
};

const scrapeTikTokVideo = async (vlink: string): Promise<Readable> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(vlink);
    
    const videoUrl = await page.evaluate(() => {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            return videoElement.src;
        }
        return null;
    });
    
    if (!videoUrl) {
        throw new Error('Failed to retrieve video URL');
    }
    
    const response = await fetch(videoUrl);
    const readableStream = response.body;
    
    if (!readableStream) {
        throw new Error('Failed to retrieve response body');
    }
    
    // Assuming you want to treat this as a ReadableStream
    const stream = readableStream as unknown as Readable;
    return stream;  // Make sure to return the stream here
};
