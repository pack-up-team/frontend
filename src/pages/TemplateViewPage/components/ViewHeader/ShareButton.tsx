import { useState, useRef, useEffect } from "react";
import Button from "../../../../components/Button";
import { ViewShareIcon, ViewLinkIcon, ViewCheckboxIcon, ViewKakaoIcon, ViewInstaIcon } from "../../../../assets";

const ShareButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫힘 처리
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // 공유 핸들러
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2초 후에 원래 상태로 복귀
        } catch {
            alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
        }
    };
    const handleKakaoShare = () => {
        // TODO: 카카오톡 공유 로직 구현 예정
    };
    const handleInstagramShare = () => {
        // TODO: 인스타그램 공유 로직 구현 예정
    };

    return (
        <div className="w-[145px] relative" ref={dropdownRef}>
            {/* 공유하기 버튼 */}
            <Button onClick={() => setIsOpen((prev) => !prev)} variant="line" className="!p-0 w-[145px] h-[44px]">
                <ViewShareIcon className="w-[18px] h-[18px]" />
                공유하기
            </Button>

            {/* 드롭다운 */}
            {isOpen && (
                <div className="absolute right-0 top-11 z-20 w-[145px] inline-flex px-[16px] py-[12px] items-center rounded-lg bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
                    <div className="flex flex-col items-start gap-3">
                        <button onClick={handleCopyLink} className="flex h-[36px] justify-center items-center gap-2">
                            {!copied ? <ViewLinkIcon className="w-[18px] h-[18px]" /> : <ViewCheckboxIcon className="w-[18px] h-[18px]" />}
                            {!copied
                            ? <p className="whitespace-nowrap text-black/70 font-pretendard text-[16px] font-medium leading-none">링크 복사하기</p>
                            : <p className="whitespace-nowrap text-black/70 font-pretendard text-[16px] font-medium leading-none">링크 복사완료</p>}
                        </button>
                        <button onClick={handleKakaoShare} className="flex h-[36px] items-center gap-2 self-stretch">
                            <ViewKakaoIcon className="w-[18px] h-[18px]" />
                            <p className="whitespace-nowrap text-black/70 font-pretendard text-[16px] font-medium leading-none">카카오</p>
                        </button>
                        <button onClick={handleInstagramShare} className="flex h-[36px] items-center gap-2 self-stretch">
                            <ViewInstaIcon className="w-[18px] h-[18px]" />
                            <p className="whitespace-nowrap text-black/70 font-pretendard text-[16px] font-medium leading-none">인스타그램</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareButton;
