import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

// Helper function to create a new game with the given bet amount, move index, and move
// on behalf of the `user` address
function createGame(
  betAmount: number,
  moveIndex: number,
  move: number,
  user: string
) {
  return simnet.callPublicFn(
    "tic-tac-toe",
    "create-game",
    [Cl.uint(betAmount), Cl.uint(moveIndex), Cl.uint(move)],
    user
  );
}

// Helper function to join a game with the given move index and move on behalf of the `user` address
function joinGame(moveIndex: number, move: number, user: string) {
  return simnet.callPublicFn(
    "tic-tac-toe",
    "join-game",
    [Cl.uint(0), Cl.uint(moveIndex), Cl.uint(move)],
    user
  );
}

// Helper function to play a move with the given move index and move on behalf of the `user` address
function play(moveIndex: number, move: number, user: string) {
  return simnet.callPublicFn(
    "tic-tac-toe",
    "play",
    [Cl.uint(0), Cl.uint(moveIndex), Cl.uint(move)],
    user
  );
}

// Helper function to forfeit a game on behalf of the `user` address
function forfeitGame(gameId: number, user: string) {
  return simnet.callPublicFn(
    "tic-tac-toe",
    "forfeit-game",
    [Cl.uint(gameId)],
    user
  );
}

// Helper function to reset a game on behalf of the `user` address
function resetGame(gameId: number, newBet: number, user: string) {
  return simnet.callPublicFn(
    "tic-tac-toe",
    "reset-game",
    [Cl.uint(gameId), Cl.uint(newBet)],
    user
  );
}

// Helper function to get game status
function getGameStatus(gameId: number) {
  return simnet.callReadOnlyFn(
    "tic-tac-toe",
    "get-game-status",
    [Cl.uint(gameId)],
    alice
  );
}

describe("Tic Tac Toe Tests", () => {
  it("allows game creation", () => {
    const { result, events } = createGame(100, 0, 1, alice);

    expect(result).toBeOk(Cl.uint(0));
    expect(events.length).toBe(2); // print_event and stx_transfer_event
  });

  it("allows game joining", () => {
    createGame(100, 0, 1, alice);
    const { result, events } = joinGame(1, 2, bob);

    expect(result).toBeOk(Cl.uint(0));
    expect(events.length).toBe(2); // print_event and stx_transfer_event
  });

  it("allows game playing", () => {
    createGame(100, 0, 1, alice);
    joinGame(1, 2, bob);
    const { result, events } = play(2, 1, alice);

    expect(result).toBeOk(Cl.uint(0));
    expect(events.length).toBe(1); // print_event
  });

  it("does not allow creating a game with a bet amount of 0", () => {
    const { result } = createGame(0, 0, 1, alice);
    expect(result).toBeErr(Cl.uint(100));
  });

  it("does not allow joining a game that has already been joined", () => {
    createGame(100, 0, 1, alice);
    joinGame(1, 2, bob);

    const { result } = joinGame(1, 2, alice);
    expect(result).toBeErr(Cl.uint(103));
  });

  it("does not allow an out of bounds move", () => {
    createGame(100, 0, 1, alice);
    joinGame(1, 2, bob);

    const { result } = play(10, 1, alice);
    expect(result).toBeErr(Cl.uint(101));
  });

  it("does not allow a non X or O move", () => {
    createGame(100, 0, 1, alice);
    joinGame(1, 2, bob);

    const { result } = play(2, 3, alice);
    expect(result).toBeErr(Cl.uint(101));
  });

  it("does not allow moving on an occupied spot", () => {
    createGame(100, 0, 1, alice);
    joinGame(1, 2, bob);

    const { result } = play(1, 1, alice);
    expect(result).toBeErr(Cl.uint(101));
  });

  it("allows player one to win", () => {
    createGame(100, 0, 1, alice);
    joinGame(3, 2, bob);
    play(1, 1, alice);
    play(4, 2, bob);
    const { result, events } = play(2, 1, alice);

    expect(result).toBeOk(Cl.uint(0));
    expect(events.length).toBe(2); // print_event and stx_transfer_event

    const gameData = simnet.getMapEntry("tic-tac-toe", "games", Cl.uint(0));
    expect(gameData).toBeSome(
      Cl.tuple({
        "player-one": Cl.principal(alice),
        "player-two": Cl.some(Cl.principal(bob)),
        "is-player-one-turn": Cl.bool(false),
        "bet-amount": Cl.uint(100),
        board: Cl.list([
          Cl.uint(1),
          Cl.uint(1),
          Cl.uint(1),
          Cl.uint(2),
          Cl.uint(2),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(0),
        ]),
        winner: Cl.some(Cl.principal(alice)),
        forfeited: Cl.bool(false),
      })
    );
  });

  it("allows player two to win", () => {
    createGame(100, 0, 1, alice);
    joinGame(3, 2, bob);
    play(1, 1, alice);
    play(4, 2, bob);
    play(8, 1, alice);
    const { result, events } = play(5, 2, bob);

    expect(result).toBeOk(Cl.uint(0));
    expect(events.length).toBe(2); // print_event and stx_transfer_event

    const gameData = simnet.getMapEntry("tic-tac-toe", "games", Cl.uint(0));
    expect(gameData).toBeSome(
      Cl.tuple({
        "player-one": Cl.principal(alice),
        "player-two": Cl.some(Cl.principal(bob)),
        "is-player-one-turn": Cl.bool(true),
        "bet-amount": Cl.uint(100),
        board: Cl.list([
          Cl.uint(1),
          Cl.uint(1),
          Cl.uint(0),
          Cl.uint(2),
          Cl.uint(2),
          Cl.uint(2),
          Cl.uint(0),
          Cl.uint(0),
          Cl.uint(1),
        ]),
        winner: Cl.some(Cl.principal(bob)),
        forfeited: Cl.bool(false),
      })
    );
  });

  // Tests for forfeit-game function
  describe("forfeit-game", () => {
    it("allows a player to forfeit a game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);

      const { result, events } = forfeitGame(0, alice);

      expect(result).toBeOk(Cl.bool(true));
      expect(events.length).toBe(2); // print_event and stx_transfer_event

      const gameData = simnet.getMapEntry("tic-tac-toe", "games", Cl.uint(0));
      expect(gameData).toBeSome(
        Cl.tuple({
          "player-one": Cl.principal(alice),
          "player-two": Cl.some(Cl.principal(bob)),
          "is-player-one-turn": Cl.bool(true),
          "bet-amount": Cl.uint(100),
          board: Cl.list([
            Cl.uint(1),
            Cl.uint(2),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
          ]),
          winner: Cl.some(Cl.principal(bob)), // Bob wins because Alice forfeited
          forfeited: Cl.bool(true),
        })
      );
    });

    it("does not allow forfeiting a non-existent game", () => {
      const { result } = forfeitGame(999, alice);
      expect(result).toBeErr(Cl.uint(102)); // ERR_GAME_NOT_FOUND
    });

    it("does not allow forfeiting an already ended game", () => {
      // Create a game and let player one win
      createGame(100, 0, 1, alice);
      joinGame(3, 2, bob);
      play(1, 1, alice);
      play(4, 2, bob);
      play(2, 1, alice); // Alice wins

      const { result } = forfeitGame(0, bob);
      expect(result).toBeErr(Cl.uint(105)); // ERR_GAME_ENDED
    });

    it("does not allow non-players to forfeit a game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);

      const charlie = accounts.get("wallet_3")!;
      const { result } = forfeitGame(0, charlie);
      expect(result).toBeErr(Cl.uint(107)); // ERR_NOT_A_PLAYER
    });

    it("does not allow forfeiting a game with only one player", () => {
      createGame(100, 0, 1, alice);

      const { result } = forfeitGame(0, alice);
      expect(result).toBeErr(Cl.uint(103)); // ERR_GAME_CANNOT_BE_JOINED (no player two)
    });
  });

  // Tests for reset-game function
  describe("reset-game", () => {
    it("allows a player to reset a completed game", () => {
      // Create a game and let player one win
      createGame(100, 0, 1, alice);
      joinGame(3, 2, bob);
      play(1, 1, alice);
      play(4, 2, bob);
      play(2, 1, alice); // Alice wins

      const { result, events } = resetGame(0, 200, alice);

      expect(result).toBeOk(Cl.uint(0));
      expect(events.length).toBe(2); // print_event and stx_transfer_event

      const gameData = simnet.getMapEntry("tic-tac-toe", "games", Cl.uint(0));
      expect(gameData).toBeSome(
        Cl.tuple({
          "player-one": Cl.principal(alice),
          "player-two": Cl.none(),
          "is-player-one-turn": Cl.bool(false),
          "bet-amount": Cl.uint(200),
          board: Cl.list([
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
            Cl.uint(0),
          ]),
          winner: Cl.none(),
          forfeited: Cl.bool(false),
        })
      );
    });

    it("allows a player to reset a forfeited game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);
      forfeitGame(0, alice); // Alice forfeits

      const { result } = resetGame(0, 150, bob);
      expect(result).toBeOk(Cl.uint(0));
    });

    it("does not allow resetting a non-existent game", () => {
      const { result } = resetGame(999, 100, alice);
      expect(result).toBeErr(Cl.uint(102)); // ERR_GAME_NOT_FOUND
    });

    it("does not allow resetting an ongoing game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);

      const { result } = resetGame(0, 100, alice);
      expect(result).toBeErr(Cl.uint(108)); // ERR_GAME_NOT_ENDED
    });

    it("does not allow non-players to reset a game", () => {
      // Create a game and let player one win
      createGame(100, 0, 1, alice);
      joinGame(3, 2, bob);
      play(1, 1, alice);
      play(4, 2, bob);
      play(2, 1, alice); // Alice wins

      const charlie = accounts.get("wallet_3")!;
      const { result } = resetGame(0, 100, charlie);
      expect(result).toBeErr(Cl.uint(107)); // ERR_NOT_A_PLAYER
    });

    it("does not allow resetting with invalid bet amount", () => {
      // Create a game and let player one win
      createGame(100, 0, 1, alice);
      joinGame(3, 2, bob);
      play(1, 1, alice);
      play(4, 2, bob);
      play(2, 1, alice); // Alice wins

      const { result } = resetGame(0, 0, alice);
      expect(result).toBeErr(Cl.uint(100)); // ERR_MIN_BET_AMOUNT
    });
  });

  // Tests for get-game-status function
  describe("get-game-status", () => {
    it("returns ongoing status for an active game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);

      const { result } = getGameStatus(0);
      expect(result).toBeSome(
        Cl.tuple({
          status: Cl.uint(0), // ongoing
          winner: Cl.none(),
        })
      );
    });

    it("returns won status for a completed game", () => {
      // Create a game and let player one win
      createGame(100, 0, 1, alice);
      joinGame(3, 2, bob);
      play(1, 1, alice);
      play(4, 2, bob);
      play(2, 1, alice); // Alice wins

      const { result } = getGameStatus(0);
      expect(result).toBeSome(
        Cl.tuple({
          status: Cl.uint(1), // won
          winner: Cl.some(Cl.principal(alice)),
        })
      );
    });

    it("returns forfeited status for a forfeited game", () => {
      createGame(100, 0, 1, alice);
      joinGame(1, 2, bob);
      forfeitGame(0, alice); // Alice forfeits

      const { result } = getGameStatus(0);
      expect(result).toBeSome(
        Cl.tuple({
          status: Cl.uint(3), // forfeited
          winner: Cl.some(Cl.principal(bob)),
        })
      );
    });

    it("returns none for non-existent game", () => {
      const { result } = getGameStatus(999);
      expect(result).toBeNone();
    });
  });
});
