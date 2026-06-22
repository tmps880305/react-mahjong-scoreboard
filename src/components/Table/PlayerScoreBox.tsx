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

// Shrinks the name to fit instead of truncating with "...".
function nameFontSize(name: string): string {
  const baseChars = 4;
  const baseSize = 3.4;
  const minSize = 1.6;
  if (name.length <= baseChars) return `${baseSize}cqw`;
  return `${Math.max(minSize, baseSize * (baseChars / name.length))}cqw`;
}

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
      <div
        className="relative flex shrink-0 items-center justify-center font-serif"
        style={{ width: BOX_WIDTH, height: BOX_HEIGHT, transform: `rotate(${rotateDeg}deg)` }}
      >
        <button
          onClick={onToggleRiichi}
          aria-pressed={isRiichi}
          aria-label="リーチ"
          className={`absolute -top-[6cqw] left-1/2 h-[3cqw] w-[45cqw] -translate-x-1/2 rounded-[0.8cqw] ${
            isRiichi ? "bg-white shadow" : "border border-dashed border-white/20"
          }`}
        >
          {isRiichi && (
            <span className="absolute left-1/2 top-1/2 h-[2.2cqw] w-[2.2cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
          )}
        </button>
        <span className="flex items-end justify-center gap-[2.2cqw]">
          <span className="flex flex-col items-center gap-[0.3cqw]">
            <span
              className="max-w-[18cqw] whitespace-nowrap tracking-wide text-white/35"
              style={{ fontSize: nameFontSize(name) }}
            >
              {name}
            </span>
            <span className={`text-[15cqw] leading-none ${isDealer ? "font-bold text-amber-400" : "text-white/70"}`}>
              {wind}
            </span>
          </span>
          <span className={`text-[15cqw] leading-none tabular-nums ${score < 0 ? "text-red-400" : "text-white"}`}>
            {scoreText}
          </span>
        </span>
      </div>
    </div>
  );
}
