import type { Meta, StoryObj } from '@storybook/react';
import Button from '.';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    decorators: [
        (Story) => (
            <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA] p-8">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['fill', 'line'],
            description: '버튼 스타일 타입',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 여부',
        },
        children: {
            control: 'text',
            description: '버튼 안의 콘텐츠',
        },
        className: {
            control: 'text',
            description: '사용자 정의 스타일 클래스',
        },
    },
    args: {
        variant: 'fill',
        disabled: false,
        children: '기본 버튼',
        className: 'w-[343px] h-[50px]',
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    render: (args) => <Button {...args} />,
};
