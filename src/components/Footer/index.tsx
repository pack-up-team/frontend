import React from 'react';
// 임시 아이콘
import { LogoIcon } from '../../assets';

const Footer: React.FC = () => {
    return (
        <footer className='flex w-[1520px] pb-[56px] flex-col items-start gap-[24px] mx-auto'>
            <div className='h-0 self-stretch'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1521" height="2" viewBox="0 0 1521 2" fill="none">
                    <path d="M0.904297 0.582275H1520.9" stroke="#F0F0F0" strokeWidth="1" />
                </svg>
            </div>
            <div className='flex justify-between items-center self-stretch'>
                {/* 좌측: 로고 + 링크 */}
                <div className='flex w-[390px] items-center gap-[8px]'>
                    <LogoIcon className="w-8 h-8" />
                    <div className='flex items-center'>
                        <button className='flex h-[44px] py-0 px-[24px] justify-center items-center gap-[8px] text-[#949494] font-pretendard text-[16px] font-medium leading-[140%] hover:underline hover:text-[#707070]'>이용약관</button>
                        <div className='w-0 h-[20.308px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="21" viewBox="0 0 2 21" fill="none">
                                <path d="M0.904297 0.428467V20.7361" stroke="#F0F0F0" strokeWidth="1" />
                            </svg>
                        </div>
                        <button className='flex h-[44px] py-0 px-[24px] justify-center items-center gap-[8px] text-[#949494] font-pretendard text-[16px] font-medium leading-[140%] hover:underline hover:text-[#707070]'>개인정보처리방침</button>
                    </div>
                </div>
                {/* 우측: 카피라이트 */}
                <div className='text-[#CCC] text-right font-montserrat text-[16px] font-medium'>
                    Copyright © PACKUP Co. All rights reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;
