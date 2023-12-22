## Deploying Ecommpay modules as an Amazon Cloud Lambda function

### Installation steps
1. Install [Node LTS](https://nodejs.org/en/download) to your local machine
2. Clone the project
3. Run `npm install --omit=dev` command for installing dependencies
4. Run `npm run zip-lambda-function-extension` command
for creating `extension.zip` in project folder, which will be uploaded to AWS
5. Run `npm run zip-lambda-function-notification` command for creating
`notification.zip` in project folder, which will be uploaded to AWS
6. Create two function in the AWS cloud and upload `extension.zip` and `notification.zip`.
7. Create two URL's for each function ("Configuration" -> "Function URL")
8. Set the environment variable name `ECP_PARAMETERS` with the value as in [extension enviroment example](../resources/extension_env.json) for the extension module and [notification environment example](../resources/notification_env.json) for the notification module ("Configuration" -> "Environment variables").
