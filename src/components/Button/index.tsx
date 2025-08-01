import { useState } from 'react';

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'fill' | 'line';
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string; // 사용자 정의 스타일
};

const styleMap = {
    fill: {
        default: 'border border-transparent bg-[#411BFF] text-white',
        hover: 'border border-transparent bg-[#2500DB] text-white',
        pressed: 'border border-transparent bg-[#1B00A1] text-white',
        disabled: 'border border-transparent bg-[#E6E6E6] text-[#949494]'
    },
    line: {
        default: 'border border-[#CCCCCC] text-[#141414]',
        hover: 'border border-[#B8B8B8] bg-[#FAFAFA] text-[#141414]',
        pressed: 'border border-[#949494] bg-[#F0F0F0] text-[#141414]',
        disabled: 'border border-[#E6E6E6] text-[#949494]'
    }
};

const Button = ({
    type = 'button',
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setInternalState('pressed');
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            setInternalState('hover');
            onClick?.();
        }
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={combined} aria-disabled={disabled}
        onMouseEnter={() => !disabled && setInternalState('hover')}
        onMouseLeave={() => !disabled && setInternalState('default')}
        onMouseDown={() => !disabled && setInternalState('pressed')}
        onMouseUp={() => !disabled && setInternalState('hover')}
        onFocus={() => !disabled && setInternalState('hover')}
        onBlur={() => !disabled && setInternalState('default')}
        onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            {children}
        </button>
    );
};

export default Button;
