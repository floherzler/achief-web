import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPlayerInfo } from '@/lib/extractPlayerInfo';
import { db, playersCollection, proBCollection } from '@/models/name';
import { databases } from '@/models/server/config';
import { ID, Permission } from 'node-appwrite';

// Interfaces
interface GameStats {
  date: Date;
  home: boolean;
  teamPts: number;
  oppPts: number;
  win: boolean;
  playerID: string;
  team: string;
  opponent: string;
  minutes: number;
  points: number;
  assists: number;
  oRebs: number;
  dRebs: number;
  makes2: number;
  att2: number;
  perc2: number;
  makes3: number;
  att3: number;
  perc3: number;
  makesFT: number;
  attFT: number;
  percFT: number
  fouls: number;
  blocks: number;
  steals: number;
  turnovers: number;
  efficiency: number;
}

function parseStatBlock(statBlock: string): { made: number; attempted: number; percentage: number } {
  const [made, attempted, percentage] = statBlock.split('-').map(val => parseFloat(val.replace('%', '').trim()));
  return { made: made || 0, attempted: attempted || 0, percentage: percentage || 0 };
}

function parseReboundStats(rebBlock: string): { offensive: number; defensive: number; total: number } {
  const [offensive, defensive, total] = rebBlock.split('-').map(val => parseInt(val.trim(), 10));
  return { offensive: offensive || 0, defensive: defensive || 0, total: total || 0 };
}

interface OverallStats {
    careerGames: number;
    careerPoints: number;
    careerAssists: number;
    careerORebs: number;
    careerDRebs: number;
    careerSteals: number;
    careerBlocks: number;
    careerTurnovers: number;
    careerFouls: number;
    careerFTperc: number;
    careerFTmade: number;
    career2perc: number;
    career2made: number;
    career3perc: number;
    career3made: number;
    proAGames: string[];
    proBGames: string[];
    bblGames: string[];
    proAid: string;
    proBid: string;
    bblid: string;
  }
  
  interface PlayerInfo {
    name: string;
    avatarUrl: string;
    team: string;
    position: string;
    number: number;
    birthday: Date;
    age: number;
    heightM: number;
    weightKG: number;
    nationality: string;
    joinedDate: Date;
    stations: string[];
  }
  
  interface PlayerDocument extends PlayerInfo {
    careerStats: OverallStats;
    gameStats: GameStats[];
  }

  // Helper function to parse season string
function parseSeason(seasonStr: string) {
    const startYear = parseInt(seasonStr.split('/')[0]);
    const endYear = startYear + 1;
    return { startYear, endYear };
  }

export async function parsePlayerHtml(url: string, season: string) {  
    // check if url is valid
    const validBaseURL1 = 'https://www.2basketballbundesliga.de/teams/kader/spieler/';
    const validBaseURL2 = 'https://www.zweite-basketball-bundesliga.de/teams/kader/spieler/';
    if (!url.startsWith(validBaseURL1) && !url.startsWith(validBaseURL2)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  
    const { startYear } = parseSeason(season);
    const currentYear = new Date().getFullYear();
    const playerStats: GameStats[] = [];
    const overallStats: OverallStats = { 
      careerGames: 0,
      careerPoints: 0,
      careerAssists: 0,
      careerORebs: 0,
      careerDRebs: 0,
      careerSteals: 0,
      careerBlocks: 0,
      careerTurnovers: 0,
      careerFouls: 0,
      careerFTperc: 0,
      careerFTmade: 0,
      career2perc: 0,
      career2made: 0,
      career3perc: 0,
      career3made: 0,
      proAGames: [],
      proBGames: [],
      bblGames: [],
      proAid: '',
      proBid: '',
      bblid: '',
    };
  
    try {
      for (let year = startYear; year <= currentYear; year++) {
        const seasonParam = `${year}/${year + 1}`; // Format as "2018/2019"
        console.log(`Scraping player stats for season: ${seasonParam}`);
        const response = await axios.post('/api/createPlayer', {
            url: url,
            season: season,
          });
  
        const $ = cheerio.load(response.data);
        const rawPlayerInfo = extractPlayerInfo(response.data);
        const rawBirthday = rawPlayerInfo.birthday?.split('.').reverse().join('-') || '2000-01-01';
        // convert to yyyymmdd
        const parsedBD = rawBirthday.split('-').join('');
        const playerName = rawPlayerInfo.firstName + ' ' + rawPlayerInfo.lastName;
        const playerID = playerName.toLowerCase().replace(/[\s\W]+/g, '-');
        const playerInitials = playerName.split(' ').map((name, index, arr) => {
          if (index === 0 || index === arr.length - 1) {
            return name[0];
          }
          return '';
        }).join('');
  
        $('#stats tbody tr').each((_, row) => {
          const cells = $(row).find('td');
  
          // Custom date parsing and home/away detection
          const rawDate = $(cells[1]).text().trim(); // e.g., "(1) 28.09.24 (A)"
          const dateMatch = rawDate.match(/(\d{2})\.(\d{2})\.(\d{2})/) || '01.01.00'; // Capture DD.MM.YY format
          const isHomeGame = rawDate.includes('(H)'); // Determine if game is home or away
  
          let gameDate: Date | null = null;
          const [, day, month, year] = dateMatch;
          const formattedDate = `20${year}-${month}-${day}`; // Convert to YYYY-MM-DD format
          gameDate = new Date(formattedDate); // Now it's safe to create a Date object
          
          // i have a string: "Opp xx:yy"
          // please separate this intro opponent, ooPts and teamPts
          const [opponent, scores] = $(cells[2]).text().trim().split(' ');
          const [teamPts, oppPts] = scores.trim().split(':').map(score => score.trim());
  
          const minutes = $(cells[3]).text().trim();
          // convert mm:ss to float minutes
          const [min, sec] = minutes.split(':').map(Number);
          const gameMinutes = min + sec / 60;
  
      
          const gameStats: GameStats = {
            date: gameDate || new Date,
            // TODO: Add real team name
            team: rawPlayerInfo.team ?? '',
            home: isHomeGame,
            win: parseInt(teamPts, 10) > parseInt(oppPts, 10),
            teamPts: parseInt(teamPts, 10),
            oppPts: parseInt(oppPts, 10),
            playerID: playerID,
            opponent: opponent,
            minutes: gameMinutes,
            points: parseInt($(cells[8]).text().trim(), 10) || 0,
            assists: parseInt($(cells[9]).text().trim(), 10) || 0,
            oRebs: parseReboundStats($(cells[10]).text().trim()).offensive,
            dRebs: parseReboundStats($(cells[10]).text().trim()).defensive,
            makes2: parseStatBlock($(cells[4]).text().trim()).made,
            att2: parseStatBlock($(cells[4]).text().trim()).attempted,
            perc2: parseStatBlock($(cells[4]).text().trim()).percentage,
            makes3: parseStatBlock($(cells[5]).text().trim()).made,
            att3: parseStatBlock($(cells[5]).text().trim()).attempted,
            perc3: parseStatBlock($(cells[5]).text().trim()).percentage,
            makesFT: parseStatBlock($(cells[7]).text().trim()).made,
            attFT: parseStatBlock($(cells[7]).text().trim()).attempted,
            percFT: parseStatBlock($(cells[7]).text().trim()).percentage,
            fouls: parseInt($(cells[11]).text().trim(), 10) || 0,
            blocks: parseInt($(cells[12]).text().trim(), 10) || 0,
            steals: parseInt($(cells[13]).text().trim(), 10) || 0,
            turnovers: parseInt($(cells[14]).text().trim(), 10) || 0,
            efficiency: parseInt($(cells[15]).text().trim(), 10) || 0,
          };
  
          // function to add to career stats
          overallStats.careerGames += 1;
          overallStats.careerPoints += gameStats.points;
          overallStats.careerAssists += gameStats.assists;
          overallStats.careerORebs += gameStats.oRebs;
          overallStats.careerDRebs += gameStats.dRebs;
          overallStats.careerSteals += gameStats.steals;
          overallStats.careerBlocks += gameStats.blocks;
          overallStats.careerTurnovers += gameStats.turnovers;
          overallStats.careerFouls += gameStats.fouls;
          overallStats.careerFTperc += gameStats.percFT;
          overallStats.careerFTmade += gameStats.makesFT;
          overallStats.career2perc += gameStats.perc2;
          overallStats.career2made += gameStats.makes2;
          overallStats.career3perc += gameStats.perc3;
          overallStats.career3made += gameStats.makes3;
          
          // transform raw date to YYYY-MM-DD
          const dateString = gameStats.date.toISOString().split('T')[0].replace(/-/g, '');
          const gameID = `${dateString}-${playerInitials}-${parsedBD}-${gameStats.home ? 'H' : 'A'}`;
          if (gameMinutes > 0) {
            try {
                databases.createDocument(db, proBCollection, gameID, gameStats, [Permission.read("any")])
                    .then(() => {
                        console.log(`Successfully created document for gameID: ${gameID}`);
                    })
                    .catch((error) => {
                        if (error.code === 409) {  // Document already exists
                            console.log(`Document for gameID: ${gameID} already exists, skipping.`);
                        } else {
                            console.error(`Failed to create document for gameID: ${gameID}`, error);
                        }
                    });
            } catch (error) {
                console.error(`Unexpected error when creating document for gameID: ${gameID}`, error);
                return;
            }
        }
          playerStats.push(gameStats);
        });
  
        // in last iteration use playerInfo to create doc
        if (year === currentYear) {
            const playerInfo: PlayerInfo = {
            name: rawPlayerInfo.firstName + ' ' + rawPlayerInfo.lastName,
            avatarUrl: rawPlayerInfo.avatarUrl ?? '',
            team: rawPlayerInfo.team ?? '',
            position: rawPlayerInfo.position ?? '',
            number: rawPlayerInfo.number ?? 0,
            birthday: new Date(rawBirthday),
            age: rawPlayerInfo.age ?? 0,
            heightM: rawPlayerInfo.heightM ?? 0,
            weightKG: rawPlayerInfo.weightKG ?? 0,
            nationality: rawPlayerInfo.nationality ?? '',
            joinedDate: new Date(rawPlayerInfo.joinedDate || new Date()),
            stations: rawPlayerInfo.stations ?? [],
          };
  
          // divide percentages by total games
          overallStats.careerFTperc /= overallStats.careerGames;
          overallStats.career2perc /= overallStats.careerGames;
          overallStats.career3perc /= overallStats.careerGames;
  
          const playerDoc: Player = {
            $id: playerID,
            $createdAt: new Date().toISOString(),
            ...playerInfo,
            ...overallStats,
          };
  
          const { $id, $createdAt, ...playerDocWithout$ } = playerDoc;
          databases.createDocument(db, playersCollection, playerID, playerDocWithout$, [Permission.read("any")]).then(() => {
            console.log(`Successfully created document for playerID: ${playerID}`);
          }).catch((error) => {
            console.error(`Failed to create document for playerID: ${playerID}`, error);
          });
          return playerDoc; // Return the full player data 
        }
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  