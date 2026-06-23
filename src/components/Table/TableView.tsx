import { useGame } from "../../hooks/useGame";
import { dealerSeatOf, seatWindLabel } from "../../domain/hand";
import type { SeatIndex } from "../../domain/types";
import { GearIcon, ListIcon } from "../common/icons";
import { CenterPanel } from "./CenterPanel";
import { PlayerScoreBox } from "./PlayerScoreBox";

// `nudge` pulls each player's score in toward the center a touch, so glyphs
// don't sit flush against the frame edge (where they were getting clipped).
const SEAT_LAYOUT: Record<SeatIndex, { area: string; rotate: number; nudge: string }> = {
  0: { area: "bottom", rotate: 0, nudge: "translateY(-2cqw)" },
  1: { area: "right", rotate: -90, nudge: "translateX(-2cqw)" },
  2: { area: "top", rotate: 180, nudge: "translateY(2cqw)" },
  3: { area: "left", rotate: 90, nudge: "translateX(2cqw)" },
};

interface TableViewProps {
  onRecordHand: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export function TableView({ onRecordHand, onOpenSettings, onOpenHistory }: TableViewProps) {
  const { state, dispatch } = useGame();
  const { players, round } = state;
  const dealerSeat = dealerSeatOf(round);

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
        aria-label="履歴"
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
            <div
              key={seat}
              style={{ gridArea: layout.area, transform: layout.nudge }}
              className="flex items-center justify-center"
            >
              <PlayerScoreBox
                name={players[seat].name}
                score={players[seat].score}
                wind={seatWindLabel(seat, round)}
                isDealer={seat === dealerSeat}
                isRiichi={round.riichiDeclaredSeats.includes(seat)}
                rotateDeg={layout.rotate}
                onToggleRiichi={() => dispatch({ type: "TOGGLE_RIICHI", seat })}
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
            dealerRotateDeg={SEAT_LAYOUT[dealerSeat].rotate}
            onRecordHand={onRecordHand}
          />
        </div>
      </div>
    </div>
  );
}
