# SolidStart Template

For more information on SolidStart, refer to the [README](https://github.com/solidjs/solid-start/tree/main/packages/start#readme) or visit the official [documentation](https://docs.solidjs.com/solid-start/).

## Installation

Generate the **with-vitest** template using your preferred package manager

```bash
# using npm
npm create solid@latest -- -s -t with-vitest
```

```bash
# using pnpm
pnpm create solid@latest -s -t with-vitest
```

```bash
# using bun
bun create solid@latest --s --t with-vitest
```

## Testing

Tests are written with `vitest`, `@solidjs/testing-library` and `@testing-library/jest-dom` to extend expect with some helpful custom matchers.

To run them, simply start:

```bash
npm test
```
