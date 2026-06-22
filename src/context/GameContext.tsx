import { useEffect, useReducer, type ReactNode } from "react";
import { createInitialState, gameReducer } from "../domain/reducer";
import { loadState, saveState } from "../domain/storage";
import { GameContext } from "./gameContextObject";
import type { GameState } from "../domain/types";

function init(): GameState {
  return loadState() ?? createInitialState();
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}
