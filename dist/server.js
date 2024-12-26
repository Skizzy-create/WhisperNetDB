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
exports.userDB = void 0;
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const userDB_js_1 = __importDefault(require("./database/userDB.js"));
const PORT = 8080;
const userDB = new userDB_js_1.default();
exports.userDB = userDB;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/v1', index_js_1.default);
        app.use(express_1.default.urlencoded({ extended: true }));
        app.get('/', (req, res) => {
            res.json({ msg: 'main page' });
        });
        yield userDB.loadUsers();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        // total users in DB count
        console.log("Total Users = ", userDB.users.length);
        // chekcing time to create user
        const start = Date.now();
        yield userDB.createUser("test01", "test", new Date(), []);
        const end = Date.now();
        console.log(`Time taken to create user: ${end - start}ms`);
        console.log(`Time taken to create user: ${(end - start) / 1000} seconds`);
        console.log(`Time taken to create user: ${(end - start) / 60000} mins`);
    });
}
;
main();
