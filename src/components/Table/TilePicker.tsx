import { Overlay } from "../Overlay";
import { TILE_GROUPS } from "../../domain/tiles";

interface TilePickerProps {
  onSelect: (tile: string) => void;
  onClose: () => void;
}

export function TilePicker({ onSelect, onClose }: TilePickerProps) {
  return (
    <Overlay title="選擇寶牌指示牌" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {TILE_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-1 text-xs text-white/50">{group.label}</div>
            <div className="grid grid-cols-9 gap-1">
              {group.tiles.map((tile) => (
                <button
                  key={tile}
                  onClick={() => onSelect(tile)}
                  className="flex aspect-[3/4] items-center justify-center rounded bg-white text-2xl text-black active:scale-95"
                >
                  {tile}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Overlay>
  );
}
