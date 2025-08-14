import Modal from "./Modal";
import { useEditorStore } from "../../../../stores/editorStore";
import type { Category } from "../../../../stores/editorStore";

type Props = { open: boolean; onClose: () => void; };

export default function StepSelectModal({ open, onClose }: Props) {
  const background = useEditorStore(s => s.background);
  const stepsLen   = useEditorStore(s => s.steps.length);
  const setBackground = useEditorStore(s => s.setBackground);

  // 현재 배경 키에서 카테고리 추출 (e.g. "office-3" -> "office")
  const [catKey] = background.split("-") as [Category, string];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="스텝 선택"
      size="md"
      actions={<button onClick={onClose} className="h-10 px-3 rounded-lg border">닫기</button>}
    >
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((cnt) => (
          <button
            key={cnt}
            onClick={() => {
              // ✅ 배경키와 스텝수를 동시에 갱신 (스토어 내부에서 setStepCount도 같이 처리)
              setBackground(catKey, cnt as 1 | 2 | 3 | 4);
              onClose();
            }}
            className={`aspect-[4/5] rounded-xl border flex items-center justify-center text-sm hover:shadow
              ${stepsLen === cnt ? "border-[#5736FF] ring-2 ring-[#5736FF]/20" : ""}`}
          >
            {cnt} 스텝
          </button>
        ))}
      </div>
    </Modal>
  );
}
