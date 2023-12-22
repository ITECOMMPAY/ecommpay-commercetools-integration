import express from "express";
import paymentController from "./src/controllers/paymentController";
import { CommercetoolsError, InternalServerError } from "./src/helpers/errors";
import { ecommpayConfig } from "./src/services/environmentService";
import { logger } from "./src/utils/logger";
import bodyParser from "body-parser";

const app = express();
const port = process.env.EXTENSION_PORT || 8080;

logger.setFileStream();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({
    module: "extension",
    message: "ok",
    app_version: ecommpayConfig.version,
  });
});

app.post("/", async (req, res) => {
  try {
    const response = await paymentController(req.body);
    logger.log(response);
    res.status(200).json(response);
  } catch (error: any) {
    logger.log(error);
    if (error instanceof CommercetoolsError) {
      res.status(400).json(error.toJson());
    } else {
      const internalServerError = new InternalServerError(error.message);
      res.status(400).json(internalServerError.toJson());
    }
  }
});

app.listen(port, () => {
  logger.log(`Extension module is listening on port ${port}`);
});
