# Vite templates for Solid

This repository holds most of the official starter templates for Vite.

You get:

- HMR out of the box
- Minimal bundle size
- All the vite features..

## Install

Those templates dependencies are maintained via [pnpm](https://pnpm.js.org/) via `pnpm up -i --latest`.
This is the reason you see a `pnpm-lock.yaml`. This is my favorite package manager because it's fast and doesn't bloat the `node_modules` folder.

Note that any package manager should work. I'd just advice you to remove the `pnpm-lock.yml` file before doing an install via your package manager of choice.

```bash
# Javascript template
$ npx degit amoutonbrady/vite-template-solid/js my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

```bash
# Typescript template
$ npx degit amoutonbrady/vite-template-solid/ts my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

```bash
# Typescript minimal template
$ npx degit amoutonbrady/vite-template-solid/ts-minimal my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

```bash
# Typescript tailwind template
$ npx degit amoutonbrady/vite-template-solid/ts-tailwind my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

```bash
# Typescript tailwind template + basic file base routing
$ npx degit amoutonbrady/vite-template-solid/ts-router my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

```bash
# Typescript bootstrap (5) template
$ npx degit amoutonbrady/vite-template-solid/ts-bootstrap my-solid-project
$ cd my-solid-project
$ pnpm install # or npm install or yarn install
```

## I don't see a template that matches my need?

You wish there was a template with a router? Bootstrap? Your favorite library?

Feel free to make a pull request. Copy on of the template already available, tweak, name it properly and make a PR.

## Contributing

To update all dependencies you can run:

`pnpm up -r -L`

## Troubleshooting

It appears that Webstorm generate some weird triggers when saving a file. In order to prevent that you can follow [this thread](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000154544-I-m-having-a-huge-problem-with-Webstorm-and-react-hot-loader-) and disable the **"Safe Write"** option in **"Settings | Appearance & Behavior | System Settings"**.
