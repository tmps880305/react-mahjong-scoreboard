import { useState } from "react";
import { useGame } from "../../hooks/useGame";
import { dealerSeatOf, seatWindLabel } from "../../domain/hand";
import type { SeatIndex } from "../../domain/types";
import { GearIcon, ListIcon } from "../common/icons";
import { CenterPanel } from "./CenterPanel";
import { PlayerScoreBox } from "./PlayerScoreBox";
import { TilePicker } from "./TilePicker";

const DEFAULT_WALL_COUNT = 70;

const SEAT_LAYOUT: Record<SeatIndex, { area: string; rotate: number }> = {
  0: { area: "bottom", rotate: 0 },
  1: { area: "right", rotate: -90 },
  2: { area: "top", rotate: 180 },
  3: { area: "left", rotate: 90 },
};

interface TableViewProps {
  onRecordHand: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export function TableView({ onRecordHand, onOpenSettings, onOpenHistory }: TableViewProps) {
  const { state } = useGame();
  const { players, round } = state;
  const dealerSeat = dealerSeatOf(round);

  const [wallCount, setWallCount] = useState(DEFAULT_WALL_COUNT);
  const [doraIndicators, setDoraIndicators] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Cosmetic-only state: reset whenever a new hand begins (React's
  // "adjust state during render" pattern, avoids an extra effect render).
  const roundKey = `${round.wind}-${round.number}-${round.honba}`;
  const [lastRoundKey, setLastRoundKey] = useState(roundKey);
  if (roundKey !== lastRoundKey) {
    setLastRoundKey(roundKey);
    setWallCount(DEFAULT_WALL_COUNT);
    setDoraIndicators([]);
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
      <button
        onClick={onOpenSettings}
        aria-label="設定"
        className="absolute left-[1.5cqw] top-[1.5cqw] z-10 h-[9cqw] w-[9cqw] rounded-full p-[2.2cqw] text-white/30 hover:text-white/70"
      >
        <GearIcon />
      </button>
      <button
        onClick={onOpenHistory}
        aria-label="歷史記錄"
        className="absolute right-[1.5cqw] top-[1.5cqw] z-10 h-[9cqw] w-[9cqw] rounded-full p-[2.2cqw] text-white/30 hover:text-white/70"
      >
        <ListIcon />
      </button>

      <div
        className="grid h-full w-full"
        style={{
          gridTemplateAreas: `". top ." "left center right" ". bottom ."`,
          gridTemplateColumns: "18cqw 64cqw 18cqw",
          gridTemplateRows: "18cqw 64cqw 18cqw",
        }}
      >
        {([0, 1, 2, 3] as SeatIndex[]).map((seat) => {
          const layout = SEAT_LAYOUT[seat];
          return (
            <div key={seat} style={{ gridArea: layout.area }} className="flex items-center justify-center">
              <PlayerScoreBox
                name={players[seat].name}
                score={players[seat].score}
                wind={seatWindLabel(seat, round)}
                isDealer={seat === dealerSeat}
                rotateDeg={layout.rotate}
              />
            </div>
          );
        })}

        <div style={{ gridArea: "center" }} className="flex items-center justify-center">
          <CenterPanel
            roundWind={round.wind}
            roundNumber={round.number}
            honba={round.honba}
            riichiSticks={round.riichiSticks}
            wallCount={wallCount}
            onWallCountChange={(delta) => setWallCount((c) => Math.max(0, c + delta))}
            doraIndicators={doraIndicators}
            onOpenDoraPicker={() => setPickerOpen(true)}
            onRemoveDora={(index) => setDoraIndicators((tiles) => tiles.filter((_, i) => i !== index))}
            onRecordHand={onRecordHand}
          />
        </div>
      </div>

      {pickerOpen && (
        <TilePicker
          onClose={() => setPickerOpen(false)}
          onSelect={(tile) => {
            setDoraIndicators((tiles) => [...tiles, tile]);
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
