
// src/__tests__/database/roomDB.test.ts
import roomDatabase from '../../database/roomDB';

describe('RoomDatabase', () => {
    let roomDB: roomDatabase;

    beforeEach(() => {
        roomDB = new roomDatabase();
    });

    describe('createRoomId', () => {
        it('should create room with valid name', () => {
            const result = roomDB.createRoomId('TestRoom');
            expect(result).not.toBeNull();
        });

        it('should not create duplicate rooms', () => {
            roomDB.createRoomId('TestRoom');
            const duplicate = roomDB.createRoomId('TestRoom');
            expect(duplicate).toBeNull();
        });

        it('should generate valid room ID format', () => {
            const result = roomDB.createRoomId('TestRoom');
            const room = result as any; // Accessing private property for testing
            expect(room.roomId).toMatch(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
        });
    });
});
