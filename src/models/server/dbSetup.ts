import { db } from "../name";
import { databases } from "./config";
import createPlayersCollection from "./players.collection";
import createProACollection from "./proA.collection";
import createProBCollection from "./proB.collection";
import createBBLCollection from "./bbl.collection";


export default async function getOrCreateDB(){
  try {
    await databases.get(db)
    console.log("Database already setup and connected!")
  } catch (error) {
    try {
      await databases.create(db, db)
      console.log("Database created!")
      //create players and league collections
      await Promise.all([
        createPlayersCollection(),
        createProACollection(),
        createProBCollection(),
        createBBLCollection(),
      ])
      console.log("Collections (Players, Leagues) created!")
    } catch (error) {
      console.log("Error creating databases or collection: ", error)
    }
  }
  return databases
}