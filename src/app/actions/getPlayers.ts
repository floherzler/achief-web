import { db, playersCollection } from "@/models/name"
import { databases } from "@/models/server/config"

export async function getPlayers(): Promise<Player[]> {
    const response = await databases.listDocuments(
      db,
      playersCollection,
    )
    response.documents.forEach(doc => console.log(doc.name))
  
    const players: Player[] = response.documents.map((doc) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        name: doc.name,
        proAid: doc.proAid,
        proBid: doc.proBid,
        bblid: doc.bblid,
        position: doc.position,
        team: doc.team,
        number: doc.number,
        birthday: doc.birthday,
        age: doc.age,
        heightM: doc.heightM,
        weightKG: doc.weightKG,
        nationality: doc.nationality,
        joinedDate: doc.joinedDate,
        careerGames: doc.careerGames,
        proAGames: doc.proAGames,
        proBGames: doc.proBGames,
        bblGames: doc.bblGames,
        avatarUrl: doc.avatarUrl,
        careerPoints: doc.careerPoints,
        careerAssists: doc.careerAssists,
        careerFouls: doc.careerFouls,
        careerDRebs: doc.careerDRebs,
        careerORebs: doc.careerORebs,
        careerSteals: doc.careerSteals,
        careerTurnovers: doc.careerTurnovers,
        careerBlocks: doc.careerBlocks,
        career2perc: doc.career2perc,
        career3perc: doc.career3perc,
        careerFTperc: doc.careerFTperc,
        career2made: doc.career2made,
        career3made: doc.career3made,
        careerFTmade: doc.careerFTmade,
        stations: doc.stations,
    }))
  
    return players
  }
  