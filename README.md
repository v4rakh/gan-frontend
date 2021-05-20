# README

Frontend for [g.an tiny announcement application](https://github.com/v4rakh/gan).

Image is available on [Docker Hub](https://hub.docker.com/r/varakh/gan-frontend).

## Install

1. Copy `.env.example` to `.env` and adjust to your liking. For more on configuration settings and deployment see below.
2. Run `npm install`
3. Run `npm run start-unix` if you're on a UNIX based system or `npm run start` for non-UNIX systems. If on UNIX, a
   `env.config.js` will automatically be created and used. For development purpose, you can still set usual environment
   variables for configuration also with the `start` command.

Info: The `env.sh` has been introduced to also allow production builds to use docker environment variables in a
convenient way.

## Development

Prettier is required, configure Prettier to be used with the project. Probably disable other code formatters.

ESLint is used for semantic validation, ensure to enable it in the IDE settings.

## Configuration

The following environment variables can be used to modify application behavior.

| Variable             | Purpose               | Required      | Default                           |
|:---------------------|:----------------------|:--------------|:----------------------------------|
| REACT_APP_API_URL    | The API URL           | required      | http://localhost:8080             |
| REACT_APP_APP_TITLE  | The document's title  | optional      | Example UI                        |

## Release & deployment

### Native

1. Run `npm run build-unix` or `npm run build` and a production build will be placed into the `build/` folder.
2. Copy the contents of the `build/` folder to your web server root you like to serve
3. To adapt configuration values, you can do it i) manually or ii) via `env.sh` script
    * a) Add/edit `env-config.js` file of the web server root and add the following (ensure to define every
      configuration value from the above table):

    ```js
    window._env_ = {
      REACT_APP_API_URL: "https://server-address:server-port",
      REACT_APP_APP_TITLE: "The app title",
    }
    ```

    * b) In your web server root, adapt `.env` to your liking and run `env.sh` afterwards, a `env-config.js` will be
      generated for you

### Docker

#### Run

Default docker user is `nginx` (`uid=101`) and group is `nginx` (`gid=101`).

```sh
sudo docker run -p 3000:80 \
    --name gan-frontend \
    -e API_URL=http://192.168.1.11:8080 \
    varakh/gan-frontend:latest
```

#### Build

To build docker images, run `npm run build:docker` or manually do the following

```sh
export IMG_NAME="gan-frontend";
export IMG_TAG="latest";
sudo docker build --rm --no-cache -t ${IMG_NAME}:${IMG_TAG} .

and/or

export IMG_NAME="gan-frontend";
export IMG_TAG="latest";
export REMOTE_REPO_URL="varakh";
sudo docker build --rm --no-cache -t ${REMOTE_REPO_URL}/${IMG_NAME}:${IMG_TAG} .
sudo docker push ${REMOTE_REPO_URL}/${IMG_NAME}:${IMG_TAG}
```

Run the built image with any environment variable from the configuration section, e.g. like

**IMPORTANT:** `npm start` (`Dockerfile-dev` setup) needs the docker container to start with `docker -it` (interactive
mode)
which is required for create-react-scripts `>= 3.4.1`. You might also want to edit your `docker-compose` files to
account for the interactive mode requirement.

