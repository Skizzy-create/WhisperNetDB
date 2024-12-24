import { NextFunction, Request, Response } from "express";
import { SafeParseReturnType } from "zod";
import { createUserSchema } from "../schemas/userSchema";

const validateUserSignIp = (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;
    const dateOfJoining = new Date(req.body.dateOfJoining);
    const RoomId = req.body.RoomId;

    try {
        const isValid: SafeParseReturnType<any, any> = createUserSchema.safeParse({
            username: username,
            password: password,
            dateOfJoining: dateOfJoining,
            RoomId: RoomId
        });

        console.log("Signup Route Called");
        console.log("isValid zod  = " + isValid.success);

        if (!isValid.success) {
            return res.status(400).json({
                msg: "Invalid data!",
                errors: isValid.error,
                success: false
            });
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            msg: "Invalid data!"
        });
    };
};

export {
    validateUserSignIp
}