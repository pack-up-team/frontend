import { useEffect } from "react";
import { CloseIcon } from "../../../assets";
import Button from "../../../components/Button";

type DeleteConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
    // ESC로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="flex w-[356px] p-[16px_24px_24px_24px] flex-col justify-center items-center gap-[32px] rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
                <div className="flex flex-col items-center gap-[16px] self-stretch">
                    <div className="flex h-[44px] justify-between items-center self-stretch">
                        <div className="w-11 h-11"></div>
                        <h2 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">삭제 확인</h2>
                        <div className="flex h-[44px] p-[10px_0_10px_20px] justify-end items-center">
                            <button onClick={onClose} className="w-6 h-6"><CloseIcon className="w-6 h-6" /></button>
                        </div>
                    </div>
                    <p className="text-[#4D4D4D] text-center font-pretendard text-[16px] font-medium leading-[140%]">정말 템플릿을 삭제하시겠어요?</p>
                </div>
                <div className="flex flex-col items-start gap-[32px] self-stretch">
                    <div className="flex items-center gap-4 self-stretch">
                        <Button variant="line" onClick={onClose} className="flex-1 h-[50px]">취소</Button>
                        <Button onClick={onConfirm} className="flex-1 h-[50px]">삭제</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
