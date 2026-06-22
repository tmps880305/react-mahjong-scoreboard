interface PlayerScoreBoxProps {
  name: string;
  score: number;
  wind: string;
  isDealer: boolean;
  rotateDeg: number;
}

// Sized in container-query units (cqw) so the whole scoreboard scales with
// the actual screen. Matched against the reference sample: the score line
// ("東 250oo") spans ~58% of the frame width there.
const BOX_WIDTH = "60cqw";
const BOX_HEIGHT = "17cqw";

function formatScoreParts(score: number) {
  const sign = score < 0 ? "−" : "";
  const str = Math.abs(score).toString().padStart(3, "0");
  return { sign, main: str.slice(0, -2), tail: str.slice(-2) };
}

export function PlayerScoreBox({ name, score, wind, isDealer, rotateDeg }: PlayerScoreBoxProps) {
  const isSideways = rotateDeg === 90 || rotateDeg === -90;
  const { sign, main, tail } = formatScoreParts(score);

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: isSideways ? BOX_HEIGHT : BOX_WIDTH,
        height: isSideways ? BOX_WIDTH : BOX_HEIGHT,
      }}
    >
      <div
        className="flex shrink-0 flex-col items-center justify-center gap-[0.5cqw]"
        style={{ width: BOX_WIDTH, height: BOX_HEIGHT, transform: `rotate(${rotateDeg}deg)` }}
      >
        <span className="max-w-[55cqw] truncate text-[2.6cqw] tracking-wide text-white/35">{name}</span>
        <span className="flex items-baseline gap-[2.5cqw] font-serif leading-none">
          <span className={`text-[17.5cqw] leading-none ${isDealer ? "font-bold text-amber-400" : "text-white/70"}`}>
            {wind}
          </span>
          <span className={`leading-none tabular-nums ${score < 0 ? "text-red-400" : "text-white"}`}>
            <span className="text-[17.5cqw]">
              {sign}
              {main}
            </span>
            <span className="text-[9.5cqw]">{tail}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
