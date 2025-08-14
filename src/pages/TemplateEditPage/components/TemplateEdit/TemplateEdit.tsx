import { useEffect, useMemo, useRef, useState } from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, DragMoveEvent } from "@dnd-kit/core";
import { useEditorStore } from "../../../../stores/editorStore";
import { layoutRegistry, bgStepCount } from "./layoutRegistry";
import type { BackgroundKey } from "./layoutRegistry";
import StepText from "../../../TemplateViewPage/components/StepText";

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
    const CANVAS = 800;
    const DELETE_MARGIN = 32; // 캔버스 밖 판정 여유 px

    // 드래그 중 상태(가이드 표시용)
    const [active, setActive] = useState<ActiveItem | null>(null);
    const [deletePreview, setDeletePreview] = useState(false); // 밖으로 나가면 삭제 미리보기

    // 캔버스(0..800) 밖인지 판단
    const isOutsideCanvas = (p: { x: number; y: number }) => {
        return (
            p.x < -DELETE_MARGIN || p.x > CANVAS + DELETE_MARGIN ||
            p.y < -DELETE_MARGIN || p.y > CANVAS + DELETE_MARGIN
        );
    };

    // dnd 센서
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

    // 포인터 좌표 안정화 & 드롭 미리보기(예상 착지)
    const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null);
    const [hover, setHover] = useState<{ sIdx: number; slot: number } | null>(null);

    // 현재 배경의 레이아웃(스텝별 슬롯들)
    const stepLayouts = useMemo(() => layoutRegistry[background] ?? [], [background]);
    useEffect(() => {
        // background에서 스텝 개수 추출
        const expectedSteps = bgStepCount(background);
        
        // 현재 스텝 개수와 다르면 조정
        if (steps.length !== expectedSteps) {
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

        // 텍스트
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
        x: slot.x * CANVAS,
        y: slot.y * CANVAS,
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

    // 공통: 이벤트에서 컨테이너 기준 포인터(=드래그 아이템 중심) 추출
    const getPointerInCanvas = (e: DragMoveEvent | DragEndEvent): { x: number; y: number } | null => {
        if (!containerRef.current) return null;
        const rect =
            e.active.rect.current?.translated ??
            e.active.rect.current?.initial ??
            null;
        if (!rect) return null;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const box = containerRef.current.getBoundingClientRect();
        return { x: centerX - box.left, y: centerY - box.top };
    };

    // 공통: 최근접 빈 슬롯 찾기 (거리 계산 정리)
    const findNearestVacant = (
        px: number,
        py: number,
        fromStepId: number,
        itemId: number,
        originSlot: number | undefined
    ): { sIdx: number; slot: number } | null => {
        let best = { sIdx: -1, slot: -1, d2: Number.POSITIVE_INFINITY };

        for (let sIdx = 0; sIdx < steps.length; sIdx++) {
            const grid = stepLayouts[sIdx];
            if (!grid) continue;

            // 점유 슬롯(본인 원래 칸은 비워둔 것으로 간주)
            const occ = new Map<number, number>(occupiedByStep[sIdx] ?? new Map());
            if (typeof originSlot === "number" && steps[sIdx].id === fromStepId) {
                if (occ.get(originSlot) === itemId) occ.delete(originSlot);
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

        return best.sIdx >= 0 ? { sIdx: best.sIdx, slot: best.slot } : null;
    };

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

    // 드래그 이동(미리보기 하이라이트)
    const onDragMove = (e: DragMoveEvent) => {
        const id = String(e.active.id);
        if (!id.startsWith("item-") || !active) return;
        const [, stepStr, itemStr] = id.split("-");
        const fromStepId = Number(stepStr);
        const itemId = Number(itemStr);

        const p = getPointerInCanvas(e);
        if (!p) return;
        setLastPointer(p);

        // 캔버스 밖이면: 삭제 미리보기 ON, 하이라이트 해제
        if (isOutsideCanvas(p)) {
            setDeletePreview(true);
            setHover(null);
            return;
        }

        setDeletePreview(false);
        const best = findNearestVacant(p.x, p.y, fromStepId, itemId, active.originSlot);
        setHover(best);
    };

    // 드래그 종료(스냅 배치)
    const onDragEnd = (e: DragEndEvent) => {
        const id = String(e.active.id);
        if (!id.startsWith("item-")) {
            setActive(null);
            setHover(null);
            setLastPointer(null);
            return;
        }
        const [, stepStr, itemStr] = id.split("-");
        const fromStepId = Number(stepStr);
        const itemId = Number(itemStr);

        // 1) 좌표 안정화: 이동 중 저장된 좌표 우선, 없으면 이벤트로 계산
        const p = lastPointer ?? getPointerInCanvas(e);
        if (!p) {
            setActive(null);
            setHover(null);
            setLastPointer(null);
            setDeletePreview(false);
            return;
        }

        // 캔버스 밖으로 드롭 → 삭제 처리(해당 스텝에서 슬롯 -1)
        if (isOutsideCanvas(p)) {
            placeItem(fromStepId, itemId, -1);
            setActive(null);
            setHover(null);
            setLastPointer(null);
            setDeletePreview(false);
            return;
        }

        // 2) 최근접 빈 슬롯 찾기
        const best = findNearestVacant(p.x, p.y, fromStepId, itemId, active?.originSlot);
        if (!best) {
            setActive(null);
            setHover(null);
            setLastPointer(null);
            return; // 드롭 불가 → 원위치
        }

        // 3) 배치
        const toStepId = steps[best.sIdx].id;
        if (toStepId !== fromStepId) {
            moveItemAcrossSteps(itemId, fromStepId, toStepId);
        }
        placeItem(toStepId, itemId, best.slot);

        // 4) 정리
        setActive(null);
        setHover(null);
        setLastPointer(null);
        setDeletePreview(false);
    };

    return (
        <div className="relative w-full" style={{ height: "calc(100vh - 144px)" }}>
            {/* 캔버스 컨테이너 (배경+가이드+아이템이 같은 좌표계) */}
            <div ref={containerRef} className="relative w-[800px] h-[800px] bg-white overflow-hidden shrink-0">
                {/* 배경 이미지 */}
                <div className="absolute inset-0 w-[800px] h-[800px] pointer-events-none select-none z-0">
                    <BackgroundImage bg={background} />
                </div>
                {/* ✅ 삭제 미리보기: 반드시 컨테이너(800×800) 내부에서 absolute */}
                {deletePreview && (
                    <div className="absolute inset-0 pointer-events-none z-30">
                        <div className="absolute inset-0" style={{ background: "rgba(239,68,68,0.08)" }} />
                        <div
                            className="absolute"
                            style={{
                                left: 6, top: 6, right: 6, bottom: 6,
                                border: "3px dashed #EF4444",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                )}
                <DndContext sensors={sensors} onDragStart={onDragStart} onDragMove={onDragMove} onDragEnd={onDragEnd}>
                    {/* 가이드: 모든 스텝에 대해, 부모가 계산한 grid를 직접 전달 */}
                    {active && steps.map((st, sIdx) => {
                        const grid = stepLayouts[sIdx];
                        if (!grid) return null;
                        return (
                            <GridGuide
                                key={st.id}
                                stepIndex={sIdx}
                                occupied={occupiedByStep}
                                size={{ w: CANVAS, h: CANVAS }}
                                active={active}
                                highlightSlot={hover && hover.sIdx === sIdx ? hover.slot : -1}
                                grid={grid}
                            />
                        );
                    })}
                    {/* 아이템들 */}
                    {steps.map((st, sIdx) => {
                        const grid = stepLayouts[sIdx];
                        if (!grid) return null;
                        const map = st.itemSlotById ?? {};
                        return st.itemIds.map((itemId) => {
                            const item = items.find((it) => it.id === itemId);
                            if (!item) return null;
                            const idx = map[itemId];
                            // 삭제 표시(slot = -1)이면 렌더하지 않음
                            if (typeof idx !== "number" || idx < 0) return null;
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
                                <PositionedStepText key={`t-${st.id}-${textId}`} x={base.x} y={base.y} text={tx.value} />
                            );
                        });
                    })}
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

// 캔버스 좌표(x,y)에 템플릿 보기용 StepText를 절대배치해서 재사용
function PositionedStepText({ x, y, text }: { x: number; y: number; text: string }) {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                // 기본 배치 + 회전 30도 + 스큐 30도
                transform: `translate(-50%, -50%) rotate(-30deg) skewX(-30deg)`,
                transformOrigin: "50% 50%",
                zIndex: 2, // 평상시 아이템(zIndex:1) 위, 드래그 중 아이템(zIndex:10) 아래
            }}
            className="pointer-events-auto"
        >
            <StepText text={text || "텍스트"} />
        </div>
    );
}

/** 드래그 중에만 등장하는 그리드 가이드(초록=가능, 빨강=점유중) */
function GridGuide(props: {
    stepIndex: number;
    occupied: Map<number, number>[];
    size: { w: number; h: number };
    active: ActiveItem;
    highlightSlot?: number; // 예상 착지 슬롯 인덱스 (해당 스텝일 때만 유효)
    grid: {
        itemSlots: { x: number; y: number }[];
        textSlots: { x: number; y: number }[];
    };
}) {
    const { stepIndex, occupied, size, active, highlightSlot = -1, grid } = props;
    if (!grid) {
        return null;
    }

    // 점유 슬롯 집합
    const occMap = occupied[stepIndex] ?? new Map<number, number>();
    const occ = new Set<number>(Array.from(occMap.keys()));

    return (
        <div className="absolute inset-0 pointer-events-none">
            {grid.itemSlots.map((slot, i) => {
                const p = { x: slot.x * size.w, y: slot.y * size.h };
                const isBlocked = occ.has(i) && active.originSlot !== i; // 내가 점유하던 칸은 허용
                const isHL = i === highlightSlot;

                // 기본 색: 가능=초록, 점유=빨강. 하이라이트면 밝게 + 윤곽선
                const baseBg = isBlocked ? "#B54F2C" : "#78C170";
                const bg = isHL ? (isBlocked ? "#E08D7B" : "#9BE28A") : baseBg;
                const boxShadow = isHL ? "0 0 0 2px #FFF, 0 0 0 5px #5736FF" : undefined;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: p.x,
                            top: p.y,
                            transform: "translate(-50%, -50%)",
                            width: 43,
                            height: 78,
                            clipPath: "polygon(0% 32%, 100% 0%, 100% 68%, 0% 100%)",
                            background: bg,
                            boxShadow,
                        }}
                    />
                );
            })}
        </div>
    );
}
