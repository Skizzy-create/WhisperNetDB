// ../WhisperNetDB/src/routes/index.ts

import express, { Router } from "express";
import userRouter from "./userRoutes";

const router: Router = express.Router();

router.use("/user", userRouter);

router.get("/", (_, res) => {
    res.json({
        msg: "Main Router"
    });
});

export default router;