import type {Config} from 'jest';

const config: Config = {
	roots: ['<rootDir>/src'],
	preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/ts-jest',
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
};

export default config;