"use client";

import { Move } from "@/lib/contract";
import { Circle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type GameBoardProps = {
  board: Move[];
  onCellClick?: (index: number) => void;
  cellClassName?: string;
  nextMove?: Move;
  disabled?: boolean;
  showWinningLine?: number[];
};

// Custom game icons
const GameIcon = ({
  move,
  isPreview = false,
}: {
  move: Move;
  isPreview?: boolean;
}) => {
  const iconClass = cn(
    "transition-all duration-200",
    isPreview ? "opacity-40" : "opacity-100"
  );

  switch (move) {
    case Move.X:
      return <Zap className={cn(iconClass, "game-icon-x")} />;
    case Move.O:
      return <Circle className={cn(iconClass, "game-icon-o")} />;
    default:
      return null;
  }
};

export function GameBoard({
  board,
  onCellClick,
  nextMove,
  cellClassName = "h-24 w-24 text-4xl",
  disabled = false,
  showWinningLine = [],
}: GameBoardProps) {
  const isWinningCell = (index: number) => showWinningLine.includes(index);

  return (
    <div className="flex flex-col items-center gap-4 fade-in">
      <div className="grid grid-cols-3 gap-3 p-4 bg-card rounded-xl shadow-lg border border-border">
        {board.map((cell, index) => {
          const isEmpty = cell === Move.EMPTY;
          const canClick = !disabled && isEmpty && onCellClick;
          const isWinning = isWinningCell(index);

          return (
            <div
              key={index}
              className={cn(
                "game-cell",
                "border-2 rounded-lg flex items-center justify-center font-bold group relative overflow-hidden",
                "bg-gradient-to-br from-card to-muted",
                cellClassName,
                canClick ? "cursor-pointer" : "cursor-default",
                isEmpty
                  ? "border-border hover:border-primary/50"
                  : "border-primary/30",
                isWinning &&
                  "ring-2 ring-accent ring-offset-2 ring-offset-background animate-pulse",
                disabled && "opacity-60"
              )}
              onClick={() => canClick && onCellClick(index)}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Cell content */}
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                {isEmpty ? (
                  // Preview icon on hover
                  canClick &&
                  nextMove && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-75 group-hover:scale-100">
                      <GameIcon move={nextMove} isPreview />
                    </div>
                  )
                ) : (
                  // Actual game piece
                  <div className="animate-in zoom-in-50 duration-300">
                    <GameIcon move={cell} />
                  </div>
                )}
              </div>

              {/* Winning cell overlay */}
              {isWinning && (
                <div className="absolute inset-0 bg-accent/20 rounded-lg animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Game status indicator */}
      {nextMove && !disabled && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Next move:</span>
          <div className="flex items-center space-x-1">
            <GameIcon move={nextMove} />
            <span className="font-medium">
              {nextMove === Move.X ? "Player X" : "Player O"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
