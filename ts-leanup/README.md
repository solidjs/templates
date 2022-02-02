## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm start` or `npm vite:dev` (vite)

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run webpack:dev` (webpack)

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

Or runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build` or `npm run vite:build` (vite)

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run webpack:build` (webpack)

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run lint` or `npm run lint -- -fix`

Executes the static code checks on the app code. With the additional argument `-fix`, all fixable findings are fixed automatically.

### `npm run format` or `npm run format -- -w`

Executes format checks on the app code. With the additional argument `-w` all app code is reformatted.

### `npm run test` or `npm run test -- -w`

Executes the unit tests.

### `npm run coverage`

Executes the unit tests and validates the cover watermarks. A coverage report is generated.

### `npm run e2e -- -e chrome`

Executes the e2e tests.

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
