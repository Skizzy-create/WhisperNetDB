// ../src/routes/roomRoutes.ts

import express, { Request, Response, Router } from 'express';
import { authenticateToken, CustomRequest, } from '../auth/auth';
import { inputValidator } from '../middlewares/universalSchemaValidator';
import { createRoomSchema } from '../schemas/roomSchemas';
import { roomDB } from '../server';

const roomRouter: Router = express.Router();

roomRouter.get('/', (_, res) => {
    res.status(200).json({
        msg: "Room Router"
    });
});

roomRouter.post('/create', authenticateToken, inputValidator(createRoomSchema), async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const roomName = req.body.roomName;
        const newRoom = roomDB.createRoom(roomName);
        if (newRoom === null) {
            return res.status(400).json({
                msg: 'Room already exists or invalid data'
            });
        };
        return res.status(200).json({
            msg: 'Room created successfully!',
            room: newRoom
        });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    };
});

export default roomRouter; 