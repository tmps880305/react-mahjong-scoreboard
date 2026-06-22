import type { SeatIndex } from "./types";

export const roundUp100 = (x: number): number => Math.ceil(x / 100) * 100;

/** Base points from han/fu, with mangan-and-above caps applied. */
export function baseFromHanFu(han: number, fu: number): number {
  if (han >= 26) return 16000; // double yakuman
  if (han >= 13) return 8000; // yakuman
  if (han >= 11) return 6000; // sanbaiman
  if (han >= 8) return 4000; // baiman
  if (han >= 6) return 3000; // haneman
  if (han >= 5) return 2000; // mangan
  const base = fu * 2 ** (2 + han);
  return Math.min(base, 2000); // cap at mangan (e.g. 4han30fu, 3han70fu)
}

/** Displays "3翻30符" below mangan, or the bracket name (満貫/跳満/.../ダブル役満) above it. */
export function formatHanFu(han: number, fu: number): string {
  if (han >= 26) return "ダブル役満";
  if (han >= 13) return "役満";
  if (han >= 11) return "三倍満";
  if (han >= 8) return "倍満";
  if (han >= 6) return "跳満";
  if (han >= 5) return "満貫";
  return `${han}翻${fu}符`;
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

export interface HanFuCombo {
  label: string; // e.g. "3翻30符", "満貫", "ダブル役満"
}

export interface HanFuGuessResult {
  exact: boolean;
  combos: HanFuCombo[]; // every combo (fu <= 50) tied at the best match found
}

const GUESS_FU_OPTIONS = [20, 25, 30, 40, 50];

const BRACKET_LABELS: [number, string][] = [
  [5, "満貫"],
  [6, "跳満"],
  [8, "倍満"],
  [11, "三倍満"],
  [13, "役満"],
];

// Yakuman can stack when a hand satisfies multiple yakuman conditions at
// once; payout is a straight multiple of the base yakuman amount (8000).
const YAKUMAN_MULTIPLE_LABELS: [number, string][] = [
  [2, "ダブル役満"],
  [3, "トリプル役満"],
  [4, "四倍役満"],
  [5, "五倍役満"],
  [6, "六倍役満"],
];

function hanFuCandidates(): { base: number; label: string }[] {
  const candidates: { base: number; label: string }[] = [];
  for (let han = 1; han <= 4; han++) {
    for (const fu of GUESS_FU_OPTIONS) {
      // Skip combos already capped at mangan: they're redundant with citing
      // the han bracket directly (e.g. 3han70fu == mangan, same as 5han).
      if (fu * 2 ** (2 + han) <= 2000) {
        candidates.push({ base: baseFromHanFu(han, fu), label: `${han}翻${fu}符` });
      }
    }
  }
  for (const [han, label] of BRACKET_LABELS) {
    candidates.push({ base: baseFromHanFu(han, 0), label });
  }
  for (const [multiple, label] of YAKUMAN_MULTIPLE_LABELS) {
    candidates.push({ base: 8000 * multiple, label });
  }
  return candidates;
}

function bestGuesses(target: number, computePayment: (base: number) => number): HanFuGuessResult | null {
  if (target <= 0) return null;
  let bestDiff = Infinity;
  let combos: HanFuCombo[] = [];
  for (const { base, label } of hanFuCandidates()) {
    const diff = Math.abs(computePayment(base) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      combos = [{ label }];
    } else if (diff === bestDiff) {
      combos.push({ label });
    }
  }
  if (combos.length === 0) return null;
  return { exact: bestDiff === 0, combos };
}

export function guessHanFuForRon(payment: number, winnerIsDealer: boolean): HanFuGuessResult | null {
  return bestGuesses(payment, (base) => ronPayment(base, winnerIsDealer));
}

export function guessHanFuForTsumoEach(amount: number): HanFuGuessResult | null {
  return bestGuesses(amount, (base) => tsumoPayments(base, true).fromNonDealer);
}

export function guessHanFuForTsumoNonDealer(fromNonDealer: number): HanFuGuessResult | null {
  return bestGuesses(fromNonDealer, (base) => tsumoPayments(base, false).fromNonDealer);
}

export function formatHanFuCombo(combo: HanFuCombo): string {
  return combo.label;
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
