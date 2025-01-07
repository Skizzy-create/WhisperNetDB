// ../WhisperNetDB/src/routes/index.ts

import express, { Router } from "express";
import userRouter from "./userRoutes";
import roomRouter from "./roomRoutes";

const router: Router = express.Router();

router.use("/user", userRouter);
router.use("/room", roomRouter);

router.get("/", (_, res) => {
    res.json({
        msg: "Main Router"
    });
});

export default router;