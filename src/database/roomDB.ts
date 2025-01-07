// src/database/roomDB.ts

import { userExists } from "../middlewares/roomDbMiddelwares";
import { Room } from "../types/room";

export class roomDatabase {
    private rooms: Room[] = [];
    private dataPathRooms: string = 'rooms.json';

    constructor() {
        console.log("Room Database initialized!");
    }

    // Clear method specifically for testing
    public clearDatabase(): void {
        this.rooms = [];
    }

    private generateRoomId(): string | null {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const length = 9;
            let roomId = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                roomId += characters[randomIndex];

                if ((i + 1) % 3 === 0 && i !== length - 1) {
                    roomId += "-";
                }
            }
            return roomId;
        } catch (error) {
            console.error("Error generating room id:", error);
            return null;
        }
    }

    private checkDuplicateRoom(ROOMID: string, ROOMNAME: string): boolean | null {
        try {
            const room = this.rooms.find((room) => room.roomId === ROOMID || room.roomName === ROOMNAME);
            if (room) {
                console.log("Room already exists!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking duplicate room:", error);
            return null;
        }
    }

    private createRoomMiddleware(ROOMNAME: string): boolean {
        try {
            if (!ROOMNAME) return false;
            if (ROOMNAME.length >= 256) return false;
            if (ROOMNAME.trim().length === 0) return false;
            return true;
        } catch (error) {
            console.error("Error creating room middleware:", error);
            return false;
        }
    }

    public createRoom(ROOMNAME: string): Room | null {
        try {
            if (!this.createRoomMiddleware(ROOMNAME)) return null;
            const TROOMNAME = ROOMNAME.trim();
            const roomId = this.generateRoomId();
            if (!roomId) return null;
            if (this.checkDuplicateRoom(roomId, TROOMNAME)) return null;

            const newRoom: Room = {
                roomId: roomId,
                roomName: TROOMNAME,
                dateOfCreation: new Date(),
                users: []
            };
            this.rooms.push(newRoom);
            return newRoom;
        } catch (error) {
            console.error("Error creating room:", error);
            return null;
        }
    }

    public addUserToRoom(ROOMID: string, USERID: string): string | null {
        try {
            if (!ROOMID || !USERID) {
                console.log("Room or user id is empty!");
                return null;
            }
            if (!userExists(USERID)) {
                console.log("User does not exist");
                return null;
            }
            const room = this.rooms.find((room) => room.roomId === ROOMID);
            if (!room) {
                console.log("Room does not exist!");
                return null;
            }
            room.users.push(USERID);
            return room.roomId;
        } catch (error) {
            console.error("Error adding user to room:", error);
            return null;
        }
    }

    public getAllRooms(): Room[] {
        return this.rooms;
    }
}

// Test instance
export const testRoomDB = new roomDatabase();