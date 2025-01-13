// ../WhisperNet/src/Database/userDB.ts

import fs from 'fs';
import generateUID from "../util/generateUID";
import { comparePassword, hashPassword } from "../auth/authOps";
import JSONStream from 'jsonstream-next';
import { Transform } from 'stream';
import { User } from '../types/user';

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
            };
        } catch (error) {
            console.error('Error ensuring data file exists:', error);
            throw error;
        };
    };

    public loadUsers = async (): Promise<void> => {
        try {
            console.log("Loading users...");
            await this.ensureDataFileExists();

            const readStream = fs.createReadStream(this.dataPath, { encoding: 'utf-8' });
            const jsonStream = JSONStream.parse('*');

            const processingStream = new Transform({
                objectMode: true,
                transform: (user: User, _, callback) => {
                    this.users.push(user);
                    callback();
                }
            });

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
        };
    };

    private checkDuplicateUser = (username: string): boolean => {
        try {
            const user = this.users.find((user) => user.username === username);
            if (user) {
                console.log("User already exists!");
                return true;
            }
            console.log("User does not exist!");
            return false;
        } catch (error) {
            console.log("Error while checking for duplicate users!");
            console.error(error);
            return true;
        };
    };

    public createUser = async (username: string, password: string, dateOfJoining: Date, RoomId?: string): Promise<User | null> => {
        try {
            if (!password)
                return null;
            if (this.checkDuplicateUser(username)) {
                return null;
            };
            const hashedPassword = await hashPassword(password);
            const hashedUid = await generateUID(username, password);
            const user: User = {
                username,
                uid: hashedUid,
                dateOfJoining,
                RoomId,
                password: hashedPassword
            };
            this.users.push(user);
            return user;
        } catch (error) {
            console.log("Error creating user");
            return null;
        }
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

    private fetchUserId = (username: string): string | null => {
        try {
            const userId = this.users.find((user) => user.username === username);
            if (userId) {
                return userId.uid;
            }
            return null;
        } catch (error) {
            console.log("Error fetching user ID");
            return null;
        }
    };

    public findOne = (criteria: Partial<User>, matchAll: boolean = true): Partial<User> | null => {
        try {
            const user = this.users.find((user) => {
                const conditions = [
                    criteria.username ? user.username === criteria.username : true,
                    criteria.uid ? user.uid === criteria.uid : true,
                    criteria.dateOfJoining ? user.dateOfJoining === criteria.dateOfJoining : true,
                    criteria.socketId ? user.socketId === criteria.socketId : true,
                    criteria.RoomId ? user.RoomId === criteria.RoomId : true,
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
        const dataWithNewLines = JSON.stringify(this.users, null, 2);
        try {
            await fs.promises.writeFile('data.json', dataWithNewLines);
            console.log("Data logged to file successfully!");
        } catch (error) {
            console.log("Error while logging data to file!");
            console.error(error);
        }
    };

    public findAll = (criteria: Partial<User>) => {
        try {
            // check if inputs are empty
            if (Object.keys(criteria).length === 0) {
                console.log("No criteria provided!");
                return null;
            };

            const users = this.users.filter((user) => {
                const conditions = [
                    criteria.username ? user.username === criteria.username : true,
                    criteria.uid ? user.uid === criteria.uid : true,
                    criteria.dateOfJoining ? user.dateOfJoining === criteria.dateOfJoining : true,
                    criteria.socketId ? user.socketId === criteria.socketId : true,
                    criteria.RoomId ? user.RoomId === criteria.RoomId : true,
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

    public findUserById = (uid: string): User | null => {
        try {
            const user = this.users.find((user) => user.uid === uid);
            if (!user) {
                console.log("User not found!");
                return null;
            }
            console.log("User found!");
            console.log(user);
            return user;
        } catch (error) {
            console.log("Error while finding user by ID!");
            console.error(error);
            return null;
        };
    };

    public deleteUser = (uid: string): boolean => {
        try {
            const userIndex = this.users.findIndex((user) => user.uid === uid);
            if (userIndex === -1) {
                console.log("User not found!");
                return false;
            }
            this.users.splice(userIndex, 1);
            console.log("User deleted successfully!");
            return true;
        } catch (error) {
            console.log("Error while deleting user!");
            console.error(error);
            return false;
        };
    };

    public updateUser = (uid: string, updatedUser: Partial<User>): User | null => {
        try {
            const userIndex = this.users.findIndex((user) => user.uid === uid);
            if (userIndex === -1) {
                console.log("User not found!");
                return null;
            }
            this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
            console.log("User updated successfully!");
            return this.users[userIndex];
        } catch (error) {
            console.log("Error while updating user!");
            console.error(error);
            return null;
        };
    };

    public listAllUsers = (): User[] => {
        console.log("Listing all users...");
        try {
            console.log("Users found!");
            console.log(this.users);
            return this.users;
        } catch (error) {
            console.log("Error while listing all users!");
            console.error(error);
            return [];
        };
    };

    // Todo: Add a method to add/ update user's room id.
    public updateUserRoomId = (uid: string, roomId: string): string | null => {
        try {
            const userIndex = this.users.findIndex((user) => user.uid === uid);
            if (userIndex === -1) {
                console.log("User not found!");
                return null;
            };
            this.users[userIndex].RoomId = roomId;
            console.log("User room id updated successfully!");
            return this.users[userIndex].uid;

        } catch (error) {
            console.log("Error while updating user room id!");
            console.error(error);
            return null;
        };
    };
};

export default userDatabase;