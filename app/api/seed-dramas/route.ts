import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const YT_KEY = process.env.YOUTUBE_API_KEY;

  if (!YT_KEY) {
    return NextResponse.json({ error: "Missing YouTube API Key" }, { status: 500 });
  }

  // Look how clean this is! Just add any YouTube handle here in the future.
  const handles = [
    'HUMTV',               // HUM TV
    'arydigitalasia',      // ARY Digital
    'harpalgeo',           // Geo Entertainment
    'TopPakistaniDramas',  // Top Pakistani Dramas aggregator
    'bingeseriess'         // Binge - शृंखला aggregator
  ];

  try {
    let addedCount = 0;

    for (const handle of handles) {
      // 1. First, ask YouTube to convert the @handle into their hidden Channel ID
      const channelRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id&forHandle=@${handle}&key=${YT_KEY}`);
      const channelData = await channelRes.json();
      
      if (!channelData.items || channelData.items.length === 0) {
        console.warn(`Could not find channel for @${handle}`);
        continue;
      }
      
      const channelId = channelData.items[0].id;

      // 2. Ask YouTube for that specific channel's drama playlists
      const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=15&key=${YT_KEY}`);
      const playlistData = await playlistRes.json();

      for (const item of (playlistData.items || [])) {
        // Clean up the titles (YouTube playlists often say "Episode 1 | Drama Name")
        const cleanTitle = item.snippet.title.split('|')[0].trim();
        
        const existing = await prisma.title.findFirst({ where: { title_name: cleanTitle } });
        
        if (!existing) {
          await prisma.title.create({
            data: {
              title_name: cleanTitle,
              synopsis: item.snippet.description || `Watch this hit Pakistani Drama series from @${handle}.`,
              format: 'DRAMA',
              release_date: new Date(item.snippet.publishedAt),
              poster_url: item.snippet.thumbnails?.high?.url || null,
            }
          });
          addedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully pulled ${addedCount} new drama playlists across 5 different networks and added them to your database!`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch from YouTube" }, { status: 500 });
  }
}