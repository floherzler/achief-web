// extractPlayerInfo function in createPlayer.ts

import * as cheerio from 'cheerio';

// Helper function to convert date to ISO format
function convertToISODate(dateString: string | undefined) {
  if (!dateString) return null;
  
  const [day, month, year] = dateString.split('.');
  return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0]; // Return as 'yyyy-mm-dd'
}

export function extractPlayerInfo(html: string) {
  const $ = cheerio.load(html);

  const rawInfo = $('b:contains("Vorname:")').parent().text().replace(/\s+/g, ' ').trim(); // Normalize whitespace

  // Extract the player's image URL
  const avatarUrl = $('img.circular').attr('src');

  // Extract the league and team
  // Select the third h5 with the class `av-special-heading-tag`, which should be the {league} - {team} element
  const leagueTeam = $('h5.av-special-heading-tag').eq(2).text().trim();
  const [league, team] = leagueTeam.split(' - ');

  // Define regex patterns to extract data between labels
  const playerData = {
    firstName: rawInfo.match(/Vorname:\s*(.+?)\s*Nachname:/)?.[1]?.trim(),
    lastName: rawInfo.match(/Nachname:\s*(.+?)\s*Team:/)?.[1]?.trim(),
    team: rawInfo.match(/Team:\s*(.+?)\s*Position:/)?.[1]?.trim(),
    position: rawInfo.match(/Position:\s*(.+?)\s*Nummer:/)?.[1]?.trim(),
    number: parseInt(rawInfo.match(/Nummer:\s*(\d+)\s*Geburtstag:/)?.[1]?.trim() || '0', 10),
    birthday: rawInfo.match(/Geburtstag:\s*([\d.]+)/)?.[1]?.trim(),
    age: parseInt(rawInfo.match(/Alter:\s*(\d+)/)?.[1]?.trim() || '0', 10),
    heightM: parseFloat(
      rawInfo.match(/Größe:\s*([\d,]+)\s*m/)?.[1]?.replace(',', '.') || '0'
    ),
    weightKG: parseFloat(
      rawInfo.match(/Gewicht:\s*([\d,]+)\s*kg/)?.[1]?.replace(',', '.') || '0'
    ),
    nationality: rawInfo.match(/Nationalität:\s*([\w\s]+?)\s*Im Verein seit:/)?.[1]?.trim(),
    joinedDate: convertToISODate(rawInfo.match(/Im Verein seit:\s*([\d.]+)/)?.[1]?.trim()), // Convert to ISO format
    stations: Array.from(
      rawInfo.matchAll(/(\d{2}\.\d{4} - \d{2}\.\d{4}, .+? \(DE\))/g),
      match => match[1].trim()
    ),
    avatarUrl: avatarUrl ? avatarUrl.trim() : null,
    leagueTeam: leagueTeam || null, // Add league-team pair to player data
  };

  return playerData;
}
