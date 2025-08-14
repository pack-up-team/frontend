import React from "react";
import { STEP_LABEL_OFFSETS } from "./stepLabelOffsets";

type Props = {
  value: string;
  selected: boolean;
  onChange?: (v: string) => void;
  stepIndex: number;   // 0-based
  totalSteps: number;  // 1~4
};

function resolveOffset(stepIndex: number, totalSteps: number) {
  const count = Math.min(4, Math.max(1, totalSteps)) as 1 | 2 | 3 | 4;
  const arr = STEP_LABEL_OFFSETS[count] || [];
  return arr[stepIndex] || { dx: 0, dy: -10 };
}

export default function StepNameBadge({ value, selected, onChange, stepIndex, totalSteps }: Props) {
  const { dx, dy } = resolveOffset(stepIndex, totalSteps);

  const base: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "100%",
    transform: `translate(calc(-50% + ${dx}px), ${dy}px) rotate(-30deg) skewX(-30deg)`,
    transformOrigin: "50% 50%",
    pointerEvents: "auto",
    zIndex: selected ? 900 : 20,
  };

  if (!selected) {
    if (!value) return null;
    return (
      <div style={base}>
        <span style={{
          display: "inline-block",
          background: "#000",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "20px",
          padding: "6px 8px",
          whiteSpace: "nowrap",
        }}>
          {value}
        </span>
      </div>
    );
  }

  return (
    <div style={base} onPointerDown={(e) => e.stopPropagation()}>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `calc(${Math.max(1, value.length)}ch + 12px)`,
          minWidth: "2ch",
          display: "inline-block",
          boxSizing: "content-box",
          overflow: "visible",
          background: "#000",
          color: "#fff",
          border: "none",
          padding: "8px 10px",
          margin: 0,
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "20px",
          outline: "none",
          whiteSpace: "nowrap",
          textShadow: "0 0 0 #ffffff",
        }}
        placeholder=""
      />
    </div>
  );
}
