import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: [
        '**/src/**/__test__/**/*.test.ts'
    ],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    setupFiles: ['<rootDir>/src/jest.setup.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    testTimeout: 10000,
    // Add these lines to silence console logs
    silent: true,
    // Or use this to be more specific about what to silence
    // setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts']
};

export default config;