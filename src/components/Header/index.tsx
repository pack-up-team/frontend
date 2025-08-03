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
        alert("알림 전체 읽음");
    };
    // onClickNotification: (id: number) => void;
    const handleClickNotification = (id: number) => {
        alert(`알림 ${id} 클릭됨`);
    };

    // username: string;
    const username = "심심한알파카59223";
    // onLogout: () => void;
    const handleLogout = () => {
        alert("로그아웃 완료");
    };
    // onMyPage: () => void;
    const handleMyPage = () => {
        alert("마이페이지 이동");
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
