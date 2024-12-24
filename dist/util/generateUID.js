"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateUID = (USERNAME_1, PASSWORD_1, ...args_1) => __awaiter(void 0, [USERNAME_1, PASSWORD_1, ...args_1], void 0, function* (USERNAME, PASSWORD, TYPE = "USER") {
    console.log("Generating UID...");
    const type = TYPE.toLowerCase();
    const salt = yield bcrypt_1.default.genSalt(10);
    const finalString = `${type}-${USERNAME.toLowerCase()}-${PASSWORD.toLowerCase()}`;
    const hashedUID = yield bcrypt_1.default.hash(finalString, salt);
    console.log("hashed UID = ", hashedUID);
    return hashedUID;
});
exports.default = generateUID;
