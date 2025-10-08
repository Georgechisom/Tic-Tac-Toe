"use client";

import { GameBoard } from "@/components/game-board";
import { useStacks } from "@/hooks/use-stacks";
import { EMPTY_BOARD, Move } from "@/lib/contract";
import { formatStx, parseStx } from "@/lib/stx-utils";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gamepad2, Coins, Zap, Wallet, Info, TrendingUp } from "lucide-react";

export default function CreateGame() {
  const { stxBalance, userData, connectWallet, handleCreateGame } = useStacks();

  const [betAmount, setBetAmount] = useState(0);
  // When creating a new game, the initial board is entirely empty
  const [board, setBoard] = useState(EMPTY_BOARD);

  function onCellClick(index: number) {
    // Update the board to be the empty board + the move played by the user
    // Since this is inside 'Create Game', the user's move is the very first move and therefore always an X
    const tempBoard = [...EMPTY_BOARD];
    tempBoard[index] = Move.X;
    setBoard(tempBoard);
  }

  async function onCreateGame() {
    // Find the moveIndex (i.e. the cell) where the user played their move
    const moveIndex = board.findIndex((cell) => cell !== Move.EMPTY);
    const move = Move.X;
    // Trigger the onchain transaction popup
    await handleCreateGame(parseStx(betAmount), moveIndex, move);
  }

  const hasSelectedMove = board.some((cell) => cell !== Move.EMPTY);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12 fade-in">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Gamepad2 className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-accent">
            Create New Game
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Set your bet amount and make your first move to challenge other
            players on the blockchain.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Game Instructions */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>How to play:</strong> Choose your bet amount, click on any
              cell to place your X, then create the game. Other players can join
              by matching your bet and making their first move.
            </AlertDescription>
          </Alert>

          {/* Game Board */}
          <Card className="card-hover">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Make Your First Move
              </CardTitle>
              <CardDescription>
                Click on any cell to place your X and start the game
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <GameBoard
                board={board}
                onCellClick={onCellClick}
                nextMove={Move.X}
                cellClassName="size-20 text-4xl md:size-24 md:text-5xl"
              />
            </CardContent>
          </Card>

          {/* Bet Configuration */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-6 w-6 text-accent" />
                Set Your Bet
              </CardTitle>
              <CardDescription>
                Choose how much STX you want to bet. Winner takes all!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bet-amount" className="text-sm font-medium">
                  Bet Amount (STX)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="bet-amount"
                    type="number"
                    placeholder="Enter bet amount"
                    value={betAmount || ""}
                    onChange={(e) =>
                      setBetAmount(parseInt(e.target.value) || 0)
                    }
                    className="flex-1 bg-card border-border focus:border-primary focus:ring-primary/20"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount(formatStx(stxBalance))}
                    className="shrink-0 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Max
                  </Button>
                </div>
                {userData && (
                  <p className="text-sm text-muted-foreground">
                    Available balance: {formatStx(stxBalance)} STX
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center">
            {userData ? (
              <Button
                onClick={onCreateGame}
                disabled={!hasSelectedMove || betAmount <= 0}
                size="lg"
                className="bg-muted-foreground hover:bg-accent text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <Gamepad2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Create Game ({betAmount} STX)
              </Button>
            ) : (
              <Button
                onClick={connectWallet}
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Play
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
