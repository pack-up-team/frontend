import type { Meta, StoryObj } from '@storybook/react';
import Header from '.';

const meta: Meta<typeof Header> = {
    title: 'Components/Header',
    component: Header,
    decorators: [
        (Story) => (
        <div className='fixed inset-0 bg-[#FAFAFA]'>
            <Story />
        </div>
        ),
    ],
    argTypes: {
        pageType: {
            control: { type: 'select' },
            options: ['default', 'landing', 'login', 'signup'],
            description: '헤더의 페이지 타입',
        },
        notificationCount: {
            control: { type: 'number' },
            description: '알림 개수',
        },
    },
    args: {
        pageType: 'default',
        notificationCount: 0,
    },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
    render: (args) => <Header {...args} />,
};
