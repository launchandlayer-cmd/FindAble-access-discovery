import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import userDataRouter from "./userData";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(userDataRouter);

export default router;
