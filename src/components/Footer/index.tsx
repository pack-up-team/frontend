import React from 'react';
// 임시 아이콘
import { ReactComponent as LogoIcon } from '../../assets/vite.svg';

const Footer: React.FC = () => {
    return (
        <footer className='max-w-[1520px] w-full mx-auto bg-[#FAFAFA] border-t border-[#F0F0F0] text-base text-[#CCCCCC] pt-6 pb-14'>
            <div className='w-full flex justify-between items-center'>
                {/* 좌측: 로고 + 링크 */}
                <div className='w-[390px] flex'>
                    <LogoIcon className="w-8 h-8 my-1.5 mr-2" />
                    <div className='flex items-center'>
                        <button className='text-[#949494] px-6 py-[11px] flex items-center justify-center hover:underline hover:text-[#707070] font-pretendard'>이용약관</button>
                        <div className='w-px h-5 bg-[#F0F0F0]'></div>
                        <button className='text-[#949494] px-6 py-[11px] flex items-center justify-center hover:underline hover:text-[#707070] font-pretendard'>개인정보처리방침</button>
                    </div>
                </div>
                {/* 우측: 카피라이트 */}
                <div className='font-montserrat'>
                    Copyright © PACKUP Co. All rights reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;
