import { useNavigate } from 'react-router-dom';
import TemplateCard from "./TemplateCard";
import Button from "../../../components/Button";
import { CoinIcon, FastIcon } from '../../../assets';
// 임시 이미지
import dummyImg from "../../../../src/assets/dummy.png"

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="mx-auto flex w-[1085px] flex-col items-center gap-[92px]">
            <div className="flex flex-col items-center gap-[42px] self-stretch">
                <div className="flex flex-col items-center gap-4 self-stretch">
                    <div className="flex flex-col items-center self-stretch">
                        <h3 className="text-[#4D4D4D] text-center font-montserrat text-[28px] font-semibold leading-[140%] uppercase">Pack up</h3>
                        <h2 className="text-[#141414] font-pretendard text-[64px] font-bold leading-[140%]">
                            자주하는 일을 <span className="text-[#411BFF] font-pretendard text-[64px] font-bold leading-[140%]">한눈에 볼 수 있는 템플릿</span>으로
                        </h2>
                    </div>
                    <p className="text-[#707070] text-center font-pretendard text-[22px] font-medium leading-[140%]">
                        매번 하는 일의 반복 주기, 준비물, 과정을 생각하는데 에너지를 쓰고 계신가요?
                        <br />
                        직관적으로 볼 수 있는 템플릿으로 쉽게 기억하세요!
                    </p>
                </div>
                <div className="flex w-[942px] flex-col items-center gap-[16px]">
                    <span className="self-stretch text-[#949494] text-center font-pretendard text-[16px] font-medium leading-normal">템플릿 카드에 마우스를 올려보세요!</span>
                    <div className="flex items-center gap-[21px] self-stretch">
                        <TemplateCard image={dummyImg} title="여행 준비 템플릿" subtitle={"바로 캐리어들고 떠날 수 있는 \n완벽한 체크리스트"} checklist={["여행과정을 고려한 체크리스트", "국내 / 해외 여행에 따른 준비물 ", "필수 준비물과 있으면 유용한\n준비물 추천"]} />
                        <TemplateCard image={dummyImg} title="여행 준비 템플릿" subtitle={"바로 캐리어들고 떠날 수 있는 \n완벽한 체크리스트"} checklist={["여행과정을 고려한 체크리스트", "국내 / 해외 여행에 따른 준비물 ", "필수 준비물과 있으면 유용한\n준비물 추천"]} />
                        <TemplateCard image={dummyImg} title="여행 준비 템플릿" subtitle={"바로 캐리어들고 떠날 수 있는 \n완벽한 체크리스트"} checklist={["여행과정을 고려한 체크리스트", "국내 / 해외 여행에 따른 준비물 ", "필수 준비물과 있으면 유용한\n준비물 추천"]} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-6">
                <Button onClick={() => navigate('/auth')} className="w-[343px] h-[50px]">지금 시작하기</Button>
                <div className='flex items-center gap-10'>
                    <div className='flex items-center gap-3'>
                        <CoinIcon className='w-8 h-8' aria-hidden="true" />
                        <span className='text-[#4D4D4D] text-center font-pretendard text-[18px] font-medium leading-normal'>무료 사용</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <FastIcon className='w-8 h-8' aria-hidden="true" />
                        <span className='text-[#4D4D4D] text-center font-pretendard text-[18px] font-medium leading-normal'>간편 템플릿 생성 시 1분 소요!</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
