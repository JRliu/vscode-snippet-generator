import typescript from 'rollup-plugin-typescript2'
import { dependencies, main, module } from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: main,
      format: 'cjs',
      exports: 'named'
    },
    {
      file: module,
      exports: 'named',
      format: 'es'
    }
  ],
  plugins: [
    typescript()
  ],
  external: [...Object.keys(dependencies)]
}
