"use client";

import { Game, Move } from "@/lib/contract";
import { GameBoard } from "./game-board";
import { abbreviateAddress, explorerAddress, formatStx } from "@/lib/stx-utils";
import Link from "next/link";
import { useStacks } from "@/hooks/use-stacks";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Trophy,
  Coins,
  Play,
  UserPlus,
  RotateCcw,
  Flag,
  ExternalLink,
  Clock,
  Crown,
  Info,
} from "lucide-react";

interface PlayGameProps {
  game: Game;
}

export function PlayGame({ game }: PlayGameProps) {
  const {
    userData,
    handleJoinGame,
    handlePlayGame,
    handleForfeitGame,
    handleResetGame,
  } = useStacks();

  // Initial game board is the current `game.board` state
  const [board, setBoard] = useState(game.board);
  // cell where user played their move. -1 denotes no move has been played
  const [playedMoveIndex, setPlayedMoveIndex] = useState(-1);
  // Reset bet amount for reset functionality
  const [resetBetAmount, setResetBetAmount] = useState(game["bet-amount"]);

  // If user is not logged in, show login prompt
  if (!userData) {
    return (
      <div className="flex flex-col items-center space-y-6 py-12">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to view and interact with this game.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isPlayerOne =
    userData.profile.stxAddress.testnet === game["player-one"];
  const isPlayerTwo =
    userData.profile.stxAddress.testnet === game["player-two"];
  const isJoinable = game["player-two"] === null && !isPlayerOne;
  const isJoinedAlready = isPlayerOne || isPlayerTwo;
  const nextMove = game["is-player-one-turn"] ? Move.X : Move.O;
  const isMyTurn =
    (game["is-player-one-turn"] && isPlayerOne) ||
    (!game["is-player-one-turn"] && isPlayerTwo);
  const isGameOver = game.winner !== null || game.forfeited;
  const canMakeMove =
    isJoinedAlready && isMyTurn && !isGameOver && playedMoveIndex !== -1;

  function onCellClick(index: number) {
    // Allow clicking if:
    // 1. Cell is empty
    // 2. Game is not over
    // 3. Either it's my turn (for existing players) OR the game is joinable (for new players)
    if (board[index] !== Move.EMPTY || isGameOver || (!isMyTurn && !isJoinable))
      return;

    const tempBoard = [...game.board];
    tempBoard[index] = nextMove;
    setBoard(tempBoard);
    setPlayedMoveIndex(index);
  }

  const getGameStatusAlert = () => {
    if (isGameOver) {
      if (game.winner) {
        const isWinner = userData.profile.stxAddress.testnet === game.winner;
        return (
          <Alert
            className={
              isWinner
                ? "border-accent bg-accent/10"
                : "border-destructive bg-destructive/10"
            }
          >
            <Crown className="h-4 w-4" />
            <AlertDescription>
              {isWinner
                ? "Congratulations! You won the game!"
                : "Game Over. Better luck next time!"}
            </AlertDescription>
          </Alert>
        );
      }
      if (game.forfeited) {
        return (
          <Alert className="border-destructive bg-destructive/10">
            <Flag className="h-4 w-4" />
            <AlertDescription>This game was forfeited.</AlertDescription>
          </Alert>
        );
      }
    }

    if (isJoinable) {
      return (
        <Alert className="border-primary bg-primary/10">
          <UserPlus className="h-4 w-4" />
          <AlertDescription>
            This game is waiting for a second player. Click on an empty cell to
            select your move, then join the game! You&apos;ll need to match the
            bet amount of {formatStx(game["bet-amount"])} STX.
          </AlertDescription>
        </Alert>
      );
    }

    if (isMyTurn) {
      return (
        <Alert className="border-accent bg-accent/10">
          <Play className="h-4 w-4" />
          <AlertDescription>
            It&apos;s your turn! Make a move by clicking on an empty cell.
          </AlertDescription>
        </Alert>
      );
    }

    if (isJoinedAlready && !isMyTurn && !isGameOver) {
      return (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Waiting for your opponent to make their move...
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You are viewing this game as a spectator.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Status Alert */}
      {getGameStatusAlert()}

      {/* Game Board */}
      <Card className="card-hover">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Game #{game.id}
          </CardTitle>
          <CardDescription>
            {isGameOver
              ? "Game Completed"
              : isJoinable
              ? "Waiting for Player"
              : "Game in Progress"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <GameBoard
            board={board}
            onCellClick={onCellClick}
            nextMove={nextMove}
            cellClassName="size-24 text-4xl md:size-32 md:text-6xl"
            disabled={isGameOver || (!isMyTurn && !isJoinable)}
          />
        </CardContent>
      </Card>

      {/* Game Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Game Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Bet Amount:</span>
              <Badge variant="outline">
                {formatStx(game["bet-amount"])} STX
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Players:</span>
              <Badge variant="outline">
                {game["player-two"] ? "2/2" : "1/2"}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Player One (X):</span>
                {isPlayerOne && <Badge variant="secondary">You</Badge>}
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={explorerAddress(game["player-one"])}
                  target="_blank"
                >
                  {abbreviateAddress(game["player-one"])}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Player Two (O):</span>
                {isPlayerTwo && <Badge variant="secondary">You</Badge>}
              </div>
              {game["player-two"] ? (
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={explorerAddress(game["player-two"])}
                    target="_blank"
                  >
                    {abbreviateAddress(game["player-two"])}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Waiting...
                </span>
              )}
            </div>

            {game.winner && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Winner:</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={explorerAddress(game.winner)} target="_blank">
                    {abbreviateAddress(game.winner)}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isJoinable && (
          <Button
            onClick={() => handleJoinGame(game.id, playedMoveIndex, nextMove)}
            className="flex-1"
            disabled={playedMoveIndex === -1}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join Game
          </Button>
        )}

        {canMakeMove && (
          <Button
            onClick={() => handlePlayGame(game.id, playedMoveIndex, nextMove)}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            Make Move
          </Button>
        )}

        {isJoinedAlready && !isGameOver && (
          <Button
            onClick={() => handleForfeitGame(game.id)}
            variant="destructive"
            className="flex-1"
          >
            <Flag className="h-4 w-4 mr-2" />
            Forfeit Game
          </Button>
        )}

        {isGameOver && isJoinedAlready && (
          <div className="flex gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="number"
                placeholder="New bet amount"
                value={resetBetAmount}
                onChange={(e) => setResetBetAmount(Number(e.target.value))}
                className="flex-1 text-white"
              />
              <Button
                onClick={() => handleResetGame(game.id, resetBetAmount)}
                variant="outline"
                disabled={resetBetAmount <= 0}
                className="bg-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Game
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
