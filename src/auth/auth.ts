// File: /d:/Projects/WhisperNetDB/src/auth/auth.ts

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./authOps";
import { JwtPayload } from "jsonwebtoken";

interface CustomResponse extends Response {
    user?: string | JwtPayload;
};

const authenticateToken = (req: Request, res: CustomResponse, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined || authHeader === null) {
        return res.status(401).json({
            msg: "Unauthorized Access!"
        });
    };
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "Unauthorized Access!"
        });
    };
    const token = authHeader.split(" ")[1];
    if (token === undefined || token === null) {
        return res.status(401).json({
            msg: "Unauthorized Access!"
        });
    };

    const decoded = verifyToken(token);
    if (decoded === null || decoded === undefined) {
        return res.status(401).json({
            msg: "Unauthorized Access!"
        });
    };
    res.user = decoded;
    next();
};