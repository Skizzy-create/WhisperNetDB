// ../WhisperNetDB/src/routes/userRoutes.ts

import express from 'express';
import { Request, Response, Router } from 'express';
import { userDB } from '../server';
import { validateUserLogin, validateUserSignUp } from '../middlewares/usersSchemaValidators';
import { generateToken } from '../auth/authOps';
import { inputValidator } from '../middlewares/universalSchemaValidator';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';
const router: Router = express.Router();

router.get("/", (_, res) => {
    res.json({
        msg: "User Router"
    });
});

router.post('/register', inputValidator(createUserSchema), async (req: Request, res: Response): Promise<any> => {
    try {
        const username: string = req.body.username;
        const password = req.body.password;
        const dateOfJoining: Date = new Date(req.body.dateOfJoining);
        const RoomId = req.body.RoomId;

        const user = await userDB.createUser(username, password, dateOfJoining, RoomId);
        if (user === null) {
            return res.status(400).json({
                msg: "User already exists! / Invalid data",
            });
        }

        console.log(user);
        const Token = generateToken(username, user.uid);
        if (Token === null) {
            return res.status(500).json({
                msg: "Internal Server Error! -- User register Route",
            });
        };
        res.status(200).json({
            msg: "User created successfully!",
            user: user,
            Token: Token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error! -- User register Route",
            error: error
        });
    };
});

router.post("/login", inputValidator(loginUserSchema), async (req: Request, res: Response): Promise<any> => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const uid = await userDB.loginUser(username, password);
        if (uid === null) {
            return res.status(400).json({
                msg: "Invalid username or password!",
            });
        };
        const token = generateToken(username, uid);
        if (token === null) {
            return res.status(500).json({
                msg: "Internal Server Error! -- User register Route",
            });
        }
        return res.status(200).json({
            msg: "User logged in successfully!",
            uid: uid,
            Token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error! -- User register Route",
            error: error
        });
    };

});

export default router;