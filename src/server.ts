import express, { Application } from 'express';
import mainRoute from './routes/index.js'
import userDatabase from './database/userDB.js';

const PORT = 8080
const userDB = new userDatabase();
async function main() {
    const app: Application = express();
    app.use(express.json());
    app.use('/api/v1', mainRoute);
    app.use(express.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
        res.json({ msg: 'main page' });
    });

    await userDB.loadUsers();
    console.log("Creating admin user...");
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
main();
export { userDB };