## Deploying Ecommpay modules as Google Cloud Platform function

### Installation steps
1. Install [Node LTS](https://nodejs.org/en/download) to your local machine
2. Clone the project
3. Run `npm install --omit=dev` command for installing dependencies
4. Run `npm run zip-gcp-extension` command for creating `extension.zip` in project folder
5. Run `npm run zip-gcp-notification` command for creating `notification.zip` in project folder 
6. Creating functions.
On the first step set the environment variable name `ECP_PARAMETERS` with the value as in [extension enviroment example](../resources/extension_env.json) for the extension module and [notification environment example](../resources/notification_env.json) for the notification module.
On the second step upload `extension.zip` and `notification.zip` into GCP Cloud and specify the entry point with the value “handler”.
