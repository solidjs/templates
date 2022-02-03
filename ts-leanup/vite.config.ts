import { mergeConfig } from 'vite';
import config from '@leanup/stack-solid/vite.config';
import UnocssPlugin from '@unocss/vite';

export default mergeConfig(config, {
  plugins: [UnocssPlugin()],
  build: {
    polyfillDynamicImport: false,
    target: 'esnext',
  },
});
