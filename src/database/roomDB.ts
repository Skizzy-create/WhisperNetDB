// ../WhisperNetDB/src/database/roomDb.ts

interface Room {
    roomId: string;
    roomName: string;
    dateOfCreation: Date;
    users: string[];
};

class roomDatabase {
    private rooms: Room[] = [];
    private dataPathRooms: string = 'rooms.json';

    constructor() {
        console.log("Room Database initialized!");
    };

    private generateRoomId = (): string | null => {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const length = 9;
            let roomId = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                roomId += characters[randomIndex];

                if ((i + 1) % 3 === 0 && i !== length - 1) {
                    roomId += "-";
                };
            };
            return roomId;
        } catch (error) {
            console.error("Error generating room id:", error);
            return null;
        }
    };

    private checkDuplicateRoom = (ROOMID: string, ROOMNAME: string): boolean | null => {
        try {
            const room = this.rooms.find((room) => room.roomId === ROOMID || room.roomName === ROOMNAME);
            if (room) {
                console.log("Room already exists!");
                return true;
            };
            return false;
        } catch (error) {
            console.error("Error checking duplicate room:", error);
            return null;
        };
    };
    private createRoomMiddelware = (ROOMNAME: string): boolean => {
        try {
            if (!ROOMNAME) return false;

            if (ROOMNAME.length >= 256) return false;

            if (ROOMNAME.trim().length === 0) return false;

            return true;
        } catch (error) {
            console.error("Error creating room middleware:", error);
            return false;
        };
    };
    public createRoom = (ROOMNAME: string) => {
        try {
            if (!this.createRoomMiddelware(ROOMNAME)) return null;
            const TROOMNAME = ROOMNAME.trim();
            const roomId = this.generateRoomId();
            if (!roomId) {
                return null;
            };
            if (this.checkDuplicateRoom(roomId, TROOMNAME)) {
                return null;
            };
            const newRoom: Room = {
                roomId: roomId,
                roomName: TROOMNAME,
                dateOfCreation: new Date(),
                users: []
            };
            this.rooms.push(newRoom);
            return newRoom;

        } catch (error) {
            console.error("Error creating room id:", error);
            return null;
        };
    };
};

export default roomDatabase;
export type {
    Room
};