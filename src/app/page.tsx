export const dynamic = "force-dynamic";

import React from "react"
import { CreatePlayerForm } from "@/components/CreatePlayerForm"
import PlayerList from "@/components/PlayerList"
import { getPlayers } from "./actions/getPlayers"

export default async function Home() {
  const players: Player[] = await getPlayers()
  return (
    <main>
      <PlayerList initialPlayers={players} />
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <span style={{ fontSize: "24px" }}>↓</span>
      </div>
      <CreatePlayerForm />
    </main>
  )
}
