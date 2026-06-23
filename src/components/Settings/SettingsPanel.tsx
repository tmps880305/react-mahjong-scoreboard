import { useState, type ReactNode } from "react";
import { Overlay } from "../Overlay";
import { useGame } from "../../hooks/useGame";
import { NumberStepper } from "../common/NumberStepper";
import type { GameLength, ScoreInputMode } from "../../domain/types";

const UMA_PRESETS: { label: string; value: [number, number, number, number] }[] = [
  { label: "なし", value: [0, 0, 0, 0] },
  { label: "5-10", value: [1500, 500, -500, -1500] },
  { label: "10-20", value: [3000, 1000, -1000, -3000] },
  { label: "20-30", value: [5000, 2000, -2000, -5000] },
];

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { state, dispatch } = useGame();
  const { players, settings } = state;
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);

  return (
    <Overlay title="設定" onClose={onClose}>
      <div className="flex flex-col gap-6">
        <Section title="プレイヤー名">
          <div className="flex flex-col gap-2">
            {players.map((p, i) => (
              <input
                key={i}
                value={p.name}
                onChange={(e) => dispatch({ type: "RENAME_PLAYER", seat: i as 0 | 1 | 2 | 3, name: e.target.value })}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                maxLength={8}
              />
            ))}
          </div>
        </Section>

        <Section title="点数入力モード">
          <div className="grid grid-cols-2 gap-2">
            {(["hanfu", "direct"] as ScoreInputMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { scoreInputMode: mode } })}
                className={`rounded-lg border py-2 text-sm font-medium ${
                  settings.scoreInputMode === mode
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                {mode === "hanfu" ? "翻符" : "点数を直接入力"}
              </button>
            ))}
          </div>
        </Section>

        <Section title="対局形式">
          <div className="grid grid-cols-2 gap-2">
            {(["tonpuusen", "hanchan"] as GameLength[]).map((len) => (
              <button
                key={len}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { gameLength: len } })}
                className={`rounded-lg border py-2 text-sm font-medium ${
                  settings.gameLength === len
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                {len === "tonpuusen" ? "東風戦" : "半荘戦"}
              </button>
            ))}
          </div>
        </Section>

        {settings.gameLength === "hanchan" && (
          <Section title="西入点数">
            <NumberStepper
              label="西入点数"
              value={settings.westEntryScore}
              min={10000}
              max={50000}
              step={1000}
              onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", settings: { westEntryScore: v } })}
            />
            <p className="mt-1.5 text-xs text-white/40">
              南4局終了時に誰もこの点数に達していなければ、西入（西4局まで延長）します。
            </p>
          </Section>
        )}

        <Section title="開始点 / 返し点">
          <div className="flex flex-col gap-2">
            <NumberStepper
              label="開始点"
              value={settings.startingScore}
              min={10000}
              max={50000}
              step={1000}
              onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", settings: { startingScore: v } })}
            />
            <NumberStepper
              label="返し点（精算基準）"
              value={settings.returnScore}
              min={10000}
              max={50000}
              step={1000}
              onChange={(v) => dispatch({ type: "UPDATE_SETTINGS", settings: { returnScore: v } })}
            />
          </div>
        </Section>

        <Section title="ウマ">
          <div className="grid grid-cols-4 gap-2">
            {UMA_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => dispatch({ type: "UPDATE_SETTINGS", settings: { uma: preset.value } })}
                className={`rounded-lg border py-2 text-sm font-medium ${
                  settings.uma.join(",") === preset.value.join(",")
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="対局">
          {confirmingNewGame ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  dispatch({ type: "NEW_GAME" });
                  setConfirmingNewGame(false);
                  onClose();
                }}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-bold text-white"
              >
                新しい対局を開始（点数・記録を削除）
              </button>
              <button
                onClick={() => setConfirmingNewGame(false)}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingNewGame(true)}
              className="w-full rounded-lg border border-white/15 bg-white/5 py-2 text-sm font-medium text-white/80"
            >
              新しい対局を開始
            </button>
          )}
        </Section>
      </div>
    </Overlay>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</div>
      {children}
    </div>
  );
}
