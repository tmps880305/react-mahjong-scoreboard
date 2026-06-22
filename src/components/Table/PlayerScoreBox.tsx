interface PlayerScoreBoxProps {
  name: string;
  score: number;
  wind: string;
  isDealer: boolean;
  isRiichi: boolean;
  rotateDeg: number;
  onToggleRiichi: () => void;
}

// Sized in container-query units (cqw) so the whole scoreboard scales with
// the actual screen.
const BOX_WIDTH = "52cqw";
const BOX_HEIGHT = "15cqw";

export function PlayerScoreBox({ name, score, wind, isDealer, isRiichi, rotateDeg, onToggleRiichi }: PlayerScoreBoxProps) {
  const isSideways = rotateDeg === 90 || rotateDeg === -90;
  const scoreText = `${score < 0 ? "−" : ""}${Math.abs(score)}`;

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: isSideways ? BOX_HEIGHT : BOX_WIDTH,
        height: isSideways ? BOX_WIDTH : BOX_HEIGHT,
      }}
    >
      <button
        onClick={onToggleRiichi}
        aria-pressed={isRiichi}
        aria-label="リーチ"
        className="flex shrink-0 flex-col items-center justify-center gap-[0.5cqw] active:scale-95"
        style={{ width: BOX_WIDTH, height: BOX_HEIGHT, transform: `rotate(${rotateDeg}deg)` }}
      >
        <span className="max-w-[48cqw] truncate text-[2.3cqw] tracking-wide text-white/35">{name}</span>
        <span className="flex items-baseline gap-[2.2cqw] font-serif leading-none">
          <span className={`text-[15cqw] leading-none ${isDealer ? "font-bold text-amber-400" : "text-white/70"}`}>
            {wind}
          </span>
          <span className={`text-[15cqw] leading-none tabular-nums ${score < 0 ? "text-red-400" : "text-white"}`}>
            {scoreText}
          </span>
          {isRiichi && <span className="h-[3cqw] w-[3cqw] shrink-0 rounded-full bg-red-500" />}
        </span>
      </button>
    </div>
  );
}
