// ../src/routes/roomRoutes.ts

import express, { Response, Router } from 'express';
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

roomRouter.post('/addUserToRoom', authenticateToken, async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const ROOMID = req.body.roomId;
        const USERID = req.body.userId;

        const added = roomDB.addUserToRoom(ROOMID, USERID);
        if (!added) {
            return res.status(400).json({
                msg: 'Error adding user to room'
            });
        };
        return res.status(200).json({
            msg: 'User added to room successfully!',
            roomId: ROOMID
        });
    } catch (error) {
        console.error('Error adding user to room:', error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    };
});

roomRouter.post('/removeUserFromRoom', authenticateToken, async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const ROOMID = req.body.roomId;
        const USERID = req.body.userId;

        const removed = roomDB.removeUserFromRoom(ROOMID, USERID);
        if (!removed) {
            return res.status(400).json({
                msg: 'Error removing user from room'
            });
        };
        return res.status(200).json({
            msg: 'User removed from room successfully!',
            roomId: ROOMID
        });
    } catch (error) {
        console.error('Error removing user from room:', error);
        res.status(500).json({
            msg: 'Internal Server Error'
        });
    };
});
export default roomRouter; 