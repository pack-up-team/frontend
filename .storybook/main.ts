import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)' // stories 폴더 추가
  ],
  "addons": ['@storybook/addon-essentials'],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  }
};
export default config;