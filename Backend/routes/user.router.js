import express from "express";
import { userQueryController } from "../controller/userQuery.controller.js";

const router = express.Router();

router.post("/query", userQueryController);

export default router;
