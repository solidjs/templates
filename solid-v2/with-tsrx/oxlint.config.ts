import { defineConfig } from 'oxlint';
import solidV2 from 'eslint-plugin-solid/configs/v2';

export default defineConfig({
  jsPlugins: ['eslint-plugin-solid'],
  // oxlint cannot parse TSRX syntax (it skips .tsrx as an unknown extension
  // today; the entry makes that posture explicit). The TSRX project ships
  // @tsrx/oxc for .tsrx-aware oxlint/oxfmt, and eslint-plugin-solid coverage
  // for .tsrx is future work.
  ignorePatterns: ['**/*.gen.*', '**/*.tsrx', 'dist'],
  settings: solidV2.settings,
  rules: solidV2.rules,
});
