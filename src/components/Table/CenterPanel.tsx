import type { RoundWind } from "../../domain/types";

interface CenterPanelProps {
  roundWind: RoundWind;
  roundNumber: number;
  honba: number;
  riichiSticks: number;
  wallCount: number;
  onWallCountChange: (delta: number) => void;
  doraIndicators: string[];
  onOpenDoraPicker: () => void;
  onRemoveDora: (index: number) => void;
  onRecordHand: () => void;
}

export function CenterPanel({
  roundWind,
  roundNumber,
  honba,
  riichiSticks,
  wallCount,
  onWallCountChange,
  doraIndicators,
  onOpenDoraPicker,
  onRemoveDora,
  onRecordHand,
}: CenterPanelProps) {
  return (
    <div className="flex aspect-square w-full max-w-[64cqw] flex-col items-center justify-center gap-[2.5cqw] text-center">
      <div className="flex items-baseline justify-center gap-[0.5cqw] font-serif leading-none">
        <span className="text-[21.5cqw] font-bold leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
          {roundWind === "E" ? "東" : "南"}
        </span>
        <span className="text-[14cqw] font-bold leading-none text-white">{roundNumber}</span>
        <span className="text-[11.5cqw] leading-none text-white/70">局</span>
      </div>

      <div className="flex items-center gap-[1.8cqw] text-[3.8cqw] text-white/40">
        <button onClick={() => onWallCountChange(-1)} className="px-[1.2cqw] text-white/40 hover:text-white/80">
          −
        </button>
        <span>殘牌 {wallCount}</span>
        <button onClick={() => onWallCountChange(1)} className="px-[1.2cqw] text-white/40 hover:text-white/80">
          ＋
        </button>
        <span className="text-white/20">·</span>
        <span>供託 {riichiSticks}</span>
        <span className="text-white/20">·</span>
        <span>{honba} 本場</span>
      </div>

      <button
        onClick={onOpenDoraPicker}
        className="flex min-h-[7cqw] flex-wrap items-center justify-center gap-[1.2cqw]"
        aria-label="寶牌指示牌"
      >
        {doraIndicators.length === 0 ? (
          <span className="text-[3.8cqw] text-white/25">＋ 寶牌指示牌</span>
        ) : (
          doraIndicators.map((tile, i) => (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveDora(i);
              }}
              className="rounded bg-white/90 px-[1.2cqw] text-[6.5cqw] leading-none text-black"
            >
              {tile}
            </span>
          ))
        )}
      </button>

      <button
        onClick={onRecordHand}
        className="mt-[1.2cqw] rounded-full border border-white/15 bg-white/5 px-[5cqw] py-[2cqw] text-[4.2cqw] font-medium text-white/70 active:scale-95"
      >
        記錄本局
      </button>
    </div>
  );
}
