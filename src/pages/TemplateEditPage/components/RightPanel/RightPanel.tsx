import { useMemo } from "react";
import { useEditorStore } from "../../../../stores/editorStore";
import type { PanelMode } from "../../../../stores/editorStore";
import AddItemPanel from "./AddItemPanel";
import EditStepPanel from "./EditStepPanel";
import EditItemPanel from "./EditItemPanel";
import EditTextPanel from "./EditTextPanel";

export default function RightPanel() {
    const mode = useEditorStore((s) => s.mode);
    const setMode = useEditorStore((s) => s.setMode);

    const isAttr = mode !== "ADD_ITEM";

    return (
        <aside className="flex px-4 pt-4 pb-0 flex-col items-start gap-4 self-stretch">
            {/* 1차 탭 */}
            <div className="flex w-[400px] p-2 items-center rounded-xl bg-[#E5E5E5]">
                <TopTab
                    active={mode === "ADD_ITEM"}
                    onClick={() => setMode("ADD_ITEM")}
                >
                    준비물 추가
                </TopTab>
                <TopTab
                    active={isAttr}
                    onClick={() => {
                        if (mode === "ADD_ITEM") setMode("EDIT_STEP");
                    }}
                >
                    속성
                </TopTab>
            </div>

            {/* 내용 영역 */}
            <div className="flex-1 overflow-hidden min-h-0">
                {mode === "ADD_ITEM" ? (
                    // 준비물 추가
                    <div className="h-full">
                        <AddItemPanel />
                    </div>
                ) : (
                    // 속성
                    <AttrPanels />
                )}
            </div>
        </aside>
    );
}

function TopTab({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-[38px] py-4 justify-center items-center gap-2 [flex:1_0_0] text-center font-pretendard text-lg font-semibold leading-normal
            ${active ? "rounded-[10px] bg-white text-[#141414]" : "text-[#4D4D4D]"}`}
        >
            {children}
        </button>
    );
}

function AttrPanels() {
    const mode = useEditorStore((s) => s.mode);
    const setMode = useEditorStore((s) => s.setMode);

    const tabs = useMemo(
        () =>
            [
                { key: "EDIT_STEP", label: "스텝" },
                { key: "EDIT_ITEM", label: "준비물" },
                { key: "EDIT_TEXT", label: "텍스트 박스" },
            ] as Array<{ key: Exclude<PanelMode, "ADD_ITEM">; label: string }>,
        []
    );

    return (
        <div className="h-full flex flex-col gap-4">
            {/* 2차 탭 */}
            <div className="sticky top-0 z-10 flex items-center self-stretch">
                {tabs.map((t) => (
                    <AttrTab
                        key={t.key}
                        label={t.label}
                        active={mode === t.key}
                        onClick={() => setMode(t.key)}
                    />
                ))}
            </div>
            {/* 실제 콘텐츠 */}
            {mode === "EDIT_STEP" && <EditStepPanel />}
            {mode === "EDIT_ITEM" && <EditItemPanel />}
            {mode === "EDIT_TEXT" && <EditTextPanel />}
        </div>
    );
}

function AttrTab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-[50px] py-4 justify-center items-center gap-2 [flex:1_0_0] text-center font-pretendard text-lg font-semibold leading-normal
            ${active ? "border-b-[3px] border-[#775CFF] text-[#141414]" : "text-[#949494]"}`}
        >
            {label}
        </button>
    );
}
