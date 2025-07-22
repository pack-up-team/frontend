import type { Meta, StoryObj } from '@storybook/react';
import Footer from '.';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <div className='bg-[#FAFAFA] w-[1920px] pt-[20px]'>
        <Story />
      </div>
    ),
  ],
  args: {
    // props 없음
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: (args) => <Footer {...args} />,
};
