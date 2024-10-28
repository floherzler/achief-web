import { IndexType, Permission } from "node-appwrite";
import { proBCollection, db } from "../name";
import { databases } from "./config";

export default async function createProBCollection() {
    // Creating Collection - added Server Side
    await databases.createCollection(db, proBCollection, proBCollection, [
        Permission.read("any"),
    ]);
    console.log("ProB Collection Created!");

    // Creating Attributes
    await Promise.all([
        databases.createDatetimeAttribute(db, proBCollection, "date", true),
        databases.createStringAttribute(db, proBCollection, "team", 100, true),
        databases.createIntegerAttribute(db, proBCollection, "teamPts", true),
        databases.createStringAttribute(db, proBCollection, "opponent", 100, true),
        databases.createIntegerAttribute(db, proBCollection, "oppPts", true),
        databases.createBooleanAttribute(db, proBCollection, "home", true),
        databases.createBooleanAttribute(db, proBCollection, "win", true),
        // Player Stats
        databases.createStringAttribute(db, proBCollection, "playerID", 50, true), // ID of player
        databases.createFloatAttribute(db, proBCollection, "minutes", true),
        databases.createIntegerAttribute(db, proBCollection, "points", true),
        databases.createIntegerAttribute(db, proBCollection, "makes2", true),
        databases.createIntegerAttribute(db, proBCollection, "att2", true),
        databases.createFloatAttribute(db, proBCollection, "perc2", true),
        databases.createIntegerAttribute(db, proBCollection, "makes3", true),
        databases.createIntegerAttribute(db, proBCollection, "att3", true),
        databases.createFloatAttribute(db, proBCollection, "perc3", true),
        databases.createIntegerAttribute(db, proBCollection, "makesFT", true),
        databases.createIntegerAttribute(db, proBCollection, "attFT", true),
        databases.createFloatAttribute(db, proBCollection, "percFT", true),
        databases.createIntegerAttribute(db, proBCollection, "assists", true),
        databases.createIntegerAttribute(db, proBCollection, "oRebs", true),
        databases.createIntegerAttribute(db, proBCollection, "dRebs", true),
        databases.createIntegerAttribute(db, proBCollection, "steals", true),
        databases.createIntegerAttribute(db, proBCollection, "blocks", true),
        databases.createIntegerAttribute(db, proBCollection, "turnovers", true),
        databases.createIntegerAttribute(db, proBCollection, "fouls", true),
        databases.createIntegerAttribute(db, proBCollection, "efficiency", true),
    ]);
    console.log("ProB Attributes Created");

    // TODO: clarify what we want to query and add index in console
    // create index for searching
    // await Promise.all([
    //     databases.createIndex(
    //         db,
    //         proBCollection,
    //         "",
    //         IndexType.Fulltext,
    //         ["date", "playerID"],
    //     ),
    // ]);
}