import { useState, useRef, useEffect } from "react";
import type { TemplateListItem } from "../../../stores/templateListStore";
import DropdownMenu from "./DropdownMenu";
import { BookmarkOffIcon, BookmarkOnIcon, MoreIcon } from "../../../assets";

type TemplateCardSmallProps = {
    template: TemplateListItem;
    onRename: (templateNo: number) => void;
    onEdit: (templateNo: number) => void;
    onDuplicate: (templateNo: number) => void;
    onDelete: (templateNo: number) => void;
};

const TemplateCardSmall: React.FC<TemplateCardSmallProps> = ({
    template,
    onRename,
    onEdit,
    onDuplicate,
    onDelete,
}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(template.isBookmarked ?? false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleBookmark = () => {
        setBookmarked((prev) => !prev);
        // TODO: 백엔드 API 호출해서 북마크 상태 업데이트
    };

    // DropdownMenu 바깥을 클릭하면 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className="relative flex p-[16px_16px_32px_16px] flex-col items-start gap-[8px] rounded-[16px] border-[2px] border-[#F0F0F0] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
            {/* 썸네일 */}
            <div className="flex w-[240px] h-[240px] p-[8px_8px_194px_148px] justify-end items-center rounded-[16px] bg-cover bg-center"
            style={{ backgroundImage: `url(${template.thumbnail})` }}>
                <div ref={dropdownRef} className="absolute top-6 right-6 flex items-center gap-2">
                    {/* 북마크 버튼 */}
                    <button onClick={toggleBookmark} className="flex w-[38px] h-[38px] p-[7px] justify-center items-center rounded-[12px] bg-[rgba(255,255,255,0.24)]">
                        {bookmarked ? <BookmarkOnIcon className="w-[24px] h-[24px] flex-shrink-0" /> : <BookmarkOffIcon className="w-[24px] h-[24px] flex-shrink-0" />}
                    </button>
                    {/* 옵션 더보기 버튼 */}
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex w-[38px] h-[38px] p-[7px] justify-center items-center rounded-[12px] bg-[rgba(255,255,255,0.24)]">
                        <MoreIcon className="w-[24px] h-[24px] flex-shrink-0 aspect-[1/1]" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-[38px] right-0 z-50">
                            <DropdownMenu
                                onRename={() => onRename(template.templateNo)}
                                onEdit={() => onEdit(template.templateNo)}
                                onDuplicate={() => onDuplicate(template.templateNo)}
                                onDelete={() => onDelete(template.templateNo)}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* 템플릿 이름 + 카테고리 */}
            <div className="flex flex-col items-start gap-[8px] self-stretch">
                {/* 템플릿 이름 */}
                <div className="flex w-[240px] h-[38px] items-center gap-[8px] bg-white">
                    <h3 className="text-[rgba(0,0,0,0.9)] font-pretendard text-[18px] font-semibold leading-normal">{template.templateNm}</h3>
                </div>
                {/* 카테고리 */}
                {template.categoryNm && (
                    <div className="flex items-center">
                        <div className="flex px-[8px] py-[4px] justify-center items-center gap-[8px] rounded-[2px] bg-[#F6F4FF]">
                            <span className="text-[#775CFF] font-pretendard text-[14px] font-semibold leading-normal overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">{template.categoryNm}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateCardSmall;
