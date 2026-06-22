import { useGame } from "../../hooks/useGame";
import { computeFinalSettlement } from "../../domain/scoring";

const RANK_LABELS = ["1位", "2位", "3位", "4位"];

export function GameEndScreen() {
  const { state, dispatch } = useGame();
  const { players, settings } = state;

  const settlement = computeFinalSettlement({
    scores: players.map((p) => p.score) as [number, number, number, number],
    startingScore: settings.startingScore,
    returnScore: settings.returnScore,
    uma: settings.uma,
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90 px-6 text-white">
      <h1 className="text-2xl font-bold text-amber-200">対局終了</h1>

      <div className="flex w-full max-w-sm flex-col gap-2">
        {settlement.map((entry) => (
          <div
            key={entry.seat}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
              entry.rank === 1 ? "border-amber-400 bg-amber-500/15" : "border-white/10 bg-white/5"
            }`}
          >
            <span className="w-10 text-center text-sm font-bold text-white/60">{RANK_LABELS[entry.rank - 1]}</span>
            <span className="flex-1 truncate font-medium">{players[entry.seat].name}</span>
            <span className="text-sm text-white/50 tabular-nums">{entry.rawScore.toLocaleString()}</span>
            <span
              className={`w-16 text-right text-sm font-bold tabular-nums ${
                entry.settlement >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {entry.settlement >= 0 ? "+" : ""}
              {(entry.settlement / 1000).toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-sm gap-3">
        <button
          onClick={() => dispatch({ type: "CONTINUE_GAME" })}
          className="flex-1 rounded-lg border border-white/20 bg-white/5 py-3 text-sm font-medium text-white/80"
        >
          対局を続ける
        </button>
        <button
          onClick={() => dispatch({ type: "NEW_GAME" })}
          className="flex-1 rounded-lg bg-amber-500 py-3 text-sm font-bold text-black"
        >
          新しい対局を開始
        </button>
      </div>
    </div>
  );
}
