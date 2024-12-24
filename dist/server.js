"use strict";
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
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api/v1', index_js_1.default);
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
        res.json({ msg: 'main page' });
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
;
main();
