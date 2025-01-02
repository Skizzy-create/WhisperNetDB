// src/__tests__/initial.test.ts
import { userDB } from '../server';

describe('Initial Test Suite', () => {
    it('should be defined', () => {
        expect(userDB).toBeDefined();
    });

    it('should pass a simple test', () => {
        expect(true).toBe(true);
    });
});