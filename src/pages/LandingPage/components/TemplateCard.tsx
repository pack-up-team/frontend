import { CheckIcon } from "../../../assets";

type TemplateCardProps = {
    image: string;
    title: string;
    subtitle: string;
    checklist?: string[];
};

const TemplateCard: React.FC<TemplateCardProps> = ({
    image,
    title,
    subtitle,
    checklist = [],
}) => {
    return (
        <div className="relative w-[300px] h-[400px] group">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            {/* Hover Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
            flex p-[91.5px_34px_75.5px_34px] flex-col justify-end items-center flex-shrink-0 rounded-[9.73px] bg-[linear-gradient(0deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.7)_100%)]">
                <div className="flex w-[232px] flex-col items-center gap-[54px]">
                    <div className="flex flex-col items-start gap-[24px] self-stretch">
                        <div className="flex flex-col items-center gap-[21px] self-stretch">
                            <h3 className="self-stretch text-white text-center font-pretendard text-[22px] font-bold leading-normal">{title}</h3>
                            <p className="whitespace-pre-line self-stretch text-white text-center font-pretendard text-[18px] font-semibold leading-normal">{subtitle}</p>
                        </div>
                        {/* 체크리스트 */}
                        {checklist?.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-start gap-[16px] self-stretch">
                                <div className="flex items-start gap-[8px] self-stretch">
                                    <CheckIcon className="w-4 h-4" />
                                    <span className="whitespace-pre-line text-white text-center font-pretendard text-[16px] font-medium leading-[140%]">
                                        {item}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;
