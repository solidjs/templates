<p>
  <img width="100%" src="https://raw.githubusercontent.com/solidjs/templates/vanilla/master/banner.png" alt="Solid Vite Templates">
</p>

# Solid Templates (using [vite](https://vitejs.dev/))

This repository holds most of the official starter templates for [vite](https://vitejs.dev/).

You get:

- HMR out of the box
- Minimal bundle size
- All the vite features

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Get started

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

These templates are meant to be used as is via the [degit](https://github.com/Rich-Harris/degit) utility.

```bash
# Typescript basic template
$ npx degit solidjs/templates/vanilla/basic my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript bare template
$ npx degit solidjs/templates/vanilla/bare my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript unocss template
$ npx degit solidjs/templates/vanilla/with-unocss my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript tailwindcss template + solid-router with config-based routing
$ npx degit solidjs/templates/vanilla/with-solid-router my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript vite-plugin-pages file-based routing
$ npx degit solidjs/templates/vanilla/with-vite-plugin-pages my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript bootstrap (5) template
$ npx degit solidjs/templates/vanilla/with-bootstrap my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript + tailwindcss template
$ npx degit solidjs/templates/vanilla/with-tailwindcss my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript + sass template
$ npx degit solidjs/templates/vanilla/with-sass my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript + vitest template
$ npx degit solidjs/templates/vanilla/with-vitest my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript + vitest browser mode template
$ npx degit solidjs/templates/vanilla/with-vitest-browser-mode my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# Typescript + uvu template
$ npx degit solidjs/templates/vanilla/with-uvu my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# TanStack Router
$ npx degit solidjs/templates/vanilla/with-tanstack-router-config-based my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# TanStack Router File Based
$ npx degit solidjs/templates/vanilla/with-tanstack-router-file-based my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

```bash
# TanStack Start
$ npx degit solidjs/templates/tanstack-start my-solid-project
$ cd my-solid-project
$ npm install # or pnpm install or yarn install
```

## I don't see a template that matches my need?

You wish there was a template with your favorite library?

Feel free to make a pull request. Copy one of the template already available, tweak it, name it properly and make a PR. See [contributing](#contributing) below.

## Contributing

This project is managed with [pnpm](https://pnpm.io). You should [install it](https://pnpm.io/installation) first to test out your template or contribute to an existing one.

You can create your own template and prefix it `with-` and give it a name that describe the purpose.

To update all dependencies you can run:

`pnpm up -Lri`

## Troubleshooting

It appears that Webstorm generate some weird triggers when saving a file. In order to prevent that you can follow [this thread](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000154544-I-m-having-a-huge-problem-with-Webstorm-and-react-hot-loader-) and disable the **"Safe Write"** option in **"Settings | Appearance & Behavior | System Settings"**.
