// src/__tests__/routes/userRoutes.test.ts
import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/userRoutes';

describe('User Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1/user', userRouter);
    });

    describe('POST /register', () => {
        it('should register new user with valid data', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'testuser',
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
        it('should login with valid credentials', async () => {
            // First register a user
            await request(app)
                .post('/api/v1/user/register')
                .send({
                    username: 'logintest',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                });

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
});