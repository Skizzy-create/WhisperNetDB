// src/__tests__/setup.ts

beforeEach(() => {
    // Clear all mocks and instances before each test
    jest.clearAllMocks();
});

afterEach(() => {
    // Clean up after each test
});

// Mock environment variables
process.env.TOKEN_SECRET = 'test-secret-key';