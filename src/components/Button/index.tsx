import { useState } from 'react';

type ButtonProps = {
    variant?: 'fill' | 'line';
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string; // 사용자 정의 스타일
};

const styleMap = {
    fill: {
        default: 'bg-[#411BFF] text-white',
        hover: 'bg-[#2500DB] text-white',
        pressed: 'bg-[#1B00A1] text-white',
        disabled: 'bg-[#E6E6E6] text-[#949494]'
    },
    line: {
        default: 'border border-[#CCCCCC] text-[#141414]',
        hover: 'border border-[#B8B8B8] bg-[#FAFAFA] text-[#141414]',
        pressed: 'border border-[#949494] bg-[#F0F0F0] text-[#141414]',
        disabled: 'border border-[#E6E6E6] text-[#949494]'
    }
};

const Button = ({
    variant = 'fill',
    disabled = false,
    children,
    onClick,
    className
}: ButtonProps) => {
    const [internalState, setInternalState] = useState<'default' | 'hover' | 'pressed'>('default');
    const currentState = disabled ? 'disabled' : internalState;

    const baseStyle = 'flex max-w-[343px] px-[40px] py-[16px] justify-center items-center gap-[8px] flex-shrink-0 rounded-[8px] text-center font-pretendard text-[16px] font-medium leading-none';
    const stateStyle = styleMap[variant][currentState];
    const combined = `${baseStyle} ${stateStyle} ${className || ''}`;

    return (
        <button onClick={onClick} disabled={disabled} className={combined}
        onMouseEnter={() => !disabled && setInternalState('hover')}
        onMouseLeave={() => !disabled && setInternalState('default')}
        onMouseDown={() => !disabled && setInternalState('pressed')}
        onMouseUp={() => !disabled && setInternalState('hover')}>
            {children}
        </button>
    );
};

export default Button;
