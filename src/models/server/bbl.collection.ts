import { IndexType, Permission } from "node-appwrite";
import { bblCollection, db } from "../name";
import { databases } from "./config";

export default async function createBBLCollection() {
    // Creating Collection - added Server Side
    await databases.createCollection(db, bblCollection, bblCollection, [
        Permission.read("any"),
    ]);
    console.log("BBL Collection Created!");

    // Creating Attributes
    await Promise.all([
        databases.createDatetimeAttribute(db, bblCollection, "date", true),
        databases.createStringAttribute(db, bblCollection, "team", 100, true),
        databases.createIntegerAttribute(db, bblCollection, "teamPts", true),
        databases.createStringAttribute(db, bblCollection, "opponent", 100, true),
        databases.createIntegerAttribute(db, bblCollection, "oppPts", true),
        databases.createBooleanAttribute(db, bblCollection, "home", true),
        databases.createBooleanAttribute(db, bblCollection, "win", true),
        // Player Stats
        databases.createStringAttribute(db, bblCollection, "playerID", 50, true), // ID of player
        databases.createFloatAttribute(db, bblCollection, "minutes", true),
        databases.createIntegerAttribute(db, bblCollection, "points", true),
        databases.createIntegerAttribute(db, bblCollection, "makes2", true),
        databases.createIntegerAttribute(db, bblCollection, "att2", true),
        databases.createFloatAttribute(db, bblCollection, "perc2", true),
        databases.createIntegerAttribute(db, bblCollection, "makes3", true),
        databases.createIntegerAttribute(db, bblCollection, "att3", true),
        databases.createFloatAttribute(db, bblCollection, "perc3", true),
        databases.createIntegerAttribute(db, bblCollection, "makesFT", true),
        databases.createIntegerAttribute(db, bblCollection, "attFT", true),
        databases.createFloatAttribute(db, bblCollection, "percFT", true),
        databases.createIntegerAttribute(db, bblCollection, "assists", true),
        databases.createIntegerAttribute(db, bblCollection, "oRebs", true),
        databases.createIntegerAttribute(db, bblCollection, "dRebs", true),
        databases.createIntegerAttribute(db, bblCollection, "steals", true),
        databases.createIntegerAttribute(db, bblCollection, "blocks", true),
        databases.createIntegerAttribute(db, bblCollection, "turnovers", true),
        databases.createIntegerAttribute(db, bblCollection, "fouls", true),
        databases.createIntegerAttribute(db, bblCollection, "efficiency", true),
        databases.createIntegerAttribute(db, bblCollection, "plusMinus", true),
    ]);
    console.log("BBL Attributes Created");

    // TODO: clarify what we want to query and add index in console
    // create index for searching
    // await Promise.all([
    //     databases.createIndex(
    //         db,
    //         bblCollection,
    //         "",
    //         IndexType.Fulltext,
    //         ["date", "playerID"],
    //     ),
    // ]);
}