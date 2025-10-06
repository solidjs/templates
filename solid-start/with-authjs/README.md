# SolidStart Template

Everything you need to build an [AuthJS](https://authjs.dev) authenticated Solid project. For more information on SolidStart, refer to the [README](https://github.com/solidjs/solid-start/tree/main/packages/start#readme) or visit the official [documentation](https://docs.solidjs.com/solid-start/).

## Installation

Generate the **with-authjs** template using your preferred package manager

```bash
# using npm
npm create solid@latest -- -st with-authjs
```

```bash
# using pnpm
pnpm create solid@latest -st with-authjs
```

```bash
# using bun
bun create solid@latest --s --t with-authjs
```

## Configuration

In order to run this example, you need to setup i.e. a Discord app in here: https://discord.com/developers/applications/, to get a client secret and client id which should be added to the .env file. Also, in the Discord app settings under OAuth2, set the Return URL to: http://localhost:3000/api/auth/callback/discord

Enviroment Variables:

- `DISCORD_ID`=
- `DISCORD_SECRET`=
- `AUTH_SECRET`=b198e07a64406260b98f06e21c457b84
- `AUTH_TRUST_HOST`=true
- `AUTH_URL`=http://localhost:3000
- `VITE_AUTH_PATH`=/api/auth

[Sponsor Create JD App](https://github.com/sponsors/OrJDev)
