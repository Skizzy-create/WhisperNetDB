// ../WhisperNetDB/src/auth/auth.ts

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./authOps";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: string | JwtPayload;
};

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader === undefined || authHeader === null) {
            res.status(401).json({
                msg: "Unauthorized Access!"
            });
            return
        };
        if (!authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                msg: "Unauthorized Access!"
            });
            return
        };
        const token = authHeader.split(" ")[1];
        if (token === undefined || token === null) {
            res.status(401).json({
                msg: "Unauthorized Access!"
            });
            return
        };

        const decoded = verifyToken(token);
        if (decoded === null || decoded === undefined) {
            res.status(401).json({
                msg: "Unauthorized Access!"
            });
            return
        };
        req.user = decoded;
        next();
    } catch (e) {
        console.error('Error during token authentication:', e);
        const error = e as any;
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                msg: 'Token expired'
            });
            return
        } else {
            res.status(401).json({
                msg: 'Unauthorized Access!'
            });
            return
        };
    }
};