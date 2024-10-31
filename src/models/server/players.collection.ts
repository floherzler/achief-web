import { IndexType, Permission } from "node-appwrite";
import { playersCollection, db } from "../name";
import { databases } from "./config";

export default async function createPlayersCollection() {
    // Creating Collection
    await databases.createCollection(db, playersCollection, playersCollection, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Players Collection Created!");

    // Creating Attributes
    // dbId, collId, key, size, required, default, array, encrypt
    await Promise.all([
        databases.createStringAttribute(db, playersCollection, "name", 100, true),
        databases.createIntegerAttribute(db, playersCollection, "careerGames", true),
        databases.createIntegerAttribute(db, playersCollection, "careerPoints", true),
        databases.createIntegerAttribute(db, playersCollection, "careerAssists", true),
        databases.createIntegerAttribute(db, playersCollection, "careerORebs", true),
        databases.createIntegerAttribute(db, playersCollection, "careerDRebs", true),
        databases.createIntegerAttribute(db, playersCollection, "careerSteals", true),
        databases.createIntegerAttribute(db, playersCollection, "careerBlocks", true),
        databases.createIntegerAttribute(db, playersCollection, "careerTurnovers", true),
        databases.createIntegerAttribute(db, playersCollection, "careerFouls", true),
        // Array for storing IDs of different league games
        // databases.createStringAttribute(db, playersCollection, "proAGames", 50, false, "", true),
        // databases.createStringAttribute(db, playersCollection, "proBGames", 50, false, "", true),
        // databases.createStringAttribute(db, playersCollection, "bblGames", 50, false, "", true),
        databases.createStringAttribute(db, playersCollection, "proAid", 50, false),
        databases.createStringAttribute(db, playersCollection, "proBid", 50, false),
        databases.createStringAttribute(db, playersCollection, "bblid", 50, false),
        
        // NOTE: annoyingly, I couldn't manage creating String Array attributes from the Node SDK
        // so I created the last three attributes manually in the console 
    ]);
    console.log("Players Attributes Created!");
}