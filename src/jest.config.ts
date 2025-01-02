export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: [
        '/node_modules/(?!(your-esm-package|another-esm-package)/)',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Maps @/ to the src folder
        '^(\\.{1,2}/.*)\\.js$': '$1',  // Fixes imports with .js extensions
    },
    transform: {
        '^.+\\.[tj]sx?$': [
            'babel-jest',
            {
                presets: [
                    ['@babel/preset-env', { targets: { node: 'current' } }],
                    '@babel/preset-typescript',
                ],
            },
        ],
    },
    testMatch: [
        "**/src/**/__test__/**/*.test.ts" // Matches test files in __test__ directories
    ],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};
