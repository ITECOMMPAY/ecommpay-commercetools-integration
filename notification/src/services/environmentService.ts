import packageJson from "../../package.json";
import { InvalidJsonInput } from "../helpers/errors";

abstract class Config {
  private readonly _envObject: { [index: string]: string | number } = {};
  protected constructor() {
    this._envObject = JSON.parse(process.env["ECP_PARAMETERS"] || "{}");
  }
  _getParamFromJson(key: string, defaultValue: any = undefined): any {
    const value = this._envObject[key] || defaultValue;
    if (!value) {
      throw new InvalidJsonInput(
        `Missing parameter ${key}. Please add it in ECP_PARAMETERS variable to your environment.`,
      );
    }
    return value;
  }
}

class EcommpayConfig extends Config {
  _gateUrl: string = "https://api.ecommpay.com/v2";
  _interfaceTypeId: number = 33;
  _version: string = packageJson["version"];
  _packageName: string = packageJson["name"];
  _homePage: string = packageJson["homepage"];
  _authorEmail: string = packageJson["author"]["email"];
  constructor() {
    super();
  }
  get projectId(): number {
    return this._getParamFromJson("ECP_PROJECT_ID");
  }
  get secretKey(): number {
    return this._getParamFromJson("ECP_SECRET_KEY");
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
  get packageName(): string {
    return this._packageName;
  }
  get homePage(): string {
    return this._homePage;
  }
  get authorEmail(): string {
    return this._authorEmail;
  }
}

class CommercetoolsConfig extends Config {
  constructor() {
    super();
  }
  get projectId(): string {
    return this._getParamFromJson("CT_PROJECT_ID");
  }
  get clientId(): string {
    return this._getParamFromJson("CT_CLIENT_ID");
  }
  get clientSecret(): string {
    return this._getParamFromJson("CT_CLIENT_SECRET");
  }
  get apiUrl(): string {
    return this._getParamFromJson(
      "CT_API_URL",
      "https://api.europe-west1.gcp.commercetools.com",
    );
  }
  get authUrl(): string {
    return this._getParamFromJson(
      "CT_AUTH_URL",
      "https://auth.europe-west1.gcp.commercetools.com",
    );
  }
}

export const ecommpayConfig = new EcommpayConfig();
export const commercetoolsConfig = new CommercetoolsConfig();
