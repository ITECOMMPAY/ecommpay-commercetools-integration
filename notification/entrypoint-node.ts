import express from "express";
import { callbackHandler } from "./src/controllers/gateController";
import { CommercetoolsError, InternalServerError } from "./src/helpers/errors";
import { ecommpayConfig } from "./src/services/environmentService";
import { logger } from "./src/utils/logger";
import bodyParser from "body-parser";

const app = express();
const port = process.env.NOTIFICATION_PORT || 8080;

logger.setFileStream();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({
    module: "notification",
    message: "ok",
    app_version: ecommpayConfig.version,
  });
});

app.post("/", async (req, res) => {
  try {
    await callbackHandler(req.body);
    res.status(200).json({ Message: "OK" });
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      res.status(error.statusCode || 500).json(error.toJson());
    } else {
      const internalServerError = new InternalServerError(error.message);
      res.status(500).json(internalServerError.toJson());
    }
  }
});

app.listen(port, () => {
  logger.log(`Notification module is listening on port ${port}`);
});
