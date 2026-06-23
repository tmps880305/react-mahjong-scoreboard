import type { SeatIndex } from "../../domain/types";

interface SeatChipsProps {
  names: [string, string, string, string];
  selected: SeatIndex[];
  mode: "single" | "multi";
  disabled?: SeatIndex[];
  onChange: (seats: SeatIndex[]) => void;
}

export function SeatChips({ names, selected, mode, disabled = [], onChange }: SeatChipsProps) {
  const toggle = (seat: SeatIndex) => {
    if (disabled.includes(seat)) return;
    if (mode === "single") {
      onChange([seat]);
      return;
    }
    onChange(selected.includes(seat) ? selected.filter((s) => s !== seat) : [...selected, seat]);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {([0, 1, 2, 3] as SeatIndex[]).map((seat) => {
        const isSelected = selected.includes(seat);
        const isDisabled = disabled.includes(seat);
        return (
          <button
            key={seat}
            type="button"
            disabled={isDisabled}
            onClick={() => toggle(seat)}
            className={`truncate rounded-lg border px-1.5 py-3 text-sm font-medium transition ${
              isDisabled
                ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30"
                : isSelected
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-white/15 bg-white/5 text-white/80 active:scale-95"
            }`}
          >
            {names[seat]}
          </button>
        );
      })}
    </div>
  );
}
