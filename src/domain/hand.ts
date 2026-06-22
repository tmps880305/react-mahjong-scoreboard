import { baseFromHanFu, formatHanFu, notenPenalty, ronPayment, tsumoPayments } from "./scoring";
import type { GameLength, HandInput, RoundState, SeatIndex } from "./types";

export function dealerSeatOf(round: RoundState): SeatIndex {
  return ((round.number - 1) % 4) as SeatIndex;
}

export function roundLabel(round: RoundState): string {
  const windLabel = round.wind === "E" ? "東" : "南";
  return `${windLabel}${round.number}局`;
}

const SEAT_WIND_LABELS = ["東", "南", "西", "北"] as const;

/** A seat's current wind, derived from its offset from the current dealer. */
export function seatWindLabel(seat: SeatIndex, round: RoundState): string {
  const dealerSeat = dealerSeatOf(round);
  const relative = (seat - dealerSeat + 4) % 4;
  return SEAT_WIND_LABELS[relative];
}

export function isLastHandOf(round: RoundState, gameLength: GameLength): boolean {
  if (gameLength === "tonpuusen") return round.wind === "E" && round.number === 4;
  return round.wind === "S" && round.number === 4;
}

function advanceRoundMarker(round: RoundState, dealerContinues: boolean): Pick<RoundState, "wind" | "number" | "honba"> {
  if (dealerContinues) {
    return { wind: round.wind, number: round.number, honba: round.honba + 1 };
  }
  let number = round.number + 1;
  let wind = round.wind;
  if (number > 4) {
    number = 1;
    wind = wind === "E" ? "S" : "E";
  }
  return { wind, number, honba: 0 };
}

export interface HandApplication {
  deltas: [number, number, number, number];
  newRound: RoundState;
  description: string;
  dealerContinues: boolean;
}

export function applyHand(round: RoundState, input: HandInput): HandApplication {
  const dealerSeat = dealerSeatOf(round);
  const deltas: [number, number, number, number] = [0, 0, 0, 0];
  let riichiSticks = round.riichiSticks;

  let description: string;
  let dealerContinues: boolean;

  switch (input.winType) {
    case "tsumo":
    case "ron": {
      const winnerIsDealer = input.winnerSeat === dealerSeat;
      dealerContinues = winnerIsDealer;
      let han: number | undefined;
      let fu: number | undefined;
      let total = 0;

      if (input.winType === "ron") {
        const loserSeat = input.loserSeat!;
        let payment: number;
        if (input.scoring.mode === "hanfu") {
          han = input.scoring.han;
          fu = input.scoring.fu;
          payment = ronPayment(baseFromHanFu(han, fu), winnerIsDealer);
        } else {
          payment = input.scoring.ronPoints ?? 0;
        }
        payment += round.honba * 300;
        deltas[loserSeat] -= payment;
        total = payment;
      } else {
        let fromDealer: number;
        let fromNonDealer: number;
        if (input.scoring.mode === "hanfu") {
          han = input.scoring.han;
          fu = input.scoring.fu;
          const result = tsumoPayments(baseFromHanFu(han, fu), winnerIsDealer);
          fromDealer = result.fromDealer;
          fromNonDealer = result.fromNonDealer;
        } else if (winnerIsDealer) {
          fromDealer = 0;
          fromNonDealer = input.scoring.tsumoEach ?? 0;
        } else {
          fromDealer = input.scoring.tsumoFromDealer ?? 0;
          fromNonDealer = input.scoring.tsumoFromNonDealer ?? 0;
        }
        const honbaEach = round.honba * 100;
        fromDealer += winnerIsDealer ? 0 : honbaEach;
        fromNonDealer += honbaEach;

        for (let seat = 0; seat < 4; seat++) {
          if (seat === input.winnerSeat) continue;
          const pay = winnerIsDealer ? fromNonDealer : seat === dealerSeat ? fromDealer : fromNonDealer;
          deltas[seat] -= pay;
          total += pay;
        }
      }

      deltas[input.winnerSeat] += total + riichiSticks * 1000;
      riichiSticks = 0;

      const kind = input.winType === "ron" ? "ロン" : "ツモ";
      const handLabel = han !== undefined ? ` ${formatHanFu(han, fu ?? 0)}` : "";
      description = `${roundLabel(round)}${round.honba > 0 ? ` ${round.honba}本場` : ""} ${kind}${handLabel}`;
      break;
    }
    case "ryuukyoku": {
      if (input.nagashiManganSeats.length > 0) {
        for (const achiever of input.nagashiManganSeats) {
          const achieverIsDealer = achiever === dealerSeat;
          for (let seat = 0; seat < 4; seat++) {
            if (seat === achiever) continue;
            const pay = achieverIsDealer ? 4000 : seat === dealerSeat ? 4000 : 2000;
            deltas[seat] -= pay;
            deltas[achiever] += pay;
          }
        }
      } else {
        const penalty = notenPenalty(input.tenpaiSeats.length);
        if (penalty) {
          for (let seat = 0; seat < 4; seat++) {
            const isTenpai = input.tenpaiSeats.includes(seat as SeatIndex);
            deltas[seat] += isTenpai ? penalty.perTenpaiReceive : -penalty.perNotenPay;
          }
        }
      }
      dealerContinues = input.tenpaiSeats.includes(dealerSeat) || input.nagashiManganSeats.includes(dealerSeat);
      description = `${roundLabel(round)}${round.honba > 0 ? ` ${round.honba}本場` : ""} ${
        input.nagashiManganSeats.length > 0 ? "流局満貫" : "流局"
      }`;
      break;
    }
    case "abortive": {
      dealerContinues = true;
      description = `${roundLabel(round)}${round.honba > 0 ? ` ${round.honba}本場` : ""} ${input.description}`;
      break;
    }
  }

  const marker = advanceRoundMarker(round, dealerContinues);
  const newRound: RoundState = { ...marker, riichiSticks, riichiDeclaredSeats: [] };

  return { deltas, newRound, description, dealerContinues };
}
