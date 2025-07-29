import { useState } from 'react';
import { CheckboxIcon, CheckboxOffIcon } from "../../../assets";

type CheckboxProps = {
    label: string;
    onViewClick: () => void;
    onChange?: (checked: boolean) => void;
};

const Checkbox = ({ label, onChange, onViewClick }: CheckboxProps) => {
    const [checked, setChecked] = useState(false);

    const toggleCheck = () => {
        const next = !checked;
        setChecked(next);
        onChange?.(next);
    };

    return (
        <div className="flex justify-between items-center self-stretch">
            <div className="flex items-center gap-1">
                {checked ? <CheckboxIcon onClick={toggleCheck} className='cursor-pointer w-[36px] h-[36px]' /> : <CheckboxOffIcon onClick={toggleCheck} className='cursor-pointer w-[36px] h-[36px]' />}
                <span className='text-[#4D4D4D] text-center font-pretendard text-[16px] font-semibold leading-none'>{label}</span>
            </div>
            <button type='button' onClick={onViewClick} className='cursor-pointer flex h-[36px] justify-center items-center gap-2 text-[#949494] text-center font-pretendard text-[14px] font-medium leading-none underline'>보기</button>
        </div>
    );
};

export default Checkbox;
