// File: /d:/Projects/WhisperNetDB/src/middlewares/usersSchemaValidators.ts

import { NextFunction, Request, Response } from "express";
import { SafeParseReturnType } from "zod";
import { createUserSchema, loginUserSchema } from "../schemas/userSchema";

const validateUserSignUp = (req: Request, res: Response, next: NextFunction): any => {
    const username = req.body.username;
    const password = req.body.password;
    const dateOfJoining = new Date(req.body.dateOfJoining);
    const RoomId = req.body.RoomId;

    try {
        const isValid: SafeParseReturnType<any, any> = createUserSchema.safeParse({
            username: username,
            password: password,
            dateOfJoining: dateOfJoining,
            RoomId: RoomId,
        });

        console.log("Signup Route Called");
        console.log("isValid zod  = " + isValid.success);

        if (!isValid.success) {
            return res.status(400).json({
                msg: "Invalid data!",
                errors: isValid.error,
                success: false,
            });
        }

        next(); // Call next() to pass control to the next middleware
    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: "Invalid data!",
        });
    }
};

const validateUserLogin = (req: Request, res: Response, next: NextFunction): any => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const isValid: SafeParseReturnType<any, any> = loginUserSchema.safeParse({
            username: username,
            password: password,
        });

        console.log("Login Route Called");
        console.log("isValid zod  = " + isValid.success);

        if (!isValid.success) {
            return res.status(400).json({
                msg: "Invalid data!",
                errors: isValid.error,
                success: false,
            });
        }

        next(); // Call next() to pass control to the next middleware
    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: "Invalid data!",
        });
    }
}

export {
    validateUserSignUp,
    validateUserLogin
};