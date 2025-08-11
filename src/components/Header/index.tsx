import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoIcon } from '../../assets';
import NotificationDropdown from './components/NotificationDropdown';
import ProfileDropdown from './components/ProfileDropdown';
import type { Notification } from './components/NotificationDropdown';

interface HeaderProps {
    pageType?: 'auth' | 'landing' | 'default';
}

const Header = ({ pageType = 'default' }: HeaderProps) => {
    const navigate = useNavigate();
    const isLandingPage = pageType === 'landing';
    const isDefaultPage = pageType === 'default';

    // 모든 알림 읽음 처리
    const handleMarkAllRead = async  () => {
        if (!userId) return;

        try {
            const res = await fetch('https://packupapi.xyz/notifications/readAll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error('모두 읽음 처리 실패');

            setUnreadCount(0);

            // 1) 목록의 모든 항목을 read=true로
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true})));

        } catch (err) {
            console.error('모두 읽음 처리 에러:', err);
        }
    };

    // onClickNotification: (id: number) => void;
    const handleClickNotification = (id: number) => {
        // TODO: 알림 클릭 시 상세 페이지 이동 또는 상태 업데이트 로직을 구현하세요
        console.log(`알림 ${id}번 클릭됨`);
        // 예시: navigate(`/notification/${id}`);
    };

    // username: string;
    const username = "심심한알파카59223";
    // onLogout: () => void;
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            
            console.log("로그아웃 API 호출 시작");
            
            const response = await fetch('https://packupapi.xyz/api/lgn/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('로그아웃 실패');
            }

            console.log('로그아웃 성공');
            
            // 로컬 스토리지에서 토큰 제거
            localStorage.removeItem('token');
            
            // 랜딩페이지로 이동 (루트 경로)
            navigate('/');
            
        } catch (error) {
            console.error('로그아웃 에러:', error);
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        }
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
                        <NotificationDropdown notifications={notifications} onMarkAllRead={handleMarkAllRead} onClickNotification={handleClickNotification} unreadCount={unreadCount} />
                        <ProfileDropdown username={username} onLogout={handleLogout} onMyPage={handleMyPage} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;