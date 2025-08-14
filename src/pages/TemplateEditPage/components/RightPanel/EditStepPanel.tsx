import { useEditorStore } from "../../../../stores/editorStore";

export default function EditStepPanel() {
    const steps = useEditorStore((s) => s.steps);
    const selectedStepId = useEditorStore((s) => s.selectedStepId);
    const setStepLabel = useEditorStore((s) => s.setStepLabel);
    const selectStep = useEditorStore((s) => s.selectStep);

    if (!steps || steps.length === 0) {
        return <p className="text-sm text-gray-500">스텝이 없습니다.</p>;
    }

    return (
        <div className="flex w-[400px] flex-col items-start gap-4">
            <h3 className="text-[#141414] font-pretendard text-base font-bold leading-normal self-stretch">스텝 편집</h3>

            {steps.map((st, idx) => (
                <div key={st.id} className="flex flex-col items-start gap-2 self-stretch">
                    <span className="text-[#4D4D4D] font-pretendard text-base font-medium leading-normal">{`STEP${idx + 1}`}</span>
                    <input
                        value={st.label ?? ""}
                        onFocus={() => selectStep(st.id)}
                        onChange={(e) => setStepLabel(st.id, e.target.value)}
                        placeholder={st.name}
                        className={`flex h-14 px-4 py-2 items-center gap-2 self-stretch rounded-lg border ${
                            selectedStepId === st.id ? "border-[#141414]" : "border-[#CCC]"
                        }`}
                    />
                </div>
            ))}
        </div>
    );
}
