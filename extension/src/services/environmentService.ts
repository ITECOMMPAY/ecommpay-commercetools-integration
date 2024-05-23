import packageJson from "../../package.json";
import { InvalidJsonInput } from "../helpers/errors";

abstract class Config {
  private readonly _envObject: { [index: string]: string | number } = {};
  protected constructor() {
    this._envObject = JSON.parse(process.env["ECP_PARAMETERS"] || "{}");
  }
  _getParamFromJson(key: string): any {
    if (this._envObject[key] === undefined) {
      throw new InvalidJsonInput(
        `Missing parameter ${key}. Please add it in ECP_PARAMETERS variable to your environment.`,
      );
    }
    return this._envObject[key];
  }
}

class EcommpayConfig extends Config {
  _gateUrl: string = "https://api.ecommpay.com/v2";
  _interfaceTypeId: number = 33;
  _version: string = packageJson["version"];
  constructor() {
    super();
  }
  get projectId(): number {
    return this._getParamFromJson("ECP_PROJECT_ID");
  }
  get secretKey(): number {
    return this._getParamFromJson("ECP_SECRET_KEY");
  }
  get callbackUrl(): number {
    return this._getParamFromJson("CALLBACK_URL");
  }
  get gateUrl(): string {
    return this._gateUrl;
  }
  get interfaceTypeId(): number {
    return this._interfaceTypeId;
  }
  get version(): string {
    return this._version;
  }
  get extensionLogin(): string {
    return this._getParamFromJson("EXTENSION_LOGIN");
  }
  get extensionPassword(): string {
    return this._getParamFromJson("EXTENSION_PASSWORD");
  }
}

export const ecommpayConfig = new EcommpayConfig();
