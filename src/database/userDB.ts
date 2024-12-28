// /d:/Projects/WhisperNet/src/Database/userDB.ts

import fs from 'fs';
import generateUID from "../util/generateUID.js";
import { comparePassword, hashPassword } from "../auth/authOps.js";
import JSONStream from 'jsonstream-next';
import { Transform } from 'stream';

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
    private dataPath: string = 'data.json';

    constructor() {
        console.log("User Database initialized!");
    };


    private ensureDataFileExists = async (): Promise<void> => {
        try {
            if (!fs.existsSync(this.dataPath)) {
                await fs.promises.writeFile(this.dataPath, '[]');
                console.log('Data file created successfully!');
            }
        } catch (error) {
            console.error('Error ensuring data file exists:', error);
            throw error;
        }
    };
    public loadUsers = async (): Promise<void> => {
        try {
            console.log("Loading users...");
            // Check and create file if doesn't exist
            await this.ensureDataFileExists();

            // Create read stream
            const readStream = fs.createReadStream(this.dataPath, { encoding: 'utf-8' });
            const jsonStream = JSONStream.parse('*'); // Parse all top-level array elements

            // Process users in chunks
            const processingStream = new Transform({
                objectMode: true,
                transform: (user: User, _, callback) => {
                    this.users.push(user);
                    callback();
                }
            });

            // Handle stream events
            return new Promise((resolve, reject) => {
                readStream
                    .pipe(jsonStream)
                    .pipe(processingStream)
                    .on('finish', () => {
                        console.log(`Loaded ${this.users.length} users successfully!`);
                        resolve();
                    })
                    .on('error', (error) => {
                        console.error('Error while loading users:', error);
                        reject(error);
                    });
            });
        } catch (error) {
            console.error('Error in loadUsers:', error);
            throw error;
        }
    };

    private checkDuplicateUser = (username: string,): boolean => {
        try {
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
            console.log("Error while chec   king for duplicate users!");
            console.error(error);
            return true;
        }
    };

    public createUser = async (username: string, password: string, dateOfJoining: Date, RoomId: string[]): Promise<User | null> => {
        console.log("Initializing Create User...");
        if (this.checkDuplicateUser(username,)) {
            console.log("Aborting user creation!");
            return null;
        };
        const hashedPassword = await hashPassword(password);
        const hashedUid = await generateUID(username, password,);
        const user: User = {
            username, uid:
                hashedUid,
            dateOfJoining,
            RoomId,
            password: hashedPassword
        };
        this.users.push(user);
        console.log("User created successfully!");
        // await this.logDataTofile();
        return user;
    };

    public loginUser = async (username: string, password: string): Promise<string | null> => {
        const userExists = this.findOne({ username: username });
        if (!userExists || !userExists.password || !userExists.uid) {
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
                return userId.uid;
            }
            console.log("User ID not found!");
            return null;
        } catch (error) {
            console.log("Error fetching user ID");
            return null;
        }
    };

    public findOne = (criteria: Partial<User>, matchAll: boolean = true): Partial<User> | null => {
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

    public findAll = (criterial: Partial<User>) => {
        console.log("Finding all users...");
        try {
            const users = this.users.filter((user) => {
                const conditions = [
                    criterial.username ? user.username === criterial.username : true,
                    criterial.uid ? user.uid === criterial.uid : true,
                    criterial.dateOfJoining ? user.dateOfJoining === criterial.dateOfJoining : true,
                    criterial.socketId ? user.socketId === criterial.socketId : true,
                ];
                return conditions.every(Boolean);
            });
            console.log("Users found!");
            console.log(users);
            return users;
        } catch (error) {
            console.log("Error while finding all users!");
            console.error(error);
            return null;
        };
    };
};

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