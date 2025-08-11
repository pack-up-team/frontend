import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../components/Button";
import { CloseIcon } from "../../../assets";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onPick: (type: "new" | "preset") => void;
};

const ensureRoot = () => {
    if (typeof document === "undefined") return null;
    let el = document.getElementById("modal-root");
    if (!el) {
        el = document.createElement("div");
        el.id = "modal-root";
        document.body.appendChild(el);
    }
    return el;
};

export default function AddTemplateTypeModal({ isOpen, onClose, onPick }: Props) {
    const root = ensureRoot();
    const [picked, setPicked] = useState<"new" | "preset" | null>("new");

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    // 모달 열릴 때 선택 초기화
    useEffect(() => {
        if (isOpen) setPicked("new");
    }, [isOpen]);

    if (!isOpen || !root) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
            {/* dim */}
            <button aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/50" />
            {/* 모달창 */}
            <div role="dialog" aria-modal="true" className="z-[9999] inline-flex p-[16px_24px_24px_24px] flex-col justify-center items-center gap-4 rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
                {/* header */}
                <div className="flex h-11 justify-between items-center self-stretch">
                    <div className="w-11 h-11"></div>
                    <h2 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">생성할 템플릿 유형을 선택하세요.</h2>
                    <div className="flex h-[44px] p-[10px_0_10px_20px] justify-end items-center">
                        <button onClick={onClose} className="w-6 h-6 cursor-pointer"><CloseIcon className="w-6 h-6" /></button>
                    </div>
                </div>
                {/* contents */}
                <div className="flex flex-col items-start gap-[32px] self-stretch">
                    {/* steps */}
                    <div className="flex items-start gap-4">
                        <button onClick={() => setPicked("new")}
                        className={`flex w-[204px] p-4 flex-col items-start gap-4 rounded-2xl border-2 focus:outline-none focus-visible:outline-none ${picked === "new" ? "border-[#A593FF] bg-[#F6F4FF]" : "border-[#F0F0F0]"}`}>
                            <div className="w-full flex flex-col items-start gap-2 self-stretch text-left">
                                <h3 className="text-[rgba(0,0,0,0.90)] font-pretendard text-[20px] font-semibold leading-normal">신규 템플릿</h3>
                                <p className="mb-6 self-stretch text-[rgba(0,0,0,0.64)] font-pretendard text-base font-medium leading-normal">빈 캔버스에서 처음부터 템플릿을 생성합니다.</p>
                            </div>
                            <div className="flex items-center justify-center h-[200px] self-stretch rounded-[16px] bg-[rgba(0,0,0,0.04)]">이미지 추가 필요</div>
                        </button>
                        <button onClick={() => setPicked("preset")}
                        className={`flex w-[204px] p-4 flex-col items-start gap-4 rounded-2xl border-2 focus:outline-none focus-visible:outline-none ${picked === "preset" ? "border-[#A593FF] bg-[#F6F4FF]" : "border-[#F0F0F0]"}`}>
                            <div className="w-full flex flex-col items-start gap-2 self-stretch text-left">
                                <h3 className="text-[rgba(0,0,0,0.90)] font-pretendard text-[20px] font-semibold leading-normal">간편 템플릿</h3>
                                <p className="self-stretch text-[rgba(0,0,0,0.64)] font-pretendard text-base font-medium leading-normal">스텝과 준비물, 상세 내용이 입력된 할일 템플릿을 선택해 불러옵니다.</p>
                            </div>
                            <div className="flex items-center justify-center h-[200px] self-stretch rounded-[16px] bg-[rgba(0,0,0,0.04)]">이미지 추가 필요</div>
                        </button>
                    </div>
                    {/* actions */}
                    <div className="flex items-center gap-4 self-stretch">
                        <Button variant="line" onClick={onClose} className="flex-1 h-[50px]">닫기</Button>
                        <Button disabled={!picked} onClick={() => { if (picked) onPick(picked); }} className="flex-1 h-[50px]">선택</Button>
                    </div>
                </div>
            </div>
        </div>,
        root
    );
}