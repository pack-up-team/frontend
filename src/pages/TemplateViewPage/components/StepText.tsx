import { useState, useRef, useEffect } from "react";
import { ViewArrowUpIcon, ViewArrowDownIcon } from "../../../assets";

type StepTextProps = {
    text: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
};

const boxBaseStyle = "flex flex-col justify-center items-center gap-[2px] flex-shrink-0 rounded-lg px-4 py-3 w-[110px]";
const boxCloseStyle = `${boxBaseStyle} h-[75px] bg-[#141414]`;
const boxOpenStyle = `${boxBaseStyle} h-[160px] bg-[#5736FF]`;
const textStyle = "w-[71px] flex-[1_0_0] text-white font-inter text-sm font-semibold leading-normal";

const StepText = ({ text, open, defaultOpen = false, onOpenChange }: StepTextProps) => {
    const isControlled = open !== undefined;
    const [innerOpen, setInnerOpen] = useState(defaultOpen);
    const currOpen = isControlled ? (open as boolean) : innerOpen;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                if (isControlled) {
                    onOpenChange?.(false);
                } else {
                    setInnerOpen(false);
                    onOpenChange?.(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggle = () => {
        const next = !currOpen;
        if (isControlled) onOpenChange?.(next);
        else {
            setInnerOpen(next);
            onOpenChange?.(next);
        }
    };

    return (
        <div ref={containerRef} className={`${currOpen ? "is-open " : ""}${currOpen ? boxOpenStyle : boxCloseStyle}`}>
            <p className={`${textStyle} ${currOpen ? "line-clamp-7" : "line-clamp-2"}`}>{text}</p>
            <button onClick={toggle} className="cursor-pointer">
                {currOpen ? <ViewArrowUpIcon className="w-3 h-3" /> : <ViewArrowDownIcon className="w-3 h-3" />}
            </button>
        </div>
    );
};

export default StepText;
