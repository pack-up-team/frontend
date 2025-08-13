import { useEditorStore } from "../../../../stores/editorStore";
import { EditClickIcon } from "../../../../assets";
import Button from "../../../../components/Button";

export default function EditItemPanel() {
    const selectedItemId = useEditorStore((s) => s.selectedItemId);
    const item = useEditorStore((s) => s.items.find((it) => it.id === s.selectedItemId));
    const renameItem = useEditorStore((s) => s.renameItem);

    if (!selectedItemId || !item) {
        return (
            <div className="w-[400px] flex flex-col items-center gap-4 py-[100px] flex-1 self-stretch">
                <EditClickIcon className="w-[50px] h-[50px]" />
                <p className="text-[#707070] text-center font-pretendard text-base font-medium leading-[140%]">편집할 준비물을 클릭하세요.</p>
            </div>
        );
    }

    return (
        <div className="flex w-[400px] flex-col items-start gap-4">
            <div className="flex flex-col items-end gap-4 self-stretch">
                <div className="flex flex-col items-start gap-2 self-stretch">
                    <span className="text-[#4D4D4D] font-pretendard text-base font-medium leading-normal">이름</span>
                    <input
                        value={item.name}
                        placeholder="이름을 입력하세요"
                        onChange={(e) => renameItem(item.id, e.target.value)}
                        className="flex h-14 px-4 py-2 items-center gap-2 self-stretch rounded-lg border border-[#CCC] focus:border-[#141414] outline-none"
                    />
                </div>
                <div className="flex justify-end">
                    <Button disabled={!item.name} onClick={() => renameItem(item.id, "")} variant="line" className="w-[120px] h-[38px] !p-0 text-[#D90050]">삭제</Button>
                </div>
            </div>
        </div>
    );
}
