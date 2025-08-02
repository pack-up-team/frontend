import TemplateCardSmall from "./TemplateCardSmall";
import type { TemplateListItem } from "../../../stores/templateListStore";

type TemplateGridProps = {
    templates: TemplateListItem[];
};

const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
    // placeholder 추가
    const paddedItems = [...templates];
    while (paddedItems.length % 4 !== 0) {
        paddedItems.push({ placeholder: true } as unknown as TemplateListItem);
    }

    return (
        <div className="flex w-[1200px] flex-col items-center gap-[32px]">
            {Array.from({ length: Math.ceil(paddedItems.length / 4) }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex justify-between items-center self-stretch">
                    {paddedItems.slice(rowIdx * 4, rowIdx * 4 + 4).map((item, idx) =>
                        item.placeholder ? (
                            <div key={`placeholder-${rowIdx}-${idx}`} className="w-[272px] h-[367px] bg-transparent"></div>
                        ) : (
                            <TemplateCardSmall
                            key={item.templateNo}
                            template={item}
                            onRename={() => {}}
                            onEdit={() => {}}
                            onDuplicate={() => {}}
                            onDelete={() => {}} />
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default TemplateGrid;
