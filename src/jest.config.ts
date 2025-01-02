// src/jest.config.ts
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
    testTimeout: 10000
};

export default config;