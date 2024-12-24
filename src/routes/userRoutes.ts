import express from 'express';
import { Request, Response, Router } from 'express';
import { userDB } from '../server';
const router: Router = express.Router();

router.get("/", (req, res) => {
    res.json({
        msg: "User Router"
    });
});
// @ts-ignore
router.post('/register', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const password = req.body.password;
        const dateOfJoining = req.body.dateOfJoining;
        const RoomId = req.body.RoomId;
        const user = await userDB.createUser(username, password, dateOfJoining, RoomId);
        if (user === null) {
            return res.status(400).json({
                msg: "User already exists! / Invalid data"
            });
        };
        console.log(user);
        return res.json({
            msg: "User created successfully!",
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error!"
        });
    }
});
export default router;