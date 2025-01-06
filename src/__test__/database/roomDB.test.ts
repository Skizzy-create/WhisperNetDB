// File: src/__tests__/database/roomDB.test.ts

// Mock the middleware module
jest.mock('../../middlewares/roomDbMiddelwares', () => ({
    userExists: jest.fn()
}));

import { testRoomDB } from '../../database/roomDB';
import { userExists } from '../../middlewares/roomDbMiddelwares';
import { Room } from '../../types/room';

// Previous test sections remain the same...

describe('addUserToRoom', () => {
    let validRoom: Room;

    beforeEach(() => {
        testRoomDB.clearDatabase();
        jest.clearAllMocks();
        (userExists as jest.Mock).mockReturnValue(true);
        validRoom = testRoomDB.createRoom('TestRoom') as Room;
    });

    it('should successfully add user to room', () => {
        const result = testRoomDB.addUserToRoom(validRoom.roomId, 'user123');
        expect(result).toBe(validRoom.roomId);
        expect(userExists).toHaveBeenCalledWith('user123');

        const rooms = testRoomDB.getAllRooms();
        const updatedRoom = rooms.find(r => r.roomId === validRoom.roomId);
        expect(updatedRoom?.users).toContain('user123');
    });

    it('should handle empty room ID', () => {
        const result = testRoomDB.addUserToRoom('', 'user123');
        expect(result).toBeNull();
        expect(userExists).not.toHaveBeenCalled();
    });

    it('should handle empty user ID', () => {
        const result = testRoomDB.addUserToRoom(validRoom.roomId, '');
        expect(result).toBeNull();
        expect(userExists).not.toHaveBeenCalled();
    });

    it('should handle non-existent room', () => {
        const result = testRoomDB.addUserToRoom('NON-EXI-STT', 'user123');
        expect(result).toBeNull();
        expect(userExists).toHaveBeenCalledWith('user123');
    });

    it('should handle non-existent user', () => {
        (userExists as jest.Mock).mockReturnValue(false);
        const result = testRoomDB.addUserToRoom(validRoom.roomId, 'nonexistentUser');
        expect(result).toBeNull();
        expect(userExists).toHaveBeenCalledWith('nonexistentUser');

        const room = testRoomDB.getAllRooms().find(r => r.roomId === validRoom.roomId);
        expect(room?.users).not.toContain('nonexistentUser');
    });

    it('should allow multiple users in same room', () => {
        testRoomDB.addUserToRoom(validRoom.roomId, 'user1');
        testRoomDB.addUserToRoom(validRoom.roomId, 'user2');
        testRoomDB.addUserToRoom(validRoom.roomId, 'user3');

        expect(userExists).toHaveBeenCalledWith('user1');
        expect(userExists).toHaveBeenCalledWith('user2');
        expect(userExists).toHaveBeenCalledWith('user3');

        const room = testRoomDB.getAllRooms().find(r => r.roomId === validRoom.roomId);
        expect(room?.users).toContain('user1');
        expect(room?.users).toContain('user2');
        expect(room?.users).toContain('user3');
        expect(room?.users.length).toBe(3);
    });

    it('should handle null room ID', () => {
        const result = testRoomDB.addUserToRoom(null as any, 'user123');
        expect(result).toBeNull();
        expect(userExists).not.toHaveBeenCalled();
    });

    it('should handle null user ID', () => {
        const result = testRoomDB.addUserToRoom(validRoom.roomId, null as any);
        expect(result).toBeNull();
        expect(userExists).not.toHaveBeenCalled();
    });

    it('should handle undefined values', () => {
        const result = testRoomDB.addUserToRoom(undefined as any, undefined as any);
        expect(result).toBeNull();
        expect(userExists).not.toHaveBeenCalled();
    });

    it('should handle errors during user addition', () => {
        (userExists as jest.Mock).mockImplementation(() => {
            throw new Error('Unexpected error');
        });
        const result = testRoomDB.addUserToRoom(validRoom.roomId, 'user123');
        expect(result).toBeNull();
        expect(userExists).toHaveBeenCalledWith('user123');
    });

    it('should add multiple users sequentially', () => {
        const userIds = ['user1', 'user2', 'user3', 'user4', 'user5'];

        userIds.forEach(userId => {
            const result = testRoomDB.addUserToRoom(validRoom.roomId, userId);
            expect(result).toBe(validRoom.roomId);
            expect(userExists).toHaveBeenCalledWith(userId);
        });

        const room = testRoomDB.getAllRooms().find(r => r.roomId === validRoom.roomId);
        expect(room?.users).toEqual(userIds);
        expect(room?.users.length).toBe(userIds.length);
    });

    it('should preserve existing users when adding new ones', () => {
        testRoomDB.addUserToRoom(validRoom.roomId, 'user1');
        const roomBefore = testRoomDB.getAllRooms().find(r => r.roomId === validRoom.roomId);
        const userCountBefore = roomBefore?.users.length;

        testRoomDB.addUserToRoom(validRoom.roomId, 'user2');
        const roomAfter = testRoomDB.getAllRooms().find(r => r.roomId === validRoom.roomId);

        expect(roomAfter?.users.length).toBe((userCountBefore || 0) + 1);
        expect(roomAfter?.users).toContain('user1');
        expect(roomAfter?.users).toContain('user2');
    });
});