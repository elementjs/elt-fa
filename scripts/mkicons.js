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
const OUT_DIR = path.join(__dirname, '../')

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
    var icon_name = path.basename(f).replace(/\.svg$/, '')
    var destts = path.basename(f).replace(/\.svg$/, m => suffix + '.d.ts')
    var destjs = path.basename(f).replace(/\.svg$/, m => suffix + '.js')

    const clsname = f.replace(/(?:^|-)([a-z])/g, (s, a) => a.toUpperCase())
      .replace(/\.svg$/, '')
    const source = fs.readFileSync(path.join(root, dir, f), {encoding: 'utf-8'})
      .replace(`xmlns="http://www.w3.org/2000/svg" `, `class="--eltfa-icon" `)
      .replace(/<!--[^]*-->/m, '')
      .replace(/(<defs>)?<style>.fa-secondary{opacity:.4}<\/style>(<\/defs>)?/, '')

      // Now handling some xml like syntax
      .replace(/<([a-zA-Z]+)([^]+?)(\/?)>/g, (m, fname, args, closing) => {
        var _args = []
        var match
        var closing = !!closing
        var re = /([-a-zA-Z]+)=(("[^"]+")|{([^}]+)})/g
        while ((match = re.exec(args))) {
          const name = match[1]
          const value = match[4] || match[3]
          _args.push(`${name.includes('-') ? `'${name}'` : name}: ${value}`)
        }

        return `${closing ? ', ' : ''}e('${fname}', {${_args.join(', ')}}${closing ? ')' : ''}`
      })
      .replace(/<\/svg>/g, ', chld)')

      if (process.env.DEBUG) {
        console.log(icon_name + suffix)
        new Function(source)
      }

      const djs = `import { e } from 'elt'
import { I } from './lib/index'

// ${clsname}
export default function icon(a, chld) {
  return ${source.trim()}
}

I.register('${icon_name}', icon)${suffix ? `\nI.register('${icon_name}${suffix}', icon)` : ''}
      `
    fs.writeFileSync(path.join(out, destjs), djs, {encoding: 'utf-8'})

    const dts = `import { e, Attrs, Renderable } from 'elt'
declare module './lib/index' {
  interface RegisteredIcons {
    '${icon_name}': true${suffix ? `\n    '${icon_name}${suffix}': true` : ''}
  }
}
// ${clsname}
export default function icon(a: Attrs<SVGSVGElement>, chld: Renderable[]): SVGSVGElement
`

    // console.log(path.join(out, dest))
    fs.writeFileSync(path.join(out, destts), dts, {encoding: 'utf-8'})
  }
}

get_files('svgs/brands')
get_files('svgs/regular', '-regular')
get_files('svgs/solid', '-solid')
get_files('svgs/light', '-light')
get_files('svgs/duotone', '-duotone')
