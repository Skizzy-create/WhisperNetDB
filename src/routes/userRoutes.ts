import express from 'express';
import { Request, Response, Router } from 'express';
import { userDB } from '../server';
import { validateUserLogin, validateUserSignUp } from '../middlewares/usersSchemaValidators';
const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({
        msg: "User Router"
    });
});

router.post('/register', validateUserSignUp, async (req: Request, res: Response): Promise<any> => {
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
        res.json({
            msg: "User created successfully!",
            user: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error! -- User register Route",
            error: error
        });
    };
});

router.post("/login", validateUserLogin, async (req: Request, res: Response): Promise<any> => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const uid = await userDB.loginUser(username, password);
        if (uid === null) {
            return res.status(400).json({
                msg: "Invalid username or password!",
            });
        };
        return res.status(200).json({
            msg: "User logged in successfully!",
            uid: uid,
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