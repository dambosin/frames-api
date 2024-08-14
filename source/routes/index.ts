import experss from "express";
import test from "./test";
const router = experss.Router();

router.use("/frameService", test);

export default router;