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

const U = { x: 0.053, y: -0.0308 }; // 가로
const V = { x: 0.0, y:  0.06 }; // 세로

const TXT_COL_AT = (x: number, y0: number, n = 3, gap = 0.123) => textCol(x, y0, gap, n);

const Y_TOP    = 0.15;
const Y_MID    = 0.36;
const Y_BOTTOM = 0.61;

const X1_L = 0.155;
const X2_L = 0.08; const X2_R = 0.92;
const X3_L = 0.08; const X3_R = 0.92;
const X4_L = 0.08; const X4_R = 0.92;

const COMMON_1: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.332, y: 0.392 },
    u: U, v: V,
    cols: 6, rows: 6,
    texts: TXT_COL_AT(X1_L, Y_MID),
  }),
];

const COMMON_2: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.207, y: 0.354 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_COL_AT(X2_L, Y_MID),
  }),
  buildIsoGrid({
    origin: { x: 0.58, y: 0.354 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_COL_AT(X2_R, Y_MID),
  }),
];

const COMMON_3: StepLayout[] = [
  buildIsoGrid({
    origin: { x: 0.207, y: 0.276 },
    u: U, v: V,
    cols: 3, rows: 3,
    texts: TXT_COL_AT(X3_L, Y_TOP),
  }),
  buildIsoGrid({
    origin: { x: 0.207, y: 0.648 },
    u: U, v: V,
    cols: 3, rows: 3,
    texts: TXT_COL_AT(X3_L, Y_BOTTOM),
  }),
  buildIsoGrid({
    origin: { x: 0.593, y: 0.354 },
    u: U, v: V,
    cols: 3, rows: 6,
    texts: TXT_COL_AT(X3_R, Y_MID),
  }),
];

// 4스텝: 3x3 × 4
const COMMON_4: StepLayout[] = [
  buildIsoGrid({ origin: { x: 0.231, y: 0.279 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_COL_AT(X4_L, Y_TOP) }),
  buildIsoGrid({ origin: { x: 0.232, y: 0.645 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_COL_AT(X4_L, Y_BOTTOM) }),
  buildIsoGrid({ origin: { x: 0.612, y: 0.273 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_COL_AT(X4_R, Y_TOP) }),
  buildIsoGrid({ origin: { x: 0.612, y: 0.644 }, u: U, v: V, cols: 3, rows: 3, texts: TXT_COL_AT(X4_R, Y_BOTTOM) }),
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
