import { applyHand, dealerSeatOf, isLastHandOf } from "./hand";
import type { GameSettings, GameState, HandInput, HandLogEntry, Player, SeatIndex } from "./types";

export const DEFAULT_SETTINGS: GameSettings = {
  startingScore: 25000,
  returnScore: 30000,
  gameLength: "hanchan",
  uma: [1500, 500, -500, -1500],
  scoreInputMode: "hanfu",
};

function makeDefaultPlayers(startingScore: number): [Player, Player, Player, Player] {
  return [
    { name: "プレイヤー1", score: startingScore },
    { name: "プレイヤー2", score: startingScore },
    { name: "プレイヤー3", score: startingScore },
    { name: "プレイヤー4", score: startingScore },
  ];
}

export function createInitialState(settingsOverride?: Partial<GameSettings>): GameState {
  const settings = { ...DEFAULT_SETTINGS, ...settingsOverride };
  return {
    players: makeDefaultPlayers(settings.startingScore),
    round: { wind: "E", number: 1, honba: 0, riichiSticks: 0 },
    settings,
    history: [],
    isEnded: false,
  };
}

export type GameAction =
  | { type: "APPLY_HAND"; input: HandInput }
  | { type: "UNDO_LAST" }
  | { type: "UPDATE_SETTINGS"; settings: Partial<GameSettings> }
  | { type: "RENAME_PLAYER"; seat: SeatIndex; name: string }
  | { type: "NEW_GAME"; settings?: Partial<GameSettings> }
  | { type: "CONTINUE_GAME" }
  | { type: "LOAD_STATE"; state: GameState };

function makeLogEntry(state: GameState, input: HandInput, deltas: [number, number, number, number], scoresAfter: [number, number, number, number], description: string): HandLogEntry {
  let winnerSeat: SeatIndex | undefined;
  let loserSeat: SeatIndex | undefined;
  let tenpaiSeats: SeatIndex[] | undefined;
  let han: number | undefined;
  let fu: number | undefined;

  if (input.winType === "tsumo" || input.winType === "ron") {
    winnerSeat = input.winnerSeat;
    loserSeat = input.loserSeat;
    if (input.scoring.mode === "hanfu") {
      han = input.scoring.han;
      fu = input.scoring.fu;
    }
  } else if (input.winType === "ryuukyoku") {
    tenpaiSeats = input.tenpaiSeats;
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    round: state.round,
    dealerSeat: dealerSeatOf(state.round),
    winType: input.winType,
    winnerSeat,
    loserSeat,
    riichiDeclarers: input.riichiDeclarers,
    tenpaiSeats,
    han,
    fu,
    description,
    deltas,
    scoresAfter,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "APPLY_HAND": {
      if (state.isEnded) return state;
      const { deltas, newRound, description, dealerContinues } = applyHand(state.round, action.input);
      const players = state.players.map((p, i) => ({ ...p, score: p.score + deltas[i] })) as GameState["players"];
      const scoresAfter = players.map((p) => p.score) as [number, number, number, number];
      const wasLastHand = isLastHandOf(state.round, state.settings.gameLength);
      const isEnded = wasLastHand && !dealerContinues;
      const entry = makeLogEntry(state, action.input, deltas, scoresAfter, description);

      return {
        ...state,
        players,
        round: newRound,
        history: [...state.history, entry],
        isEnded,
      };
    }
    case "UNDO_LAST": {
      if (state.history.length === 0) return state;
      const last = state.history[state.history.length - 1];
      const players = state.players.map((p, i) => ({ ...p, score: p.score - last.deltas[i] })) as GameState["players"];
      return {
        ...state,
        players,
        round: last.round,
        history: state.history.slice(0, -1),
        isEnded: false,
      };
    }
    case "UPDATE_SETTINGS": {
      return { ...state, settings: { ...state.settings, ...action.settings } };
    }
    case "RENAME_PLAYER": {
      const players = state.players.map((p, i) => (i === action.seat ? { ...p, name: action.name } : p)) as GameState["players"];
      return { ...state, players };
    }
    case "NEW_GAME": {
      return createInitialState({ ...state.settings, ...action.settings });
    }
    case "CONTINUE_GAME": {
      return { ...state, isEnded: false };
    }
    case "LOAD_STATE": {
      return action.state;
    }
    default:
      return state;
  }
}
