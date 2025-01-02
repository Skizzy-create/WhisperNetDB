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
            const roomIds: string[] = [];

            const user = await userDB.createUser(username, password, dateOfJoining, roomIds);

            expect(user).not.toBeNull();
            expect(user?.username).toBe(username);
            expect(user?.dateOfJoining).toBe(dateOfJoining);
            expect(user?.RoomId).toEqual(roomIds);
            expect(user?.password).not.toBe(password); // Password should be hashed
        });

        it('should not create duplicate users', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            // Create first user
            await userDB.createUser(username, password, dateOfJoining, roomIds);

            // Try to create duplicate user
            const duplicateUser = await userDB.createUser(username, password, dateOfJoining, roomIds);
            expect(duplicateUser).toBeNull();
        });

        it('should not create user with missing username or password', async () => {
            const user = await userDB.createUser('', '', new Date(), []);
            expect(user).toBeNull();
        });
    });

    describe('loginUser', () => {
        it('should login with valid credentials', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            const user = await userDB.createUser(username, password, dateOfJoining, roomIds);
            const uid = await userDB.loginUser(username, password);

            expect(uid).not.toBeNull();
            expect(uid).toBe(user?.uid);
        });

        it('should not login with invalid password', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            await userDB.createUser(username, password, dateOfJoining, roomIds);
            const uid = await userDB.loginUser(username, 'wrongpassword');

            expect(uid).toBeNull();
        });

        it('should not login for non-existent user', async () => {
            const uid = await userDB.loginUser('nonexistent', 'password123');
            expect(uid).toBeNull();
        });
    });

    describe('findOne', () => {
        it('should find user by username', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            await userDB.createUser(username, password, dateOfJoining, roomIds);
            const foundUser = userDB.findOne({ username });

            expect(foundUser).not.toBeNull();
            expect(foundUser?.username).toBe(username);
        });

        it('should return null for non-existent user', () => {
            const foundUser = userDB.findOne({ username: 'nonexistent' });
            expect(foundUser).toBeNull();
        });
    });

    describe('updateUser', () => {
        it('should update user information', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            const user = await userDB.createUser(username, password, dateOfJoining, roomIds);
            const updatedUser = userDB.updateUser(user!.uid, { username: 'newUsername' });

            expect(updatedUser).not.toBeNull();
            expect(updatedUser?.username).toBe('newUsername');
        });

        it('should return null when updating non-existent user', () => {
            const updatedUser = userDB.updateUser('nonexistent-uid', { username: 'newUsername' });
            expect(updatedUser).toBeNull();
        });
    });

    describe('deleteUser', () => {
        it('should delete existing user', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            const user = await userDB.createUser(username, password, dateOfJoining, roomIds);
            const isDeleted = userDB.deleteUser(user!.uid);

            expect(isDeleted).toBe(true);
            expect(userDB.findUserById(user!.uid)).toBeNull();
        });

        it('should return false when deleting non-existent user', () => {
            const isDeleted = userDB.deleteUser('nonexistent-uid');
            expect(isDeleted).toBe(false);
        });
    });

    describe('listAllUsers', () => {
        it('should list all users after adding them', async () => {
            const user1 = await userDB.createUser('user1', 'password1', new Date(), []);
            const user2 = await userDB.createUser('user2', 'password2', new Date(), []);
            const users = userDB.listAllUsers();

            expect(users.length).toBe(2);
            expect(users).toContainEqual(user1);
            expect(users).toContainEqual(user2);
        });
    });

    describe('findUserById', () => {
        it('should find user by UID', async () => {
            const username = 'testUser';
            const password = 'password123';
            const dateOfJoining = new Date();
            const roomIds: string[] = [];

            const user = await userDB.createUser(username, password, dateOfJoining, roomIds);
            const foundUser = userDB.findUserById(user!.uid);

            expect(foundUser).not.toBeNull();
            expect(foundUser?.uid).toBe(user?.uid);
        });

        it('should return null for non-existent user ID', () => {
            const foundUser = userDB.findUserById('nonexistent-uid');
            expect(foundUser).toBeNull();
        });
    });
});
