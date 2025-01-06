// File: src/__tests__/middlewares/roomDbMiddlewares.test.ts

import { userExists } from '../../middlewares/roomDbMiddelwares';
import { userDB } from '../../server';

// Mock the userDB
jest.mock('../../server', () => ({
    userDB: {
        findUserById: jest.fn()
    }
}));

describe('roomDbMiddlewares', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('userExists', () => {
        it('should return true when user exists', () => {
            (userDB.findUserById as jest.Mock).mockReturnValueOnce({ id: 'user123' });
            const result = userExists('user123');
            expect(result).toBe(true);
            expect(userDB.findUserById).toHaveBeenCalledWith('user123');
        });

        it('should return false when user does not exist', () => {
            (userDB.findUserById as jest.Mock).mockReturnValueOnce(null);
            const result = userExists('nonexistent');
            expect(result).toBe(false);
            expect(userDB.findUserById).toHaveBeenCalledWith('nonexistent');
        });

        it('should return false when findUserById throws an error', () => {
            (userDB.findUserById as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Database error');
            });
            const result = userExists('user123');
            expect(result).toBe(false);
            expect(userDB.findUserById).toHaveBeenCalledWith('user123');
        });

        it('should return false for empty user ID', () => {
            const result = userExists('');
            expect(result).toBe(false);
            expect(userDB.findUserById).toHaveBeenCalledWith('');
        });

        it('should handle null user ID', () => {
            const result = userExists(null as any);
            expect(result).toBe(false);
            expect(userDB.findUserById).toHaveBeenCalledWith(null);
        });

        it('should handle undefined user ID', () => {
            const result = userExists(undefined as any);
            expect(result).toBe(false);
            expect(userDB.findUserById).toHaveBeenCalledWith(undefined);
        });
    });
});