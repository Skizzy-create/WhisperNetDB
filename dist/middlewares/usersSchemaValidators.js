"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserSignIp = void 0;
const userSchema_1 = require("../schemas/userSchema");
const validateUserSignIp = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const dateOfJoining = new Date(req.body.dateOfJoining);
    const RoomId = req.body.RoomId;
    try {
        const isValid = userSchema_1.createUserSchema.safeParse({
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
        }
        ;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            msg: "Invalid data!"
        });
    }
    ;
};
exports.validateUserSignIp = validateUserSignIp;
