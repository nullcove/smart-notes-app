import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notesRouter from "./notes";
import tagsRouter from "./tags";
import authRouter from "./auth";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(notesRouter);
router.use(tagsRouter);
router.use(aiRouter);

export default router;
