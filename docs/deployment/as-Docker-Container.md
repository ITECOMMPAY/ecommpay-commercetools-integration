## Deploying Ecommpay modules as a Docker containers

### Installation steps
1. Install [Docker](https://docs.docker.com/get-docker/) with the docker compose on your host
2. Copy a content of `.env.example` to `.env` file, and change the environment options to your needs

|Parametr|Description|
|---|---|
| EXTENSION_MODULE_PORT | External port for extension module
| NOTIFICATION_MODULE_PORT | External port for notifictaion module
| ECP_PARAMETERS | Environment parameters in json format for both modules. See [the full environment in JSON format](../resources/full_env.json)

3. To run the docker containers, execute the following command:
```docker-compose up -d --build```
