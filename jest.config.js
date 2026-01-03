const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    // Handle module aliases (this should match your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mocks for CSS and image files
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    // Use ts-jest for TypeScript files
    '^.+\.(ts|tsx)$': 'ts-jest',
    // Use babel-jest for JavaScript files (if any)
    '^.+\.(js|jsx|mjs|cjs)$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/(?!next-i18next|react-i18next)/']
};

module.exports = createJestConfig(customJestConfig);
