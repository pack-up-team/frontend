import type { Meta, StoryObj } from '@storybook/react';
import Header from '.';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => (
      <div className='bg-[#FAFAFA] w-[1920px] pb-[20px]'>
        <Story />
      </div>
    ),
  ],
  args: {
    // props 없음
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: (args) => <Header {...args} />,
};
