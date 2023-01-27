// eslint-disable-next-line no-undef
module.exports = {
    purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    plugins: {
        'postcss-import': {},
        tailwindcss: {},
        autoprefixer: {},
    },
}