// src/server.ts
import express, { Application } from 'express';
import mainRoute from './routes/index'
import userDatabase from './database/userDB';
import roomDatabase from './database/roomDB';

export const userDB = new userDatabase();
export const roomDB = new roomDatabase();

export async function createApp(): Promise<Application> {
    const app: Application = express();

    app.use(express.json());
    app.use('/api/v1', mainRoute);
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (_, res) => {
        res.json({ msg: 'main page' });
    });

    await userDB.loadUsers();

    return app;
}

if (process.env.NODE_ENV !== 'test') {
    const PORT = 8080;
    createApp().then(app => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    });
}