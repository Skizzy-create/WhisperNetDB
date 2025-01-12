// src/server.ts
import express, { Application } from 'express';
import mainRoute from './routes/index'
import userDatabase from './database/userDB';
import { roomDatabase } from './database/roomDB';
import { countRequest, countTime } from './util/logs';
// import { roomDB } from './database/roomDB';

export const userDB = new userDatabase();
export const roomDB = new roomDatabase();

// export { roomDB };
export async function createApp(): Promise<Application> {
    const app: Application = express();

    app.use(express.json());
    app.use('/api/v1', mainRoute);
    app.use(express.urlencoded({ extended: true }));
    app.use(countRequest);
    app.use(countTime);

    app.get('/', (_, res) => {
        res.json({ msg: 'main page' });
    });

    await userDB.loadUsers();

    // create new room and add a user to it
    const roomId = roomDB.createRoom('TestRoom');
    //create user
    const user = await userDB.createUser('TestUser', 'TestPassword', new Date(), "");
    console.log("user created", user);
    const added_roomId = roomDB.addUserToRoom(roomId.roomId, user.uid);
    console.log("user added to room", added_roomId);
    return app;
}

if (process.env.NODE_ENV !== 'test') {
    const PORT = 8080;
    (async () => {
        /**
         * Immediately Invoked Function Expression (IIFE) to create and initialize the application.
         * 
         * This function is executed immediately after it is defined, allowing for asynchronous
         * operations to be performed before the rest of the code executes. The `await` keyword
         * is used to wait for the `createApp` function to resolve, ensuring that the application
         * is fully initialized before proceeding.
         * 
         * @returns {Promise<void>} A promise that resolves when the application is created.
         */
        const app = await createApp();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })(); // Function is immediately invoked
}