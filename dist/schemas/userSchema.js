"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const createUserSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string().min(6),
    dateOfJoining: zod_1.default.date(),
    RoomId: zod_1.default.array(zod_1.default.string()).optional(),
});
exports.createUserSchema = createUserSchema;
