#!/usr/bin/env node
/**
 * Make the icons .js files as well as their .d.ts
 */

function try_require(pkg) {
  try {
    // The file returned is actually two folders up.
    return path.join(require.resolve(pkg), '../..')
  } catch (e) {
    return null
  }
}

const fs = require('fs')
const path = require('path')
const root = try_require('@fortawesome/fontawesome-pro') || try_require('@fortawesome/fontawesome-free')

if (!root) {
  throw new Error(`Could not find any fontawesome package`)
}

const version = path.basename(root)
console.log(`Compiling elt-fa for '${version}'`)


// const SVG_DIR = path.join(__dirname, '_svg')
const OUT_DIR = path.join(__dirname, '../src')

/**
 * ...
 * @param {string} dir The directory to read
 * @param {string} suffix The suffix to add to a file
 */
function get_files(dir, suffix = '') {
  var files = []
  try {
    files = fs.readdirSync(path.join(root, dir)).filter(s => s.match(/\.svg$/))
    console.log(`Making icons in ${dir} with suffix ${suffix}`)
  } catch (e) {
    return null
  }
  const out = OUT_DIR

  for (var f of files) {
    var dest = path.basename(f).replace(/\.svg$/, m => suffix + '.tsx')
    const clsname = f.replace(/(?:^|-)([a-z])/g, (s, a) => a.toUpperCase())
      .replace(/\.svg$/, '')
    const source = fs.readFileSync(path.join(root, dir, f), {encoding: 'utf-8'})
      .replace(`xmlns="http://www.w3.org/2000/svg" `, `class={Fa.icon} `)
      .replace(/<!--[^]*-->/m, '')
      .replace(/(<defs>)?<style>.fa-secondary{opacity:.4}<\/style>(<\/defs>)?/, '')
      .replace('"fa-primary"', '{Fa.primary}')
      .replace('"fa-secondary"', '{Fa.secondary}')

    const src = `import { e } from 'elt'
import { Fa } from './index'

// ${clsname}
export default function icon(a: e.JSX.Attrs) {
  return ${source}
}
`

    // console.log(path.join(out, dest))
    fs.writeFileSync(path.join(out, dest), src, {encoding: 'utf-8'})
  }
}

get_files('svgs/brands')
get_files('svgs/regular', '-regular')
get_files('svgs/solid')
get_files('svgs/light', '-light')
get_files('svgs/duotone', '-duotone')
console.log('all icons .tsx files done, compiling them now.')
