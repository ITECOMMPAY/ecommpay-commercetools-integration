## Deploying Ecommpay modules as Azure Cloud component

### Installation steps
1. Install [Node LTS](https://nodejs.org/en/download) 
and [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) (for simple deploying)
to your local machine
2. Clone the project
3. Run `npm install --omit=dev` command for installing dependencies
4. Run `npm run zip-azure` command for creating `azure.zip` in project folder
5. Create Function App in Azure Cloud with node js v18+
6. You can upload the zip file and set the environment variables manually (see the official documentation [here](https://learn.microsoft.com/en-us/azure/azure-functions/run-functions-from-deployment-package)) or use az utility with following commands:
```shell
#! /bin/bash
# Replace 'RESOURCE_GROUP' and 'FUNCTION_APP' to your values
RESOURCE_GROUP="MY_RESOURCE_GROUP"
FUNCTION_APP="MY_FUNCTION_APP"
az login
az functionapp config appsettings set --settings FUNCTIONS_EXTENSION_VERSION=~4 -g $RESOURCE_GROUP -n $FUNCTION_APP
az functionapp config appsettings set --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true -g $RESOURCE_GROUP -n $FUNCTION_APP
az functionapp config appsettings set --settings POST_BUILD_COMMAND="npm install" -g $RESOURCE_GROUP -n $FUNCTION_APP
az functionapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $FUNCTION_APP --src azure.zip
```
### Function App Env ("Configuration" -> "Application settings")
|Key|Value|Comment|
|---|---|---|
|FUNCTIONS_EXTENSION_VERSION|~4||
|SCM_DO_BUILD_DURING_DEPLOYMENT|true||
|POST_BUILD_COMMAND|npm install||
|ECP_PARAMETERS||See [full environment](../resources/full_env.json)
|WEBSITE_RUN_FROM_PACKAGE|$URL_TO_BLOB|Only if you use manual deployment

> [!IMPORTANT]
> To see the functions in your Function APP, you need to specify the ECP_PARAMETERS. Use fake values, if you don’t know some of them yet.

> [!NOTE]
> If you want to change the authentication level or other, you should edit [extension/entrypoint-azure.ts](../../extension/entrypoint-azure.ts) and [notification/entrypoint-azure.ts](../../notification/entrypoint-azure.ts).
See [official documentation](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?.tabs=typescript%2Clinux%2Cazure-cli&pivots=nodejs-model-v4)