import type { Meta, StoryObj } from '@storybook/react';
import FormInput from '.';

const meta: Meta<typeof FormInput> = {
    title: 'Components/FormInput',
    component: FormInput,
    decorators: [
        (Story) => (
            <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA] p-8">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        label: {
            control: 'text',
            description: '입력 필드 라벨',
        },
        variant: {
            control: { type: 'select' },
            options: ['name', 'email', 'phone', 'password'],
            description: '입력 필드 타입',
        },
        placeholder: {
            control: 'text',
            description: 'placeholder 텍스트',
        },
        state: {
            control: { type: 'select' },
            options: ['default', 'active', 'error'],
            description: '입력 필드 상태',
        },
        errorMessage: {
            control: 'text',
            description: '에러 메시지',
        },
    },
    args: {
        label: '이름',
        variant: 'name',
        placeholder: '이름을 입력하세요',
        value: '',
        onChange: () => {},
        state: 'default',
        errorMessage: '',
    },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
    render: (args) => <FormInput {...args} />,
};
