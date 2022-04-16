const { build } = require('esbuild')
const minimist = require('minimist')
const { resolve } = require('path')
// minimist 用来解析命令行参数的

const args = minimist(process.argv.slice(2))

const target = args._[0] || 'reactivity'
const format = args.f || 'global'

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'


const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

console.log(outputFormat, outfile)

// 天生支持ts
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口
  outfile, // 出口
  bundle: true, // 把所有包全部打到一起
  sourcemap: true,
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) console.log('rebuild.....')
    }
  }
}).then(() => {
  console.log('watching....')
})