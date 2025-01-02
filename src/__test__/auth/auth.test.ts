// src/__tests__/auth/auth.test.ts
import { Request, Response } from 'express';
import { authenticateToken } from '../../auth/auth';
import { generateToken } from '../../auth/authOps';

describe('Authentication Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should authenticate valid token', () => {
        const token = generateToken('testuser', 'test-uid');
        mockRequest = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it('should reject missing token', () => {
        mockRequest = {
            headers: {}
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should reject invalid token format', () => {
        mockRequest = {
            headers: {
                authorization: 'InvalidToken'
            }
        };

        authenticateToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
});