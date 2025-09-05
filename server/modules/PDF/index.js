import express from "express";

import { upload } from "./pdf-controller.js";
import { controllers } from "../../modulesLoader.js";

const router = express.Router();
router.post(
  "/upload",
  upload.single("file"),
  controllers.PDFController.uploadFile
);

export default { indexRoute: "/", router };
