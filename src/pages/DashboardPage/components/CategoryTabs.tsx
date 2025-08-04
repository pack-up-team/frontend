import Button from "../../../components/Button";

type CategoryCounts = {
    전체: number;
    즐겨찾기: number;
    업무: number;
    생활: number;
    여행: number;
};

type CategoryTabsProps = {
    counts: CategoryCounts;
    selected: string;
    onChange: (category: string) => void;
};

const CATEGORY_NAMES = ["전체", "즐겨찾기", "업무", "생활", "여행"] as const;

const CategoryTabs: React.FC<CategoryTabsProps> = ({ counts, selected, onChange }) => {
    return (
        <div className="flex h-[38px] items-center gap-4">
            {CATEGORY_NAMES.map((name) => (
                <Button key={name} onClick={() => onChange(name)} variant={selected === name ? "fill" : "line"}
                className={`gap-[6px] h-[38px] !p-4 ${selected === name ? "bg-[#5736FF]" : ""}`}>
                    {name}
                    <span className={selected === name ? "text-white" : "text-[#8D76FF]"}>{counts[name as keyof CategoryCounts]}</span>
                </Button>
            ))}
        </div>
    );
};

export default CategoryTabs;
