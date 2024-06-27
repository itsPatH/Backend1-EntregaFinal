import { defineConfig } from 'postcss';

export default defineConfig({
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
});
