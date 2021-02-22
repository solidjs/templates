## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.js.org/) via `pnpm up -i --latest`.
This is the reason you see a `pnpm-lock.yaml`. This is my favorite package manager because it's fast and doesn't bloat the `node_modules` folder.

Note that any package manager should work. I'd just advice you to remove the `pnpm-lock.yml` file before doing an install via your package manager of choice.

```bash
$ pnpm install # or npm install or yarn install
```
## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
