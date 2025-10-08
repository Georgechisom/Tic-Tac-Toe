import {
  createNewGame,
  joinGame,
  Move,
  play,
  forfeitGame,
  resetGame,
  getGameStatus,
} from "@/lib/contract";
import { getStxBalance } from "@/lib/stx-utils";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  request,
} from "@stacks/connect";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface UserData {
  profile: {
    stxAddress: {
      testnet: string;
      mainnet: string;
    };
  };
}

export function useStacks() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stxBalance, setStxBalance] = useState(0);

  async function connectWallet() {
    try {
      await connect();
      // Get the connected address from local storage
      const localData = getLocalStorage();
      if (localData?.addresses?.stx?.[0]) {
        setUserData({
          profile: {
            stxAddress: {
              testnet: localData.addresses.stx[0].address,
              mainnet: localData.addresses.stx[0].address,
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }

  function disconnectWallet() {
    disconnect();
    setUserData(null);
  }

  async function handleCreateGame(
    betAmount: number,
    moveIndex: number,
    move: Move
  ) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      toast.error("Invalid move. Please make a valid move.");
      return;
    }
    if (betAmount === 0) {
      toast.error("Please make a bet");
      return;
    }

    const loadingToast = toast.loading("Creating game...");
    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await createNewGame(betAmount, moveIndex, move);
      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        postConditionMode: "allow",
      });
      console.log(response);
      toast.success("Game created successfully! Transaction sent.", {
        id: loadingToast,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error(err.message || "Failed to create game", { id: loadingToast });
    }
  }

  async function handleJoinGame(gameId: number, moveIndex: number, move: Move) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      toast.error("Invalid move. Please make a valid move.");
      return;
    }

    const loadingToast = toast.loading("Joining game...");
    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await joinGame(gameId, moveIndex, move);
      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        postConditionMode: "allow",
      });
      console.log(response);
      toast.success("Joined game successfully! Transaction sent.", {
        id: loadingToast,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error(err.message || "Failed to join game", { id: loadingToast });
    }
  }

  async function handlePlayGame(gameId: number, moveIndex: number, move: Move) {
    if (typeof window === "undefined") return;
    if (moveIndex < 0 || moveIndex > 8) {
      toast.error("Invalid move. Please make a valid move.");
      return;
    }

    const loadingToast = toast.loading("Making move...");
    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await play(gameId, moveIndex, move);
      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        postConditionMode: "allow",
      });
      console.log(response);
      toast.success("Move made successfully! Transaction sent.", {
        id: loadingToast,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error(err.message || "Failed to make move", { id: loadingToast });
    }
  }

  async function handleForfeitGame(gameId: number) {
    if (typeof window === "undefined") return;

    const loadingToast = toast.loading("Forfeiting game...");
    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await forfeitGame(gameId);
      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        postConditionMode: "allow",
      });
      console.log(response);
      toast.success("Game forfeited successfully! Transaction sent.", {
        id: loadingToast,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error(err.message || "Failed to forfeit game", {
        id: loadingToast,
      });
    }
  }

  async function handleResetGame(gameId: number, newBetAmount: number) {
    if (typeof window === "undefined") return;
    if (newBetAmount <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    const loadingToast = toast.loading("Resetting game...");
    try {
      if (!userData) throw new Error("User not connected");
      const txOptions = await resetGame(gameId, newBetAmount);
      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        postConditionMode: "allow",
      });
      console.log(response);
      toast.success("Game reset successfully! Transaction sent.", {
        id: loadingToast,
      });
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error(err.message || "Failed to reset game", { id: loadingToast });
    }
  }

  async function fetchGameStatus(gameId: number) {
    try {
      return await getGameStatus(gameId);
    } catch (_err) {
      const err = _err as Error;
      console.error(err);
      toast.error("Failed to fetch game status");
      return null;
    }
  }

  useEffect(() => {
    // Check if user is already connected on component mount
    if (isConnected()) {
      const localData = getLocalStorage();
      if (localData?.addresses?.stx?.[0]) {
        setUserData({
          profile: {
            stxAddress: {
              testnet: localData.addresses.stx[0].address,
              mainnet: localData.addresses.stx[0].address,
            },
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const address = userData.profile.stxAddress.testnet;
      getStxBalance(address).then((balance) => {
        setStxBalance(balance);
      });
    }
  }, [userData]);

  return {
    userData,
    stxBalance,
    connectWallet,
    disconnectWallet,
    handleCreateGame,
    handleJoinGame,
    handlePlayGame,
    handleForfeitGame,
    handleResetGame,
    fetchGameStatus,
  };
}
