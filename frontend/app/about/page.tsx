import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Shield,
  Zap,
  Trophy,
  ArrowRight,
  Blocks,
  Coins,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description:
        "Every move is permanently recorded on the Stacks blockchain, ensuring complete transparency and immutability of game results.",
    },
    {
      icon: Zap,
      title: "Smart Contracts",
      description:
        "Powered by Clarity smart contracts that automatically handle game logic, betting, and payouts without intermediaries.",
    },
    {
      icon: Trophy,
      title: "Competitive Gaming",
      description:
        "Place STX bets and compete with players worldwide. Winners take the entire pot automatically.",
    },
    {
      icon: Blocks,
      title: "Decentralized",
      description:
        "No central authority controls the game. Everything runs on the decentralized Stacks blockchain.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Connect Wallet",
      description:
        "Connect your Stacks wallet to start playing and betting with STX tokens.",
    },
    {
      step: "2",
      title: "Create or Join Game",
      description:
        "Create a new game with your bet amount or join an existing game waiting for a player.",
    },
    {
      step: "3",
      title: "Play Tic-Tac-Toe",
      description:
        "Take turns making moves. Each move is recorded as a blockchain transaction.",
    },
    {
      step: "4",
      title: "Win & Earn",
      description:
        "Win the game to automatically receive the entire pot of STX tokens.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 fade-in">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Gamepad2 className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-accent">
            About Tic-Tac-Toe on Stacks
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the classic game of Tic-Tac-Toe reimagined for the
            blockchain era. Built on Stacks, our platform combines nostalgic
            gameplay with cutting-edge decentralized technology.
          </p>
        </div>

        {/* What Makes Us Special */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-accent">
              What Makes Us Special
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve taken the timeless game of Tic-Tac-Toe and enhanced it
              with blockchain technology to create a transparent, secure, and
              rewarding gaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-accent">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to begin your
              blockchain gaming journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="text-center card-hover">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Built on Stacks</CardTitle>
              <CardDescription className="text-lg">
                Experience the power of Bitcoin&apos;s security with smart
                contract capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <Blocks className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Stacks Blockchain</h3>
                  <p className="text-sm text-muted-foreground">
                    Secured by Bitcoin with smart contract functionality
                  </p>
                </div>
                <div className="space-y-2">
                  <Coins className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">STX Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Native currency for betting and rewards
                  </p>
                </div>
                <div className="space-y-2">
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Clarity Smart Contracts</h3>
                  <p className="text-sm text-muted-foreground">
                    Predictable and secure contract execution
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link
                    href="https://docs.stacks.co/"
                    className="text-muted-foreground py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn About Stacks
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="https://github.com/stacks-network"
                    className="text-muted-foreground py-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4 text-accent">
                Ready to Play?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the future of gaming where every move matters and every win
                is guaranteed by blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group">
                  <Link href="/create">
                    <Gamepad2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Start Playing Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group">
                  <Link href="/" className="text-muted-foreground">
                    View Games
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
