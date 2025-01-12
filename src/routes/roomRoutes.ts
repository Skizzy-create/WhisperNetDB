// ../src/routes/roomRoutes.ts

import express, { Request, Response, Router } from 'express';
import { authenticateToken, CustomRequest, } from '../auth/auth';
import { inputValidator } from '../middlewares/universalSchemaValidator';
import { createRoomSchema } from '../schemas/roomSchemas';
import { roomDB, userDB } from '../server';
import { userExists } from '../middlewares/roomDbMiddelwares';

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
        const ROOMID: string = req.body.roomId;
        let USERID: string;
        if (typeof req.user !== 'string' && 'UID' in req.user) {
            USERID = req.user.UID;
        } else {
            return res.status(400).json({
                msg: 'Expected user id in token'
            });
        };

        // Check if user exists
        const userExist = userDB.findUserById(USERID);
        if (!userExist) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        };

        // Check if user is already in a room
        if (userExist.RoomId) {
            if (userExist.RoomId === ROOMID) {
                return res.status(400).json({
                    msg: 'User is already in the room'
                });
            };
            roomDB.removeUserFromRoom(userExist.RoomId, USERID);
        };

        // Add user to room
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
        let USERID: string;
        if (typeof req.user !== 'string' && 'UID' in req.user) {
            USERID = req.user.UID;
        } else {
            return res.status(400).json({
                msg: 'Expected user id in token'
            });
        }

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

roomRouter.get("/all", authenticateToken, (_: Request, res: Response): any => {
    try {
        const rooms = roomDB.getAllRooms();
        return res.status(200).json({
            msg: "Rooms fetched successfully!",
            rooms: rooms
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error!",
            error: error
        });
    }
});
export default roomRouter; 