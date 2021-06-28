# Solid templates using [vite](https://vitejs.dev/)

This repository holds most of the official starter templates for [vite](https://vitejs.dev/).

You get:

- HMR out of the box
- Minimal bundle size
- All the vite features

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Get started

Those templates dependencies are maintained via [pnpm](https://pnpm.js.org/) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

These templates are meant to be used as is via the [degit](https://github.com/Rich-Harris/degit) utility.

```bash
# Javascript template
$ npx degit solidjs/templates/js my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript template
$ npx degit solidjs/templates/ts my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript minimal template
$ npx degit solidjs/templates/ts-minimal my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript windicss template
$ npx degit solidjs/templates/ts-windicss my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript windicss template + basic file base routing
$ npx degit solidjs/templates/ts-router my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript bootstrap (5) template
$ npx degit solidjs/templates/ts-bootstrap my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

## I don't see a template that matches my need?

You wish there was a template with your favorite library?

Feel free to make a pull request. Copy on of the template already available, tweak it, name it properly and make a PR. See [contributing](#contributing) below.

## Contributing

This project is managed with [pnpm](https://pnpm.js.org/). You should [install it](https://pnpm.js.org/install) first to test out your template or contribute to an existing one. 

You can create your own template and prefix it with `ts-` or `js-` and giving it a name that describe the purpose.

To update all dependencies you can run:

`pnpm up -Lri`

## Troubleshooting

It appears that Webstorm generate some weird triggers when saving a file. In order to prevent that you can follow [this thread](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000154544-I-m-having-a-huge-problem-with-Webstorm-and-react-hot-loader-) and disable the **"Safe Write"** option in **"Settings | Appearance & Behavior | System Settings"**.
