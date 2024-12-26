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

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    // total users in DB count
    console.log("Total Users = ", userDB.users.length);

    // chekcing time to create user
    const start = Date.now();
    await userDB.createUser("test01", "test", new Date(), []);
    const end = Date.now();

    console.log(`Time taken to create user: ${end - start}ms`);
    console.log(`Time taken to create user: ${(end - start) / 1000} seconds`);
    console.log(`Time taken to create user: ${(end - start) / 60000} mins`);
};
main();
export { userDB };