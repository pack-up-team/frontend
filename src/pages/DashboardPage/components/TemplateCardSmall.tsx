import { useState, useRef, useEffect } from "react";
import type { TemplateListItem } from "../../../stores/templateListStore";
import DropdownMenu from "./DropdownMenu";
import { BookmarkOffIcon, BookmarkOnIcon, MoreIcon } from "../../../assets";

type TemplateCardSmallProps = {
    template: TemplateListItem;
    onRename: (templateNo: number, newName: string) => void;
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
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false); // 로딩 상태 추가
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 인라인 편집
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(template.templateNm);

    const toggleBookmark = async () => {
        if (isBookmarkLoading) return;

        setIsBookmarkLoading(true);
        setBookmarked((prev) => !prev); // 낙관적 UI 업데이트

        try {
            // TODO: API 연결 시 아래 코드에 적용
            console.log(`템플릿 ${template.templateNo} 북마크 상태 변경 요청`);
            // await bookmarksService.toggle(template.templateNo);
        } catch (error) {
            // 실패 시 원래대로 복구
            setBookmarked((prev) => !prev);
            console.error("북마크 상태 변경 실패:", error);
        } finally {
            setIsBookmarkLoading(false);
        }
    };

    // 템플릿 이름 저장
    const handleSaveName = () => {
        const trimmedName = editedName.trim(); // 앞뒤 공백 제거

        if (!trimmedName) {
            // 이름이 공백이면 원래 이름으로 복구하고 편집 종료
            setEditedName(template.templateNm);
            setIsEditing(false);
            return;
        }

        onRename(template.templateNo, trimmedName); // 정상 저장
        // TODO: 백엔드 API 호출해서 템플릿 이름 업데이트
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSaveName();
        if (e.key === "Escape") {
            setEditedName(template.templateNm); // 원래 이름 복구
            setIsEditing(false);
        }
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
                    <button onClick={toggleBookmark} disabled={isBookmarkLoading} className="flex w-[38px] h-[38px] p-[7px] justify-center items-center rounded-[12px] bg-[rgba(255,255,255,0.24)]">
                        {bookmarked ? <BookmarkOnIcon className="w-[24px] h-[24px] flex-shrink-0" /> : <BookmarkOffIcon className="w-[24px] h-[24px] flex-shrink-0" />}
                    </button>
                    {/* 옵션 더보기 버튼 */}
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex w-[38px] h-[38px] p-[7px] justify-center items-center rounded-[12px] bg-[rgba(255,255,255,0.24)]">
                        <MoreIcon className="w-[24px] h-[24px] flex-shrink-0 aspect-[1/1]" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-[38px] right-0 z-50">
                            <DropdownMenu
                                onRename={() => { setIsEditing(true); setDropdownOpen(false); }}
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
                {isEditing ? (
                    <input className="flex w-[240px] h-[38px] px-4 items-center gap-1 flex-shrink-0 rounded-lg border border-[#8D76FF] bg-white text-[rgba(0,0,0,0.9)] font-pretendard text-[18px] font-semibold leading-normal caret-[#775CFF] outline-none"
                    value={editedName} autoFocus onChange={(e) => setEditedName(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleSaveName}></input>
                ) : (
                    <div className="flex w-[240px] h-[38px] items-center gap-[8px] bg-white">
                        <h3 className="text-[rgba(0,0,0,0.9)] font-pretendard text-[18px] font-semibold leading-normal">{template.templateNm}</h3>
                    </div>
                )}
                {/* 카테고리 */}
                {template.categoryNm && (
                    <div className="flex items-center">
                        <div className="flex px-[8px] py-[4px] justify-center items-center gap-[8px] rounded-[2px] bg-[#F6F4FF]">
                            <span className="text-[#775CFF] font-pretendard text-[14px] font-semibold leading-[20px] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">{template.categoryNm}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateCardSmall;
