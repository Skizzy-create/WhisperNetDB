// src/__tests__/server.test.ts
import request from 'supertest';
import express, { Application } from 'express';
import mainRoute from '../routes/index';

describe('Server', () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/v1', mainRoute);
        app.use(express.urlencoded({ extended: true }));
    });

    it('should respond to main route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'main page');
    });

    it('should parse JSON correctly', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({ username: 'test', password: 'test123' });
        expect(response.status).toBe(400); // Should fail validation but parse JSON
    });
});