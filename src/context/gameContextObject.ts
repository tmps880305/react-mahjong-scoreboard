import { createContext, type Dispatch } from "react";
import type { GameAction } from "../domain/reducer";
import type { GameState } from "../domain/types";

export interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);
