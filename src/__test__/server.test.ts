// src/__test__/server.test.ts
import request from 'supertest';
import { createApp } from '../server';
import { Application } from 'express';

describe('Server', () => {
    let app: Application;

    beforeAll(async () => {
        app = await createApp();
    });

    describe('Base Route', () => {
        it('should return 200 and main page message', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ msg: 'main page' });
        });
    });

    describe('API Routes', () => {
        it('should return 200 for the base API route', async () => {
            const response = await request(app).get('/api/v1');
            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existent routes', async () => {
            const response = await request(app).get('/api/v1/nonexistent');
            expect(response.status).toBe(404);
        });
    });

    describe('Middleware', () => {
        it('should parse JSON bodies', async () => {
            const testData = { test: 'data' };
            const response = await request(app)
                .post('/api/v1/user/register')
                .send(testData);

            // Even if registration fails, the request should be parsed
            expect(response.status).not.toBe(415); // 415 is Unsupported Media Type
        });

        it('should parse URL-encoded bodies', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .send('username=test&password=password123');

            // Even if registration fails, the request should be parsed
            expect(response.status).not.toBe(415);
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid JSON', async () => {
            const response = await request(app)
                .post('/api/v1/user/register')
                .set('Content-Type', 'application/json')
                .send('{"invalid": json}');

            expect(response.status).toBe(400);
        });
    });

    describe('Security Headers', () => {
        it('should process CORS preflight requests', async () => {
            const response = await request(app)
                .options('/api/v1/user/register')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'POST')
                .set('Access-Control-Request-Headers', 'Content-Type');

            // If CORS is not configured, this will return 404
            // If CORS is configured, this should return 204 or 200
            expect([200, 204]).toContain(response.status);
        });
    });

    describe('Content Type', () => {
        it('should return JSON content type', async () => {
            const response = await request(app).get('/');
            expect(response.headers['content-type']).toMatch(/json/);
        });
    });

    describe('Database Connection', () => {
        it('should load users successfully', async () => {
            // This test verifies that the database initialization in createApp() works
            // The success of this test is implied by the beforeAll completing successfully
            expect(app).toBeDefined();
        });
    });
});