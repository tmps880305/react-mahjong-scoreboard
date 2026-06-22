import type { RoundWind } from "../../domain/types";

interface CenterPanelProps {
  roundWind: RoundWind;
  roundNumber: number;
  honba: number;
  riichiSticks: number;
  onRecordHand: () => void;
}

export function CenterPanel({ roundWind, roundNumber, honba, riichiSticks, onRecordHand }: CenterPanelProps) {
  return (
    <div className="flex aspect-square w-full max-w-[64cqw] flex-col items-center justify-center gap-[2.5cqw] text-center">
      <div className="flex items-baseline justify-center gap-[0.5cqw] font-serif leading-none">
        <span className="text-[18.5cqw] font-bold leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
          {roundWind === "E" ? "東" : "南"}
        </span>
        <span className="text-[12cqw] font-bold leading-none text-white">{roundNumber}</span>
        <span className="text-[10cqw] leading-none text-white/70">局</span>
      </div>

      <div className="flex items-center gap-[1.6cqw] text-[3.3cqw] text-white/40">
        <span>供託 {riichiSticks}</span>
        <span className="text-white/20">·</span>
        <span>{honba} 本場</span>
      </div>

      <button
        onClick={onRecordHand}
        className="mt-[1cqw] rounded-full border border-white/15 bg-white/5 px-[4.3cqw] py-[1.7cqw] text-[3.6cqw] font-medium text-white/70 active:scale-95"
      >
        結果を記録
      </button>
    </div>
  );
}
