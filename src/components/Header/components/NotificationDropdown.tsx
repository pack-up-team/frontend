import { useEffect, useRef } from "react";
import { AlertEmptyIcon } from "../../../assets";

type Notification = {
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
    isOpen: boolean;
    notifications: Notification[];
    onClose: () => void;
    onMarkAllRead: () => void;
    onClickNotification: (id: number) => void;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, notifications, onClose, onMarkAllRead, onClickNotification }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 닫힘
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // 알림 없을 때
    if (notifications.length === 0) {
        return (
            <div ref={dropdownRef} className="h-[456px] flex w-[464px] flex-col justify-center items-center rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
                {/* 헤더 */}
                <div className="flex px-[20px] py-[8px] justify-between items-center self-stretch border-b border-[#F0F0F0]">
                    <h3 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">알림센터</h3>
                    <button onClick={onMarkAllRead} className="flex h-[40px] justify-center items-center gap-[8px]">
                        <span className="text-[#5736FF] text-center font-pretendard text-[16px] font-medium leading-normal">모두 읽음 처리</span>
                    </button>
                </div>
                {/* 알림 리스트 */}
                <div className="flex h-[400px] p-[100px_0] flex-col items-center gap-[16px] self-stretch">
                    <AlertEmptyIcon className="w-[50px] h-[50px]" />
                    <p className="text-[#707070] text-center font-pretendard text-[16px] font-medium leading-[140%]">14일 이내에 받은 알림이 없습니다</p>
                </div>
            </div>
        );
    }

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
                                <span className={`text-center font-pretendard text-[16px] font-semibold leading-normal ${n.read ? "text-[#4D4D4D]" : "text-[#141414]"}`}>{`{${n.title})`}을 할 시간이에요.</span>
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

    // 알림 있을 때
    return (
        <div ref={dropdownRef} className="h-[456px] flex w-[464px] flex-col justify-center items-center rounded-[12px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)]">
            {/* 헤더 */}
            <div className="flex px-[20px] py-[8px] justify-between items-center self-stretch border-b border-[#F0F0F0]">
                <h3 className="text-[#141414] text-center font-pretendard text-[18px] font-semibold leading-normal">알림센터</h3>
                <button onClick={onMarkAllRead} className="flex h-[40px] justify-center items-center gap-[8px]">
                    <span className="text-[#5736FF] text-center font-pretendard text-[16px] font-medium leading-normal">모두 읽음 처리</span>
                </button>
            </div>
            {/* 알림 리스트 */}
            <div className="w-full flex flex-col h-[400px] justify-center items-start self-stretch overflow-y-auto">
                {renderGroup("오늘", grouped["오늘"] || [])}
                {renderGroup("어제", grouped["어제"] || [])}
                {renderGroup("이번 주", grouped["이번 주"] || [])}
                {renderGroup("지난 주", grouped["지난 주"] || [])}
            </div>
        </div>
    );
};

export default NotificationDropdown;
