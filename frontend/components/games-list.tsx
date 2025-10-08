"use client";

import { Game } from "@/lib/contract";
import Link from "next/link";
import { GameBoard } from "./game-board";
import { useStacks } from "@/hooks/use-stacks";
import { useMemo } from "react";
import { formatStx } from "@/lib/stx-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Coins,
  Play,
  Eye,
  UserPlus,
  GamepadIcon,
  Plus,
} from "lucide-react";

export function GamesList({ games }: { games: Game[] }) {
  const { userData } = useStacks();

  // User Games are games in which the user is a player
  // and a winner has not been decided yet
  const userGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;
    const filteredGames = games.filter(
      (game) =>
        (game["player-one"] === userAddress ||
          game["player-two"] === userAddress) &&
        game.winner === null
    );
    return filteredGames;
  }, [userData, games]);

  // Joinable games are games in which there still isn't a second player
  // and also the currently logged in user is not the creator of the game
  const joinableGames = useMemo(() => {
    if (!userData) return [];
    const userAddress = userData.profile.stxAddress.testnet;

    return games.filter(
      (game) =>
        game.winner === null &&
        game["player-one"] !== userAddress &&
        game["player-two"] === null
    );
  }, [games, userData]);

  // Ended games are games in which the winner has been decided
  const endedGames = useMemo(() => {
    return games.filter((game) => game.winner !== null);
  }, [games]);

  const getGameStatus = (game: Game) => {
    if (game.winner) return "completed";
    if (game.forfeited) return "forfeited";
    if (!game["player-two"]) return "waiting";
    return "active";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            Completed
          </Badge>
        );
      case "forfeited":
        return <Badge variant="destructive">Forfeited</Badge>;
      case "waiting":
        return <Badge variant="secondary">Waiting for Player</Badge>;
      case "active":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            Active
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const GameCard = ({
    game,
    showJoinButton = false,
  }: {
    game: Game;
    showJoinButton?: boolean;
  }) => {
    const status = getGameStatus(game);
    const isUserGame =
      userData &&
      (userData.profile.stxAddress.testnet === game["player-one"] ||
        userData.profile.stxAddress.testnet === game["player-two"]);

    return (
      <Card className="card-hover border-border/50 w-full max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <GamepadIcon className="h-5 w-5 text-primary" />
              Game #{game.id}
            </CardTitle>
            {getStatusBadge(status)}
          </div>
          <CardDescription className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4" />
              <span>{formatStx(game["bet-amount"])} STX</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{game["player-two"] ? "2/2" : "1/2"}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <GameBoard
              board={game.board}
              cellClassName="h-12 w-12 text-lg"
              disabled={true}
            />
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 group-hover:text-black"
            >
              <Link href={`/game/${game.id}`} className="text-muted">
                <Eye className="h-4 w-4 mr-2 text-muted hover:text-black" />
                View Game
              </Link>
            </Button>
            {showJoinButton && status === "waiting" && !isUserGame && (
              <Button asChild className="flex-1">
                <Link href={`/game/${game.id}`}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-12">
      {userData ? (
        <div className="fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-accent">
              <Play className="h-8 w-8 text-primary" />
              Your Active Games
            </h2>
            <p className="text-muted-foreground">
              Games you&apos;re currently playing or have played
            </p>
          </div>
          {userGames.length === 0 ? (
            <Card className="text-center py-12 border-dashed border-2 border-border">
              <CardContent className="space-y-4">
                <div className="mx-auto w-fit p-4 bg-muted rounded-full">
                  <GamepadIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Active Games
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t joined any games yet. Create a new game to
                    get started!
                  </p>
                  <Button asChild>
                    <Link href="/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Game
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGames.map((game) => (
                <GameCard key={`user-game-${game.id}`} game={game} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-accent">
            <UserPlus className="h-8 w-8 text-primary" />
            Joinable Games
          </h2>
          <p className="text-muted-foreground">
            Find games waiting for a second player
          </p>
        </div>
        {joinableGames.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2 border-border">
            <CardContent className="space-y-4">
              <div className="mx-auto w-fit p-4 bg-muted rounded-full">
                <UserPlus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  No Joinable Games
                </h3>
                <p className="text-foreground mb-4">
                  No games are currently waiting for players. Create a new game
                  to get started!
                </p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Game
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinableGames.map((game) => (
              <GameCard
                key={`joinable-game-${game.id}`}
                game={game}
                showJoinButton={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center text-accent gap-2">
            <GamepadIcon className="h-8 w-8 text-primary" />
            Completed Games
          </h2>
          <p className="text-muted-foreground">
            Browse finished games and their results
          </p>
        </div>
        {endedGames.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2 border-border">
            <CardContent className="space-y-4">
              <div className="mx-auto w-fit p-4 bg-muted rounded-full">
                <GamepadIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  No Completed Games
                </h3>
                <p className="text-foreground mb-4">
                  No games have been completed yet. Start playing to see results
                  here!
                </p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Game
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedGames.map((game) => (
              <GameCard key={`ended-game-${game.id}`} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
