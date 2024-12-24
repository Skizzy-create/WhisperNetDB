import express, { Router } from "express";
import userRouter from "./userRoutes.js";

const router: Router = express.Router();

router.use("/user", userRouter);

router.get("/", (req, res) => {
    res.json({
        msg: "Main Router"
    });
});


export default router;