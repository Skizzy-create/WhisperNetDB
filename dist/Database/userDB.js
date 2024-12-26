"use strict";
// /d:/Projects/WhisperNet/src/Database/userDB.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const generateUID_js_1 = __importDefault(require("../util/generateUID.js"));
const authOps_js_1 = require("../auth/authOps.js");
;
class userDatabase {
    constructor() {
        this.users = [];
        this.loadUsers = () => __awaiter(this, void 0, void 0, function* () {
            // write the file if it does not exist
            try {
                console.log("Checking if data file exists...");
                yield fs_1.default.promises.access("data.json");
                console.log("Data file exists!");
            }
            catch (error) {
                console.log("Data file does not exist!");
                console.log("Creating data file...");
                yield fs_1.default.promises.writeFile("data.json", "[]");
                console.log("Data file created successfully!");
            }
            console.log("Loading User data ....");
            try {
                const data = yield fs_1.default.promises.readFile("data.json", "utf-8");
                if (!data) {
                    console.log("No data found!");
                    return;
                }
                const users = JSON.parse(data);
                this.users = users;
                console.log("User loaded sucessfully!");
            }
            catch (error) {
                console.log("Error while loading users!");
                console.error(error);
            }
        });
        this.checkDuplicateUser = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Checking for duplicate users...");
                const user = this.users.find((user) => user.username === username);
                if (user) {
                    console.log("User already exists!");
                    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                    console.log(userWithoutPassword);
                    return true;
                }
                console.log("User does not exist!");
                return false;
            }
            catch (error) {
                console.log("Error while checking for duplicate users!");
                console.error(error);
                return true;
            }
        });
        this.createUser = (username, password, dateOfJoining, RoomId) => __awaiter(this, void 0, void 0, function* () {
            console.log("Initializing Create User...");
            const abort = yield this.checkDuplicateUser(username);
            if (abort) {
                console.log("Aborting user creation!");
                return null;
            }
            ;
            const hashedPassword = yield (0, authOps_js_1.hashPassword)(password);
            const hashedUid = yield (0, generateUID_js_1.default)(username, password);
            const user = { username, uid: hashedUid, dateOfJoining, RoomId, password: hashedPassword };
            this.users.push(user);
            console.log("User created successfully!");
            // await this.logDataTofile();
            return user;
        });
        this.loginUser = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const userExists = this.findOne({ username: username });
            if (!userExists || userExists === undefined || userExists === null || !userExists.password || !userExists.uid) {
                return null;
            }
            ;
            const isValid = yield (0, authOps_js_1.comparePassword)(userExists.password, password);
            if (!isValid) {
                console.log("Invalid password! -- Login User");
                return null;
            }
            ;
            console.log("User logged in successfully!");
            return userExists.uid;
        });
        this.fetchUserId = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching user ID...");
                const userId = this.users.find((user) => user.username === username);
                if (userId) {
                    console.log("User ID found!");
                    return userId.uid;
                }
                console.log("User ID not found!");
                return null;
            }
            catch (error) {
                console.log("Error fetching user ID");
                return null;
            }
        });
        this.findOne = (criteria, matchAll = true) => {
            console.log("Looking for one user...");
            try {
                const user = this.users.find((user) => {
                    const conditions = [
                        criteria.username ? user.username === criteria.username : true,
                        criteria.uid ? user.uid === criteria.uid : true,
                        criteria.dateOfJoining ? user.dateOfJoining === criteria.dateOfJoining : true,
                        criteria.socketId ? user.socketId === criteria.socketId : true,
                    ];
                    return matchAll ? conditions.every(Boolean) : conditions.some(Boolean);
                });
                if (!user) {
                    console.log("User not found!");
                    return null;
                }
                console.log("User found!");
                console.log(user);
                return user;
            }
            catch (error) {
                console.log("Error - FindOne --> User DB");
                console.error(error);
                return null;
            }
        };
        this.logDataTofile = () => __awaiter(this, void 0, void 0, function* () {
            console.log("Logging data to file...");
            const dataWithNewLines = JSON.stringify(this.users, null, 2);
            try {
                yield fs_1.default.promises.writeFile('data.json', dataWithNewLines);
                console.log("Data logged to file successfully!");
            }
            catch (error) {
                console.log("Error while logging data to file!");
                console.error(error);
            }
        });
        console.log("User Database initialized!");
    }
    ;
}
exports.default = userDatabase;
// Function names from the UserDatabase class
// checkDuplicateUser ✅
// createUser ✅
// fetchUserId ✅
// loginUser
// findOne
// findUserById
// deleteUser
// updateUser
// listAllUsers
// findAll
