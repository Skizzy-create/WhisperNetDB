// src/__test__/database/userDB.test.ts

import userDatabase from "../../database/userDB";

describe('UserDatabase', () => {
    let userDB: userDatabase;

    beforeEach(() => {
        userDB = new userDatabase();
    });

    describe('createUser', () => {
        it('should create a new user with valid data', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);

            expect(user).not.toBeNull();
            expect(user?.username).toBe(username);
            expect(user?.dateOfJoining).toBe(dateOfJoining);
            expect(user?.RoomId).toBe(roomId);
            expect(user?.password).not.toBe(password); // Password should be hashed
        });

        it('should create a new user without roomId', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();

            const user = await userDB.createUser(username, password, dateOfJoining);

            expect(user).not.toBeNull();
            expect(user?.username).toBe(username);
            expect(user?.RoomId).toBeUndefined();
        });

        it('should not create duplicate users', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();

            // Create first user
            await userDB.createUser(username, password, dateOfJoining);

            // Try to create duplicate user
            const duplicateUser = await userDB.createUser(username, password, dateOfJoining);
            expect(duplicateUser).toBeNull();
        });

        it('should not create user with missing password', async () => {
            const user = await userDB.createUser('testUser', '', new Date());
            expect(user).toBeNull();
        });

        it('should create user with socketId', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);
            const updatedUser = userDB.updateUser(user!.uid, { socketId: 'socket-123' });

            expect(updatedUser?.socketId).toBe('socket-123');
        });
    });

    describe('loginUser', () => {
        it('should login with valid credentials', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();

            const user = await userDB.createUser(username, password, dateOfJoining);
            const uid = await userDB.loginUser(username, password);

            expect(uid).not.toBeNull();
            expect(uid).toBe(user?.uid);
        });

        it('should not login with invalid password', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();

            await userDB.createUser(username, password, dateOfJoining);
            const uid = await userDB.loginUser(username, 'wrongpassword');

            expect(uid).toBeNull();
        });

        it('should not login for non-existent user', async () => {
            const uid = await userDB.loginUser('nonexistent', 'password123');
            expect(uid).toBeNull();
        });

        it('should not login with empty credentials', async () => {
            const uid = await userDB.loginUser('', '');
            expect(uid).toBeNull();
        });
    });

    describe('findOne', () => {
        it('should find user by username', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            await userDB.createUser(username, password, dateOfJoining, roomId);
            const foundUser = userDB.findOne({ username });

            expect(foundUser).not.toBeNull();
            expect(foundUser?.username).toBe(username);
            expect(foundUser?.RoomId).toBe(roomId);
        });

        it('should find user by multiple criteria', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);
            const foundUser = userDB.findOne({
                username,
                uid: user!.uid,
                RoomId: roomId
            });

            expect(foundUser).not.toBeNull();
            expect(foundUser?.username).toBe(username);
        });

        it('should return null for non-existent user', () => {
            const foundUser = userDB.findOne({ username: 'nonexistent' });
            expect(foundUser).toBeNull();
        });

        it('should find user with partial match when matchAll is false', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();

            await userDB.createUser(username, password, dateOfJoining);
            const foundUser = userDB.findOne(
                { username, RoomId: 'nonexistent-room' },
                false
            );

            expect(foundUser).not.toBeNull();
            expect(foundUser?.username).toBe(username);
        });
    });

    describe('findAll', () => {
        it('should find all users matching criteria', async () => {
            const roomId = 'room-123';
            await userDB.createUser('user1', 'pass1', new Date(), roomId);
            await userDB.createUser('user2', 'pass2', new Date(), roomId);
            await userDB.createUser('user3', 'pass3', new Date(), 'other-room');

            const users = userDB.findAll({ RoomId: roomId });
            expect(users?.length).toBe(2);
            expect(users?.every(user => user.RoomId === roomId)).toBe(true);
        });

        it('should return empty array when no users match criteria', () => {
            const users = userDB.findAll({ RoomId: 'nonexistent-room' });
            expect(users).toEqual([]);
        });

        it('should find users with multiple criteria', async () => {
            const dateOfJoining = new Date();
            await userDB.createUser('user1', 'pass1', dateOfJoining, 'room-1');
            await userDB.createUser('user2', 'pass2', dateOfJoining, 'room-2');

            const users = userDB.findAll({ dateOfJoining });
            expect(users?.length).toBe(2);
        });
    });

    describe('updateUser', () => {
        it('should update user information', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);
            const updatedUser = userDB.updateUser(user!.uid, {
                username: 'newUsername',
                RoomId: 'new-room-456',
                socketId: 'socket-789'
            });

            expect(updatedUser).not.toBeNull();
            expect(updatedUser?.username).toBe('newUsername');
            expect(updatedUser?.RoomId).toBe('new-room-456');
            expect(updatedUser?.socketId).toBe('socket-789');
        });

        it('should return null when updating non-existent user', () => {
            const updatedUser = userDB.updateUser('nonexistent-uid', { username: 'newUsername' });
            expect(updatedUser).toBeNull();
        });

        it('should maintain unchanged fields after update', async () => {
            const user = await userDB.createUser('testUser', 'password123', new Date(), 'room-123');
            const updatedUser = userDB.updateUser(user!.uid, { username: 'newUsername' });

            expect(updatedUser?.RoomId).toBe('room-123');
            expect(updatedUser?.password).toBe(user?.password);
        });
    });

    describe('deleteUser', () => {
        it('should delete existing user', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);
            const isDeleted = userDB.deleteUser(user!.uid);

            expect(isDeleted).toBe(true);
            expect(userDB.findUserById(user!.uid)).toBeNull();
        });

        it('should return false when deleting non-existent user', () => {
            const isDeleted = userDB.deleteUser('nonexistent-uid');
            expect(isDeleted).toBe(false);
        });

        it('should not affect other users when deleting one user', async () => {
            const user1 = await userDB.createUser('user1', 'pass1', new Date());
            await userDB.createUser('user2', 'pass2', new Date());

            userDB.deleteUser(user1!.uid);
            const allUsers = userDB.listAllUsers();
            expect(allUsers.length).toBe(1);
            expect(allUsers[0].username).toBe('user2');
        });
    });

    describe('listAllUsers', () => {
        it('should list all users after adding them', async () => {
            const user1 = await userDB.createUser('user1', 'password1', new Date(), 'room-1');
            const user2 = await userDB.createUser('user2', 'password2', new Date(), 'room-2');
            const users = userDB.listAllUsers();

            expect(users.length).toBe(2);
            expect(users).toContainEqual(user1);
            expect(users).toContainEqual(user2);
        });

        it('should return empty array when no users exist', () => {
            const users = userDB.listAllUsers();
            expect(users).toEqual([]);
        });

        it('should list users with all their properties', async () => {
            const dateOfJoining = new Date();
            const user = await userDB.createUser('testUser', 'password123', dateOfJoining, 'room-123');
            const updatedUser = userDB.updateUser(user!.uid, { socketId: 'socket-123' });

            const users = userDB.listAllUsers();
            expect(users[0]).toEqual(updatedUser);
        });
    });

    describe('findUserById', () => {
        it('should find user by UID', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomId = 'room-123';

            const user = await userDB.createUser(username, password, dateOfJoining, roomId);
            const foundUser = userDB.findUserById(user!.uid);

            expect(foundUser).not.toBeNull();
            expect(foundUser?.uid).toBe(user?.uid);
            expect(foundUser?.username).toBe(username);
            expect(foundUser?.RoomId).toBe(roomId);
        });

        it('should return null for non-existent user ID', () => {
            const foundUser = userDB.findUserById('nonexistent-uid');
            expect(foundUser).toBeNull();
        });

        it('should find user after updating their information', async () => {
            const user = await userDB.createUser('testUser', 'password123', new Date());
            userDB.updateUser(user!.uid, {
                username: 'updatedUsername',
                RoomId: 'new-room'
            });

            const foundUser = userDB.findUserById(user!.uid);
            expect(foundUser?.username).toBe('updatedUsername');
            expect(foundUser?.RoomId).toBe('new-room');
        });
    });

    describe('Error Handling', () => {
        it('should handle errors in findOne gracefully', () => {
            const result = userDB.findOne({} as any);
            expect(result).toBeNull();
        });

        it('should handle errors in findAll gracefully', () => {
            const result = userDB.findAll({} as any);
            expect(result).toBeNull();
        });

        it('should handle errors in updateUser gracefully', () => {
            const result = userDB.updateUser('', {} as any);
            expect(result).toBeNull();
        });
    });
});