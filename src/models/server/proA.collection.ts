import { IndexType, Permission } from "node-appwrite";
import { proACollection, db } from "../name";
import { databases } from "./config";

export default async function createProACollection() {
    // Creating Collection - Server Side
    await databases.createCollection(db, proACollection, proACollection, [
        Permission.read("any"), // added via Function
    ]);
    console.log("ProA Collection Created!");

    // Creating Attributes
    await Promise.all([
        // Game Stats
        databases.createDatetimeAttribute(db, proACollection, "date", true),
        databases.createStringAttribute(db, proACollection, "team", 100, true),
        databases.createIntegerAttribute(db, proACollection, "teamPts", true),
        databases.createStringAttribute(db, proACollection, "opponent", 100, true),
        databases.createIntegerAttribute(db, proACollection, "oppPts", true),
        databases.createBooleanAttribute(db, proACollection, "home", true),
        databases.createBooleanAttribute(db, proACollection, "win", true),
        // Player Stats
        databases.createStringAttribute(db, proACollection, "playerID", 50, true), // ID of player
        databases.createFloatAttribute(db, proACollection, "minutes", true),
        databases.createIntegerAttribute(db, proACollection, "points", true),
        databases.createIntegerAttribute(db, proACollection, "makes2", true),
        databases.createIntegerAttribute(db, proACollection, "att2", true),
        databases.createFloatAttribute(db, proACollection, "perc2", true),
        databases.createIntegerAttribute(db, proACollection, "makes3", true),
        databases.createIntegerAttribute(db, proACollection, "att3", true),
        databases.createFloatAttribute(db, proACollection, "perc3", true),
        databases.createIntegerAttribute(db, proACollection, "makesFT", true),
        databases.createIntegerAttribute(db, proACollection, "attFT", true),
        databases.createFloatAttribute(db, proACollection, "percFT", true),
        databases.createIntegerAttribute(db, proACollection, "assists", true),
        databases.createIntegerAttribute(db, proACollection, "oRebs", true),
        databases.createIntegerAttribute(db, proACollection, "dRebs", true),
        databases.createIntegerAttribute(db, proACollection, "steals", true),
        databases.createIntegerAttribute(db, proACollection, "blocks", true),
        databases.createIntegerAttribute(db, proACollection, "turnovers", true),
        databases.createIntegerAttribute(db, proACollection, "fouls", true),
        databases.createIntegerAttribute(db, proACollection, "efficiency", true),
    ]);
    console.log("ProA Attributes Created");

    // TODO: clarify what we want to query and add index in console
    // create index for searching
    // await Promise.all([
    //     databases.createIndex(
    //         db,
    //         proACollection,
    //         "",
    //         IndexType.Fulltext,
    //         ["date", "playerID"],
    //     ),
    // ]);
}