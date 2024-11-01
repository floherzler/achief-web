import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { url, season } = await request.json();

  // check if url is valid
  const validBaseURL1 = 'https://www.2basketballbundesliga.de/teams/kader/spieler/';
  const validBaseURL2 = 'https://www.zweite-basketball-bundesliga.de/teams/kader/spieler/';
  if (!url.startsWith(validBaseURL1) && !url.startsWith(validBaseURL2)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  
  try {
    console.log(`Scraping player stats for season: ${season}`);
      const response = await axios.post(
        url,
        { season: season },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },},
      );

      // return raw html response
      return NextResponse.json({html: response.data});
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to scrape player stats' }, { status: 500 });
  }
}