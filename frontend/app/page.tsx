import { GamesList } from "@/components/games-list";
import { getAllGames } from "@/lib/contract";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gamepad2, Zap, Shield, Trophy, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getAllGames();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description:
        "Every move is recorded on the Stacks blockchain for complete transparency and security.",
    },
    {
      icon: Zap,
      title: "Instant Gameplay",
      description:
        "Fast and responsive gameplay with real-time updates and smooth animations.",
    },
    {
      icon: Trophy,
      title: "Competitive Betting",
      description: "Place bets and compete with other players for STX rewards.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className=" bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 fade-in">
            {/* Hero Title */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Gamepad2 className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-accent">
                Tic-Tac-Toe
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground/80">
                on Stacks Blockchain
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the classic game with a modern twist. Play, bet, and
                win with complete transparency and security on the Stacks
                blockchain.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                <Link href="/create">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Create New Game
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group text-muted border-2 border-muted hover:border-none"
              >
                <Link href="#games">
                  View Games
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-accent">
              Why Choose Our Platform?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on cutting-edge blockchain technology for the ultimate
              gaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover border-border/50">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <GamesList games={games} />
        </div>
      </section>
    </div>
  );
}
