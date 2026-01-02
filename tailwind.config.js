/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // User's Green Palette #007a52 (Overriding Emerald)
                emerald: {
                    50: '#eefcf6',
                    100: '#d5f7e8',
                    200: '#007a52', // Main
                    300: '#6ee7b7', // Keep some light ones? 
                    400: '#34d399',
                    500: '#10b981',
                    600: '#007a52', // <--- MAIN REQUESTED COLOR
                    700: '#006241', // Darker for hover
                    800: '#004d33',
                    900: '#064e3b',
                    950: '#022c22',
                },
                // User's Blue Palette #2563eb (Overriding Indigo)
                indigo: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb', // <--- MAIN REQUESTED COLOR (matches blue-600)
                    700: '#1d4ed8', // Darker for hover
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
