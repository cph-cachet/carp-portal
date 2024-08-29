Repository containing the dashboard (UI), the Carp Portal.

## Introduction

The website is using React v18, Material-UI v5, [Carp Client TS (1.0.0)](https://github.com/cph-cachet/carp-client-ts) and [Carp.Core (1.2.1)](https://github.com/cph-cachet/carp.core-kotlin/releases/tag/v1.1.1). The later two components are dependencies not available on npm. They can be found in the [non_npm_dependencies](non_npm_dependencies) folder.

## Setup

1. Install node `v18.16.0`
2. Install `pnpm`

3. Run `pnpm i` in the root folder of the project.

4. Create an `.env.` file in the root of the project:

```
VITE_BASE_URL= <`/proxy` for local development or base URL for the backend>
VITE_BASE_NAME=/
VITE_KEYCLOAK_URL= <Keycloak URL>
VITE_KEYCLOAK_REALM= <Name of the Keycloak realm>
VITE_KEYCLOAK_CLIENT_ID= <Keycloak clientID>
VITE_KEYCLOAK_REDIRECT_URI= <Valid Keycloak redirect URL to redirect after login>
```

4. You can now start the portal with `pnpm start` and you can access the portal at `http://localhost:3000`.

> **Note**
> Every time a developer uses the `pnpm add`, `pnpm install`, `pnpm rm` (or similar npm commands), `pnpm` will remove the `non_npm_dependencies` from `node_modules/`. There is a post-install script that links the dependencies again, but this only works on UNIX-based systems. On Windows, you must manually copy the `non_npm_dependencies` to `node_modules/`.

---

## Development

### Folder structure

The [src](src) folder contains all the Typescript source code and static asset for the web interface. The web interface is using custom CARP fonts (MuseoSansRounded), and these custom font files can be found in the [fonts](src/assets/fonts) folder. The carp logo and the image used on the landing page are located in the [images](src/assets/images) folder. The [components](src/components) folder holds all the reusable components for the application and [pages](src/pages) contains the full sites, which are usually build up using the reusable components.

## Deployment

The project uses GitHub Actions to build and push the CARP Portal as a docker image, that can be then deployed on a preferred hosting service. To deploy your own version of the Portal fork this project and setup the configuaration for GitHub Actions.

### Workflow

To change the docker repository where the docker image is pushed, the following lines needs to be changed in [deployment.yaml](.github/workflows/deployment.yaml):

```
- name: Docker build and push
    run: |
    docker build -t <REPOSITORY>/<CONTAINER-NAME>:${{ env.TAG }} .
    docker push <REPOSITORY>/<CONTAINER-NAME>:${{ env.TAG }}
```

### Secrets and variables

#### Secrets

For GitHub Actions secrets the following secrets needs to be added:
- `DOCKERHUB_TOKEN` API token for DockerHub
- `DOCKERHUB_USERNAME` Username for DockerHub

#### Variables

For variables, you need to create a special enviroment file content named `DEV_ENV`, `PLAYGROUND_ENV`, `PROD_ENV`, `TEST_ENV`.
Example:
```
VITE_APP_NAME=...
VITE_BASE_URL=...
VITE_BASE_NAME=...
VITE_KEYCLOAK_URL=...
VITE_KEYCLOAK_REALM=...
VITE_KEYCLOAK_CLIENT_ID=...
VITE_KEYCLOAK_REDIRECT_URI=...
VITE_PORT=...
TAG=..
```

The different enviroment files correspondes to the different branches in the project.
- `DEV_ENV` for the develop branch
- `TEST_ENV` for the test branch
- `PROD_ENV` for the main branch
- `PLAYGROUND_ENV` for every other branch
