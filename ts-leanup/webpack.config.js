module.exports = (...args) => {
  // Here using the example for solid
  const config = require('@leanup/stack-solid/webpack.config')(...args);
  const UnoCSS = require('@unocss/webpack').default;
  config.plugins.unshift(UnoCSS());
  return config;
};
