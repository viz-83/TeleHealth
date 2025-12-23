/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#4A7C59', // Sage Green
                secondary: '#D1E8E2', // Soft Mint
                accent: '#718096', // Warm Grey
                cta: {
                    DEFAULT: '#2C7A7B', // Deep Teal
                    hover: '#285E61',
                },
                text: {
                    primary: '#1F2933',
                    secondary: '#4A5568',
                    muted: '#718096',
                },
                background: {
                    light: '#F7FAFC',
                    subtle: '#EDF2F7',
                }
            },
            fontFamily: {
                heading: ['"Libre Baskerville"', 'serif'],
                body: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 8px 30px rgba(0,0,0,0.04)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
