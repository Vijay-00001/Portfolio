import type { Config } from 'tailwindcss';

const config: Config = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         colors: {
            foreground: 'var(--foreground)',
            background: 'var(--color-background)',
            text: 'var(--color-text)',
            primary: 'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            accent: 'var(--color-accent)',
            'shadow-light': 'var(--color-shadow-light)',
            'shadow-dark': 'var(--color-shadow-dark)',
         },
      },
   },
   plugins: [],
};
export default config;
