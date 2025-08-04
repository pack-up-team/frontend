import TemplateCardSmall from "./TemplateCardSmall";
import type { TemplateListItem } from "../../../stores/templateListStore";

type TemplateGridProps = {
    templates: TemplateListItem[];
};

const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
    // 4개씩 맞추기 위한 placeholder 계산
    const placeholderCount = templates.length % 4 === 0 ? 0 : 4 - (templates.length % 4);
    const placeholders = Array(placeholderCount).fill(null); // null을 placeholder로 사용
    const fullItems: (TemplateListItem | null)[] = [...templates, ...placeholders]; // 혼합 배열

    return (
        <div className="flex w-[1200px] flex-col items-center gap-[32px]">
            {Array.from({ length: Math.ceil(fullItems.length / 4) }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex justify-between items-center self-stretch">
                    {fullItems.slice(rowIdx * 4, rowIdx * 4 + 4).map((item, idx) =>
                        item ? (
                            <TemplateCardSmall
                            key={item.templateNo}
                            template={item}
                            onRename={() => {}}
                            onEdit={() => {}}
                            onDuplicate={() => {}}
                            onDelete={() => {}} />
                        ) : (
                            <div key={`placeholder-${rowIdx}-${idx}`} className="w-[272px] h-[367px] bg-transparent"></div>
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default TemplateGrid;
