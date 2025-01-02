
// src/__tests__/database/roomDB.test.ts
import roomDatabase from '../../database/roomDB';

describe('RoomDatabase', () => {
    let roomDB: roomDatabase;

    beforeEach(() => {
        roomDB = new roomDatabase();
    });

    describe('createRoom', () => {
        it('should create room with valid name', () => {
            const result = roomDB.createRoom('TestRoom');
            expect(result).not.toBeNull();
        });

        it('should not create duplicate rooms', () => {
            roomDB.createRoom('TestRoom');
            const duplicate = roomDB.createRoom('TestRoom');
            expect(duplicate).toBeNull();
        });

        // it('should generate valid room ID format', () => {
        //     const result = roomDB.createRoom('TestRoom');
        //     const room = result as any; // Accessing private property for testing
        //     expect(room.roomId).toMatch(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
        // });
    });
});
