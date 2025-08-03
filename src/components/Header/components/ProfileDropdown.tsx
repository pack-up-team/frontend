import { useRef, useEffect, useState } from "react";
import { MyPageIcon, LogoutIcon, ArrowSquareIcon } from "../../../assets";

type ProfileDropdownProps = {
    username: string;
    onLogout: () => void;
    onMyPage: () => void;
};

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ username, onLogout, onMyPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    // 외부 클릭 시 닫힘
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                handleClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            {/* 항상 보이는 username 버튼 */}
            <button onClick={handleToggle} className="flex h-[44px] px-[16px] justify-center items-center gap-[8px]">
                <span className="text-[rgba(0,0,0,0.72)] font-pretendard text-[16px] font-semibold leading-[140%]">{username}</span>
                <ArrowSquareIcon className="w-[18px] h-[18px]" />
            </button>
            {/* 드롭다운 */}
            {isOpen && (
                <div className="absolute right-0 top-11 flex w-[191px] px-[16px] py-[12px] items-center rounded-[8px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.12)]">
                    <div className="flex flex-col items-start gap-[12px]">
                        {/* 마이페이지 버튼 */}
                        <button onClick={() => { onMyPage(); handleClose(); }} className="flex h-[36px] justify-center items-center gap-[8px]">
                            <MyPageIcon className="w-[18px] h-[18px]" />
                            <span className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">마이페이지</span>
                        </button>
                        {/* 구분선 */}
                        <div className="h-0 self-stretch">
                            <svg xmlns="http://www.w3.org/2000/svg" width="97" height="2" viewBox="0 0 97 2" fill="none">
                                <path d="M0.0585938 1.39453H96.0586" stroke="#F0F0F0" strokeWidth="1" />
                            </svg>
                        </div>
                        {/* 로그아웃 버튼 */}
                        <button onClick={() => { onLogout(); handleClose(); }} className="flex h-[36px] items-center gap-[8px] self-stretch">
                            <LogoutIcon className="w-[18px] h-[18px]" />
                            <span className="text-[rgba(0,0,0,0.7)] font-pretendard text-[16px] font-medium leading-normal">로그아웃</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
