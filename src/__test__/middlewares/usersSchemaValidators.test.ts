// src/__tests__/middlewares/usersSchemaValidators.test.ts
import { Request, Response } from 'express';
import { validateUserSignUp, validateUserLogin } from '../../middlewares/usersSchemaValidators';

describe('User Schema Validators', () => {
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

    describe('validateUserSignUp', () => {
        it('should pass valid signup data', () => {
            mockRequest = {
                body: {
                    username: 'testuser',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                }
            };

            validateUserSignUp(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject invalid signup data', () => {
            mockRequest = {
                body: {
                    username: 'test',
                    password: 'short'
                }
            };

            validateUserSignUp(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should reject username with only spaces', () => {
            mockRequest = {
                body: {
                    username: '   ',
                    password: 'password123',
                    dateOfJoining: new Date().toISOString(),
                    RoomId: []
                }
            };

            validateUserSignUp(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });

    describe('validateUserLogin', () => {
        it('should pass valid login data', () => {
            mockRequest = {
                body: {
                    username: 'testuser',
                    password: 'password123'
                }
            };

            validateUserLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject invalid login data', () => {
            mockRequest = {
                body: {
                    username: 'test',
                    password: 'short'
                }
            };

            validateUserLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should reject password with only spaces', () => {
            mockRequest = {
                body: {
                    username: 'testuser',
                    password: '    '
                }
            };

            validateUserLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
});