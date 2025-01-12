// ../WhisperNetDB/src/schemas/userSchema.ts

import zod from 'zod';

// interface User {
//     username: string;
//     uid: string;
//     password: string;
//     dateOfJoining: Date;
//     RoomId?: string[]; optional
//     socketId?: string; optional
// };

const createUserSchema = zod.object({
    username: zod.string().max(256).nonempty(),
    password: zod.string().min(6).nonempty(),
    dateOfJoining: zod.date(),
    RoomId: zod.string().optional(),
});

const loginUserSchema = zod.object({
    username: zod.string(),
    password: zod.string().min(6),
});

export {
    createUserSchema,
    loginUserSchema
};