import { Router, type IRouter } from "express";
import healthRouter from "./health";
import prospectingRouter from "./agents/prospecting";
import dealIntelligenceRouter from "./agents/deal-intelligence";
import revenueRetentionRouter from "./agents/revenue-retention";
import competitiveIntelRouter from "./agents/competitive-intel";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/agents", prospectingRouter);
router.use("/agents", dealIntelligenceRouter);
router.use("/agents", revenueRetentionRouter);
router.use("/agents", competitiveIntelRouter);

export default router;
