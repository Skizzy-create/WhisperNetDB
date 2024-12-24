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
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({
        msg: "User Router"
    });
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const dateOfJoining = req.body.dateOfJoining;
        const RoomId = req.body.RoomId;
        const user = yield server_1.userDB.createUser(username, password, dateOfJoining, RoomId);
        if (user === null) {
            return res.status(400).json({
                msg: "User already exists! / Invalid data"
            });
        }
        ;
        console.log(user);
        return res.json({
            msg: "User created successfully!",
            user: user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error!"
        });
    }
}));
exports.default = router;
