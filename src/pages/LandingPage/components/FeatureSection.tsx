import { CorrectIcon } from "../../../assets";

type FeatureSectionProps = {
    title: string;
    description: string;
    checklist: string[];
    image: string;
    reverse?: boolean; // 레이아웃 순서
};

const FeatureSection: React.FC<FeatureSectionProps> = ({
    title,
    description,
    checklist,
    image,
    reverse = false,
}) => {
    return (
        <section className={`flex w-full max-w-[1200px] items-center gap-[24px] ${reverse ? 'flex-row-reverse' : ''}`}>
            {/* 텍스트 영역 */}
            <div className="flex flex-col items-start gap-[54px] flex-[1_0_0]">
                <div className="flex flex-col items-start gap-[16px] self-stretch">
                    <h3 className="self-stretch text-[#141414] font-pretendard text-[48px] font-bold leading-normal">{title}</h3>
                    <p className="text-[#707070] font-pretendard text-[18px] font-medium leading-[140%]">{description}</p>
                </div>
                <div className="flex w-[353px] flex-col items-start gap-[16px]">
                    {checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-[16px] self-stretch">
                            <CorrectIcon className="w-6 h-6" />
                            <span className="text-[#141414] text-center font-pretendard text-[22px] font-medium leading-[140%]">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {/* 이미지 영역 */}
            <div className="w-[700px] h-[540px] flex-shrink-0 rounded-[12px] overflow-hidden">
                <img 
                    src={image} 
                    alt={`${title} 기능 일러스트`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        </section>
    );
};

export default FeatureSection;
