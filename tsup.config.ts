import { defineConfig } from 'tsup';

export default defineConfig([
    {
      entry: ['src/main.ts'],
      format: ['cjs'],
      dts: { entry: 'src/types.ts' },  // Generates a types file
      minify: false,
      sourcemap: false,
      outDir: 'dist',
      outExtension: () => ({ js: '.runtime.js' }), // CommonJS runtime file
    },
    {
      entry: ['src/main.ts'],
      format: ['esm'],
      minify: true,
      sourcemap: false,
      outDir: 'dist',
      outExtension: () => ({ js: '.min.js' }), // ESM minified file
    },
    {
      entry: ['src/main.ts'],
      format: ['cjs'],
      minify: true,
      sourcemap: false,
      outDir: 'dist',
      outExtension: () => ({ js: '.js' }), // Unminified hmpl.js
    }
  ]);
