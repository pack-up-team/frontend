import { useEffect, useMemo, useRef, useState } from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useEditorStore } from "../../../../stores/editorStore";
import { layoutRegistry, bgStepCount } from "./layoutRegistry";
import type { BackgroundKey } from "./layoutRegistry";

type ActiveItem = {
    stepId: number;
    itemId: number;
    originSlot?: number;
};

export default function TemplateEdit() {
    const steps = useEditorStore((s) => s.steps);
    const items = useEditorStore((s) => s.items);
    const texts = useEditorStore((s) => s.texts);
    const background = useEditorStore((s) => s.background);
    const placeItem = useEditorStore((s) => s.placeItem);
    const placeText = useEditorStore((s) => s.placeText);
    const moveItemAcrossSteps = useEditorStore((s) => s.moveItemAcrossSteps);
    const setStepCount = useEditorStore((s) => s.setStepCount);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    // 드래그 중 상태(가이드 표시용)
    const [active, setActive] = useState<ActiveItem | null>(null);

    // dnd 센서
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

    // 컨테이너 리사이즈 추적
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const cr = entry.contentRect;
            setSize({ w: cr.width, h: cr.height });
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // 현재 배경의 레이아웃(스텝별 슬롯들)
    const stepLayouts = useMemo(() => layoutRegistry[background] ?? [], [background]);
    useEffect(() => {
        // background에서 스텝 개수 추출
        const expectedSteps = bgStepCount(background);
        
        // 현재 스텝 개수와 다르면 조정
        if (steps.length !== expectedSteps) {
            console.log(`Steps 조정: ${steps.length} → ${expectedSteps}`);
            setStepCount(expectedSteps);
        }
    }, [background, steps.length, setStepCount]);

    // 화면 진입/변경 시, 슬롯이 지정되지 않은 아이템/텍스트를 "첫 빈 슬롯"에 자동 스냅
    useEffect(() => {
        // 아이템
        steps.forEach((st, sIdx) => {
            const grid = stepLayouts[sIdx];
            if (!grid) return;
            const total = grid.itemSlots.length;
            if (!total) return;

            const used = new Set<number>();
            const slotMap = st.itemSlotById ?? {};
            st.itemIds.forEach((id) => {
                const idx = slotMap[id];
                if (typeof idx === "number") used.add(idx);
            });

            st.itemIds.forEach((id) => {
                const idx = slotMap[id];
                if (typeof idx === "number") return;

                // 1) 현재 스텝 내에서 빈 칸 찾기
                let placed = false;
                for (let i = 0; i < total; i++) {
                    if (!used.has(i)) {
                        used.add(i);
                        placeItem(st.id, id, i);
                        placed = true;
                        break;
                    }
                }
                if (placed) return;

                // 2) 현재 스텝이 꽉 찼다면, 이후 스텝에서 빈 칸을 탐색
                for (let next = 0; next < steps.length; next++) {
                    if (next === sIdx) continue;
                    const grid2 = stepLayouts[next];
                    if (!grid2) continue;

                    const st2 = steps[next];
                    const total2 = grid2.itemSlots.length;
                    if (!total2) continue;

                    const used2 = new Set<number>();
                    const slotMap2 = st2.itemSlotById ?? {};
                    st2.itemIds.forEach((iid) => {
                        const ii = slotMap2[iid];
                        if (typeof ii === "number") used2.add(ii);
                    });

                    let found = -1;
                    for (let i = 0; i < total2; i++) {
                        if (!used2.has(i)) {
                            found = i;
                            break;
                        }
                    }
                    if (found >= 0) {
                        // 옮기고 해당 슬롯에 배치
                        moveItemAcrossSteps(id, st.id, st2.id);
                        placeItem(st2.id, id, found);
                        break;
                    }
                }
            });
        });

        // 텍스트(옵션)는 기존 그대로
        steps.forEach((st, sIdx) => {
            const grid = stepLayouts[sIdx];
            if (!grid) return;
            const total = grid.textSlots.length;
            if (!total) return;

            const used = new Set<number>();
            const slotMap = st.textSlotById ?? {};
            st.textIds.forEach((id) => {
                const idx = slotMap[id];
                if (typeof idx === "number") used.add(idx);
            });
            st.textIds.forEach((id) => {
                const idx = slotMap[id];
                if (typeof idx === "number") return;
                for (let i = 0; i < total; i++) {
                    if (!used.has(i)) {
                        used.add(i);
                        placeText(st.id, id, i);
                        break;
                    }
                }
            });
        });
    }, [background, steps, placeItem, placeText, moveItemAcrossSteps, stepLayouts]);

    // 픽셀 좌표로 변환
    const toPx = (slot: { x: number; y: number }) => ({
        x: slot.x * size.w,
        y: slot.y * size.h,
    });

    // 특정 스텝에서 "해당 슬롯이 점유되었는지" 빠르게 판단
    const occupiedByStep = useMemo(() => {
        return steps.map((st) => {
            const m = new Map<number, number>(); // slotIndex -> itemId
            const map = st.itemSlotById ?? {};
            st.itemIds.forEach((id) => {
                const idx = map[id];
                if (typeof idx === "number") m.set(idx, id);
            });
            return m;
        });
    }, [steps]);

    // 드래그 시작
    const onDragStart = (e: DragStartEvent) => {
        const id = String(e.active.id); // "item-<stepId>-<itemId>"
        if (!id.startsWith("item-")) return;
        const [, stepStr, itemStr] = id.split("-");
        const stepId = Number(stepStr);
        const itemId = Number(itemStr);
        const st = steps.find((s) => s.id === stepId);
        const originSlot = st?.itemSlotById?.[itemId];
        setActive({ stepId, itemId, originSlot });
    };

    const onDragEnd = (e: DragEndEvent) => {
        const id = String(e.active.id);
        if (!id.startsWith("item-")) {
            setActive(null);
            return;
        }
        const [, stepStr, itemStr] = id.split("-");
        const fromStepId = Number(stepStr);
        const itemId = Number(itemStr);
    
        if (!containerRef.current) {
            setActive(null);
            return;
        }
    
        // 요소 중심 좌표 (널 가드)
        const rect =
            e.active.rect.current?.translated ??
            e.active.rect.current?.initial ??
            null;
        if (!rect) {
            setActive(null);
            return;
        }
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const box = containerRef.current.getBoundingClientRect();
        const px = centerX - box.left;
        const py = centerY - box.top;
    
        // 모든 스텝의 모든 슬롯 중, 비어있는 최근접 후보 탐색
        const stepLayouts = layoutRegistry[background] ?? [];
        let best = { sIdx: -1, slot: -1, d2: Number.POSITIVE_INFINITY };
    
        for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const grid = stepLayouts[sIdx];
            if (!grid) continue;
    
            // 점유 슬롯(본인 슬롯은 비워둔 것으로 간주)
            const occ = new Map<number, number>();
            const st = steps[sIdx];
            const byId = st.itemSlotById ?? {};
            st.itemIds.forEach((iid) => {
                const ii = byId[iid];
                if (typeof ii === "number") occ.set(ii, iid);
            });
            if (typeof active?.originSlot === "number" && fromStepId === st.id) {
                if (occ.get(active.originSlot) === itemId) occ.delete(active.originSlot);
            }
    
            grid.itemSlots.forEach((slot, i) => {
                if (occ.has(i)) return;
                const p = toPx(slot);
                const dx = p.x - px;
                const dy = p.y - py;
                const d2 = dx * dx + dy * dy;
                if (d2 < best.d2) best = { sIdx, slot: i, d2 };
            });
        }
    
        if (best.sIdx < 0 || best.slot < 0) {
            setActive(null);
            return; // 드롭 불가 → 원위치
        }
    
        const toStepId = steps[best.sIdx].id;
    
        if (toStepId !== fromStepId) {
            moveItemAcrossSteps(itemId, fromStepId, toStepId);
        }
        placeItem(toStepId, itemId, best.slot);
        setActive(null);
    };

    return (
        <div className="relative w-full" style={{ height: "calc(100vh - 144px)" }}>
            {/* 배경 이미지: 자산 경로 규칙에 맞춰 교체 */}
            <BackgroundImage bg={background} />

            {/* 캔버스 컨테이너 (격자/아이템/텍스트 모두 이 안에 절대배치) */}
            <div ref={containerRef} className="absolute inset-0 overflow-hidden">
                <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    {/* 아이템들 */}
                    {steps.map((st, sIdx) => {
                        const grid = stepLayouts[sIdx];
                        if (!grid) return null;
                        const map = st.itemSlotById ?? {};
                        return st.itemIds.map((itemId) => {
                            const item = items.find((it) => it.id === itemId);
                            if (!item) return null;
                            const idx = map[itemId];
                            if (typeof idx !== "number") return null;
                            const base = toPx(grid.itemSlots[idx]);
                            return (
                                <DraggableItem
                                    key={`i-${st.id}-${itemId}`}
                                    id={`item-${st.id}-${itemId}`}
                                    x={base.x}
                                    y={base.y}
                                    imgUrl={`https://packupapi.xyz/images/object/${item.cate}/${item.name}.png`}
                                />
                            );
                        });
                    })}

                    {/* 텍스트 박스 (드래그 이동은 추후 필요 시 추가) */}
                    {steps.map((st, sIdx) => {
                        const grid = stepLayouts[sIdx];
                        if (!grid) return null;
                        const map = st.textSlotById ?? {};
                        return st.textIds.map((textId) => {
                            const tx = texts.find((t) => t.id === textId);
                            if (!tx) return null;
                            const idx = map[textId];
                            if (typeof idx !== "number") return null;
                            const base = toPx(grid.textSlots[idx]);
                            return (
                                <TextBubble key={`t-${st.id}-${textId}`} x={base.x} y={base.y} value={tx.value} />
                            );
                        });
                    })}

                    {/* 드래그 가이드(가능/불가 슬롯 시각화) */}
                    {active && (
                        <GridGuide
                            stepIndex={steps.findIndex((s) => s.id === active.stepId)}
                            background={background}
                            occupied={occupiedByStep}
                            size={size}
                            active={active}
                        />
                    )}
                </DndContext>
            </div>
        </div>
    );
}

function BackgroundImage({ bg }: { bg: BackgroundKey }) {
    // bg 예: "office-1" | "daily-3" | "trip-4"
    type CatKey = "office" | "daily" | "trip";
    const CAT_NO: Record<CatKey, number> = { office: 1, daily: 2, trip: 3 };

    const [catKey, stepStr] = bg.split("-") as [CatKey, string];
    const src = `/cate-${CAT_NO[catKey]}-step-${stepStr}.svg`;

    return (
        <img
            src={src}
            alt={bg}
            className="absolute inset-0 w-[800px] h-[800px] object-contain pointer-events-none select-none"
            draggable={false}
        />
    );
}

function DraggableItem(props: { id: string; x: number; y: number; imgUrl: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: props.id });

    // dnd-kit에서 내려주는 이동량을 기존 중앙정렬 translate와 결합
    const dragTranslate = transform ? ` translate3d(${transform.x}px, ${transform.y}px, 0)` : "";

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            id={props.id}
            style={{
                position: "absolute",
                left: props.x,
                top: props.y,
                transform: `translate(-50%, -50%)${dragTranslate}`,
                width: 72,
                height: 72,
                pointerEvents: "auto",
                touchAction: "none",
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: isDragging ? 10 : 1, // 드래그 중 위로
                willChange: "transform",
            }}
        >
            <img
                src={props.imgUrl}
                alt=""
                className="w-full h-full object-contain select-none"
                draggable={false}
            />
        </div>
    );
}

function TextBubble({ x, y, value }: { x: number; y: number; value: string }) {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                minWidth: 140,
                maxWidth: 220,
            }}
            className="px-3 py-2 rounded-lg bg-white/90 border border-[#CCC] text-[#141414] text-sm leading-snug pointer-events-none"
        >
            {value || "텍스트"}
        </div>
    );
}

/** 드래그 중에만 등장하는 그리드 가이드(초록=가능, 빨강=점유중) */
function GridGuide(props: {
    stepIndex: number;
    background: BackgroundKey;
    occupied: Map<number, number>[];
    size: { w: number; h: number };
    active: ActiveItem;
}) {
    const { stepIndex, background, occupied, size, active } = props;
    const grid = layoutRegistry[background]?.[stepIndex];
    if (!grid) return null;

    // 점유 슬롯 집합
    const occMap = occupied[stepIndex] ?? new Map<number, number>();
    const occ = new Set<number>(Array.from(occMap.keys()));

    return (
        <div className="absolute inset-0 pointer-events-none">
            {grid.itemSlots.map((slot, i) => {
                const p = { x: slot.x * size.w, y: slot.y * size.h };
                const isBlocked = occ.has(i) && active.originSlot !== i; // 내가 점유하던 칸은 허용
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: p.x,
                            top: p.y,
                            transform: "translate(-50%, -50%)",
                            width: 43,
                            height: 74,
                            clipPath: "polygon(0% 33.8%, 100% 0%, 100% 66.2%, 0% 100%)",
                            background: isBlocked ? "#B54F2C" : "#78C170",
                        }}
                    />
                );
            })}
        </div>
    );
}
