// File: ../src/middlewares/roomDbMiddlewares.ts

import { userDB } from "../server";

const userExists = (userId: string) => {
    try {
        if (userDB.findUserById(userId)) {
            return true;
        };
        return false;
    } catch (e) {
        console.log("User does not exist");
        return false;
    };
};

export {
    userExists
}