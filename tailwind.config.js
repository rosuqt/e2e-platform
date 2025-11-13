const tailwindcssAnimate = require("tailwindcss-animate");
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./landing-page/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
	"./node_modules/@heroui/react/**/*.js",
  ],
  theme: {
        extend: {
            colors: {
                button: '#3B82F6',
                buttonHover: '#2563EB',
                customYellow: '#E8AF30',
                darkBlue: '#162F65',
                customPurple: '#5651AB',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                'custom-gray': '#f3f4f6',
                'custom-red': '#f87171',
                'custom-gray-300': '#d1d5db',
                'custom-blue-300': '#93c5fd',
                'custom-blue-100': '#dbeafe',
                'custom-blue-50': '#eff6ff',
                'custom-blue-500': '#3b82f6',
                'custom-blue-600': '#2563eb',
                'custom-sky-100': '#e0f2fe',
                'custom-sky-400': '#38bdf8',
                'custom-sky-500': '#0ea5e9',
                'custom-indigo-500': '#6366f1',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [tailwindcssAnimate, heroui()],
};
