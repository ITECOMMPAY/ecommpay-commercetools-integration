import pino from "pino";
import pretty from "pino-pretty";
import { createWriteStream } from "node:fs";

class Logger {
  _context: any = null;
  _fileStream: any = null;
  setAzureContext(context: any) {
    this._context = context;
  }

  setFileStream() {
    const writeStream = createWriteStream(`${__dirname}/../../logs/logger.log`, {flags: "a"});
    const streams = [{ stream: writeStream }, { stream: pretty() }];
    this._fileStream = pino({ level: "debug" }, pino.multistream(streams));
  }

  log(data: any) {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    if (this._context) {
      this._context.log(data);
    } else if (this._fileStream) {
      this._fileStream.info(data);
    } else {
      console.log(data);
    }
  }
}

const logger = new Logger();

export { logger };
