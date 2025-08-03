import { useEffect, useRef, useState } from "react";
import { AlertIcon, AlertEmptyIcon } from "../../../assets";

export type Notification = {
    id: number;
    title: string;
    memo?: string;
    timeAgo: string; // 상대 시간
    timestamp: string; // 최신순 정렬용
    dateGroup: "오늘" | "어제" | "이번 주" | "지난 주";
    read: boolean;
    thumbnail?: string;
};

type NotificationDropdownProps = {
    notifications: Notification[];
    onMarkAllRead: () => void;
    onClickNotification: (id: number) => void;
};

// 조사 자동 설정 함수
function getPostposition(word: string) {
    if (!word) return "을";
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0) - 0xac00;

    if (code < 0 || code > 11171) return "를";
    const jong = code % 28;
    return jong === 0 ? "를" : "을";
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAllRead, onClickNotification }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const count = notifications.filter(n => !n.read).length;

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

    // 알림 badge 스타일 헬퍼 함수
    const getBadgeStyles = (count: number) => {
        if (count < 10) return 'w-[8px] h-[17px] top-[1.5px] right-[6px] text-[12px] leading-[16.8px] !tracking-[-0.48px]';
        if (count < 100) return 'w-[13px] h-[14px] top-[3px] right-[3.5px] text-[10px] leading-[14px] !tracking-[-0.4px]';
        return 'w-[19px] h-[14px] top-[3px] right-0 text-[10px] leading-[14px] !tracking-[-0.4px]';
    };

    // 외부 클릭 시 닫힘
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // 최신순 정렬
    const sorted = [...notifications].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // 날짜 그룹핑
    const grouped = sorted.reduce<Record<string, Notification[]>>((acc, n) => {
        if (!acc[n.dateGroup]) acc[n.dateGroup] = [];
        acc[n.dateGroup].push(n);
        return acc;
    }, {});

    const renderGroup = (label: string, items: Notification[]) => {
        if (items.length === 0) return null;
        return (
            <div key={label} className="w-full flex-col">
                <div className="w-full flex p-[14px_20px_8px_20px] items-center self-stretch border-b border-[#F0F0F0]">
                    <span className="text-[#141414] text-center font-pretendard text-[14px] font-bold leading-normal">{label}</span>
                </div>
                {items.map((n) => (
                    <button
                    key={n.id} onClick={() => onClickNotification(n.id)}
                    className={`w-full flex px-[20px] py-[16px] justify-between items-start self-stretch border-b border-[#F0F0F0] ${n.read ? "bg-[#FAFAFA]" : ""}`}>
                        <div className="flex items-start gap-6">
                            {/* 썸네일 */}
                            <div className="w-[50px] h-[50px] rounded-[4px] bg-[#F0F0F0]">
                                {n.thumbnail && (
                                    <img src={n.thumbnail} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            {/* 텍스트 영역 */}
                            <div className="flex flex-col justify-center items-start gap-[8px]">
                                <span className={`text-center font-pretendard text-[16px] font-semibold leading-normal ${n.read ? "text-[#4D4D4D]" : "text-[#141414]"}`}>{`${n.title}${getPostposition(n.title)} 할 시간이에요.`}</span>
                                {n.memo && (
                                    <span className={`text-center font-pretendard text-[14px] font-medium leading-normal ${n.read ? "text-[#949494]" : "text-[#4D4D4D]"}`}>{n.memo}</span>
                                )}
                            </div>
                        </div>
                        {/* timeAgo */}
                        <span className="text-[#949494] text-center font-pretendard text-[14px] font-medium leading-normal">{n.timeAgo}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* 알림 버튼 */}
            <button onClick={toggleDropdown} className='relative w-11 h-11 flex items-center justify-center' aria-label={`알림 ${count > 0 ? `${count > 99 ? '99개 이상' : count + '개'}` : '없음'}`} type="button">
                <AlertIcon className='w-8 h-8 flex-shrink-0 aspect-square' />
                {/* 알림 badge */}
                {count > 0 && (
                    <div className='absolute top-0 right-0 w-5 h-5 flex-shrink-0 rounded-full bg-[#FF1F57]'>
                        <span className={`absolute text-white flex items-center justify-center font-pretendard font-bold ${getBadgeStyles(count)}`}>
                            {count > 99 ? '99+' : count}
                        </span>
                    </div>
                )}
            </button>

            {/* 드롭다운 */}
            {isOpen && (
                <div className="absolute right-0 top-11 h-[456px] flex w-[464px] flex-col justify-center items-center rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
                    {/* 헤더 */}
                    <div className="flex px-[20px] py-[8px] justify-between items-center self-stretch border-b border-[#F0F0F0]">
                        <h3 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">알림센터</h3>
                        <button onClick={onMarkAllRead} className="flex h-[40px] justify-center items-center gap-[8px]">
                            <span className="text-[#5736FF] text-center font-pretendard text-[16px] font-medium leading-normal">모두 읽음 처리</span>
                        </button>
                    </div>
                    {/* 알림 리스트 */}
                    {notifications.length === 0 ? (
                        <div className="flex h-[400px] p-[100px_0] flex-col items-center gap-[16px] self-stretch">
                            <AlertEmptyIcon className="w-[50px] h-[50px]" />
                            <p className="text-[#707070] text-center font-pretendard text-[16px] font-medium leading-[140%]">14일 이내에 받은 알림이 없습니다</p>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col h-[400px] items-start self-stretch overflow-y-auto">
                            {renderGroup("오늘", grouped["오늘"] || [])}
                            {renderGroup("어제", grouped["어제"] || [])}
                            {renderGroup("이번 주", grouped["이번 주"] || [])}
                            {renderGroup("지난 주", grouped["지난 주"] || [])}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
