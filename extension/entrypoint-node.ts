import express from "express";
import { IncomingHttpHeaders } from 'http';
import paymentController from "./src/controllers/paymentController";
import { CommercetoolsError, InternalServerError, AuthError} from "./src/helpers/errors";
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
    checkBasicAuth(req.headers);
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

function checkBasicAuth(headers: IncomingHttpHeaders): void {
  if (!headers['authorization']) {
    throw new AuthError(
      'invalid_request',
      'Missing header "authorization". Please enable authorization for extension module.'
      );
  }
  const [authType, authToken] = headers['authorization'].split(" ");
  if (authType !== 'Basic') {
    throw new AuthError(
      'invalid_client',
      `Unsupported authentication method ${authType}`
      );
  }
  let verificationToken = btoa(
    ecommpayConfig.extensionLogin+':'+ecommpayConfig.extensionPassword
    );
  if (verificationToken !== authToken) {
    throw new AuthError(
      'invalid_client',
      `Invalid authorization token`
      );
  }
}