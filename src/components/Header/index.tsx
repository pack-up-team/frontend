import React from 'react';
// 임시 아이콘
import { LogoIcon } from '../../assets';

const Header: React.FC = () => {
    return (
        <header className='flex w-[1920px] h-[84px] py-[8px] px-[200px] justify-between items-center shrink-0 border border-[#F0F0F0] bg-white'>
            {/* 좌측: 로고 */}
            <a href="/" className='flex items-center gap-[8px]'>
                <LogoIcon className="w-8 h-8" />
                <span className='text-black font-montserrat text-[18px] font-semibold uppercase'>Pack up</span>
            </a>
            {/* 우측: 사용자 인터랙션 영역 */}
            <div className='flex items-center gap-[8px]'>
                <button className='flex w-11 h-11 p-1.5 justify-center items-center'>
                    <div className='w-8 h-8 shrink-0 aspect-square'>
                        {/* 추가 예정 */}
                    </div>
                </button>
                {/* 마이페이지 + 로그인 */}
                <div className='flex items-center'>
                    <button className='flex h-11 py-0 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>마이페이지</button>
                    {/* 로그인 버튼 디자인 문의 답변 확인 필요함 */}
                    <button className='flex h-11 py-0 px-6 justify-center items-center gap-2 text-[rgba(0,0,0,0.72)] font-pretendard text-base font-medium leading-[140%] hover:text-[#411BFF]'>로그인</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
