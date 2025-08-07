import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../assets';
import NotificationDropdown from './components/NotificationDropdown';
import ProfileDropdown from './components/ProfileDropdown';
import type { Notification } from './components/NotificationDropdown';

interface HeaderProps {
    pageType?: 'auth' | 'landing' | 'default';
}

const Header = ({ pageType = 'default' }: HeaderProps) => {
    const isLandingPage = pageType === 'landing';
    const isDefaultPage = pageType === 'default';

    // notifications: Notification[];
    const dummyNotifications: Notification[] = [
        {
            id: 1,
            title: "회의 준비",
            memo: "10분 후 회의 시작",
            timeAgo: "방금 전",
            timestamp: new Date().toISOString(),
            dateGroup: "오늘",    // ✅ 리터럴 타입
            read: false,
        },
        {
            id: 2,
            title: "새 댓글",
            memo: "게시물에 댓글이 달렸습니다.",
            timeAgo: "5분 전",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            dateGroup: "오늘",    // ✅ 리터럴 타입
            read: true,
        },
        {
            id: 3,
            title: "비밀번호 변경",
            memo: "계정 보안 강화",
            timeAgo: "1일 전",
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
            dateGroup: "어제",    // ✅ 리터럴 타입
            read: false,
        },
        {
            id: 4,
            title: "주간 리포트 확인",
            memo: "이번 주 성과를 확인하세요.",
            timeAgo: "3일 전",
            timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
            dateGroup: "이번 주",
            read: false,
        },
        {
            id: 5,
            title: "새 프로젝트 시작",
            memo: "지난 주에 새 프로젝트가 생성되었습니다.",
            timeAgo: "6일 전",
            timestamp: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
            dateGroup: "지난 주",
            read: true,
        },
    ];
    // onMarkAllRead: () => void;
    const handleMarkAllRead = () => {
        // TODO: 모든 알림을 읽음 처리하는 기능을 여기에 구현하세요
        console.log("모든 알림을 읽음 처리합니다.");
        // 예시: notificationService.markAllAsRead();
    };
    // onClickNotification: (id: number) => void;
    const handleClickNotification = (id: number) => {
        // TODO: 알림 클릭 시 상세 페이지 이동 또는 상태 업데이트 로직을 구현하세요
        console.log(`알림 ${id}번 클릭됨`);
        // 예시: navigate(`/notification/${id}`);
    };

    const [username, setUsername] = useState<string>("심심한알파카59223");
    // 사용자 정보 불러오기(JWT 토큰으로 인증)
    useEffect(() => {
        if (!isDefaultPage) return;
        
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("https://packupapi.xyz/api/user", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' // 브라우저가 JWT 토큰 쿠키 자동 전송
                });

                if (!response.ok) {
                    throw new Error('사용자 정보 불러오기 실패');
                }

                const userInfo = await response.json();
    
                // 다양한 키 중 첫 번째 존재하는 것 사용
                setUsername(userInfo.username || userInfo.userName || userInfo.userId || userInfo.email || "심심한알파카59223");
            } catch (err) {
                console.error("사용자 정보 불러오기 실패: ", err);
                setUsername("심심한알파카59223");
            }
        };

        fetchUserInfo();
    }, [isDefaultPage]);

    // onLogout: () => void;
    const handleLogout = () => {
        // TODO: 실제 로그아웃 처리 로직을 여기에 구현하세요
        console.log("사용자 로그아웃 처리");
        // 예시: authService.logout(); navigate('/');
    };
    // onMyPage: () => void;
    const handleMyPage = () => {
        // TODO: 마이페이지로 이동하는 기능을 구현하세요
        console.log("마이페이지로 이동합니다.");
        // 예시: navigate('/mypage');
    };

    return (
        <header className='fixed top-0 left-0 z-20 w-full flex h-[76px] px-4 py-2 justify-between items-center flex-shrink-0 border-b border-[#F0F0F0] bg-white tablet:h-[84px] tablet:px-[60px] web:px-[120px]'>
            <div className='w-full max-w-[1200px] mx-auto flex justify-between items-center flex-shrink-0'>
                {/* 로고 */}
                <a href='/' className='flex items-center gap-2'>
                    <LogoIcon className='w-6 h-6 aspect-square' />
                    <span className='text-black font-montserrat text-[18px] font-semibold uppercase'>Pack up</span>
                </a>

                {/* landing */}
                {isLandingPage && (
                    <div className='flex items-center gap-2'>
                        <nav className='flex items-center'>
                            <Link to='/auth?mode=login' className='flex h-11 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>로그인</Link>
                            <Link to='/auth?mode=signup' className='flex h-11 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>회원가입</Link>
                        </nav>
                    </div>
                )}

                {/* default */}
                {isDefaultPage && (
                    <div className='flex items-center gap-2'>
                        <NotificationDropdown notifications={dummyNotifications} onMarkAllRead={handleMarkAllRead} onClickNotification={handleClickNotification} />
                        <ProfileDropdown username={username} onLogout={handleLogout} onMyPage={handleMyPage} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
