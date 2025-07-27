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

    const stateStyle = { default: 'rounded-lg border border-[#CCC]', active: 'rounded-lg border border-[#141414]', error: 'rounded-lg border border-[#D90050]' }[state];

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
            <label className='text-base font-medium leading-normal text-[#141414] font-pretendard'>{label}</label>
            <div className='relative w-[343px] h-[56px]'>
                {iconLeft}
                <input type={inputType} value={value} onChange={onChange} placeholder={placeholder} className={`${stateStyle} ${iconLeft ? 'pl-[42px]' : 'pl-4'} absolute top-0 left-0 w-[343px] h-[56px]`}></input>
                {isPassword && (
                    <div onClick={() => setShowPassword((prev) => !prev)} className='absolute top-[19px] right-4 w-[18px] h-[18px] cursor-pointer'>
                        {showPassword ? <EyeOffIcon className='absolute top-0 right-0 w-[18px] h-[18px]' /> : <EyeIcon className='absolute top-0 right-0 w-[18px] h-[18px]' />}
                    </div>
                )}
            </div>
            {state === 'error' && errorMessage && (
                <p className='self-stretch text-[#D90050] font-pretendard text-[14px] font-medium leading-none'>{errorMessage}</p>
            )}
        </div>
    );
};

export default FormInput;
