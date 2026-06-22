// Unicode Mahjong Tiles block (U+1F000-U+1F02B)
export const WIND_TILES = ["🀀", "🀁", "🀂", "🀃"]; // 東南西北
export const DRAGON_TILES = ["🀄", "🀅", "🀆"]; // 中發白
export const MAN_TILES = ["🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏"]; // 一萬~九萬
export const SOU_TILES = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"]; // 一索~九索
export const PIN_TILES = ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"]; // 一筒~九筒

export const TILE_GROUPS: { label: string; tiles: string[] }[] = [
  { label: "萬", tiles: MAN_TILES },
  { label: "索", tiles: SOU_TILES },
  { label: "筒", tiles: PIN_TILES },
  { label: "風", tiles: WIND_TILES },
  { label: "元", tiles: DRAGON_TILES },
];
