import rpi_jsy from 'rollup-plugin-jsy'
import { terser as rpi_terser } from 'rollup-plugin-terser'

const configs = []
export default configs

const sourcemap = true
const external = k => k.startsWith('https://')
const plugins = [rpi_jsy()]
const plugins_web = [ ... plugins, rpi_terser({}) ]


add_jsy('index', {minify: true})
add_jsy('prism-editor', {minify: true})
add_jsy('editor')
add_jsy('all')


function add_jsy(src_name, opt={}) {
  configs.push({
    input: `code/${src_name}.jsy`,
    output: [
      { file: `esm/${src_name}.mjs`, format: 'es', sourcemap },
      { file: `esm/${src_name}.js`, format: 'es', sourcemap },
    ], plugins, external })

  plugins_web && opt.minify && configs.push({
    input: `code/${src_name}.jsy`,
    output: [
      { file: `esm/${src_name}.min.mjs`, format: 'es', sourcemap },
      { file: `esm/${src_name}.min.js`, format: 'es', sourcemap },
    ], plugins: plugins_web })
}
