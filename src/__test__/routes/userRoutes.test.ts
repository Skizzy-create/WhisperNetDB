// src/__test__/routes/userRoutes.test.ts
import request from 'supertest';
import { createApp } from '../../server';
import { userDB } from '../../server';
import { Application } from 'express';

describe('User Routes', () => {
    let app: Application;
    let authToken: string;

    beforeAll(async () => {
        app = await createApp();
    });

    beforeEach(async () => {
        // Reset users before each test
        const users = userDB.listAllUsers();
        users.forEach(user => userDB.deleteUser(user.uid));
    });

    describe('GET /', () => {
        it('should return main page message', async () => {
            const response = await request(app).get('/api/v1/user/');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'User Router');
        });
    });

    describe('POST /register', () => {
        it('should register new user with valid data', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'newtestuser',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg', 'User created successfully!');
            expect(response.body).toHaveProperty('Token');
            expect(response.body.user).toHaveProperty('username', 'newtestuser');
        });

        it('should reject registration with missing fields', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'test'
                });

            expect(response.status).toBe(500);
        });

        it('should reject registration with invalid date format', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'test',
                    password: 'password123',
                    dateOfJoining: 'invalid-date',
                    RoomId: []
                });

            expect(response.status).toBe(400);
        });

        it('should reject duplicate username registration', async () => {
            // First registration
            await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'duplicateuser',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });

            // Duplicate registration
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'duplicateuser',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'User already exists! / Invalid data');
        });
    });

    describe('POST /login', () => {
        beforeEach(async () => {
            // Create test user before each login test
            await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'logintest',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'logintest',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('Token');
            expect(response.body).toHaveProperty('uid');
            authToken = response.body.Token;
        });

        it('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'logintest',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Invalid username or password!');
        });

        it('should reject login with non-existent username', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Invalid username or password!');
        });

        it('should reject login with missing fields', async () => {
            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'logintest'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg', 'Invalid data!');
        });
    });

    // Test error handling
    describe('Error Handling', () => {
        it('should handle internal server errors in registration', async () => {
            // Mock error by temporarily breaking userDB
            const originalCreateUser = userDB.createUser;
            userDB.createUser = async () => { throw new Error('Simulated error'); };

            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'errortest',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Internal Server Error! -- User register Route');

            // Restore original function
            userDB.createUser = originalCreateUser;
        });

        it('should handle internal server errors in login', async () => {
            // Mock error by temporarily breaking userDB
            const originalLoginUser = userDB.loginUser;
            userDB.loginUser = async () => { throw new Error('Simulated error'); };

            const response = await request(app)
                .post('/api/v1/user/login')
                .send({
                    username: 'logintest',
                    password: 'password123'
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('msg', 'Internal Server Error! -- User register Route');

            // Restore original function
            userDB.loginUser = originalLoginUser;
        });
    });

    afterAll(async () => {
        // Clean up after all tests
        const users = userDB.listAllUsers();
        users.forEach(user => userDB.deleteUser(user.uid));
    });
});