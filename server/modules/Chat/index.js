import express from "express";

import { controllers } from "../../modulesLoader.js";

const router = express.Router();
router.post("/chat", controllers.ChatController.chat);

export default { indexRoute: "/", router };
