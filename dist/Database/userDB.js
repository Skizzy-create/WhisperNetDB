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
const jsonstream_next_1 = __importDefault(require("jsonstream-next"));
const stream_1 = require("stream");
;
class userDatabase {
    constructor() {
        this.users = [];
        this.dataPath = 'data.json';
        this.ensureDataFileExists = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs_1.default.existsSync(this.dataPath)) {
                    yield fs_1.default.promises.writeFile(this.dataPath, '[]');
                    console.log('Data file created successfully!');
                }
            }
            catch (error) {
                console.error('Error ensuring data file exists:', error);
                throw error;
            }
        });
        this.loadUsers = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Check and create file if doesn't exist
                yield this.ensureDataFileExists();
                // Create read stream
                const readStream = fs_1.default.createReadStream(this.dataPath, { encoding: 'utf-8' });
                const jsonStream = jsonstream_next_1.default.parse('*'); // Parse all top-level array elements
                // Process users in chunks
                const processingStream = new stream_1.Transform({
                    objectMode: true,
                    transform: (user, _, callback) => {
                        this.users.push(user);
                        callback();
                    }
                });
                // Handle stream events
                return new Promise((resolve, reject) => {
                    readStream
                        .pipe(jsonStream)
                        .pipe(processingStream)
                        .on('finish', () => {
                        console.log(`Loaded ${this.users.length} users successfully!`);
                        resolve();
                    })
                        .on('error', (error) => {
                        console.error('Error while loading users:', error);
                        reject(error);
                    });
                });
            }
            catch (error) {
                console.error('Error in loadUsers:', error);
                throw error;
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
                // console.log("Fetching user ID...");
                const userId = this.users.find((user) => user.username === username);
                if (userId) {
                    // console.log("User ID found!");
                    return userId.uid;
                }
                // console.log("User ID not found!");
                return null;
            }
            catch (error) {
                // console.log("Error fetching user ID");
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
