"use client";

import { PlayGame } from "@/components/play-game";
import { getGame, type Game } from "@/lib/contract";
import { useEffect, useState, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Gamepad2 } from "lucide-react";

type Params = Promise<{ gameId: string }>;

export default function GamePage({ params }: { params: Params }) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { gameId } = use(params);

  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true);
        setError(null);
        const gameData = await getGame(parseInt(gameId));
        if (!gameData) {
          setError("Game not found");
        } else {
          setGame(gameData);
        }
      } catch (err) {
        console.error("Error fetching game:", err);
        setError("Failed to load game. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="card-hover">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <h2 className="text-xl font-semibold">
                  Loading Game #{gameId}
                </h2>
                <p className="text-muted-foreground text-center">
                  Fetching game details from the blockchain...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-6 mb-12 fade-in">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Gamepad2 className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Game #{gameId}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Play the game with your opponent on the blockchain
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {game && <PlayGame game={game} />}
        </div>
      </div>
    </div>
  );
}
