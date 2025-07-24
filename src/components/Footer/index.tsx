import React from 'react';
// 임시 아이콘
import { LogoIcon } from '../../assets';

const Footer: React.FC = () => {
    return (
        <footer className='flex flex-col items-center gap-6 w-full px-4 pt-6 pb-[42px] tablet:px-[60px] web:px-[120px] web:pb-14 web:items-start border-t border-[#F0F0F0]'>
            <div className='w-full max-w-[1200px] mx-auto flex flex-col items-center gap-4 self-stretch web:flex-row web:justify-between'>
                {/* 좌측: 로고 + 링크 */}
                <div className='flex items-center gap-2'>
                    <LogoIcon className="w-8 h-8" />
                    <div className='flex items-center'>
                        <a href='#' target='_blank' rel='noopener' className='flex h-11 px-6 justify-center items-center gap-2 text-[#949494] font-pretendard text-base font-medium leading-[140%] hover:underline hover:text-[#707070]'>이용약관</a>
                        {/* divider */}
                        <div className='w-0 h-[20.308px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="21" viewBox="0 0 2 21" fill="none">
                                <path d="M0.691406 0.430176V20.7378" stroke="#F0F0F0" strokeWidth="1" />
                            </svg>
                        </div>
                        <a href='#' target='_blank' rel='noopener' className='flex h-11 px-6 justify-center items-center gap-2 text-[#949494] font-pretendard text-base font-medium leading-[140%] hover:underline hover:text-[#707070]'>개인정보처리방침</a>
                    </div>
                </div>
                {/* 우측: 카피라이트 */}
                <div className='self-stretch text-[#CCC] text-center font-montserrat text-base font-medium leading-[normal] tablet:self-auto tablet:text-right'>Copyright © PACKUP Co. All rights reserved</div>
            </div>
        </footer>
    );
};

export default Footer;
