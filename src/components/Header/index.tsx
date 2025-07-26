import { useState } from 'react';
import { LogoIcon, AlertIcon, HamburgerIcon, CloseIcon } from '../../assets';

interface HeaderProps {
    pageType?: 'login' | 'signup' | 'landing' | 'default';
    notificationCount?: number;
}

const Header = ({ pageType = 'default', notificationCount }: HeaderProps) => {
    const isAuthPage = pageType === 'login' || pageType === 'signup';
    
    // 알림 개수 결정
    const [localCount] = useState(0);
    const count = notificationCount !== undefined ? notificationCount : localCount;

    // 알림 드롭다운 오픈 상태
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    // 햄버거 버튼 오픈 상태
    const [drawerOpen, setDrawerOpen] = useState(false);

    /*
    const dummyNotifications = [
        { id: 1, text: '새로운 댓글이 달렸습니다.' },
        { id: 2, text: '회원가입이 완료되었습니다.' },
        { id: 3, text: '비밀번호가 변경되었습니다.' },
    ];
    */

    return (
        <header className='fixed top-0 left-0 z-20 w-full flex h-[76px] px-4 py-2 justify-between items-center flex-shrink-0 border-b border-[#F0F0F0] bg-white tablet:h-[84px] tablet:px-[60px] web:px-[120px]'>
            <div className='w-full max-w-[1200px] mx-auto flex justify-between items-center flex-shrink-0'>
                {/* 로고 */}
                <a href='/' className='flex items-center gap-2'>
                    <LogoIcon className='w-6 h-6 aspect-square' />
                    <span className='text-black font-montserrat text-[18px] font-semibold uppercase'>Pack up</span>
                </a>
                {/* login, signup 페이지는 로고만 */}
                {!isAuthPage && (
                    <div className='flex items-center web:gap-2'>
                        {/* 알림 버튼 */}
                        {/* onClick={() => setDropdownOpen((prev) => !prev)} 추가 예정 */}
                        <button className={`relative w-11 h-11 flex items-center justify-center ${pageType === 'landing' ? 'hidden' : ''}`}>
                            <AlertIcon className='w-8 h-8 flex-shrink-0 aspect-square' />
                            {/* 알림 badge */}
                            {count > 0 && (
                                <div className='absolute top-0 right-0 w-5 h-5 flex-shrink-0 rounded-full bg-[#FF1F57]'>
                                    <span className={`absolute text-white flex items-center justify-center font-pretendard font-bold
                                        ${count < 10
                                            ? 'w-[8px] h-[17px] top-[1.5px] right-[6px] text-[12px] leading-[16.8px] !tracking-[-0.48px]'
                                            : count < 100
                                            ? 'w-[13px] h-[14px] top-[3px] right-[3.5px] text-[10px] leading-[14px] !tracking-[-0.4px]'
                                            : 'w-[19px] h-[14px] top-[3px] right-0 text-[10px] leading-[14px] !tracking-[-0.4px]'}`}>
                                        {count > 99 ? '99+' : count}
                                    </span>
                                </div>
                            )}
                        </button>
                        {/* 햄버거 버튼 */}
                        <button onClick={() => setDrawerOpen(true)} className='web:hidden flex h-[44px] justify-end items-center py-[10px] pl-[20px]'>
                            <HamburgerIcon className='w-6 h-6 aspect-square' />
                        </button>
                        {/* side drawer */}
                        {drawerOpen && (
                            <div className='fixed inset-0 z-50'>
                                {/* dim */}
                                <div onClick={() => setDrawerOpen(false)} className='absolute inset-0 bg-black/50'></div>
                                {/* drawer */}
                                <div className='absolute right-0 top-0 w-[280px] h-full flex flex-col items-start gap-2 flex-shrink-0 bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.02)] tablet:w-[320px]'>
                                    <div className='flex h-[50px] px-[24px] py-[8px] justify-between items-center self-stretch'>
                                        {/* 로고 */}
                                        <div className='flex items-center gap-2'>
                                            <LogoIcon className='w-6 h-6 aspect-square' />
                                            <span className='text-black font-montserrat text-[18px] font-semibold uppercase'>Pack up</span>
                                        </div>
                                        {/* close 버튼 */}
                                        <button onClick={() => setDrawerOpen(false)} className='flex w-[44px] h-[44px] justify-end items-center py-[10px] pl-[20px]'>
                                            <CloseIcon className='w-[24px] h-[24px] aspect-square' />
                                        </button>
                                    </div>
                                    {/* nav */}
                                    <nav className='flex flex-col items-start self-stretch'>
                                        {/* href 삼항 연산자 추후 추가(React Router 사용?) */}
                                        <a href='#' rel='noopener' className='flex h-[50px] px-6 py-2 justify-center items-center gap-2 self-stretch text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%]'>{pageType === 'landing' ? '로그인' : '마이페이지'}</a>
                                        <a href='#' rel='noopener' className='flex h-[50px] px-6 py-2 justify-center items-center gap-2 self-stretch text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%]'>{pageType === 'landing' ? '회원가입' : '로그아웃'}</a>
                                    </nav>
                                </div>
                            </div>
                        )}
                        {/* 액션 */}
                        <nav className='hidden web:flex items-center'>
                            {/* href 삼항 연산자 추후 추가(React Router 사용?) */}
                            <a href='#' rel='noopener' className='flex h-11 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>{pageType === 'landing' ? '로그인' : '마이페이지'}</a>
                            <a href='#' rel='noopener' className='flex h-11 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>{pageType === 'landing' ? '회원가입' : '로그아웃'}</a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
