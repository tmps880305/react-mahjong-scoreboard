export type SeatIndex = 0 | 1 | 2 | 3;

export type RoundWind = "E" | "S";

export type WinType = "tsumo" | "ron" | "ryuukyoku" | "abortive";

export type ScoreInputMode = "hanfu" | "direct";

export type GameLength = "tonpuusen" | "hanchan";

export interface Player {
  name: string;
  score: number;
}

export interface RoundState {
  wind: RoundWind;
  number: number; // 1-4
  honba: number;
  riichiSticks: number; // count of 1000-point sticks on the table
}

export interface GameSettings {
  startingScore: number;
  returnScore: number; // 返し点, used to derive oka
  gameLength: GameLength;
  uma: [number, number, number, number]; // points awarded to rank 1..4, sums to 0
  scoreInputMode: ScoreInputMode;
}

export interface HandLogEntry {
  id: string;
  round: RoundState;
  dealerSeat: SeatIndex;
  winType: WinType;
  winnerSeat?: SeatIndex;
  loserSeat?: SeatIndex;
  riichiDeclarers: SeatIndex[];
  tenpaiSeats?: SeatIndex[];
  han?: number;
  fu?: number;
  description: string;
  deltas: [number, number, number, number];
  scoresAfter: [number, number, number, number];
}

export interface GameState {
  players: [Player, Player, Player, Player];
  round: RoundState;
  settings: GameSettings;
  history: HandLogEntry[];
  isEnded: boolean;
}

export interface HanFuScoring {
  mode: "hanfu";
  han: number;
  fu: number;
}

export interface DirectScoring {
  mode: "direct";
  /** ron: amount the loser pays the winner */
  ronPoints?: number;
  /** tsumo, dealer wins: amount each of the 3 non-dealers pays */
  tsumoEach?: number;
  /** tsumo, non-dealer wins: amount the dealer pays */
  tsumoFromDealer?: number;
  /** tsumo, non-dealer wins: amount each other non-dealer pays */
  tsumoFromNonDealer?: number;
}

export type WinScoring = HanFuScoring | DirectScoring;

export interface WinInput {
  winType: "tsumo" | "ron";
  winnerSeat: SeatIndex;
  loserSeat?: SeatIndex; // required for ron
  riichiDeclarers: SeatIndex[];
  scoring: WinScoring;
}

export interface RyuukyokuInput {
  winType: "ryuukyoku";
  tenpaiSeats: SeatIndex[];
  riichiDeclarers: SeatIndex[];
}

export interface AbortiveInput {
  winType: "abortive";
  riichiDeclarers: SeatIndex[];
  description: string;
}

export type HandInput = WinInput | RyuukyokuInput | AbortiveInput;
