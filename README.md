# README

Frontend for g.an tiny announcement application.

## Install

1. Copy `.npmrc.example` to `.npmrc`
2. Run `npm install`
3. Run `npm run dev`

## Development

Prettier is required, configure Prettier to be used with the project. Probably disable other code formatters.

ESLint is used for semantic validation, ensure to enable it in the IDE settings.

## Configuration

The following environment variables can be used to modify application behavior.

| Variable | Purpose | Required | Default |
|:---|:---|:---|:---|
| API_URL | The API URL | required | http://localhost:8080 |
| APP_TITLE | The document's title | optional | UI |

## Release & deployment

### Native

1. Run `npm run build` and a production build will be placed into the `build/` folder.
2. Copy the contents of the `build/` folder to your web server root you like to serve
3. To adapt configuration values, you can do it i) manually or ii) via `env.sh` script
    * a) Add/edit `env-config.js` file of the web server root and add the following (ensure to define every configuration value from the above table):
    
    ```js
    window._env_ = {
      API_URL: "https://server-address:server-port",
      APP_TITLE: "g.an",
    }
    ```
   
   * b) In your web server root, adapt `.env` to your liking and run `env.sh` afterwards, a `env-config.js` will be generated for you
   
### Docker

To build docker images, run `npm run build:docker` or manually do the following

```
export IMG_NAME="gan-frontend";
export IMG_TAG="latest";
sudo docker build --no-cache -t IMG_NAME:IMG_TAG .

and/or

sudo docker build --no-cache -t REMOTE_REPO_URL/IMG_NAME:IMG_TAG .
sudo docker push REMOTE_REPO_URL/IMG_NAME:IMG_TAG
```

Run the built image with any environment variable from the configuration section, e.g. like

```sh
sudo docker run -p 3000:80 \
    -e API_URL=http://192.168.1.11:8080 \
    gan-frontend:latest
```
