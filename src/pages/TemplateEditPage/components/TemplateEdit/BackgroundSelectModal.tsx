import Modal from "./Modal";
import { useEditorStore } from "../../../../stores/editorStore";
import type { Category } from "../../../../stores/editorStore";

type Props = { open: boolean; onClose: () => void; };

export default function BackgroundSelectModal({ open, onClose }: Props) {
  const bg = useEditorStore(s => s.background);
  const stepsCount = useEditorStore(s => s.steps.length) as 1|2|3|4;
  const setBackground = useEditorStore(s => s.setBackground);

  const cats: { key: Category; label: string }[] = [
    { key: "office", label: "업무" },
    { key: "daily",  label: "일상" },
    { key: "trip",   label: "여행" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="배경 선택" size="md"
      actions={<>
        <button onClick={onClose} className="h-10 px-3 rounded-lg border">닫기</button>
      </>}
    >
      <div className="grid grid-cols-3 gap-3">
        {cats.map(c => (
          <button
            key={c.key}
            onClick={() => { setBackground(c.key, stepsCount); onClose(); }}
            className={`aspect-square rounded-xl border flex items-center justify-center text-sm hover:shadow
                        ${bg.startsWith(c.key) ? "border-[#5736FF] ring-2 ring-[#5736FF]/20" : ""}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">* 스텝 개수는 현재 값({stepsCount})을 그대로 유지합니다.</p>
    </Modal>
  );
}
