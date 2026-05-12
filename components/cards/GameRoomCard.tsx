import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Coins } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Lobby {
  id: string;
  game: string;
  creator: string;
  betAmount: number;
  players: number;
  maxPlayers: number;
}

export default function GameRoomCard({ room }: { room: Lobby }) {
  return (
    <Card key={room.id} className="mb-4 overflow-hidden p-2">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>{room.game}</CardTitle>
          <Badge variant="secondary" className="bg-white text-purple-700">
            {room.betAmount} Pi
          </Badge>
        </div>
        <CardDescription className="text-purple-200">
          Created by {room.creator}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${room.creator}`}
              />
              {/* <AvatarFallback>{room.creator[0]}</AvatarFallback> */}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{room.creator}</p>
              <p className="text-xs text-muted-foreground">Room Creator</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              {/* <span className="text-sm">
                {room.players}/{room.maxPlayers}
              </span> */}
            </div>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm font-medium">{room.betAmount} Pi</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50">
        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          Join Game
        </Button>
      </CardFooter>
    </Card>
  );
}
