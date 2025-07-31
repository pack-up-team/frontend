import { useNavigate } from "react-router-dom";

const BannerSection = () => {
    const navigate = useNavigate();

    return (
        <section className="flex items-center justify-center w-full max-w-[1200px] h-[260px] flex-shrink-0 rounded-[12px] bg-cover"
        style={{ backgroundImage: "url('/banner.svg')" }} role="banner" aria-label="나만의 템플릿 만들기 배너">
            <div className="flex w-[245px] flex-col items-center gap-[33px]">
                <div className="flex flex-col items-center gap-[16px] self-stretch">
                    <p className="self-stretch text-white/70 text-center font-montserrat text-[18px] font-semibold leading-[140%] uppercase">Pack up</p>
                    <h3 className="text-white font-pretendard text-[26px] font-bold leading-normal">지금 바로 시작해보세요!</h3>
                </div>
                <button type="button" onClick={() => navigate('/auth')} className="flex w-[240px] h-[44px] px-[24px] py-[8px] justify-between items-center rounded-[4.235px] bg-white">
                    <span className="mx-auto text-[#411BFF] text-center font-pretendard text-[16px] font-medium leading-normal">나만의 템플릿 만들기</span>
                </button>
            </div>
        </section>
    );
};

export default BannerSection;
