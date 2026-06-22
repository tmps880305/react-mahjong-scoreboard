import { useMemo, useState, type ReactNode } from "react";
import { Overlay } from "../Overlay";
import { useGame } from "../../hooks/useGame";
import { applyHand, dealerSeatOf } from "../../domain/hand";
import type { HandInput, SeatIndex, WinScoring } from "../../domain/types";
import { SeatChips } from "../common/SeatChips";
import { NumberStepper } from "../common/NumberStepper";
import { PointInput } from "../common/PointInput";

const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
const ABORTIVE_REASONS = ["四家立直", "三家和", "四開槓", "九種九牌", "四風連打"];

type LocalWinType = "tsumo" | "ron" | "ryuukyoku" | "abortive";

const WIN_TYPE_OPTIONS: [LocalWinType, string][] = [
  ["tsumo", "ツモ"],
  ["ron", "ロン"],
  ["ryuukyoku", "流局"],
  ["abortive", "途中流局"],
];

interface HandInputModalProps {
  onClose: () => void;
}

export function HandInputModal({ onClose }: HandInputModalProps) {
  const { state, dispatch } = useGame();
  const { round, players, settings } = state;
  const dealerSeat = dealerSeatOf(round);
  const names = players.map((p) => p.name) as [string, string, string, string];

  const [winType, setWinType] = useState<LocalWinType>("tsumo");
  const [winnerSeat, setWinnerSeat] = useState<SeatIndex>(0);
  const [loserSeat, setLoserSeat] = useState<SeatIndex>(1);
  const [tenpaiSeats, setTenpaiSeats] = useState<SeatIndex[]>([]);
  const [abortiveReason, setAbortiveReason] = useState(ABORTIVE_REASONS[0]);

  const [han, setHan] = useState(3);
  const [fu, setFu] = useState(30);
  const [ronPoints, setRonPoints] = useState(0);
  const [tsumoEach, setTsumoEach] = useState(0);
  const [tsumoFromDealer, setTsumoFromDealer] = useState(0);
  const [tsumoFromNonDealer, setTsumoFromNonDealer] = useState(0);

  const winnerIsDealer = winnerSeat === dealerSeat;

  const scoring: WinScoring = useMemo(() => {
    if (settings.scoreInputMode === "hanfu") {
      return { mode: "hanfu", han, fu };
    }
    if (winType === "ron") {
      return { mode: "direct", ronPoints };
    }
    if (winnerIsDealer) {
      return { mode: "direct", tsumoEach };
    }
    return { mode: "direct", tsumoFromDealer, tsumoFromNonDealer };
  }, [settings.scoreInputMode, han, fu, winType, winnerIsDealer, ronPoints, tsumoEach, tsumoFromDealer, tsumoFromNonDealer]);

  const handInput: HandInput = useMemo(() => {
    if (winType === "tsumo" || winType === "ron") {
      return {
        winType,
        winnerSeat,
        loserSeat: winType === "ron" ? loserSeat : undefined,
        scoring,
      };
    }
    if (winType === "ryuukyoku") {
      return { winType: "ryuukyoku", tenpaiSeats };
    }
    return { winType: "abortive", description: abortiveReason };
  }, [winType, winnerSeat, loserSeat, scoring, tenpaiSeats, abortiveReason]);

  const preview = useMemo(() => applyHand(round, handInput), [handInput, round]);

  const submit = () => {
    dispatch({ type: "APPLY_HAND", input: handInput });
    onClose();
  };

  const selectWinner = (seat: SeatIndex) => {
    setWinnerSeat(seat);
    if (loserSeat === seat) {
      setLoserSeat(([0, 1, 2, 3] as SeatIndex[]).find((s) => s !== seat)!);
    }
  };

  return (
    <Overlay
      title="結果を記録"
      onClose={onClose}
      footer={
        <button
          onClick={submit}
          className="w-full rounded-lg bg-amber-500 py-3 text-center text-base font-bold text-black active:scale-[0.99]"
        >
          点数を更新
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-4 gap-2">
          {WIN_TYPE_OPTIONS.map(([type, label]) => (
            <button
              key={type}
              onClick={() => setWinType(type)}
              className={`rounded-lg border py-3 text-sm font-medium ${
                winType === type
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-white/15 bg-white/5 text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {(winType === "tsumo" || winType === "ron") && (
          <>
            <Section title="和了者">
              <SeatChips names={names} selected={[winnerSeat]} mode="single" onChange={(s) => selectWinner(s[0])} />
            </Section>

            {winType === "ron" && (
              <Section title="放銃者">
                <SeatChips
                  names={names}
                  selected={[loserSeat]}
                  mode="single"
                  disabled={[winnerSeat]}
                  onChange={(s) => setLoserSeat(s[0])}
                />
              </Section>
            )}

            <Section title="点数">
              {settings.scoreInputMode === "hanfu" ? (
                <div className="flex flex-col gap-2">
                  <NumberStepper label="翻数" value={han} min={1} max={13} onChange={setHan} suffix="翻" />
                  {han < 5 && (
                    <div className="flex flex-wrap gap-1.5">
                      {FU_OPTIONS.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFu(f)}
                          className={`rounded px-2.5 py-1 text-sm ${
                            fu === f ? "bg-amber-500 text-black" : "bg-white/10 text-white/70"
                          }`}
                        >
                          {f}符
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : winType === "ron" ? (
                <PointInput label="放銃点数" value={ronPoints} onChange={setRonPoints} />
              ) : winnerIsDealer ? (
                <PointInput label="各家の支払い" value={tsumoEach} onChange={setTsumoEach} />
              ) : (
                <div className="flex flex-col gap-3">
                  <PointInput label="親の支払い" value={tsumoFromDealer} onChange={setTsumoFromDealer} />
                  <PointInput label="子の支払い" value={tsumoFromNonDealer} onChange={setTsumoFromNonDealer} />
                </div>
              )}
            </Section>
          </>
        )}

        {winType === "ryuukyoku" && (
          <>
            <Section title="聴牌者">
              <SeatChips names={names} selected={tenpaiSeats} mode="multi" onChange={setTenpaiSeats} />
            </Section>
          </>
        )}

        {winType === "abortive" && (
          <Section title="流局の種類">
            <div className="flex flex-wrap gap-2">
              {ABORTIVE_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setAbortiveReason(reason)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    abortiveReason === reason
                      ? "border-amber-400 bg-amber-500/20 text-amber-200"
                      : "border-white/15 bg-white/5 text-white/70"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </Section>
        )}

        <Section title="プレビュー">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {names.map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5">
                <span className="text-white/60">{name}</span>
                <span
                  className={
                    preview.deltas[i] > 0 ? "text-green-400" : preview.deltas[i] < 0 ? "text-red-400" : "text-white/40"
                  }
                >
                  {preview.deltas[i] > 0 ? "+" : ""}
                  {preview.deltas[i]}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </Overlay>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-lg font-semibold uppercase tracking-wide text-white/40">{title}</div>
      {children}
    </div>
  );
}
