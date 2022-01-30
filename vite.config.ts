import DTS from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import path from 'path';

const root = process.cwd();
const mode = process.env.MODE as 'production' | 'demo';

const productionConfig = defineConfig({
   plugins: [
      DTS({
         outputDir: 'dist',
      }),
   ],
   build: {
      target: 'es2020',
      lib: {
         entry: path.resolve(root, 'src', 'lib.ts'),
         name: 'ecs',
         formats: ['es', 'umd'],
      },
   },
});

const demoConfig = defineConfig({
   root: path.join(root, 'demo'),
   build: {
      emptyOutDir: true,
      outDir: path.join(root, 'dist-demo'),
   },
});

export default mode === 'demo' ? demoConfig : productionConfig;
