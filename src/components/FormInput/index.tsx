import { useState } from 'react';
import { MailIcon, LockIcon, PhoneIcon, EyeIcon, EyeOffIcon } from '../../assets';

type FormInputProps = {
    label: string;
    variant?: 'name' | 'email' | 'phone' | 'password';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    state?: 'default' | 'active' | 'error';
    errorMessage?: string;
};

const FormInput = ({ label, variant = 'name', placeholder, value, onChange, state = 'default', errorMessage }: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // focus 상태 active 스타일 우선 적용
    const effectiveState = isFocused && state !== 'error' ? 'active' : state;

    const stateStyle = { default: 'rounded-lg border border-[#CCC]', active: 'rounded-lg border border-[#141414]', error: 'rounded-lg border border-[#D90050]' }[effectiveState];

    // variant별 아이콘 매핑
    const iconLeft = (() => {
        switch (variant) {
            case 'email':
                return <MailIcon className="absolute top-[19px] left-4 w-[18px] h-[18px]" />;
            case 'phone':
                return <PhoneIcon className="absolute top-[19px] left-4 w-[18px] h-[18px]" />;
            case 'password':
                return <LockIcon className="absolute top-[19px] left-4 w-[18px] h-[18px]" />;
            default:
                return null;
        }
    })();
    
    const isPassword = variant === 'password';
    const inputType = isPassword && !showPassword ? 'password' : 'text';

    return (
        <div className='flex flex-col items-start w-[343px] gap-2'>
            <label htmlFor={`input-${label}`} className='text-base font-medium leading-normal text-[#141414] font-pretendard'>{label}</label>
            <div className='relative w-[343px] h-[56px]'>
                {iconLeft}
                <input id={`input-${label}`} type={inputType} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={state === 'error'} aria-describedby={state === 'error' && errorMessage ? `error-${label}` : undefined}
                className={`${stateStyle} ${iconLeft ? 'pl-[42px]' : 'pl-4'} absolute top-0 left-0 w-[343px] h-[56px] outline-none`}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}></input>
                {isPassword && (
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'} className='absolute top-[19px] right-4 w-[18px] h-[18px] cursor-pointer bg-transparent border-none'>
                        {showPassword ? <EyeOffIcon className='absolute top-0 right-0 w-[18px] h-[18px]' /> : <EyeIcon className='absolute top-0 right-0 w-[18px] h-[18px]' />}
                    </button>
                )}
            </div>
            {state === 'error' && errorMessage && (
                <p id={`error-${label}`} role="alert" className='self-stretch text-[#D90050] font-pretendard text-[14px] font-medium leading-none'>{errorMessage}</p>
            )}
        </div>
    );
};

export default FormInput;
