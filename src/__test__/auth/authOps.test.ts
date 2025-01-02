// src/__tests__/auth/authOps.test.ts
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../auth/authOps';

describe('Authentication Operations', () => {
    describe('Password Operations', () => {
        it('should hash password correctly', async () => {
            const password = 'testPassword123';
            const hashedPassword = await hashPassword(password);

            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword.length).toBeGreaterThan(0);
        });

        it('should verify correct password', async () => {
            const password = 'testPassword123';
            const hashedPassword = await hashPassword(password);
            const isValid = await comparePassword(hashedPassword, password);

            expect(isValid).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const password = 'testPassword123';
            const hashedPassword = await hashPassword(password);
            const isValid = await comparePassword(hashedPassword, 'wrongPassword');

            expect(isValid).toBe(false);
        });
    });

    describe('Token Operations', () => {
        it('should generate valid token', () => {
            const username = 'testUser';
            const uid = 'test-uid';
            const token = generateToken(username, uid);

            expect(token).not.toBeNull();
            expect(typeof token).toBe('string');
        });

        it('should verify valid token', () => {
            const username = 'testUser';
            const uid = 'test-uid';
            const token = generateToken(username, uid);
            const decoded = verifyToken(token!);

            expect(decoded).not.toBeNull();
            expect(typeof decoded).toBe('object');
            if (typeof decoded === 'object' && decoded !== null) {
                expect(decoded.USERNAME).toBe(username);
                expect(decoded.UID).toBe(uid);
            }
        });

        it('should reject invalid token', () => {
            const decoded = verifyToken('invalid-token');
            expect(decoded).toBeNull();
        });
    });
});