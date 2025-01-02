// src/__test__/routes/userRoutes.test.ts
import request from 'supertest';
import { createApp } from '../../server';
import { userDB } from '../../server';
import { Application } from 'express';

describe('User Routes', () => {
    let app: Application;

    beforeAll(async () => {
        app = await createApp();
    });

    beforeEach(async () => {
        // Reset users before each test
        const users = userDB.listAllUsers();
        users.forEach(user => userDB.deleteUser(user.uid));
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
        });

        it('should reject invalid registration data', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'test',
                    password: 'short'
                });

            expect(response.status).toBe(400);
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
        });
    });

    afterAll(async () => {
        // Clean up after all tests
        const users = userDB.listAllUsers();
        users.forEach(user => userDB.deleteUser(user.uid));
    });
});