import type { RoundWind } from "../../domain/types";

interface CenterPanelProps {
  roundWind: RoundWind;
  roundNumber: number;
  honba: number;
  riichiSticks: number;
  dealerRotateDeg: number;
  onRecordHand: () => void;
}

export function CenterPanel({ roundWind, roundNumber, honba, riichiSticks, dealerRotateDeg, onRecordHand }: CenterPanelProps) {
  return (
    <div className="flex aspect-square w-full max-w-[64cqw] flex-col items-center justify-center text-center">
      <div
        style={{ transform: `rotate(${dealerRotateDeg}deg)` }}
        className="flex flex-col items-center gap-[2.5cqw]"
      >
        <button
          onClick={onRecordHand}
          aria-label="結果を記録"
          className="flex items-baseline justify-center gap-[0.5cqw] font-serif leading-none active:scale-95"
        >
          <span className="text-[18.5cqw] font-bold leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
            {roundWind === "E" ? "東" : "南"}
          </span>
          <span className="text-[12cqw] font-bold leading-none text-white">{roundNumber}</span>
          <span className="text-[10cqw] leading-none text-white/70">局</span>
        </button>

        <div className="flex items-center gap-[1.6cqw] text-[3.3cqw] text-white/40">
          <span>供託 {riichiSticks}</span>
          <span className="text-white/20">·</span>
          <span>{honba} 本場</span>
        </div>
      </div>
    </div>
  );
}
