process.env.NODE_ENV = 'test';

// Silence console.log during tests
global.console = {
    ...console,
    // Uncomment any methods you want to allow
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Alternative approach: only silence log but keep other console methods
// global.console.log = jest.fn();