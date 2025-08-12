import { useMemo } from "react";
import { useEditorStore } from "../../../../stores/editorStore";
import Button from "../../../../components/Button";
import { AddIcon, HandleIcon } from "../../../../assets";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MAX_PER_STEP = 3;

export default function EditTextPanel() {
    const steps = useEditorStore((s) => s.steps);
    const texts = useEditorStore((s) => s.texts);
    const addTextToStep = useEditorStore((s) => s.addTextToStep);
    const removeTextFromStep = useEditorStore((s) => s.removeTextFromStep);
    const setTextValue = useEditorStore((s) => s.setTextValue);
    const reorderTextInStep = useEditorStore((s) => s.reorderTextInStep);
    const selectText = useEditorStore((s) => s.selectText);
    const selectedTextId = useEditorStore((s) => s.selectedTextId);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

    const textMap = useMemo(() => {
        const m = new Map<number, string>();
        texts.forEach((t) => m.set(t.id, t.value));
        return m;
    }, [texts]);

    if (!steps || steps.length === 0) {
        return <p className="text-sm text-gray-500">스텝이 없습니다.</p>;
    }

    return (
        <div className="flex w-[400px] h-full items-start gap-1 min-h-0 overflow-y-auto pr-[10px]">
            <div className="flex flex-col items-start gap-4 flex-1">
                {steps.map((st, sIdx) => {
                    const ids = st.textIds;
                    console.log(ids);
                    const count = ids.length;
                    const canAdd = count < MAX_PER_STEP;

                    const onDragStart = (e: DragStartEvent) => {
                        const idNum = Number(e.active.id);
                        selectText(idNum); // 클릭/드래그 시작 시 선택(회색 하이라이트)
                    };

                    const onDragEnd = (e: DragEndEvent) => {
                        const { active, over } = e;
                        if (!over) return;
                        const from = ids.findIndex((x) => String(x) === String(active.id));
                        const to = ids.findIndex((x) => String(x) === String(over.id));
                        if (from !== -1 && to !== -1 && from !== to) {
                            reorderTextInStep(st.id, from, to);
                        }
                        selectText(-1);
                        (document.activeElement as HTMLElement)?.blur(); // 포커스 해제
                    };

                    return (
                        <>
                        <section key={st.id} className="flex flex-col items-start gap-4 self-stretch">
                            <div className="flex justify-between items-center self-stretch">
                                <div className="flex w-[189px] items-center gap-4">
                                    <span className="text-[#141414] font-pretendard text-base font-bold leading-normal">{`스텝 ${sIdx + 1}`}</span>
                                    <span className="text-[#949494] font-pretendard text-base font-medium leading-normal">
                                        <span className={count !== 0 ? "text-[#411BFF]" : ""}>{`${count}`}</span>{`/${MAX_PER_STEP}`}
                                    </span>
                                </div>
                                <Button disabled={!canAdd} onClick={() => canAdd && addTextToStep(st.id)} className="w-[120px] h-[38px] !p-0">
                                    <AddIcon className="w-[18px] h-[18px]" />
                                    <span className="text-white text-center font-pretendard text-[16px] font-medium leading-normal">추가</span>
                                </Button>
                            </div>

                            {count === 0 ? (
                                <p className="mx-auto text-[#707070] text-center font-pretendard text-base font-medium leading-[140%]">텍스트 박스가 없습니다.</p>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={onDragStart}
                                    onDragEnd={onDragEnd}
                                >
                                    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                                        <>
                                        {ids.map((tid, idx) => (
                                            <SortableTextCard
                                                key={tid}
                                                id={tid}
                                                index={idx}
                                                value={textMap.get(tid) ?? ""}
                                                selected={selectedTextId === tid} // 핸들 클릭 시 bg-[#F0F0F0]
                                                onSelect={() => selectText(tid)}
                                                onChange={(v) => setTextValue(tid, v)}
                                                onRemove={() => removeTextFromStep(st.id, tid)}
                                            />
                                        ))}
                                        </>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </section>
                        {/* 스텝 사이 divider */}
                        {sIdx < steps.length - 1 && (
                            <div className="h-0 self-stretch">
                                <svg xmlns="http://www.w3.org/2000/svg" width="390" height="3" viewBox="0 0 390 3" fill="none">
                                    <path d="M0.0078125 1.24805H390.008" stroke="#F0F0F0" stroke-width="2"/>
                                </svg>
                            </div>
                        )}
                        </>
                    );
                })}
            </div>
        </div>
    );
}

type SortableTextCardProps = {
    id: number;
    index: number;
    value: string;
    selected: boolean;
    onSelect: () => void;
    onChange: (v: string) => void;
    onRemove: () => void;
};

function SortableTextCard(props: SortableTextCardProps) {
    const { id, index, value, selected, onSelect, onChange, onRemove } = props;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={`group flex w-[390px] p-2 justify-end items-start gap-2 ${selected || isDragging ? "rounded bg-[#F0F0F0]" : ""}`}>
            <div className="flex flex-col items-end gap-4 [flex:1_0_0]">
                <div className="flex flex-col items-start gap-2 self-stretch">
                    <span className="text-[#4D4D4D] font-pretendard text-base font-medium leading-normal">{`텍스트 박스 ${index + 1}`}</span>
                    <textarea maxLength={45} placeholder="메모할 내용을 적어주세요(45자)" value={value} onChange={(e) => onChange(e.target.value)}
                        className="focus:outline-none focus:border-[#141414] resize-none flex h-20 p-4 items-start gap-2 self-stretch rounded-lg border border-[#CCC]
                        placeholder-[#949494] placeholder-pretendard placeholder-text-[16px] placeholder-font-medium placeholder-leading-none"
                    />
                </div>
                <div className="flex justify-end">
                    <Button variant="line" onClick={onRemove} className="w-[120px] h-[38px] !p-0 text-[#D90050]">삭제</Button>
                </div>
            </div>
            {/* 드래그 핸들: 이 버튼으로만 드래그되도록 listeners 부착 */}
            <button className={`flex w-4 h-[161px] flex-col justify-center items-center flex-shrink-0
            opacity-0 group-hover:opacity-100 focus:opacity-100 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={onSelect} {...attributes} {...listeners} title="드래그로 순서 변경">
                <HandleIcon className="w-[18px] h-[18px]" />
            </button>
        </div>
    );
}
