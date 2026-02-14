// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                'valentine-pink': '#ff85a1',
                'valentine-red': '#ff4d6d',
                'valentine-cream': '#fff0f3',
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
            },
        },
    },
    plugins: [],
}