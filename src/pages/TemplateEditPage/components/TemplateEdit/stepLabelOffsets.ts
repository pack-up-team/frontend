// src/pages/TemplateEditPage/components/TemplateEdit/stepLabelOffsets.ts
export type StepCount = 1 | 2 | 3 | 4;
export type Offset = { dx: number; dy: number };

export const STEP_LABEL_OFFSETS: Record<StepCount, Offset[]> = {
  1: [{ dx: 0, dy: -12 }],
  2: [{ dx: -10, dy: -12 }, { dx: 10, dy: -12 }],
  3: [{ dx: -8, dy: -12 }, { dx: 0, dy: -12 }, { dx: 8, dy: -12 }],
  4: [
    { dx: -10, dy: -12 },
    { dx: 10, dy: -12 },
    { dx: -10, dy: -12 },
    { dx: 10, dy: -12 },
  ],
};
