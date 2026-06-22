import { Overlay } from "../Overlay";
import { useGame } from "../../hooks/useGame";

interface HistoryLogProps {
  onClose: () => void;
}

export function HistoryLog({ onClose }: HistoryLogProps) {
  const { state, dispatch } = useGame();
  const { history, players } = state;
  const names = players.map((p) => p.name);
  const reversed = [...history].reverse();

  return (
    <Overlay
      title="歷史記錄"
      onClose={onClose}
      footer={
        <button
          disabled={history.length === 0}
          onClick={() => dispatch({ type: "UNDO_LAST" })}
          className={`w-full rounded-lg py-3 text-center text-sm font-bold ${
            history.length === 0 ? "bg-white/10 text-white/40" : "bg-red-500/90 text-white active:scale-[0.99]"
          }`}
        >
          復原最後一手
        </button>
      }
    >
      {reversed.length === 0 ? (
        <div className="py-10 text-center text-sm text-white/40">尚無記錄</div>
      ) : (
        <div className="flex flex-col gap-2">
          {reversed.map((entry, idx) => (
            <div
              key={entry.id}
              className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2 ${idx === 0 ? "ring-1 ring-amber-400/40" : ""}`}
            >
              <div className="mb-1 text-sm font-medium text-white/90">{entry.description}</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {names.map((name, i) => {
                  const delta = entry.deltas[i];
                  if (delta === 0) return null;
                  return (
                    <div key={i} className="flex justify-between text-white/60">
                      <span>{name}</span>
                      <span className={delta > 0 ? "text-green-400" : "text-red-400"}>
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Overlay>
  );
}
