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
exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "defaultTokenSecretsdknfkjsdnfsnflwenfeofnewwlcfnoweifnweolnfwloernsdfikwebfcs";
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Hashing password...");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.log("Error while hashing password");
        console.error(error);
        return "";
    }
    ;
});
exports.hashPassword = hashPassword;
const comparePassword = (hashPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(password, hashPassword);
    }
    catch (error) {
        console.log("Error while comparing password");
        console.error(error);
        return null;
    }
    return null;
});
exports.comparePassword = comparePassword;
const generateToken = (USERNAME, UID) => {
    try {
        console.log("Generating token...");
        const payload = {
            USERNAME,
            UID
        };
        const token = jsonwebtoken_1.default.sign(payload, TOKEN_SECRET, {
            expiresIn: '10h'
        });
        return token;
    }
    catch (error) {
        console.log("Error while generating token");
        console.error(error);
        return null;
    }
    ;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        console.log("Error while decoding token");
        console.error(error);
        return null;
    }
    ;
};
exports.verifyToken = verifyToken;
