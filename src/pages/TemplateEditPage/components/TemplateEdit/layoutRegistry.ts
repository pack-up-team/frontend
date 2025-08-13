import type { Category } from "../../../../stores/editorStore";

export type BackgroundKey =
  | "office-1" | "office-2" | "office-3" | "office-4"
  | "daily-1"  | "daily-2"  | "daily-3"  | "daily-4"
  | "trip-1"   | "trip-2"   | "trip-3"   | "trip-4";

export type Slot = { x: number; y: number };

export type StepLayout = {
  itemSlots: Slot[];
  textSlots: Slot[];
};

export type LayoutRegistry = Record<BackgroundKey, StepLayout[]>;

export function makeBg(cat: Category, steps: 1 | 2 | 3 | 4): BackgroundKey {
  return `${cat}-${steps}` as BackgroundKey;
}
export function bgStepCount(bg: BackgroundKey): 1 | 2 | 3 | 4 {
  const n = Number(bg.split("-")[1]);
  return (n === 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : 4);
}

type IsoStepSpec = {
  origin: Slot;             // (0,0) 기준점
  u: Slot;                  // 가로 1칸 이동 벡터(등각)
  v: Slot;                  // 세로 1칸 이동 벡터(등각)
  cols: number;             // 가로 칸수
  rows: number;             // 세로 칸수
  texts?: Slot[];           // 텍스트 슬롯(옵션)
};

function buildIsoGrid(spec: IsoStepSpec): StepLayout {
  const { origin, u, v, cols, rows, texts } = spec;
  const itemSlots: Slot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      itemSlots.push({
        x: origin.x + u.x * c + v.x * r,
        y: origin.y + u.y * c + v.y * r,
      });
    }
  }
  return { itemSlots, textSlots: texts ?? [] };
}

const textCol = (x: number, y0: number, gap: number, n = 3): Slot[] =>
  Array.from({ length: n }, (_, i) => ({ x, y: y0 + i * gap }));

const U = { x: 0.053, y: -0.0257 }; // 가로
const V = { x: 0.0, y:  0.051 }; // 세로

// 텍스트 위치(좌/우 사이드 공통)
const TXT_LEFT  = (n = 3) => textCol(0.205, 0.36, 0.14, n);
const TXT_RIGHT = (n = 3) => textCol(0.860, 0.36, 0.14, n);

const COMMON_1: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.332, y: 0.33 },
    u: U, v: V,
    cols: 6, rows: 6,
    texts: TXT_LEFT(),
  }),
];

const COMMON_2: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.207, y: 0.3 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_LEFT(),
  }),
  buildIsoGrid({
    origin: { x: 0.58, y: 0.298 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_RIGHT(),
  }),
];

const COMMON_3: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.207, y: 0.234 },
    u: U, v: V,
    cols: 3, rows: 3,
    texts: TXT_LEFT(),
  }),
  buildIsoGrid({
    origin: { x: 0.207, y: 0.545 },
    u: U, v: V,
    cols: 3, rows: 3,
    texts: TXT_LEFT(),
  }),
  buildIsoGrid({
    origin: { x: 0.593, y: 0.298 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_RIGHT(),
  }),
];

// 4스텝: 3x3 × 4
const COMMON_4: StepLayout[] = [
  buildIsoGrid({ origin: { x: 0.232, y: 0.234 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_LEFT() }),
  buildIsoGrid({ origin: { x: 0.232, y: 0.54 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_LEFT() }),
  buildIsoGrid({ origin: { x: 0.612, y: 0.233 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_RIGHT() }),
  buildIsoGrid({ origin: { x: 0.612, y: 0.54 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_RIGHT() }),
];

/* -------------------------------------------------------
 * 카테고리 → 공통 레이아웃 매핑
 * -----------------------------------------------------*/
function byCat(cat: Category): Record<BackgroundKey, StepLayout[]> {
  return {
    [makeBg(cat, 1)]: COMMON_1,
    [makeBg(cat, 2)]: COMMON_2,
    [makeBg(cat, 3)]: COMMON_3,
    [makeBg(cat, 4)]: COMMON_4,
  } as Record<BackgroundKey, StepLayout[]>;
}

export const layoutRegistry: LayoutRegistry = {
  ...byCat("office"),
  ...byCat("daily"),
  ...byCat("trip"),
};
