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
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const usersSchemaValidators_1 = require("../middlewares/usersSchemaValidators");
const authOps_1 = require("../auth/authOps");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({
        msg: "User Router"
    });
});
router.post('/register', usersSchemaValidators_1.validateUserSignUp, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const dateOfJoining = new Date(req.body.dateOfJoining);
        const RoomId = req.body.RoomId;
        const user = yield server_1.userDB.createUser(username, password, dateOfJoining, RoomId);
        if (user === null) {
            return res.status(400).json({
                msg: "User already exists! / Invalid data",
            });
        }
        console.log(user);
        const Token = (0, authOps_1.generateToken)(username, user.uid);
        if (Token === null) {
            return res.status(500).json({
                msg: "Internal Server Error! -- User register Route",
            });
        }
        ;
        res.json({
            msg: "User created successfully!",
            user: user,
            Token: Token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error! -- User register Route",
            error: error
        });
    }
    ;
}));
router.post("/login", usersSchemaValidators_1.validateUserLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const uid = yield server_1.userDB.loginUser(username, password);
        if (uid === null) {
            return res.status(400).json({
                msg: "Invalid username or password!",
            });
        }
        ;
        const token = (0, authOps_1.generateToken)(username, uid);
        if (token === null) {
            return res.status(500).json({
                msg: "Internal Server Error! -- User register Route",
            });
        }
        return res.status(200).json({
            msg: "User logged in successfully!",
            uid: uid,
            Token: token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error! -- User register Route",
            error: error
        });
    }
    ;
}));
exports.default = router;
