import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notesRouter from "./notes";
import tagsRouter from "./tags";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notesRouter);
router.use(tagsRouter);

export default router;
