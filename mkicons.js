#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const root = path.join(require.resolve('@fortawesome/fontawesome-free'), '../..')

// const SVG_DIR = path.join(__dirname, '_svg')
const OUT_DIR = path.join(__dirname, 'src')

/**
 * ...
 * @param {string} dir The directory to read
 * @param {string} suffix The suffix to add to a file
 */
function get_files(dir) {
  const files = fs.readdirSync(path.join(root, dir)).filter(s => s.match(/\.svg$/))
  const base = path.basename(dir)
  const out = path.join(OUT_DIR, base)

  try {
    fs.mkdirSync(out)
  } catch (e) { }

  for (var f of files) {
    var dest = path.basename(f).replace(/\.svg$/, m => '.tsx')
    const clsname = f.replace(/(?:^|-)([a-z])/g, (s, a) => a.toUpperCase())
      .replace(/\.svg$/, '')
    const source = fs.readFileSync(path.join(root, dir, f), {encoding: 'utf-8'})
      .replace(`xmlns="http://www.w3.org/2000/svg" `, `class={Fa.icon} `)
      .replace(/<!--[^]*-->/m, '')

    const src = `import { Attrs } from 'elt'
import { Fa } from '../index'

export default function ${clsname}(a: Attrs) {
  return ${source}
}
`

    // console.log(src)
    fs.writeFileSync(path.join(out, dest), src, {encoding: 'utf-8'})
  }
}

get_files('svgs/brands')
get_files('svgs/regular')
get_files('svgs/solid')

