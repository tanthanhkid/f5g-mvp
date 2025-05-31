const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  // Cấu hình environment cho từng test file
  projects: [
    {
      displayName: 'API Tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/**/api-*.test.ts', '<rootDir>/__tests__/**/database-*.test.ts', '<rootDir>/__tests__/**/integration-*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.api.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
    },
    {
      displayName: 'UI Tests', 
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/__tests__/**/*.test.tsx', '<rootDir>/__tests__/**/components*.test.ts', '<rootDir>/__tests__/**/homepage*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ui.js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
    }
  ],
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    'src/components/**/*.{js,jsx,ts,tsx}',
    'src/app/**/*.{js,jsx,ts,tsx}',
    '!src/app/api/**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig) 