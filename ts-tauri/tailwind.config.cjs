/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const defaultTheme = require('tailwindcss/defaultTheme')

const generateSizeClass = (upToSize, startAt = 80) => {
    const classes = {}
    for (let i = startAt; i < upToSize / 4; i += 4) {
        classes[i] = `${(i * 4) / 16}rem`
    }

    return classes
}

const labelsClasses = ['indigo', 'gray', 'green', 'blue', 'red', 'purple']

// eslint-disable-next-line no-undef
module.exports = {
    darkMode: 'class', // add class='dark' to <html> to enable dark mode - https://tailwindcss.com/docs/dark-mode
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'],
    purge: {
        //Because we made a dynamic class with the label we need to add those classes
        // to the safe list so the purge does not remove that
        safelist: [
            ...labelsClasses.map((lbl) => `bg-${lbl}-500`),
            ...labelsClasses.map((lbl) => `bg-${lbl}-200`),
            ...labelsClasses.map((lbl) => `text-${lbl}-400`),
        ],
    },
    theme: {
        screens: {
            xxs: '300px',
            xs: '475px',
            ...defaultTheme.screens,
        },
        extend: {
            width: generateSizeClass(1024),
            minHeight: generateSizeClass(1024, 0),
            maxHeight: generateSizeClass(1024, 0),
            maxWidth: generateSizeClass(1024, 0),
            minWidth: generateSizeClass(1024, 0),
            borderWidth: {
                1: '1px',
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
            gridTemplateColumns: {
                '1/5': '1fr 5fr',
            },
        },
    },
    // eslint-disable-next-line no-undef
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
