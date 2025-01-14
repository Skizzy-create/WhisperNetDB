import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const inputValidator = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.body.dateOfJoining) {
                req.body.dateOfJoining = new Date(req.body.dateOfJoining);
            }
            const isValid = schema.safeParse(req.body);
            if (!isValid.success) {
                res.status(400).json({
                    msg: "Invalid data!",
                    errors: isValid.error,
                    success: false,
                });
                return;
            }
            next();
        } catch (e) {
            console.error(e);
            res.status(400).json({
                msg: "Internal Server Error",
                success: false,
            });
            return;
        };
    };
};

export { inputValidator };