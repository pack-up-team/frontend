import Button from "../../../components/Button";

type Category = {
    name: string;
    count: number;
};

type CategoryTabsProps = {
    categories: Category[];
    selected: string;
    onChange: (category: string) => void;
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, selected, onChange }) => {
    return (
        <div className="flex h-[38px] items-center gap-4">
            {categories.map((cat) => (
                <Button key={cat.name} onClick={() => onChange(cat.name)} variant={selected === cat.name ? "fill" : "line"}
                className={`gap-[6px] h-[38px] !p-4 ${selected === cat.name ? "bg-[#5736FF]" : ""}`}>
                    {cat.name}
                    <span className={selected === cat.name ? "text-white" : "text-[#8D76FF]"}>{cat.count}</span>
                </Button>
            ))}
        </div>
    );
};

export default CategoryTabs;
