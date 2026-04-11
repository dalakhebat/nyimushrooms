import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
                headline: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Clinical Greenhouse palette
                surface: {
                    DEFAULT: '#f7f9fc',
                    dim: '#d8dadd',
                    bright: '#f7f9fc',
                    variant: '#e0e3e6',
                    tint: '#3456c1',
                    container: {
                        DEFAULT: '#eceef1',
                        low: '#f2f4f7',
                        high: '#e6e8eb',
                        highest: '#e0e3e6',
                        lowest: '#ffffff',
                    },
                },
                primary: {
                    DEFAULT: '#000f3f',
                    container: '#00206e',
                    fixed: {
                        DEFAULT: '#dce1ff',
                        dim: '#b6c4ff',
                    },
                },
                secondary: {
                    DEFAULT: '#0058bc',
                    container: '#0070eb',
                    fixed: {
                        DEFAULT: '#d8e2ff',
                        dim: '#adc6ff',
                    },
                },
                tertiary: {
                    DEFAULT: '#04161d',
                    container: '#192b32',
                    fixed: {
                        DEFAULT: '#d2e6ef',
                        dim: '#b6cad2',
                    },
                },
                error: {
                    DEFAULT: '#ba1a1a',
                    container: '#ffdad6',
                },
                outline: {
                    DEFAULT: '#757682',
                    variant: '#c5c6d2',
                },
                on: {
                    surface: '#191c1e',
                    'surface-variant': '#444650',
                    primary: '#ffffff',
                    'primary-container': '#6a89f7',
                    'primary-fixed': '#001550',
                    'primary-fixed-variant': '#133ca8',
                    secondary: '#ffffff',
                    'secondary-container': '#fefcff',
                    'secondary-fixed': '#001a41',
                    'secondary-fixed-variant': '#004493',
                    tertiary: '#ffffff',
                    'tertiary-container': '#80939b',
                    'tertiary-fixed': '#0b1e24',
                    'tertiary-fixed-variant': '#374951',
                    error: '#ffffff',
                    'error-container': '#93000a',
                    background: '#191c1e',
                },
                inverse: {
                    surface: '#2d3133',
                    'on-surface': '#eff1f4',
                    primary: '#b6c4ff',
                },
            },
            borderRadius: {
                xl: '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                clinical: '0 12px 40px rgba(0, 15, 63, 0.06)',
                'clinical-lg': '0 20px 60px rgba(0, 15, 63, 0.1)',
                'clinical-sm': '0 4px 16px rgba(0, 15, 63, 0.04)',
            },
        },
    },

    plugins: [forms],
};
