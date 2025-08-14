import { useState } from "react";

type Props = {
  title?: string;
  onChangeTitle?: (v: string) => void;
  onOpenStepModal: () => void;
  onOpenBackgroundModal: () => void;
  onOpenPreview: () => void;
  onSave: () => void;
};

export default function HeaderBar({
  title = "",
  onChangeTitle,
  onOpenStepModal,
  onOpenBackgroundModal,
  onOpenPreview,
  onSave,
}: Props) {
  const [local, setLocal] = useState(title);

  return (
    <div className="w-full h-[72px] bg-white border-b flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <div className="text-[#5736FF] font-bold">pack-up</div>
        <div className="w-px h-5 bg-[#E5E7EB]" />
        <input
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            onChangeTitle?.(e.target.value);
          }}
          placeholder="템플릿 제목을 입력하세요"
          className="h-10 px-3 rounded-lg border bg-[#141414] text-white placeholder:text-[#AAA] outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onOpenBackgroundModal} className="h-10 px-3 rounded-lg border">배경 선택</button>
        <button onClick={onOpenStepModal} className="h-10 px-3 rounded-lg border">스텝 선택</button>
        <button onClick={onOpenPreview} className="h-10 px-3 rounded-lg border">미리보기</button>
        <button onClick={onSave} className="h-10 px-4 rounded-lg bg-[#5736FF] text-white font-semibold">
          템플릿 저장
        </button>
      </div>
    </div>
  );
}
