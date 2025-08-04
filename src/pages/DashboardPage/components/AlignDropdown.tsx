import { useState, useRef, useEffect } from "react";
import { ArrowIcon } from "../../../assets";

type AlignDropdownProps = {
    selectedAlign?: string;
    onAlignChange: (option: string) => void;
};

const alignOptions = ["최근 수정일", "최근 생성일", "알림 시간 임박", "템플릿명"];

const AlignDropdown: React.FC<AlignDropdownProps> = ({ selectedAlign = '최근 수정일', onAlignChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            {/* 선택된 정렬 기준 버튼 */}
            <button onClick={() => setOpen(!open)} className="flex w-[169px] h-[44px] px-[16px] py-[8px] justify-between items-center rounded-[8px] border border-[#CCC]">
                <span className="flex-[1_0_0] text-[#949494] font-pretendard text-[16px] font-medium leading-normal">{selectedAlign}</span>
                <ArrowIcon className="w-[38px] h-[38px]" />
            </button>
            {/* 드롭다운 */}
            {open && (
                <div className="z-50 absolute right-0 top-[44px] flex w-[169px] px-[16px] py-[12px] items-center rounded-[8px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
                    <div className="flex flex-col items-start gap-3">
                        {alignOptions.map((option) => (
                            <button key={option} onClick={() => { onAlignChange(option); setOpen(false); }} className="flex h-[36px] justify-center items-center gap-[8px]">
                                <span className={`font-pretendard text-[16px] font-medium leading-normal ${selectedAlign === option ? "text-[rgba(0,0,0,0.7)]" : "text-[#949494]"}`}>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlignDropdown;
