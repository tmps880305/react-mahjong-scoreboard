import { useState } from "react";
import { Overlay } from "../Overlay";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useGame } from "../../hooks/useGame";
import type { HandLogEntry } from "../../domain/types";

interface HistoryLogProps {
  onClose: () => void;
  onStartNewGame?: () => void;
}

export function HistoryLog({ onClose, onStartNewGame }: HistoryLogProps) {
  const { state, dispatch } = useGame();
  const { history, players } = state;
  const names = players.map((p) => p.name);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const lastEntry = history[history.length - 1];

  const renderEntry = (entry: HandLogEntry) => (
    <div
      key={entry.id}
      className={`mb-1.5 break-inside-avoid rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 ${
        entry.id === lastEntry?.id ? "ring-1 ring-amber-400/40" : ""
      }`}
    >
      <div className="mb-1 text-xs font-medium text-white/90">{entry.description}</div>
      <div className="grid grid-cols-2 gap-1 text-[10px]">
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
  );

  return (
    <Overlay
      title="履歴"
      onClose={onClose}
      footer={
        onStartNewGame ? (
          <button
            onClick={onStartNewGame}
            className="w-full rounded-lg bg-amber-500 py-3 text-center text-sm font-bold text-black active:scale-[0.99]"
          >
            新しい対局を開始
          </button>
        ) : (
          <button
            disabled={history.length === 0}
            onClick={() => setConfirmOpen(true)}
            className={`w-full rounded-lg py-3 text-center text-sm font-bold ${
              history.length === 0 ? "bg-white/10 text-white/40" : "bg-red-500/90 text-white active:scale-[0.99]"
            }`}
          >
            元に戻す
          </button>
        )
      }
    >
      {history.length === 0 ? (
        <div className="py-10 text-center text-sm text-white/40">記録がありません</div>
      ) : (
        <div className="h-full columns-2 gap-1.5" style={{ columnFill: "auto" }}>
          {history.map(renderEntry)}
        </div>
      )}

      {confirmOpen && lastEntry && (
        <ConfirmDialog
          title="この1局を元に戻しますか？"
          confirmLabel="戻す"
          variant="danger"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            dispatch({ type: "UNDO_LAST" });
            setConfirmOpen(false);
            onClose();
          }}
        >
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="mb-1 text-white/80">{lastEntry.description}</div>
            {names.map((name, i) => {
              const delta = lastEntry.deltas[i];
              if (delta === 0) return null;
              return (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-white/60">{name}</span>
                  <span className={delta > 0 ? "text-green-400" : "text-red-400"}>
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </span>
                </div>
              );
            })}
          </div>
        </ConfirmDialog>
      )}
    </Overlay>
  );
}
