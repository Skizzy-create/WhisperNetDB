"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLogin = exports.validateUserSignUp = void 0;
const userSchema_1 = require("../schemas/userSchema");
const validateUserSignUp = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const dateOfJoining = new Date(req.body.dateOfJoining);
    const RoomId = req.body.RoomId;
    try {
        const isValid = userSchema_1.createUserSchema.safeParse({
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
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            msg: "Invalid data!",
        });
    }
};
exports.validateUserSignUp = validateUserSignUp;
const validateUserLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const isValid = userSchema_1.loginUserSchema.safeParse({
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
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            msg: "Invalid data!",
        });
    }
};
exports.validateUserLogin = validateUserLogin;
