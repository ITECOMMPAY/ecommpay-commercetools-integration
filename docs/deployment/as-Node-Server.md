## Deploying Ecommpay modules as a Node web server

### Installation steps
1. Install [Node LTS](https://nodejs.org/en/download) to your host machine
2. Clone the project
3. Run `npm install` command for installing dependencies
4. Run `npm run build` command for building application
5. Run the following commands
```
export EXTENSION_PORT=8080
export NOTIFICATION_PORT=8090
export ECP_PARAMETERS={ ... }
```

|Parametr|Description|
|---|---|
| EXTENSION_PORT | External port for extension module
| NOTIFICATION_PORT | External port for notifictaion module
| ECP_PARAMETERS | Environment parameters in json format for both modules. See [the full environment in JSON format](../resources/full_env.json)

6. Run `npm run extension` command for running extension module
7. Run `npm run notification` command for running notification module
8. Run `login=${YourExtensionLogin} password=${YourExtensionPassword} npm run get-basic-token` and you get a token like this 'Basic QmlsbHk6SGVycmluZ3Rvbg=='. `YourExtensionLogin` and `YourExtensionPassword` are credentials you specified in the `ECP_PARAMETERS` environment variable. Copy and paste the token into destination object of api_extension.json file.

Example:
```
{
    "key": "ecommpay-integration-payment-extension",
    "destination": {
        "type": "HTTP",
        "url": "${ExtensionUrl}"
        "authentication": {
            "type": "AuthorizationHeader",
            "headerValue": "Basic QmlsbHk6SGVycmluZ3Rvbg=="
        }
    },
    ...
}
```
