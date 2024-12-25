// /d:/Projects/WhisperNet/src/Database/userDB.ts

import fs from 'fs';
import generateUID from "../util/generateUID.js";
import { comparePassword, hashPassword } from "../auth/authOps.js";

interface User {
    username: string;
    uid: string;
    password: string;
    dateOfJoining: Date;
    RoomId?: string[];
    socketId?: string;
};

class userDatabase {
    private users: User[] = [];

    constructor() {
        console.log("User Database initialized!");
    };

    public loadUsers = async (): Promise<void> => {
        console.log("Loading User data ....");
        try {
            const data = await fs.promises.readFile("data.json", "utf-8");
            if (!data) {
                console.log("No data found!");
                return;
            }
            const users = JSON.parse(data);
            this.users = users;
            console.log("User loaded sucessfully!");
        } catch (error) {
            console.log("Error while loading users!");
            console.error(error);
        }
    };

    public checkDuplicateUser = async (username: string,): Promise<boolean> => {
        try {
            await this.logDataTofile();
            console.log("Checking for duplicate users...");
            const user = this.users.find((user) => user.username === username);
            if (user) {
                console.log("User already exists!");
                const { password, ...userWithoutPassword } = user;
                console.log(userWithoutPassword);
                return true;
            }
            console.log("User does not exist!");
            return false;
        } catch (error) {
            console.log("Error while checking for duplicate users!");
            console.error(error);
            return true;
        }
    };

    public createUser = async (username: string, password: string, dateOfJoining: Date, RoomId: string[]): Promise<User | null> => {
        console.log("Initializing Create User...");
        const hashedPassword = await hashPassword(password);
        const abort = await this.checkDuplicateUser(username,);
        const hashedUid = await generateUID(username, password,);
        if (abort) {
            console.log("Aborting user creation!");
            return null;
        };
        const user: User = { username, uid: hashedUid, dateOfJoining, RoomId, password: hashedPassword };
        this.users.push(user);
        console.log("User created successfully!");
        await this.logDataTofile();
        return user;
    };

    public loginUser = async (username: string, password: string): Promise<string | null> => {
        const userExists = this.findOne({ username: username });
        if (!userExists || userExists === undefined || userExists === null || !userExists.password || !userExists.uid) {
            return null;
        };
        const isValid = await comparePassword(userExists.password, password);
        if (!isValid) {
            console.log("Invalid password! -- Login User");
            return null;
        };
        console.log("User logged in successfully!");
        return userExists.uid;
    };

    private fetchUserId = async (username: string,): Promise<string | null> => {
        try {
            console.log("Fetching user ID...");
            const userId = this.users.find((user) => user.username === username);
            if (userId) {
                console.log("User ID found!");
                await this.logDataTofile();
                return userId.uid;
            }
            console.log("User ID not found!");
            await this.logDataTofile();
            return null;
        } catch (error) {
            console.log("Error fetching user ID");
            return null;
        }
    };

    private findOne = (criteria: Partial<User>, matchAll: boolean = true): Partial<User> | null => {
        console.log("Looking for one user...");
        try {
            const user = this.users.find((user) => {
                const conditions = [
                    criteria.username ? user.username === criteria.username : true,
                    criteria.uid ? user.uid === criteria.uid : true,
                    criteria.dateOfJoining ? user.dateOfJoining === criteria.dateOfJoining : true,
                    criteria.socketId ? user.socketId === criteria.socketId : true,
                ];
                return matchAll ? conditions.every(Boolean) : conditions.some(Boolean);
            });
            if (!user) {
                console.log("User not found!");
                return null;
            }
            console.log("User found!");
            console.log(user);
            return user;
        } catch (error) {
            console.log("Error - FindOne --> User DB");
            console.error(error);
            return null;
        }
    };

    private logDataTofile = async (): Promise<void> => {
        console.log("Logging data to file...");
        const dataWithNewLines = JSON.stringify(this.users, null, 2);
        try {
            await fs.promises.writeFile('data.json', dataWithNewLines);
            console.log("Data logged to file successfully!");
        } catch (error) {
            console.log("Error while logging data to file!");
            console.error(error);
        }
    };
}

export default userDatabase;

// Function names from the UserDatabase class
// checkDuplicateUser ✅
// createUser ✅
// fetchUserId ✅
// loginUser
// findOne
// findUserById
// deleteUser
// updateUser
// listAllUsers
// findAll