import rpi_jsy from 'rollup-plugin-jsy'
import rpi_resolve from '@rollup/plugin-node-resolve'
import { terser as rpi_terser } from 'rollup-plugin-terser'

const configs = []
export default configs

const sourcemap = true
const external = k => k.startsWith('https://')
const plugins = [rpi_jsy(), rpi_resolve()]
const plugins_web = [ ... plugins, rpi_terser({}) ]


add_jsy('all')
add_jsy('editor')
add_jsy('func-editor')

add_jsy('index', {minify: true})
add_jsy('prism-editor', {minify: true})
add_jsy('js-func-editor', {minify: true})
add_jsy('jsy-func-editor', {minify: true})


function add_jsy(src_name, opt={}) {
  configs.push({
    input: `code/${src_name}.jsy`,
    output: { file: `esm/${src_name}.mjs`, format: 'es', sourcemap },
    plugins, external })

  plugins_web && opt.minify && configs.push({
    input: `code/${src_name}.jsy`,
    output: { file: `esm/${src_name}.min.mjs`, format: 'es', sourcemap },
    plugins: plugins_web, external })
}
