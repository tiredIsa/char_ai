import express, { Router } from "express";
import * as chatController from "../controllers/chatController";

const router: Router = express.Router();

router.post("/message", async (req, res) => {
  await chatController.sendMessage(req, res);
});

export default router;
