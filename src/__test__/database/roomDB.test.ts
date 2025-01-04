// src/__tests__/database/roomDB.test.ts
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

        it('should not create room with empty name', () => {
            const result = roomDB.createRoom('');
            expect(result).toBeNull();
        });

        it('should not create room with very long name', () => {
            const longName = 'a'.repeat(256);
            const result = roomDB.createRoom(longName);
            expect(result).toBeNull();
        });

        it('should create multiple unique rooms', () => {
            const room1 = roomDB.createRoom('Room1');
            const room2 = roomDB.createRoom('Room2');
            const room3 = roomDB.createRoom('Room3');

            expect(room1).not.toBeNull();
            expect(room2).not.toBeNull();
            expect(room3).not.toBeNull();
        });

        it('should handle special characters in room name', () => {
            const result = roomDB.createRoom('Test Room #1 @Special');
            expect(result).not.toBeNull();
        });

        it('should handle concurrent room creation', () => {
            const results = Array(10).fill(null).map(() =>
                roomDB.createRoom('ConcurrentRoom')
            );

            const successfulCreations = results.filter(result => result !== null);
            expect(successfulCreations.length).toBe(1);
        });

        it('should handle room name with leading/trailing spaces', () => {
            const result = roomDB.createRoom('  TestRoom  ');
            expect(result).not.toBeNull();
            expect((result as any).name).toBe('TestRoom');
        });
    });

    describe('Room ID Generation', () => {
        it('should generate room ID in correct format', () => {
            const result = roomDB.createRoom('TestRoom') as any;
            expect(result.roomId).toMatch(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
        });

        it('should generate unique room IDs', () => {
            const room1 = roomDB.createRoom('Room1') as any;
            const room2 = roomDB.createRoom('Room2') as any;
            expect(room1.roomId).not.toBe(room2.roomId);
        });
    });

    describe('Error Handling', () => {
        it('should handle null room name', () => {
            const result = roomDB.createRoom(null as any);
            expect(result).toBeNull();
        });

        it('should handle undefined room name', () => {
            const result = roomDB.createRoom(undefined as any);
            expect(result).toBeNull();
        });

        it('should handle non-string room name', () => {
            const result = roomDB.createRoom(123 as any);
            expect(result).toBeNull();
        });

        it('should reject room names with only spaces', () => {
            const result = roomDB.createRoom('   ');
            expect(result).toBeNull();
        });

        it('should handle room names with numbers only', () => {
            const result = roomDB.createRoom('12345');
            expect(result).not.toBeNull();
        });
    });

    describe('Room Properties', () => {
        it('should set correct creation date', () => {
            const before = new Date();
            const result = roomDB.createRoom('TestRoom') as any;
            const after = new Date();

            expect(result.dateOfCreation).toBeInstanceOf(Date);
            expect(result.dateOfCreation.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(result.dateOfCreation.getTime()).toBeLessThanOrEqual(after.getTime());
        });

        it('should initialize empty users array', () => {
            const result = roomDB.createRoom('TestRoom') as any;
            expect(result.users).toEqual([]);
        });
    });
});