export interface User {
    username: string;
    uid: string;
    password: string;
    dateOfJoining: Date;
    RoomId?: string;
    socketId?: string;
};