import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import BannerSection from "./components/BannerSection";
// 임시 이미지
import dummyImg from "../../assets/dummy.png"

const LandingPage = () => {
    return (
        <div className="w-full bg-white">
            <Header pageType="landing" />
            <div className="relative pt-[152px] mx-auto w-[1085px]">
                <img src="/landing-bg-1.png" alt="" className="absolute top-[678px] left-[873px]" />
                <img src="/landing-bg-2.png" alt="" className="absolute top-[677px] left-[-98px]" />
                <img src="/landing-bg-3.png" alt="" className="absolute top-[298px] left-[42px]" />
                <img src="/landing-bg-4.png" alt="" className="absolute top-[321px] left-[1010px]" />
                <HeroSection />
            </div>
            <p className="mx-auto pt-[204px] pb-[70px] text-center text-[#949494] font-pretendard text-[22px] font-semibold leading-normal">핵심 기능</p>
            <FeatureSection title="템플릿 생성" description="자주하는 일의 준비물과 과정을 간단하게 템플릿으로 만드세요"
            checklist={["드래그 앤 드롭으로 직관적인 조작", "카테고리별 분류 및 관리", "할일 별 추천 준비물"]} image={dummyImg} />
            <div className="w-full pt-[115px] pb-[105px] my-[75px] bg-[#FAFAFA]">
                <FeatureSection title="한눈에 들어오는 시각화" description="복잡한 과정을 시각화하여 한눈에 파악하세요"
                checklist={["진행 상황 실시간 확인", "간트 차트 및 타임라인 뷰", "체크리스트 및 칸반 보드"]} image={dummyImg} reverse />
            </div>
            <FeatureSection title="반복 설정 & 알림" description="과정별 알림으로 까먹지 않게 알려드릴게요"
            checklist={["할일 반복 주기 알림 설정", "마감일 및 우선순위 알림", "이메일 및 푸시 알림 지원"]} image={dummyImg} />
            <BannerSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
