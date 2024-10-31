'use client'

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db, playersCollection } from '@/models/name';
import { client } from '@/models/client/config';
import { databases } from '@/models/server/config';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

export default function PlayerList({ initialPlayers }: { initialPlayers: Player[] }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  useEffect(() => {
    const channel = `databases.${db}.collections.${playersCollection}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
        const eventType = response.events[0]
        console.log(response.events)
        const changedPlayer = response.payload as Player

        if (eventType.includes('create')) {
            setPlayers((prevPlayers) => [...prevPlayers, changedPlayer])
        } else if (eventType.includes('delete')) {
            setPlayers((prevPlayers) => prevPlayers.filter((player) => player.$id !== changedPlayer.$id))
        } else if (eventType.includes('update')) {
            setPlayers((prevPlayers) => prevPlayers.map((player) => player.$id === changedPlayer.$id ? changedPlayer : player))
        }
    });
    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    await databases.deleteDocument(db, playersCollection, id)
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center pt-8">
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {players.map((player, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <Card key={player.$id} className="w-100 p-4 shadow-md">
                <CardHeader className="flex items-center gap-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={player.avatarUrl} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="items-center">
                    <CardTitle className="text-lg font-semibold">{player.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">{player.position} | #{player.number} | {player.age}y</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-2">
                  <Table>
                    <TableHeader>
                    <TableRow>
                      <TableCell>Games</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>PPG</TableCell>
                      <TableCell>Assists</TableCell>
                      <TableCell>Rebounds O/D</TableCell>
                      <TableCell>FT %</TableCell>
                      <TableCell>2pt %</TableCell>
                      <TableCell>3pt %</TableCell>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    <TableRow>
                      <TableCell>{player.careerGames}</TableCell>
                      <TableCell>{player.careerPoints}</TableCell>
                      <TableCell>{(player.careerPoints / player.careerGames).toFixed(1)}</TableCell>
                      <TableCell>{player.careerAssists}</TableCell>
                      <TableCell>{player.careerDRebs}/{player.careerORebs}</TableCell>
                      <TableCell>{Math.round(player.careerFTperc)}%</TableCell>
                      <TableCell>{Math.round(player.career2perc)}%</TableCell>
                      <TableCell>{Math.round(player.career3perc)}%</TableCell>
                    </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
