import express, { Application } from 'express';
import mainRoute from './routes/index.js'
import userDatabase from './database/userDB.js';
import roomDatabase from './database/roomDB.js';

const PORT = 8080
const userDB = new userDatabase();
const roomDB = new roomDatabase();
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


    // // chekcing time to create user
    // const start = Date.now();
    // await userDB.createUser("test01", "test", new Date(), []);
    // const end = Date.now();

    // console.log(`Time taken to create user: ${end - start}ms`);
    // console.log(`Time taken to create user: ${(end - start) / 1000} seconds`);
    // console.log(`Time taken to create user: ${(end - start) / 60000} mins`);

    // const start2 = Date.now();
    // await testFetching();
    // const end2 = Date.now();
    // console.log(`Time taken to fetch 10K user: ${end2 - start2}ms`);
    // console.log(`Time taken to fetch 10K user: ${(end2 - start2) / 1000} seconds`);
    // console.log(`Time taken to fetch 10K user: ${(end2 - start2) / 60000} mins`);

};
main();
export {
    userDB,
    roomDB
};

// async function testFetching() {
//     console.log("test in progress");
//     // get a random number from - to 10,000,000 and append with the users tring
//     for (let i = 0; i < 100000; i++) {
//         const randomNumber = Math.floor(Math.random() * 1000000);
//         const username = `user${randomNumber}`;
//         const userId = await userDB.fetchUserId(username);
//     }
// }