import type { SeatIndex } from "./types";

export const roundUp100 = (x: number): number => Math.ceil(x / 100) * 100;

/** Base points from han/fu, with mangan-and-above caps applied. */
export function baseFromHanFu(han: number, fu: number): number {
  if (han >= 13) return 8000; // yakuman
  if (han >= 11) return 6000; // sanbaiman
  if (han >= 8) return 4000; // baiman
  if (han >= 6) return 3000; // haneman
  if (han >= 5) return 2000; // mangan
  const base = fu * 2 ** (2 + han);
  return Math.min(base, 2000); // cap at mangan (e.g. 4han30fu, 3han70fu)
}

export interface RonResult {
  /** points the loser pays the winner, before honba bonus */
  payment: number;
}

export function ronPayment(base: number, winnerIsDealer: boolean): number {
  const multiplier = winnerIsDealer ? 6 : 4;
  return roundUp100(base * multiplier);
}

export interface TsumoResult {
  /** payment from each non-dealer seat (or all 3 if dealer wins) */
  fromNonDealer: number;
  /** payment from dealer seat, only relevant when winner is non-dealer */
  fromDealer: number;
}

export function tsumoPayments(base: number, winnerIsDealer: boolean): TsumoResult {
  if (winnerIsDealer) {
    const each = roundUp100(base * 2);
    return { fromNonDealer: each, fromDealer: each };
  }
  return {
    fromNonDealer: roundUp100(base),
    fromDealer: roundUp100(base * 2),
  };
}

export interface NotenPenaltyResult {
  /** index into seats 0-3, points each tenpai seat receives / noten seat pays */
  perTenpaiReceive: number;
  perNotenPay: number;
}

/** Standard 3000-point exhaustive draw tenpai/noten exchange. Returns null when no exchange occurs (0 or 4 tenpai). */
export function notenPenalty(tenpaiCount: number): NotenPenaltyResult | null {
  if (tenpaiCount <= 0 || tenpaiCount >= 4) return null;
  const notenCount = 4 - tenpaiCount;
  const total = 3000;
  return {
    perTenpaiReceive: total / tenpaiCount,
    perNotenPay: total / notenCount,
  };
}

export interface FinalSettlementInput {
  scores: [number, number, number, number];
  startingScore: number;
  returnScore: number;
  uma: [number, number, number, number];
}

export interface FinalSettlementEntry {
  seat: SeatIndex;
  rank: number; // 1-4
  rawScore: number;
  settlement: number; // raw point delta vs return score, including uma/oka
}

/** Ranks players by score (ties broken by seat order, lower seat wins) and computes uma+oka settlement. */
export function computeFinalSettlement(input: FinalSettlementInput): FinalSettlementEntry[] {
  const { scores, startingScore, returnScore, uma } = input;
  const seats: SeatIndex[] = [0, 1, 2, 3];
  const ranked = [...seats].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return a - b;
  });
  const oka = (returnScore - startingScore) * 4;
  return ranked.map((seat, idx) => {
    const rank = idx + 1;
    let settlement = scores[seat] - returnScore + uma[idx];
    if (rank === 1) settlement += oka;
    return { seat, rank, rawScore: scores[seat], settlement };
  });
}
